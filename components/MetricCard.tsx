import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'blue' | 'purple';
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'indigo',
}: MetricCardProps) {
  const schemeStyles = {
    indigo: { bg: 'bg-indigo-50 text-indigo-600', ring: 'ring-indigo-100' },
    emerald: { bg: 'bg-emerald-50 text-emerald-600', ring: 'ring-emerald-100' },
    amber: { bg: 'bg-amber-50 text-amber-600', ring: 'ring-amber-100' },
    blue: { bg: 'bg-blue-50 text-blue-600', ring: 'ring-blue-100' },
    purple: { bg: 'bg-purple-50 text-purple-600', ring: 'ring-purple-100' },
  }[colorScheme];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${schemeStyles.bg} ring-4 ${schemeStyles.ring}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold ${
                trend.positive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
