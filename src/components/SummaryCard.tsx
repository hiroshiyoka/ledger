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
    color: 'text-ink',
    bg: 'bg-surface-card',
    border: 'border-hairline-strong',
    icon: DollarSign,
    labelKey: 'net_balance'
  },
  income: {
    color: 'text-accent-green',
    bg: 'bg-surface-card',
    border: 'border-hairline-strong',
    icon: TrendingUp,
    labelKey: 'total_income'
  },
  expense: {
    color: 'text-accent-red',
    bg: 'bg-surface-card',
    border: 'border-hairline-strong',
    icon: TrendingDown,
    labelKey: 'total_expense'
  }
};

export default function SummaryCard({ type, total }: SummaryCardProps) {
  const { t } = useTranslation();
  const { color, bg, border, icon: Icon, labelKey } = CONFIG[type];

  return (
    <div className={`rounded-lg border ${border} ${bg} p-6 shadow-none transition-all hover:-translate-y-0.5`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-lg bg-surface-elevated shadow-none ${color}`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        <span className="text-base font-[500] text-charcoal">
          {t(labelKey)}
        </span>
      </div>
      <p className="text-3xl font-[500] text-ink tracking-tight font-ui">
        {formatCurrency(total)}
      </p>
    </div>
  );
}