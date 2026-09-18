import { ExtractedEntity, ActivityCategory } from '../types';

/**
 * PROMPT DE SISTEMA PARA LA IA
 */
const SYSTEM_PROMPT = `
Eres un analista de huella de carbono experto para pequeños negocios y PYMEs.
Tu tarea es analizar descripciones de actividades diarias en español e identificar todas las actividades que consumen recursos o generan emisiones.

Debes responder ÚNICAMENTE con un arreglo JSON válido (sin código markdown ni explicaciones de texto).
Cada elemento del arreglo debe tener exactamente este formato JSON:
[
  {
    "categoria": "transport" | "energy" | "waste" | "water" | "operations",
    "nombre": "Nombre descriptivo breve de la actividad en español",
    "cantidad": número_float_positivo,
    "unidad": "km" | "kWh" | "kg" | "m3" | "litros" | "balones (10kg)",
    "subTipo": "diesel" | "gasolina" | "electricidad" | "carton" | "plastico" | "balon" | "gas_natural" | "generales"
  }
]

Reglas estrictas:
1. Ignora números negativos o cantidades en cero.
2. Si el texto incluye varias actividades, incluye cada una como un objeto separado.
3. Si no logras identificar ninguna cantidad o actividad válida con emisiones, responde con un arreglo vacío: []
`;

export interface AnalysisResult {
  entities: ExtractedEntity[];
  isRealAI: boolean;
  modelUsed: string;
  isFallback?: boolean;
}

/**
 * FUNCIÓN PRINCIPAL CON TIMEOUT Y QA EDGE CASE GUARDS: analizarActividad(texto)
 */
export async function analizarActividad(texto: string): Promise<AnalysisResult> {
  const sanitizedText = (texto || '').trim();

  // Guard QA 1: Texto vacío o solo espacios
  if (!sanitizedText || sanitizedText.length === 0) {
    return {
      entities: [],
      isRealAI: false,
      modelUsed: 'QA Guard (Texto vacío)'
    };
  }

  const apiKey = import.meta.env.VITE_AI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;
  const provider = (import.meta.env.VITE_AI_PROVIDER || 'gemini').toLowerCase();

  // Si hay API Key, intentamos llamada con Timeout de 8 segundos
  if (apiKey && apiKey.trim().length > 5) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s Timeout

      let realResult: ExtractedEntity[] = [];

      if (provider === 'gemini') {
        realResult = await callGeminiAPI(sanitizedText, apiKey, controller.signal);
      } else if (provider === 'openai') {
        realResult = await callOpenAIAPI(sanitizedText, apiKey, controller.signal);
      }

      clearTimeout(timeoutId);

      if (realResult && realResult.length > 0) {
        return {
          entities: sanitizeEntities(realResult),
          isRealAI: true,
          modelUsed: provider === 'gemini' ? 'Google Gemini 1.5 Flash' : 'OpenAI GPT-4o-mini'
        };
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn('⚠️ La API de IA excedió el tiempo límite (Timeout 8s). Conmutando a Modo Demo...');
      } else {
        console.warn('⚠️ Falló la llamada a la API de IA real:', error.message || error);
      }
    }
  }

  // FALLBACK MODO DEMO (NLP Local)
  const demoEntities = await parseLocalDemoNLP(sanitizedText);
  return {
    entities: sanitizeEntities(demoEntities),
    isRealAI: false,
    modelUsed: 'EcoTrack AI Engine (Modo Demo)',
    isFallback: true
  };
}

/**
 * Saneamiento QA de entidades: Filtra valores negativos, ceros y desbordamientos
 */
function sanitizeEntities(rawEntities: ExtractedEntity[]): ExtractedEntity[] {
  return rawEntities
    .filter((e) => e && typeof e.quantity === 'number' && !isNaN(e.quantity) && e.quantity > 0)
    .map((e) => ({
      ...e,
      quantity: Math.min(Math.abs(e.quantity), 1000000), // Cap razonable de 1M para evitar desbordamiento
      confidence: Math.min(Math.max(e.confidence || 0.8, 0.1), 1.0)
    }));
}

/**
 * Llamada Gemini con AbortSignal para timeout
 */
async function callGeminiAPI(userText: string, apiKey: string, signal: AbortSignal): Promise<ExtractedEntity[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nTexto del usuario: "${userText}"` }] }],
      generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
    })
  });

  if (!response.ok) throw new Error(`Gemini HTTP Error ${response.status}`);

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return rawText ? parseLLMJsonResponse(rawText) : [];
}

/**
 * Llamada OpenAI con AbortSignal para timeout
 */
async function callOpenAIAPI(userText: string, apiKey: string, signal: AbortSignal): Promise<ExtractedEntity[]> {
  const url = 'https://api.openai.com/v1/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    signal,
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userText }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) throw new Error(`OpenAI HTTP Error ${response.status}`);

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content;
  return rawText ? parseLLMJsonResponse(rawText) : [];
}

function parseLLMJsonResponse(jsonText: string): ExtractedEntity[] {
  try {
    const cleanedText = jsonText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedText);
    const itemsArray = Array.isArray(parsed) ? parsed : (parsed.actividades || parsed.items || [parsed]);

    const validCategories: ActivityCategory[] = ['transport', 'energy', 'waste', 'water', 'operations'];

    return itemsArray.map((item: any) => {
      const cat = validCategories.includes(item.categoria) ? item.categoria : 'energy';
      const rawQty = Math.abs(parseFloat(item.cantidad) || 0);
      return {
        id: 'ent_' + Math.random().toString(36).substr(2, 9),
        category: cat,
        name: item.nombre || `Consumo de ${item.unidad || 'recurso'}`,
        quantity: rawQty,
        unit: item.unidad || 'unidades',
        subType: item.subTipo || undefined,
        confidence: 0.98
      };
    });
  } catch (err) {
    console.error('Error parseando JSON de IA:', err);
    return [];
  }
}

/**
 * FALLBACK LOCAL MODO DEMO (NLP Local)
 */
async function parseLocalDemoNLP(text: string): Promise<ExtractedEntity[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const lowerText = text.toLowerCase();
  const entities: ExtractedEntity[] = [];

  // Regex con captura segura de cantidades positivas
  const transportMatch = lowerText.match(/(\d+(?:[\.,]\d+)?)\s*(?:km|kilómetros|kilometros|camioneta|camionetas|furgón|furgones)/i);
  if (transportMatch) {
    const qty = Math.abs(parseFloat(transportMatch[1].replace(',', '.')));
    if (qty > 0) {
      entities.push({
        id: 'ent_' + Math.random().toString(36).substr(2, 9),
        category: 'transport',
        name: lowerText.includes('camioneta') ? 'Transporte en camioneta/furgón' : 'Transporte logístico',
        quantity: qty,
        unit: lowerText.includes('litro') ? 'litros' : 'km',
        subType: lowerText.includes('gasolina') ? 'gasolina' : 'diesel',
        confidence: 0.90
      });
    }
  }

  const energyMatch = lowerText.match(/(\d+(?:[\.,]\d+)?)\s*(?:kwh|kw|kilovatios|luz|electricidad)/i);
  if (energyMatch) {
    const qty = Math.abs(parseFloat(energyMatch[1].replace(',', '.')));
    if (qty > 0) {
      entities.push({
        id: 'ent_' + Math.random().toString(36).substr(2, 9),
        category: 'energy',
        name: 'Consumo de energía eléctrica',
        quantity: qty,
        unit: 'kWh',
        confidence: 0.95
      });
    }
  }

  const wasteMatch = lowerText.match(/(\d+(?:[\.,]\d+)?)\s*(?:kg|kilos|kilo|toneladas)\s*(?:de\s*)?(?:basura|residuos|cartón|carton|plástico|plastico)/i);
  if (wasteMatch) {
    const qty = Math.abs(parseFloat(wasteMatch[1].replace(',', '.')));
    if (qty > 0) {
      const isCarton = lowerText.includes('cartón') || lowerText.includes('carton');
      entities.push({
        id: 'ent_' + Math.random().toString(36).substr(2, 9),
        category: 'waste',
        name: isCarton ? 'Residuos de cartón y empaques' : 'Residuos comerciales mixtos',
        quantity: qty,
        unit: 'kg',
        subType: isCarton ? 'carton' : 'generales',
        confidence: 0.88
      });
    }
  }

  const waterMatch = lowerText.match(/(\d+(?:[\.,]\d+)?)\s*(?:m3|metros cúbicos|litros?)\s*(?:de\s*)?agua/i);
  if (waterMatch) {
    const qty = Math.abs(parseFloat(waterMatch[1].replace(',', '.')));
    if (qty > 0) {
      entities.push({
        id: 'ent_' + Math.random().toString(36).substr(2, 9),
        category: 'water',
        name: 'Consumo de agua potable',
        quantity: qty,
        unit: lowerText.includes('m3') ? 'm3' : 'litros',
        confidence: 0.90
      });
    }
  }

  const gasMatch = lowerText.match(/(\d+(?:[\.,]\d+)?)\s*(?:balón|balones|cilindro|m3)?\s*(?:de\s*)?gas/i);
  if (gasMatch && !entities.some(e => e.category === 'operations')) {
    const qty = Math.abs(parseFloat(gasMatch[1].replace(',', '.')));
    if (qty > 0) {
      const isBalon = lowerText.includes('balón') || lowerText.includes('balones');
      entities.push({
        id: 'ent_' + Math.random().toString(36).substr(2, 9),
        category: 'operations',
        name: isBalon ? 'Gas licuado GLP (balones)' : 'Gas natural comercial',
        quantity: qty,
        unit: isBalon ? 'balones (10kg)' : 'm3',
        subType: isBalon ? 'balon' : 'gas_natural',
        confidence: 0.89
      });
    }
  }

  return entities;
}
