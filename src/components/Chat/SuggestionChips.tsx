import React from 'react';
import { Sparkles } from 'lucide-react';

interface SuggestionChipsProps {
  onSelectSuggestion: (text: string) => void;
  disabled?: boolean;
}

const SUGGESTIONS = [
  { label: '🚚 3 camionetas diésel recorriendo 120 km', query: 'Hoy usamos 3 camionetas de reparto diésel recorriendo 120 km' },
  { label: '⚡ 200 kWh de energía en el local', query: 'Consumimos 200 kWh de luz eléctrica en el taller' },
  { label: '📦 40 kg de cartón y 5 kg de plástico', query: 'Generamos 40 kg de residuos de cartón y 5 kg de plástico' },
  { label: '💧 10 m3 de agua en limpieza', query: 'Usamos 10 m3 de agua potable para la limpieza del establecimiento' },
  { label: '🔥 2 balones de gas GLP', query: 'Consumimos 2 balones de gas GLP en la cocina comercial' },
];

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({ onSelectSuggestion, disabled }) => {
  return (
    <div className="py-2 overflow-x-auto no-scrollbar flex items-center space-x-2 text-xs">
      <span className="flex items-center text-stone-400 font-medium whitespace-nowrap mr-1">
        <Sparkles className="w-3 h-3 mr-1 text-emerald-500" />
        Sugerencias rápidas:
      </span>
      {SUGGESTIONS.map((item, idx) => (
        <button
          key={idx}
          onClick={() => onSelectSuggestion(item.query)}
          disabled={disabled}
          className="whitespace-nowrap px-3 py-1.5 rounded-full bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/60 transition-all duration-150 active:scale-95 disabled:opacity-50"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
