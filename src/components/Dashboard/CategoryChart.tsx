import React from 'react';
import { LogEntry, ActivityCategory } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Truck, Zap, Trash2, Droplets, Flame, BarChart3 } from 'lucide-react';

interface CategoryChartProps {
  logs: LogEntry[];
}

const CATEGORY_CONFIG: Record<ActivityCategory, { name: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  transport: { name: 'Transporte', color: '#d97706', bgColor: 'bg-amber-500', icon: <Truck className="w-3.5 h-3.5 text-amber-600" /> },
  energy: { name: 'Energía', color: '#eab308', bgColor: 'bg-yellow-500', icon: <Zap className="w-3.5 h-3.5 text-yellow-600" /> },
  waste: { name: 'Residuos', color: '#78716c', bgColor: 'bg-stone-500', icon: <Trash2 className="w-3.5 h-3.5 text-stone-600" /> },
  water: { name: 'Agua', color: '#0284c7', bgColor: 'bg-sky-500', icon: <Droplets className="w-3.5 h-3.5 text-sky-600" /> },
  operations: { name: 'Operaciones', color: '#ea580c', bgColor: 'bg-orange-500', icon: <Flame className="w-3.5 h-3.5 text-orange-600" /> },
};

export const CategoryChart: React.FC<CategoryChartProps> = ({ logs }) => {
  const categoryTotals: Record<ActivityCategory, number> = {
    transport: 0,
    energy: 0,
    waste: 0,
    water: 0,
    operations: 0,
  };

  let grandTotal = 0;
  logs.forEach((log) => {
    Object.entries(log.categoryTotals).forEach(([cat, val]) => {
      const typedCat = cat as ActivityCategory;
      categoryTotals[typedCat] = (categoryTotals[typedCat] || 0) + val;
      grandTotal += val;
    });
  });

  const chartData = Object.entries(categoryTotals)
    .filter(([_, val]) => val > 0)
    .map(([cat, val]) => ({
      name: CATEGORY_CONFIG[cat as ActivityCategory].name,
      val: Number(val.toFixed(2)),
      color: CATEGORY_CONFIG[cat as ActivityCategory].color,
      category: cat as ActivityCategory,
      percentage: grandTotal > 0 ? Math.round((val / grandTotal) * 100) : 0,
    }));

  return (
    <div className="bg-white p-4 rounded-2xl border border-emerald-100/80 shadow-eco-sm mb-4">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
        <h3 className="text-sm font-semibold text-stone-800 flex items-center">
          <BarChart3 className="w-4 h-4 mr-1.5 text-emerald-600" />
          Desglose por Categoría
        </h3>
        <span className="text-[11px] text-stone-400">Distribución %</span>
      </div>

      {grandTotal === 0 ? (
        <div className="text-center py-6 text-stone-400 text-xs">
          Aún no hay suficiente actividad registrada para generar el gráfico.
        </div>
      ) : (
        <div className="space-y-3">
          {/* Donut Chart visual */}
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={4}
                  dataKey="val"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val} kg CO2e`, 'Emisión']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Visual Bar list */}
          <div className="space-y-2">
            {Object.entries(categoryTotals).map(([catKey, val]) => {
              const cat = catKey as ActivityCategory;
              const config = CATEGORY_CONFIG[cat];
              const percentage = grandTotal > 0 ? Math.round((val / grandTotal) * 100) : 0;

              return (
                <div key={catKey} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="flex items-center font-medium text-stone-700">
                      <span className="mr-1.5">{config.icon}</span>
                      {config.name}
                    </span>
                    <span className="text-stone-500 font-mono">
                      {val.toFixed(1)} kg ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full ${config.bgColor} transition-all duration-500 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
