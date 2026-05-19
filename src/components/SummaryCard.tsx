import { useTranslation } from 'react-i18next';
import { Wallet, TrendingUp } from 'lucide-react';

import type { SpendCategory } from '../types';
import { CATEGORY_CONFIG } from '../constants';

import { formatCurrency } from '../utils/format';

interface SummaryCardProps {
  category: SpendCategory;
  total: number;
  count: number;
}

const ICON_MAP: Record<SpendCategory, typeof Wallet> = {
  daily: Wallet,
  big: TrendingUp,
};

export default function SummaryCard({ category, total, count }: SummaryCardProps) {
  const { t } = useTranslation();
  const { color, bg, border } = CATEGORY_CONFIG[category];
  const Icon = ICON_MAP[category];

  return (
    <div className={`rounded-3xl border ${border} ${bg} p-6 shadow-2xl shadow-black/5 dark:shadow-black/20 transition-all hover:-translate-y-1 duration-300 backdrop-blur-md`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 bg-white/50 dark:bg-black/20 p-2 pr-4 rounded-2xl backdrop-blur-sm border border-black/5 dark:border-white/5">
          <div className={`p-2 bg-black/5 dark:bg-white/10 rounded-xl shadow-sm ${color}`}>
            <Icon size={22} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {category === 'daily' ? `Daily 🍔` : `Big 🚀`}
          </span>
        </div>
        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm border border-black/5 dark:border-white/5">
          {count} {t('items')}
        </span>
      </div>
      <p className="mt-6 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
        {formatCurrency(total)}
      </p>
    </div>
  );
}
