import React from 'react';
import { Leaf, RefreshCw, Trash2, HelpCircle, Sparkles, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  totalKgCO2: number;
  onResetDemo: () => void;
  onClearAll: () => void;
  onOpenMethodology: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalKgCO2,
  onResetDemo,
  onClearAll,
  onOpenMethodology,
}) => {
  // Un árbol maduro absorbe ~22 kg de CO2 al año
  const treesRequired = Math.ceil(totalKgCO2 / 22);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-emerald-100/80 shadow-eco-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Vibe */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-200 text-white transform hover:scale-105 transition-transform duration-200">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg text-stone-900 tracking-tight">EcoTrack <span className="text-emerald-600 font-extrabold">AI</span></h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Sparkles className="w-3 h-3 mr-1 text-emerald-600 animate-pulse-subtle" />
                MVP
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">Huella de carbono en lenguaje natural para PYMEs</p>
          </div>
        </div>

        {/* Dynamic Badge & Actions */}
        <div className="flex items-center space-x-3">
          {/* Tree Counter Pill */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Total Acumulado: <strong className="text-emerald-700 font-bold">{totalKgCO2.toFixed(1)} kg CO2e</strong></span>
            <span className="text-stone-400">|</span>
            <span className="flex items-center text-emerald-800">
              🌳 ~{treesRequired} {treesRequired === 1 ? 'árbol' : 'árboles'} para compensar
            </span>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center space-x-1">
            <button
              onClick={onOpenMethodology}
              className="p-2 rounded-lg text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors text-xs font-medium flex items-center space-x-1"
              title="Metodología y Factores de Emisión"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden lg:inline">Factores CO2</span>
            </button>

            <button
              onClick={onResetDemo}
              className="p-2 rounded-lg text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors text-xs font-medium flex items-center space-x-1"
              title="Restaurar datos de demostración"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden lg:inline">Demo</span>
            </button>

            <button
              onClick={onClearAll}
              className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Borrar todo el historial"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
