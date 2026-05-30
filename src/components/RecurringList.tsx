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
      <div className="text-center py-6 text-body-sm text-ash">
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
          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-card border border-hairline-strong hover:bg-surface-card transition-colors">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isIncome ? 'bg-surface-elevated ' : 'bg-rose-100 '}`}>
                <RefreshCw size={16} className={isIncome ? 'text-accent-green ' : 'text-rose-600 '} />
              </div>
              <div>
                <p className="text-body-sm font-[500] text-body">{item.name}</p>
                <p className="text-caption text-mute">
                  {FREQ_LABELS[item.frequency]} • {category?.name} • {wallet?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-body-sm font-[500] ${isIncome ? 'text-accent-green ' : 'text-rose-600 '}`}>
                {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(item)}
                  className="rounded-lg p-1.5 text-accent-blue hover:text-primary-on hover:bg-surface-elevated transition-colors"
                  title={t('edit')}
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="rounded-lg p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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