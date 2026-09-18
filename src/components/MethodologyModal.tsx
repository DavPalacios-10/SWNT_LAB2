import React from 'react';
import { EMISSION_FACTORS } from '../services/emissionCalculator';
import { X, BookOpen, ShieldCheck, Info } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-emerald-100 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Metodología y Factores de Emisión</h3>
              <p className="text-xs text-stone-500">Estándares públicos GHG Protocol & DEFRA 2023</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-stone-600 leading-relaxed">
          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/60 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-950 text-xs mb-1">¿Cómo funciona el cálculo de EcoTrack AI?</p>
              <p className="text-emerald-900/90 text-[11.5px]">
                Nuestra app utiliza un motor NLP para extraer la cantidad y unidad de cada actividad descrita en lenguaje natural. Luego multiplica cada valor por el <strong>Factor de Emisión</strong> certificado para convertir la actividad en kilogramos equivalentes de dióxido de carbono (<strong>kg CO2e</strong>).
              </p>
            </div>
          </div>

          <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider pt-2">
            Tabla de Factores de Referencia Utilizados:
          </h4>

          <div className="space-y-2">
            {Object.entries(EMISSION_FACTORS).map(([key, item]) => (
              <div key={key} className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 flex justify-between items-center">
                <div>
                  <p className="font-bold text-stone-800 text-xs capitalize">{key.replace(/_/g, ' ')}</p>
                  <p className="text-[11px] text-stone-500">{item.description}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <span className="font-mono font-bold text-emerald-700 text-xs bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {item.factor} {item.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-xl shadow-md transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
