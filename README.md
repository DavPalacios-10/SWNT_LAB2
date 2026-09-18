# 🌿 EcoTrack AI — Calculadora de Huella de Carbono en Lenguaje Natural

> **EcoTrack AI** es una aplicación web intuitiva diseñada para que pequeños negocios y PYMEs calculen su impacto ambiental y huella de carbono diaria simplemente describiendo sus actividades en lenguaje natural, eliminando la complejidad de los formularios tradicionales.

---

## 📌 Tabla de Contenidos
- [Problema y Solución](#-problema-y-solución)
- [Características Principales](#-características-principales)
- [Arquitectura e Inteligencia Artificial](#-arquitectura-e-inteligencia-artificial)
- [Requisitos Previos e Instalación](#-requisitos-previos-e-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [Despliegue en Vercel](#-despliegue-en-vercel)
- [Licencia](#-licencia)

---

## 💡 Problema y Solución

* **El Problema:** Medir la huella de carbono en PYMEs suele requerir llenar formularios extensos con términos técnicos desorientadores, lo que desmotiva la adopción de prácticas sostenibles.
* **La Solución:** Una interfaz conversacional tipo chat. El usuario escribe:
  > *"Hoy usamos 4 camionetas para entregas y consumimos 150 kWh de luz en el taller"*
  Y la aplicación interpreta automáticamente las actividades, extrae las cantidades, calcula las emisiones en `kg CO2e` y actualiza un dashboard visual en tiempo real.

---

## ✨ Características Principales

- 💬 **Interfaz Conversacional:** Entrada de texto libre con procesamiento mediante lenguaje natural.
- 📊 **Dashboard en Tiempo Real:** Métricas de emisiones acumuladas, equivalencia en árboles salvados y gráficos desglosados por categorías (Transporte, Energía, Residuos, Agua, Operaciones).
- ⚡ **Modo Híbrido IA / Demo:** Funciona conectado a APIs de IA reales (Google Gemini, OpenAI o Anthropic) o en *Modo Demo* offline mediante patrones heurísticos.
- 🔒 **Persistencia Local:** Guarda automáticamente el historial de actividades y chats en `localStorage`.
- 📱 **Diseño 100% Responsivo:** Optimizado con estética minimalista en tonos verdes relajantes para su uso en dispositivos móviles y de escritorio.

---

## 🏗️ Arquitectura e Inteligencia Artificial

### Tecnologías Utilizadas
- **Frontend:** React 18, TypeScript, Vite, TailwindCSS.
- **Iconos y Gráficos:** Lucide React, Recharts.

### Módulo de IA (`analizarActividad`)
La lógica de extracción reside en `src/services/aiInterpreter.ts`. 

1. **Prompt de Sistema:** La consulta se envía a la API de IA solicitando una respuesta estructurada **estrictamente en formato JSON**:
   ```json
   [
     {
       "categoria": "transport",
       "nombre": "Camionetas de entrega",
       "cantidad": 4,
       "unidad": "vehiculos",
       "subTipo": "diesel"
     }
   ]
   ```
2. **Motor de Cálculo (`emissionCalculator.ts`):** Convierte las entidades extraídas a `kg CO2` utilizando factores de emisión estandarizados basados en el **GHG Protocol** (ej. Electricity = 0.233 kg CO2/kWh, Diesel = 2.68 kg CO2/litro).
3. **Resiliencia & QA:** Incluye límites de timeout (8 segundos con `AbortController`) y fallback automático ante fallos de red.

---

## 🚀 Requisitos Previos e Instalación

### Requisitos
- **Node.js**: `v18.0.0` o superior.
- **npm**: `v9.0.0` o superior.

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/DavPalacios-10/SWNT_LAB2.git
   cd SWNT_LAB2
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en entorno de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre tu navegador en `http://localhost:5173`.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto tomando como base `.env.example`:

```env
# Proveedor de IA (opciones: gemini, openai, anthropic)
VITE_AI_PROVIDER=gemini

# Clave de API de IA (si no se especifica, la app funciona en Modo Demo)
VITE_AI_API_KEY=tu_api_key_aqui
```

---

## 🌐 Despliegue en Vercel

Este proyecto está configurado para desplegarse sin problemas en **Vercel**.

1. Importa tu repositorio en el panel de Vercel.
2. Vercel detectará automáticamente el archivo [`vercel.json`](file:///c:/Users/daavi/OneDrive/Escritorio/SWNT/SWNT_LAB2/vercel.json) con la siguiente configuración:
   ```json
   {
     "buildCommand": "node node_modules/vite/bin/vite.js build",
     "outputDirectory": "dist",
     "framework": "vite"
   }
   ```
3. Si deseas usar una API de IA real en producción, agrega la variable de entorno `VITE_AI_API_KEY` en los ajustes del proyecto en Vercel.
4. Haz clic en **Deploy**.
