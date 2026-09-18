import React from 'react';
import { Lightbulb, CheckCircle2, ShieldAlert } from 'lucide-react';

export const EcoTips: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-4 rounded-2xl shadow-eco-md relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center space-x-2 mb-2 text-emerald-300 font-semibold text-xs uppercase tracking-wider">
        <Lightbulb className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span>Tips de Sostenibilidad PYME</span>
      </div>

      <h4 className="font-bold text-sm text-emerald-50 mb-2">
        Pequeños cambios, gran impacto financiero y ambiental
      </h4>

      <ul className="space-y-2 text-xs text-emerald-100/90 leading-relaxed">
        <li className="flex items-start space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span><strong>Optimiza la logística:</strong> Consolidar las entregas en 2 días por semana reduce hasta 40% las emisiones diésel.</span>
        </li>
        <li className="flex items-start space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span><strong>Red de reciclaje local:</strong> El cartón limpio reutilizado en embalaje ahorra costos de empaque directo.</span>
        </li>
        <li className="flex items-start space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span><strong>Eficiencia en iluminación:</strong> Sensores de movimiento en almacenes y oficinas ahorran un 15% en el recibo de luz.</span>
        </li>
      </ul>
    </div>
  );
};
