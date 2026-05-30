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

  if (items.length === 0) return null;

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-hairline-strong bg-surface-card p-3 text-body-sm">
          <p className="font-[500] text-charcoal mb-1">
            {payload[0].payload.name || payload[0].payload.dateLabel}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="font-[500]" style={{ color: entry.fill }}>
              {entry.name === 'income' ? t('income') : entry.name === 'expense' ? t('expense') : entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <div className="rounded-lg border border-hairline-strong bg-surface-card p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-[500] text-charcoal uppercase tracking-widest">
            🍩 {t('expense_distribution')}
          </h2>
          <div className="flex bg-surface-elevated p-1 rounded-lg gap-1">
            <button onClick={() => setPieType('expense')}
              className={`px-3 py-1 rounded-md text-body-sm font-[500] transition-all ${pieType === 'expense' ? 'bg-surface-card text-accent-red' : 'text-mute hover:text-ink'}`}>
              📉 {t('expense')}
            </button>
            <button onClick={() => setPieType('income')}
              className={`px-3 py-1 rounded-md text-body-sm font-[500] transition-all ${pieType === 'income' ? 'bg-surface-card text-accent-green' : 'text-mute hover:text-ink'}`}>
              📈 {t('income')}
            </button>
          </div>
        </div>
        <div className="h-64 w-full">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip content={renderTooltip as any} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-base text-ash">{t('no_data')}</div>
          )}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {pieData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-body-sm font-[500] text-charcoal">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="rounded-lg border border-hairline-strong bg-surface-card p-6">
        <h2 className="mb-5 text-base font-[500] text-charcoal uppercase tracking-widest">
          📈 {t('trend_7_days')}
        </h2>
        <div className="h-64 w-full">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="dateLabel" stroke="#a1a4a5" fontSize={13} tickLine={false} axisLine={false} dy={10} />
                <Tooltip content={renderTooltip} cursor={{ fill: 'rgba(255,255,255,0.06)' }} />
                <Bar dataKey="income" fill="#11ff99" radius={[4, 4, 0, 0]} maxBarSize={35} name="income" />
                <Bar dataKey="expense" fill="#ff2047" radius={[4, 4, 0, 0]} maxBarSize={35} name="expense" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-base text-ash">{t('no_data')}</div>
          )}
        </div>
      </div>
    </div>
  );
}
