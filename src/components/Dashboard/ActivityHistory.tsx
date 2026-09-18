import React from 'react';
import { LogEntry } from '../../types';
import { History, Trash2, Calendar } from 'lucide-react';

interface ActivityHistoryProps {
  logs: LogEntry[];
  onDeleteLog: (id: string) => void;
}

export const ActivityHistory: React.FC<ActivityHistoryProps> = ({ logs, onDeleteLog }) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-emerald-100/80 shadow-eco-sm mb-4">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
        <h3 className="text-sm font-semibold text-stone-800 flex items-center">
          <History className="w-4 h-4 mr-1.5 text-emerald-600" />
          Historial de Registros ({logs.length})
        </h3>
        <span className="text-[11px] text-stone-400">Orden cronológico</span>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-6 text-stone-400 text-xs">
          No hay registros aún en tu historial.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {logs.map((log) => {
            const dateStr = new Date(log.createdAt).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-stone-50/70 hover:bg-emerald-50/40 border border-stone-200/60 hover:border-emerald-200 transition-all text-xs flex items-start justify-between group"
              >
                <div className="space-y-1 max-w-[82%]">
                  <div className="flex items-center space-x-1.5 text-stone-400 text-[10px] font-mono">
                    <Calendar className="w-3 h-3" />
                    <span>{dateStr}</span>
                  </div>
                  <p className="text-stone-800 font-medium leading-tight line-clamp-2">
                    "{log.originalText}"
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {log.items.map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-stone-200 text-[10px] text-stone-600 font-mono"
                      >
                        {item.name}: +{item.kgCO2} kg
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between self-stretch">
                  <span className="font-extrabold text-stone-900 text-sm bg-emerald-100/70 text-emerald-900 px-2 py-0.5 rounded-lg border border-emerald-200/60">
                    {log.totalKgCO2} <span className="text-[10px] font-normal">kg</span>
                  </span>
                  <button
                    onClick={() => onDeleteLog(log.id)}
                    className="p-1 text-stone-300 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Eliminar registro"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
