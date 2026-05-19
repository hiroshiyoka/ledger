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
    <div className={`rounded-2xl border ${border} ${bg} p-6 shadow-md transition-all hover:-translate-y-0.5`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-xl bg-white/60 dark:bg-black/20 shadow-sm ${color}`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        <span className="text-base font-bold text-slate-600 dark:text-slate-200">
          {t(labelKey)}
        </span>
      </div>
      <p className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
        {formatCurrency(total)}
      </p>
    </div>
  );
}