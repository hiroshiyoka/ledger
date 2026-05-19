import {
  Bar,
  Pie,
  Cell,
  XAxis,
  Tooltip,
  PieChart,
  BarChart,
  ResponsiveContainer,
} from 'recharts';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { Transaction } from '../types';
import { useCategories } from '../hooks/useCategories';
import { formatCurrency } from '../utils/format';
import { getPieChartData, getTrendChartData } from '../utils/chartData';

interface DashboardChartsProps {
  items: Transaction[];
}

export default function DashboardCharts({ items }: DashboardChartsProps) {
  const { t } = useTranslation();
  const { categories } = useCategories();
  const [pieType, setPieType] = useState<'expense' | 'income'>('expense');

  const pieData = useMemo(() => getPieChartData(items, categories, pieType), [items, categories, pieType]);
  const trendData = useMemo(() => getTrendChartData(items), [items]);

  if (items.length === 0) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 p-3 shadow-xl backdrop-blur-md transition-colors">
          <p className="mb-1 text-sm font-medium text-slate-500 dark:text-slate-300">
            {payload[0].payload.name || payload[0].payload.dateLabel}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-bold" style={{ color: entry.fill }}>
              {entry.name === 'income' ? t('income') : entry.name === 'expense' ? t('expense') : entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 animate-slide-up opacity-0" style={{ animationDelay: '150ms' }}>
      {/* Distribution Chart (Pie) */}
      <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl dark:shadow-2xl dark:shadow-black/50 transition-colors duration-300 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>🍩</span> {t('expense_distribution')}
          </h2>
          <div className="flex gap-2 bg-slate-100 dark:bg-black/30 p-1 rounded-xl">
             <button
              onClick={() => setPieType('expense')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                pieType === 'expense' 
                  ? 'bg-white dark:bg-slate-700 text-rose-500 dark:text-rose-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {t('expense')}
            </button>
            <button
              onClick={() => setPieType('income')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                pieType === 'income' 
                  ? 'bg-white dark:bg-slate-700 text-emerald-500 dark:text-emerald-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {t('income')}
            </button>
          </div>
        </div>
        <div className="h-64 w-full flex-1">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <Tooltip content={renderCustomTooltip as any} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              {t('no_data')}
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {pieData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full shadow-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Chart (Bar) */}
      <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl dark:shadow-2xl dark:shadow-black/50 transition-colors duration-300">
        <h2 className="mb-6 text-base font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <span>📈</span> {t('trend_7_days')}
        </h2>
        <div className="h-64 w-full">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="dateLabel"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <Tooltip content={renderCustomTooltip} cursor={{ fill: 'rgba(125,125,125,0.1)' }} />
                <Bar
                  dataKey="income"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={30}
                  name="income"
                />
                <Bar
                  dataKey="expense"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={30}
                  name="expense"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              {t('no_data')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
