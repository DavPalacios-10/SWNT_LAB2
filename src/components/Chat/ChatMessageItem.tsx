import React from 'react';
import { ChatMessage, ActivityCategory } from '../../types';
import { Leaf, Truck, Zap, Trash2, Droplets, Flame, Sparkles, CheckCircle2, Lightbulb, User, AlertCircle } from 'lucide-react';

interface ChatMessageItemProps {
  message: ChatMessage;
}

const CATEGORY_ICONS: Record<ActivityCategory, { icon: React.ReactNode; label: string; colorClass: string; bgClass: string }> = {
  transport: {
    icon: <Truck className="w-4 h-4" />,
    label: 'Transporte',
    colorClass: 'text-amber-700 border-amber-200',
    bgClass: 'bg-amber-50',
  },
  energy: {
    icon: <Zap className="w-4 h-4" />,
    label: 'Energía',
    colorClass: 'text-yellow-700 border-yellow-200',
    bgClass: 'bg-yellow-50',
  },
  waste: {
    icon: <Trash2 className="w-4 h-4" />,
    label: 'Residuos',
    colorClass: 'text-stone-700 border-stone-200',
    bgClass: 'bg-stone-100',
  },
  water: {
    icon: <Droplets className="w-4 h-4" />,
    label: 'Agua',
    colorClass: 'text-sky-700 border-sky-200',
    bgClass: 'bg-sky-50',
  },
  operations: {
    icon: <Flame className="w-4 h-4" />,
    label: 'Operaciones/Gas',
    colorClass: 'text-orange-700 border-orange-200',
    bgClass: 'bg-orange-50',
  },
};

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-fadeIn">
        <div className="flex items-start max-w-xl space-x-2">
          <div className="bg-emerald-700 text-white rounded-3xl rounded-tr-sm px-5 py-3.5 shadow-sm border border-emerald-800">
            <p className="text-sm font-normal leading-relaxed">{message.text}</p>
            <span className="block text-[10px] text-emerald-200/80 text-right mt-1 font-mono">{message.timestamp}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 flex-shrink-0">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex justify-start mb-6 animate-fadeIn">
      <div className="flex items-start max-w-2xl space-x-3">
        {/* Assistant Avatar */}
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-sm flex-shrink-0 mt-0.5">
          <Leaf className="w-5 h-5" />
        </div>

        {/* Message Card */}
        <div className="bg-white rounded-3xl rounded-tl-sm p-5 shadow-eco-sm border border-emerald-100/90 text-stone-800 w-full transition-all duration-300">
          {/* Main Text */}
          <div className="text-sm leading-relaxed whitespace-pre-line mb-2 font-normal">
            {message.text}
          </div>

          {/* Analyzing Loading Spinner with Eco Pulse */}
          {message.isAnalyzing && (
            <div className="flex items-center space-x-3 py-3 px-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/50 my-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-xs text-emerald-800 font-medium">Interpretando actividades con IA y calculando factores de emisión...</span>
            </div>
          )}

          {/* Emission Result Details Card */}
          {message.emissionResult && !message.isAnalyzing && (
            <div className="mt-3 pt-3 border-t border-stone-100">
              {/* Total Badge Summary */}
              <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 via-teal-50/40 to-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200/70 mb-3">
                <div>
                  <span className="text-[11px] text-emerald-800 font-medium uppercase tracking-wider block">Emisiones Totales</span>
                  <span className="text-2xl font-extrabold text-emerald-950">{message.emissionResult.totalKgCO2} <span className="text-sm font-semibold text-emerald-700">kg CO2e</span></span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Análisis Completo
                  </span>
                </div>
              </div>

              {/* Breakdown of Extracted Items */}
              {message.emissionResult.items.length > 0 && (
                <div className="space-y-2 mb-3">
                  <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
                    Actividades procesadas por la IA:
                  </span>
                  {message.emissionResult.items.map((item, idx) => {
                    const catConfig = CATEGORY_ICONS[item.category] || CATEGORY_ICONS['energy'];
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-stone-50/80 border border-stone-200/60 text-xs hover:border-emerald-200 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`p-2 rounded-lg border ${catConfig.bgClass} ${catConfig.colorClass}`}>
                            {catConfig.icon}
                          </span>
                          <div>
                            <p className="font-semibold text-stone-800">{item.name}</p>
                            <p className="text-[11px] text-stone-500 font-mono">{item.explanation}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-stone-900 text-sm">+{item.kgCO2}</span>
                          <span className="text-[10px] text-stone-500 block font-mono">kg CO2e</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Recommendations */}
              {message.emissionResult.recommendations.length > 0 && (
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 mt-2">
                  <div className="flex items-center space-x-1.5 text-amber-800 font-semibold mb-1">
                    <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Recomendación de Reducción:</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-amber-900/90 text-[11.5px]">
                    {message.emissionResult.recommendations.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <span className="block text-[10px] text-stone-400 text-right mt-2 font-mono">{message.timestamp}</span>
        </div>
      </div>
    </div>
  );
};
