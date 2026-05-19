import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

import { formatCurrency } from '../utils/format';

type SummaryType = 'net' | 'income' | 'expense';

interface SummaryCardProps {
  type: SummaryType;
  total: number;
}

const CONFIG = {
  net: {
    color: 'text-indigo-600 dark:text-indigo-300',
    bg: 'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/40',
    border: 'border-indigo-200 dark:border-indigo-700/50',
    icon: DollarSign,
    labelKey: 'net_balance'
  },
  income: {
    color: 'text-emerald-600 dark:text-emerald-300',
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40',
    border: 'border-emerald-200 dark:border-emerald-700/50',
    icon: TrendingUp,
    labelKey: 'total_income'
  },
  expense: {
    color: 'text-rose-600 dark:text-rose-300',
    bg: 'bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/40 dark:to-orange-900/40',
    border: 'border-rose-200 dark:border-rose-700/50',
    icon: TrendingDown,
    labelKey: 'total_expense'
  }
};

export default function SummaryCard({ type, total }: SummaryCardProps) {
  const { t } = useTranslation();
  const { color, bg, border, icon: Icon, labelKey } = CONFIG[type];

  return (
    <div className={`rounded-3xl border ${border} ${bg} p-6 shadow-2xl shadow-black/5 dark:shadow-black/20 transition-all hover:-translate-y-1 duration-300 backdrop-blur-md`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 p-2 pr-4 rounded-2xl backdrop-blur-sm border border-black/5 dark:border-white/5">
          <div className={`p-2 bg-black/5 dark:bg-white/10 rounded-xl shadow-sm ${color}`}>
            <Icon size={22} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {t(labelKey)}
          </span>
        </div>
      </div>
      <p className="mt-6 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
        {formatCurrency(total)}
      </p>
    </div>
  );
}
