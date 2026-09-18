# 🌱 EcoTrack AI — Huella de Carbono Inteligente para Pequeños Negocios

> Calculadora de huella de carbono basada en Inteligencia Artificial y lenguaje natural para pequeñas empresas y PYMEs. Reemplaza los formularios extensos y complejos por una interfaz tipo chat conversacional.

---

## 📌 Problema a Resolver
Calcular la huella de carbono empresarial tradicionalmente requiere llenar formularios tediosos, clasificar códigos de factores de emisión y entender terminología técnica (Scope 1, 2 y 3). Los dueños de pequeños negocios no tienen el tiempo ni el conocimiento especializado para realizar estos trámites, lo que limita sus oportunidades de certificación ecológica o de ahorro energético.

## 💡 Solución: EcoTrack AI
**EcoTrack AI** permite que un usuario escriba sus actividades diarias en lenguaje común (ejemplo: *"Hoy usamos 3 camionetas de reparto diésel por 120 km y consumimos 180 kWh de luz"*). La app interpreta el texto con Inteligencia Artificial, extrae las entidades cuantitativas, las convierte a **kg CO2e** mediante factores de emisión certificados (GHG Protocol / DEFRA) y actualiza su dashboard visual en tiempo real.

---

## 🛠️ Stack Tecnológico
- **Frontend**: React 18, Vite, TypeScript.
- **Estilos & UI**: TailwindCSS, Lucide Icons, Recharts (gráficos responsivos).
- **Procesamiento de Lenguaje Natural (IA)**: Google Gemini API (Gemini 1.5 Flash) / OpenAI API (GPT-4o-mini) con fallback automático a motor NLP por patrones de expresiones regulares en español.
- **Persistencia**: LocalStorage con gestión de datos sembrados (*mock seed*).

---

## 🚀 Instalación y Ejecución Local

1. **Clonar / Ubicar el proyecto**:
   ```bash
   cd c:\Users\daavi\OneDrive\Escritorio\SWNT
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno** (opcional pero recomendado):
   Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
   Agrega tu clave de API si deseas usar la IA en vivo:
   ```env
   VITE_AI_PROVIDER=gemini
   VITE_AI_API_KEY=tu_clave_api_aqui
   ```
   *Nota: Si dejas la clave vacía, la app funcionará automáticamente en **Modo Demo** con el motor NLP integrado.*

4. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre en tu navegador: `http://localhost:5173`

5. **Compilar para producción**:
   ```bash
   npm run build
   ```

---

## ⚙️ Arquitectura e Integración de IA

La llamada a la IA está centralizada en la función `analizarActividad(texto)` en [`src/services/aiInterpreter.ts`](./src/services/aiInterpreter.ts).

### Flujo de Datos:
1. **Entrada de usuario**: El texto ingresado en el chat pasa por `analizarActividad(texto)`.
2. **System Prompt**: Se le exige al modelo de IA devolver estrictamente un arreglo JSON:
   ```json
   [
     {
       "categoria": "transport" | "energy" | "waste" | "water" | "operations",
       "nombre": "Descripción breve",
       "cantidad": 120,
       "unidad": "km",
       "subTipo": "diesel"
     }
   ]
   ```
3. **Conversión Estándar (GHG Protocol)**: Las entidades extraídas son enviadas a `calculateEmissions()` en [`src/services/emissionCalculator.ts`](./src/services/emissionCalculator.ts), donde se aplican factores auditables (`cantidad × factor = kg CO2e`).
4. **Resiliencia & Timeout**: La llamada a la API tiene un timeout de 8 segundos (`AbortController`). Si la API no responde o no se proporciona clave, conmuta suavemente al motor NLP local.

---

## 🌐 Guía de Despliegue en Producción

### Opción 1: Despliegue en Vercel (Recomendado)
1. Instala Vercel CLI o conecta tu repositorio en [vercel.com](https://vercel.com).
2. Ejecuta en la terminal:
   ```bash
   npx vercel
   ```
3. Configura las variables de entorno en el panel de Vercel:
   - `VITE_AI_PROVIDER`: `gemini`
   - `VITE_AI_API_KEY`: `[Tu API Key de Gemini o OpenAI]`
4. Build Command: `npm run build`
5. Output Directory: `dist`

### Opción 2: Despliegue en Netlify
1. Conecta el repositorio en [netlify.com](https://netlify.com).
2. Build Command: `npm run build`
3. Publish Directory: `dist`
4. En **Site Settings > Environment Variables**, agrega `VITE_AI_API_KEY` y `VITE_AI_PROVIDER`.

### Opción 3: Despliegue en Replit
1. Importa el proyecto a Replit como un Repl de Vite / Node.js.
2. Agrega `VITE_AI_API_KEY` en la sección **Secrets (Environment Variables)**.
3. Ejecuta `npm install` y luego `npm run dev` / `npm run build`.

---

## 📄 Licencia
Proyecto desarrollado bajo la licencia MIT.
