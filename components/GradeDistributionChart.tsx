import React from 'react';
import { GradeDistribution } from '@/lib/types';

interface GradeDistributionChartProps {
  distribution: GradeDistribution[];
}

export default function GradeDistributionChart({ distribution }: GradeDistributionChartProps) {
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  const getBarColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-emerald-500 hover:bg-emerald-600';
    if (grade.startsWith('B')) return 'bg-indigo-500 hover:bg-indigo-600';
    if (grade.startsWith('C')) return 'bg-amber-500 hover:bg-amber-600';
    if (grade.startsWith('D')) return 'bg-orange-500 hover:bg-orange-600';
    return 'bg-rose-500 hover:bg-rose-600';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Grade Distribution Analysis</h3>
          <p className="text-xs text-slate-500">Continuous assessment frequency distribution across all active courses</p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> A Scale</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> B Scale</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> C Scale</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> D/F</span>
        </div>
      </div>

      <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-100">
        {distribution.map((item) => {
          const heightPercent = Math.max(8, (item.count / maxCount) * 100);
          return (
            <div key={item.grade} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[11px] font-semibold py-1 px-2 rounded pointer-events-none whitespace-nowrap z-20 shadow-lg">
                {item.count} student{item.count !== 1 ? 's' : ''} ({item.percentage}%)
              </div>

              {/* Bar */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full max-w-[36px] rounded-t-md transition-all duration-300 ${getBarColor(
                  item.grade
                )}`}
              />
            </div>
          );
        })}
      </div>

      {/* Grade Labels below */}
      <div className="flex justify-between gap-2 mt-2 px-2 text-center">
        {distribution.map((item) => (
          <div key={item.grade} className="flex-1">
            <span className="text-xs font-semibold text-slate-700 block">{item.grade}</span>
            <span className="text-[10px] text-slate-400 block">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
