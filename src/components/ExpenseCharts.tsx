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
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { SpendItem } from '../types';
import { formatCurrency } from '../utils/format';
import { getPieChartData, getTrendChartData } from '../utils/chartData';

interface ExpenseChartsProps {
  items: SpendItem[];
  dailyTotal: number;
  bigTotal: number;
}

export default function ExpenseCharts({ items, dailyTotal, bigTotal }: ExpenseChartsProps) {
  const { t } = useTranslation();
  const pieData = useMemo(() => {
    const rawData = getPieChartData(dailyTotal, bigTotal);
    
    return rawData.map(item => ({
      ...item,
      name: item.name === 'Daily Spend' ? t('daily_spend') : t('big_spend')
    }));
  }, [dailyTotal, bigTotal, t]);
  
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
          <p className="text-base font-bold text-slate-800 dark:text-white">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 animate-slide-up opacity-0" style={{ animationDelay: '150ms' }}>
      {/* Distribution Chart (Pie) */}
      <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl dark:shadow-2xl dark:shadow-black/50 transition-colors duration-300">
        <h2 className="mb-6 text-base font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <span>🍩</span> {t('expense_distribution')}
        </h2>
        <div className="h-64 w-full">
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
        <div className="mt-4 flex justify-center gap-6">
          {pieData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
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
                  dataKey="total"
                  fill="#818cf8"
                  radius={[4, 4, 4, 4]}
                  maxBarSize={40}
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


