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
  const { label, color, bg, border } = CATEGORY_CONFIG[category];
  const Icon = ICON_MAP[category];

  return (
    <div className={`rounded-3xl border ${border} ${bg} p-6 shadow-2xl shadow-black/20 transition-all hover:-translate-y-1 duration-300 backdrop-blur-md`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 bg-black/20 p-2 pr-4 rounded-2xl backdrop-blur-sm border border-white/5">
          <div className={`p-2 bg-white/10 rounded-xl shadow-sm ${color}`}>
            <Icon size={22} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold text-slate-200">{label}</span>
        </div>
        <span className="text-sm font-bold text-slate-300 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm border border-white/5">
          {count} item
        </span>
      </div>
      <p className="mt-6 text-3xl font-black text-white tracking-tight">
        {formatCurrency(total)}
      </p>
    </div>
  );
}
