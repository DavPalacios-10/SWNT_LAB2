import { ActivityCategory, ChatMessage, LogEntry } from '../types';

const LOGS_STORAGE_KEY = 'ecotrack_ai_logs_v1';
const CHAT_STORAGE_KEY = 'ecotrack_ai_chat_v1';

// Registros iniciales de demostración para primera ejecución
const INITIAL_DEMO_LOGS: LogEntry[] = [
  {
    id: 'log_demo_1',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // Hace 2 días
    originalText: 'Ayer operamos 4 camionetas de reparto recorriendo 120 km en total y tuvimos el aire acondicionado del local a 180 kWh.',
    totalKgCO2: 95.7,
    items: [
      {
        entityId: 'ent_demo_1a',
        category: 'transport',
        name: 'Transporte en camioneta/furgón',
        quantity: 120,
        unit: 'km',
        kgCO2: 26.4,
        factorUsed: 0.22,
        factorUnit: 'kg CO2e / km',
        explanation: '120 km × 0.22 kg CO2e / km'
      },
      {
        entityId: 'ent_demo_1b',
        category: 'energy',
        name: 'Consumo de energía eléctrica',
        quantity: 180,
        unit: 'kWh',
        kgCO2: 69.3,
        factorUsed: 0.385,
        factorUnit: 'kg CO2e / kWh',
        explanation: '180 kWh × 0.385 kg CO2e / kWh'
      }
    ],
    categoryTotals: {
      transport: 26.4,
      energy: 69.3,
      waste: 0,
      water: 0,
      operations: 0
    }
  },
  {
    id: 'log_demo_2',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Hace 1 día
    originalText: 'Generamos 35 kg de cajas de cartón en empaques y gastamos 4 m3 de agua en la limpieza diaria.',
    totalKgCO2: 23.95,
    items: [
      {
        entityId: 'ent_demo_2a',
        category: 'waste',
        name: 'Residuos de cartón y empaques',
        quantity: 35,
        unit: 'kg',
        kgCO2: 22.75,
        factorUsed: 0.65,
        factorUnit: 'kg CO2e / kg',
        explanation: '35 kg × 0.65 kg CO2e / kg'
      },
      {
        entityId: 'ent_demo_2b',
        category: 'water',
        name: 'Consumo de agua potable',
        quantity: 4,
        unit: 'm3',
        kgCO2: 1.2,
        factorUsed: 0.3,
        factorUnit: 'kg CO2e / m3',
        explanation: '4 m3 × 0.3 kg CO2e / m3'
      }
    ],
    categoryTotals: {
      transport: 0,
      energy: 0,
      waste: 22.75,
      water: 1.2,
      operations: 0
    }
  }
];

const INITIAL_DEMO_CHAT: ChatMessage[] = [
  {
    id: 'msg_welcome',
    sender: 'assistant',
    text: '¡Hola! Soy tu asistente de **EcoTrack AI** 🌿.\n\nDescribe tus actividades diarias en lenguaje natural (ej. *"Hoy usamos 3 camionetas de reparto 80 km y consumimos 150 kWh de luz"*) y calcularé tu huella de carbono estimada sin formularios complejos.',
    timestamp: new Date(Date.now() - 3600000 * 5).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'msg_demo_user',
    sender: 'user',
    text: 'Ayer operamos 4 camionetas de reparto recorriendo 120 km en total y tuvimos el aire acondicionado del local a 180 kWh.',
    timestamp: new Date(Date.now() - 86400000 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'msg_demo_assistant',
    sender: 'assistant',
    text: 'Se calcularon un total de **95.7 kg CO2e** para tus actividades descritas.',
    timestamp: new Date(Date.now() - 86400000 * 2 + 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    emissionResult: {
      totalKgCO2: 95.7,
      items: INITIAL_DEMO_LOGS[0].items,
      summaryMessage: 'Se calcularon un total de 95.7 kg CO2e para tus actividades descritas.',
      recommendations: [
        'Agrupar rutas de entrega o cambiar a vehículos eléctricos/híbridos reduce hasta un 35% las emisiones logísticas.',
        'Apagar equipos en modo standby y pasar a iluminación LED inteligente ahorra entre 10% y 20% de kWh diarios.'
      ]
    },
    logId: 'log_demo_1'
  }
];

export function getStoredLogs(): LogEntry[] {
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_LOGS));
      return INITIAL_DEMO_LOGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error al leer logs de localStorage:', err);
    return INITIAL_DEMO_LOGS;
  }
}

export function saveLogs(logs: LogEntry[]): void {
  try {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Error al guardar logs en localStorage:', err);
  }
}

export function getStoredChat(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_CHAT));
      return INITIAL_DEMO_CHAT;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error al leer chat de localStorage:', err);
    return INITIAL_DEMO_CHAT;
  }
}

export function saveChat(chat: ChatMessage[]): void {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chat));
  } catch (err) {
    console.error('Error al guardar chat en localStorage:', err);
  }
}

export function resetToDemoData(): { logs: LogEntry[]; chat: ChatMessage[] } {
  localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_LOGS));
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_CHAT));
  return { logs: INITIAL_DEMO_LOGS, chat: INITIAL_DEMO_CHAT };
}

export function clearAllData(): { logs: LogEntry[]; chat: ChatMessage[] } {
  const emptyLogs: LogEntry[] = [];
  const emptyChat: ChatMessage[] = [INITIAL_DEMO_CHAT[0]];
  localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(emptyLogs));
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(emptyChat));
  return { logs: emptyLogs, chat: emptyChat };
}
