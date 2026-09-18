export type ActivityCategory = 'transport' | 'energy' | 'waste' | 'water' | 'operations';

export interface CategoryInfo {
  id: ActivityCategory;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface ExtractedEntity {
  id: string;
  category: ActivityCategory;
  name: string;
  quantity: number;
  unit: string;
  subType?: string; // e.g., 'diesel', 'gasolina', 'carton', 'electricidad'
  confidence: number; // 0 to 1 score
}

export interface EmissionBreakdownItem {
  entityId: string;
  category: ActivityCategory;
  name: string;
  quantity: number;
  unit: string;
  kgCO2: number;
  factorUsed: number;
  factorUnit: string;
  explanation: string;
}

export interface EmissionCalculationResult {
  totalKgCO2: number;
  items: EmissionBreakdownItem[];
  summaryMessage: string;
  recommendations: string[];
}

export interface LogEntry {
  id: string;
  createdAt: string; // ISO date string
  originalText: string;
  totalKgCO2: number;
  items: EmissionBreakdownItem[];
  categoryTotals: Record<ActivityCategory, number>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isAnalyzing?: boolean;
  emissionResult?: EmissionCalculationResult;
  logId?: string;
}

export interface CategorySummary {
  category: ActivityCategory;
  name: string;
  totalKgCO2: number;
  percentage: number;
  color: string;
}
