import { Pencil, Trash2, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { RecurringTransaction } from '../types';
import { useCategories } from '../hooks/useCategories';
import { useWallets } from '../hooks/useWallets';
import { formatCurrency } from '../utils/format';

interface RecurringListProps {
  items: RecurringTransaction[];
  onEdit: (item: RecurringTransaction) => void;
  onDelete: (id: string) => void;
}

const FREQ_LABELS: Record<string, string> = {
  daily: 'Harian',
  weekly: 'Mingguan',
  monthly: 'Bulanan',
};

export default function RecurringList({ items, onEdit, onDelete }: RecurringListProps) {
  const { t } = useTranslation();
  const { categories } = useCategories();
  const { wallets } = useWallets();

  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-slate-400 dark:text-slate-500">
        {t('no_recurring')}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map(item => {
        const category = categories.find(c => c.id === item.categoryId);
        const wallet = wallets.find(w => w.id === item.walletId);
        const isIncome = item.type === 'income';

        return (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-black/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isIncome ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-rose-100 dark:bg-rose-900/30'}`}>
                <RefreshCw size={16} className={isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {FREQ_LABELS[item.frequency]} • {category?.name} • {wallet?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(item)}
                  className="rounded-lg p-1.5 text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 transition-colors"
                  title={t('edit')}
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="rounded-lg p-1.5 text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/20 transition-colors"
                  title={t('delete')}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}