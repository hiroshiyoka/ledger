import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Transaction } from '../types';
import { formatCurrency } from '../utils/format';

interface BudgetProgressProps {
  items: Transaction[];
  budgetLimit: number;
  setBudgetLimit: (limit: number) => void;
}

export default function BudgetProgress({ items, budgetLimit, setBudgetLimit }: BudgetProgressProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(budgetLimit.toString());

  const currentMonthTotal = useMemo(() => {
    const now = new Date();
    return items.reduce((total, item) => {
      const itemDate = new Date(item.date);
      if (itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()) {
        return total + item.amount;
      }
      return total;
    }, 0);
  }, [items]);

  const percentage = budgetLimit > 0 ? Math.min((currentMonthTotal / budgetLimit) * 100, 100) : 0;
  
  const progressColor = percentage >= 90 ? 'bg-accent-red' : percentage >= 75 ? 'bg-accent-yellow' : 'bg-surface-light';

  return (
    <div className="rounded-lg border border-hairline-strong bg-surface-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <h2 className="text-base font-[500] text-charcoal uppercase tracking-widest flex items-center gap-3">
          🎯 {t('budget_title')}
        </h2>
        {isEditing ? (
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
              className="w-48 rounded-lg border border-hairline-strong bg-surface-card py-2.5 px-4 text-base text-ink focus:outline-none focus:border-ink"
              autoFocus
            />
            <button onClick={() => { const v = parseInt(tempBudget.replace(/[^0-9]/g, ''), 10); setBudgetLimit(isNaN(v) ? 0 : v); setIsEditing(false); }}
              className="rounded-lg bg-primary px-5 py-2.5 text-body-sm font-[500] text-primary-on hover:bg-surface-light transition-colors">
              {t('save')}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-body-sm text-mute">{t('limit')}</span>
            <span className="text-heading-sm font-[500] text-body">{budgetLimit > 0 ? formatCurrency(budgetLimit) : t('not_set')}</span>
            <button onClick={() => { setTempBudget(budgetLimit.toString()); setIsEditing(true); }}
              className="text-ash hover:text-accent-blue transition-colors p-1" title={t('budget_edit_tooltip')}>
              ✏️
            </button>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-base font-[500] text-charcoal">{t('used')} <span className="font-[500] text-ink">{formatCurrency(currentMonthTotal)}</span></span>
          <span className="text-body-lg font-[500] text-body">{budgetLimit > 0 ? `${percentage.toFixed(0)}%` : '0%'}</span>
        </div>
        <div className="h-4 w-full rounded-full bg-surface-elevated overflow-hidden shadow-none">
          <div className={`h-full rounded-full transition-all duration-500 ${progressColor}`} style={{ width: `${budgetLimit > 0 ? percentage : 0}%` }} />
        </div>
        {budgetLimit > 0 && percentage >= 90 && (
          <p className="text-base text-accent-red font-[500]">{t('budget_exceeded')}</p>
        )}
        {budgetLimit > 0 && percentage >= 75 && percentage < 90 && (
          <p className="text-base text-accent-yellow font-[500]">{t('budget_warning')}</p>
        )}
      </div>
    </div>
  );
}