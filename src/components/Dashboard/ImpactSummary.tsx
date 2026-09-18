import React from 'react';
import { LogEntry, ActivityCategory } from '../../types';
import { Cloud, Trees, Flame, Award, TrendingDown, Layers } from 'lucide-react';

interface ImpactSummaryProps {
  logs: LogEntry[];
}

export const ImpactSummary: React.FC<ImpactSummaryProps> = ({ logs }) => {
  const totalKgCO2 = logs.reduce((acc, log) => acc + log.totalKgCO2, 0);
  const treesRequired = Math.ceil(totalKgCO2 / 22);

  // Calcular la categoría con mayor emisión
  const categoryTotals: Record<ActivityCategory, number> = {
    transport: 0,
    energy: 0,
    waste: 0,
    water: 0,
    operations: 0
  };

  logs.forEach((log) => {
    Object.entries(log.categoryTotals).forEach(([cat, val]) => {
      categoryTotals[cat as ActivityCategory] = (categoryTotals[cat as ActivityCategory] || 0) + val;
    });
  });

  let topCategory: { name: string; val: number } = { name: 'Ninguna', val: 0 };
  const catNames: Record<ActivityCategory, string> = {
    transport: 'Transporte',
    energy: 'Energía Eléctrica',
    waste: 'Residuos',
    water: 'Agua',
    operations: 'Operaciones / Gas'
  };

  Object.entries(categoryTotals).forEach(([cat, val]) => {
    if (val > topCategory.val) {
      topCategory = { name: catNames[cat as ActivityCategory], val };
    }
  });

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {/* Total CO2 Card */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-100/80 shadow-eco-sm flex flex-col justify-between hover:border-emerald-200 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-stone-500">Huella Total</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Cloud className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-extrabold text-stone-900 tracking-tight">
            {totalKgCO2.toFixed(1)} <span className="text-xs font-semibold text-emerald-700">kg CO2e</span>
          </p>
          <span className="text-[11px] text-stone-400">Acumulado en registros</span>
        </div>
      </div>

      {/* Trees Compensate Card */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-100/80 shadow-eco-sm flex flex-col justify-between hover:border-emerald-200 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-stone-500">Compensación</span>
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <Trees className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-extrabold text-teal-900 tracking-tight">
            ~{treesRequired} <span className="text-xs font-semibold text-teal-700">{treesRequired === 1 ? 'Árbol' : 'Árboles'}</span>
          </p>
          <span className="text-[11px] text-stone-400">Para absorber en 1 año</span>
        </div>
      </div>

      {/* Top Source Card */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-100/80 shadow-eco-sm flex flex-col justify-between hover:border-emerald-200 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-stone-500">Mayor Fuente</span>
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-base font-bold text-stone-800 truncate">
            {topCategory.name}
          </p>
          <span className="text-[11px] text-stone-400">
            {topCategory.val > 0 ? `${topCategory.val.toFixed(1)} kg CO2e` : 'Sin registros'}
          </span>
        </div>
      </div>

      {/* Activity Count Card */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-100/80 shadow-eco-sm flex flex-col justify-between hover:border-emerald-200 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-stone-500">Registros</span>
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-extrabold text-stone-900 tracking-tight">
            {logs.length} <span className="text-xs font-semibold text-stone-500">entradas</span>
          </p>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center">
            <TrendingDown className="w-3 h-3 mr-0.5" /> Monitoreo activo
          </span>
        </div>
      </div>
    </div>
  );
};
