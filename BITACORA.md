# 📜 Bitácora de Desarrollo del Proyecto: EcoTrack AI (SWNT_LAB2)

> **Proyecto:** EcoTrack AI — Plataforma de cálculo de huella de carbono mediante Inteligencia Artificial y lenguaje natural para PYMEs.  
> **Especialidad:** Ingeniería de Software Full-Stack, UX Minimalista y Sostenibilidad.

---

## 📑 Índice de Contenidos
1. [Contexto y Objetivos del Producto](#1-contexto-y-objetivos-del-producto)
2. [Etapa 1: Cimientos y MVP (Estructura y Prototipado)](#2-etapa-1-cimientos-y-mvp-estructura-y-prototipado)
3. [Etapa 2: Integración de IA Real y Rediseño Minimalista](#3-etapa-2-integración-de-ia-real-y-rediseño-minimalista)
4. [Etapa 3: QA Senior, Resiliencia y Corrección de Despliegue](#4-etapa-3-qa-senior-resiliencia-y-corrección-de-despliegue)
5. [Especificación de la Funcionalidad de IA](#5-especificación-de-la-funcionalidad-de-ia)
6. [Resumen Técnico de Desarrollo y Vibe Coding](#6-resumen-técnico-de-desarrollo-y-vibe-coding)

---

## 1. Contexto y Objetivos del Producto

* **Usuario Objetivo:** Dueños de pequeños negocios y PYMEs sin tiempo ni conocimientos técnicos sobre contabilidad ambiental.
* **Problema a Resolver:** Los formularios tradicionales de huella de carbono son tediosos, extensos y usan terminología técnica compleja.
* **Solución:** Una interfaz web conversacional (tipo chat) donde el usuario describe su actividad diaria en texto libre (ej. *"Hoy usamos 3 camionetas de reparto y gastamos 180 kWh de electricidad"*). La app extrae las entidades, calcula la huella de carbono acumulada y la desglosa visualmente en tiempo real.

---

## 2. Etapa 1: Cimientos y MVP (Estructura y Prototipado)

### Decisiones de Arquitectura
* **Frontend:** React 18 + TypeScript + Vite + TailwindCSS para un ciclo de desarrollo rápido y ligero.
* **Visualización:** `recharts` y `lucide-react` para componentes visuales y gráficos minimalistas.
* **Persistencia:** Módulo `storageService.ts` basado en `localStorage` para guardar el historial de registros (`logs`) y mensajes de chat (`chat`), permitiendo un prototipo 100% funcional sin depender de bases de datos pesadas.

### Archivos Creados
* `src/App.tsx`: Orquestador principal de estado (chats, logs, modal metodológico y pestañas adaptativas).
* `src/types/index.ts`: Definiciones TypeScript para entidades extraídas, ítems de cálculo, categorías y entradas de historial.
* `src/components/Header.tsx`: Barra superior con estado de conexión de la IA y acceso a metodologías.
* `src/components/Chat/ChatWindow.tsx`: Interfaz conversacional con burbujas de chat, estado de carga animado y sugerencias rápidas.
* `src/components/Dashboard/ImpactSummary.tsx`: Tarjetas de métricas de CO2 equivalente y equivalencias en árboles salvados.
* `src/components/Dashboard/CategoryChart.tsx`: Gráfico de barras desglosado por categorías (transporte, energía, residuos, agua, operaciones).
* `src/components/Dashboard/ActivityHistory.tsx`: Historial cronológico con opción de eliminación de registros.

---

## 3. Etapa 2: Integración de IA Real y Rediseño Minimalista

### Funcionalidad de IA
* Se implementó la función `analizarActividad(texto)` en `src/services/aiInterpreter.ts`.
* La función admite proveedores reales de IA (Google Gemini / OpenAI / Anthropic) configurables vía variables de entorno (`VITE_AI_API_KEY`, `VITE_AI_PROVIDER`).
* Posee un motor heurístico simulado (*Modo Demo*) que analiza patrones léxicos cuando no se detecta una API Key.

### Motor de Cálculo de Emisiones
* Ubicado en `src/services/emissionCalculator.ts`.
* Utiliza factores de emisión estandarizados basados en el **GHG Protocol** y **DEFRA**:
  * **Electricidad (Red):** `0.233 kg CO2/kWh`
  * **Diésel:** `2.68 kg CO2/litro` | **Gasolina:** `2.31 kg CO2/litro` | **Flete (km):** `0.21 kg CO2/km`
  * **Residuos:** Cartón `0.50 kg CO2/kg` | Plástico `2.10 kg CO2/kg`
  * **Agua Potable:** `0.344 kg CO2/m³`

---

## 4. Etapa 3: QA Senior, Resiliencia y Corrección de Despliegue

### Manejo de Edge Cases y Resiliencia
1. **Control de Aborto por Timeout:** Se incluyó un `AbortController` con límite de 8 segundos para evitar que peticiones lentas o fallidas bloqueen la interfaz.
2. **Validación de Entradas (QA Guards):**
   * Peticiones vacías o con espacios en blanco son interceptadas sin consumir llamadas a la API.
   * Mensajes sin datos numéricos o cuantitativos reciben respuestas amigables orientativas.
   * Cantidades negativas o en cero se ignoran automáticamente para mantener la coherencia matemática.
3. **Manejo de Errores Amigable:** Ante fallos de conexión con la IA, se conmuta transparente a una respuesta estructurada que invita al usuario a dar más detalles.

### Resolución de Error de Despliegue en Vercel
* **Síntoma / Error:** Durante la integración continua en Vercel se presentó el fallo:  
  `sh: line 1: /vercel/path0/node_modules/.bin/vite: Permission denied (Exit code 126)`
* **Diagnóstico:** El entorno Linux de Vercel no otorgaba permisos de ejecución (`+x`) a los enlaces simbólicos de `.bin/vite` creados desde entornos Windows o por políticas de `npm 10+`.
* **Solución Aplicada:**
  1. Se modificó el comando de compilación en `package.json` y `vercel.json` a:
     `"buildCommand": "node node_modules/vite/bin/vite.js build"`
     Esto ejecuta Vite directamente con el intérprete de Node sin requerir permisos de la shell.
  2. Se agregó la regla `postinstall` en `package.json` para conceder permisos ejecutables en el servidor CI.

---

## 5. Especificación de la Funcionalidad de IA

La llamada a la IA se realiza a través de la función **`analizarActividad(texto: string)`** ubicada en:
👉 `src/services/aiInterpreter.ts`

```typescript
export async function analizarActividad(texto: string): Promise<AnalysisResult>
```

**Estructura del Prompt de Sistema:**
El modelo recibe instrucciones estrictas para retornar **únicamente** un arreglo JSON con el siguiente esquema por actividad identificada:
```json
[
  {
    "categoria": "transport | energy | waste | water | operations",
    "nombre": "Descripción breve",
    "cantidad": 180.0,
    "unidad": "kWh | km | kg | m3 | litros",
    "subTipo": "electricidad | diesel | gasolina | carton | balon"
  }
]
```

---

## 6. Resumen Técnico de Desarrollo y Vibe Coding

*(Extracto para entrega final del laboratorio)*

> Durante el desarrollo de **EcoTrack AI** se identificaron tres desafíos principales: (1) el parsing inconsistente en lenguaje natural al recibir mensajes ambiguos sin valores numéricos, (2) timeouts en peticiones a la API de IA en redes lentas, y (3) el fallo `Permission denied (Exit code 126)` en Vercel al intentar ejecutar `/node_modules/.bin/vite`.
>
> Estos problemas se diagnosticaron y resolvieron eficientemente mediante asistencia avanzada de IA: para el parsing se añadieron *QA Guards* y prompts de sistema con esquema JSON estricto; para los timeouts se integró `AbortController` a 8 segundos con fallback a modo demo; y para Vercel se reestructuraron las llamadas del build en `package.json` y `vercel.json` ejecutando el binario directo mediante `node node_modules/vite/bin/vite.js build`.
>
> El enfoque de *vibe coding* aceleró drásticamente el flujo de trabajo al delegar la generación de código boilerplate, tipado en TypeScript, estilos minimalistas en TailwindCSS y configuraciones de CI/CD. Esto permitió enfocar el 90% del esfuerzo en refinar la experiencia de usuario (UX) y garantizar la resiliencia del sistema frente a fallos.
