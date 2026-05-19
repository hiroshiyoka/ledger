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
  
  const progressColor = percentage >= 90 ? 'bg-rose-500' : percentage >= 75 ? 'bg-amber-400' : 'bg-indigo-500';

  return (
    <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
          🎯 {t('budget_title')}
        </h2>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
              className="w-32 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 py-1.5 px-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <button onClick={() => { const v = parseInt(tempBudget.replace(/[^0-9]/g, ''), 10); setBudgetLimit(isNaN(v) ? 0 : v); setIsEditing(false); }}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700">
              {t('save')}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">{t('limit')}</span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{budgetLimit > 0 ? formatCurrency(budgetLimit) : t('not_set')}</span>
            <button onClick={() => { setTempBudget(budgetLimit.toString()); setIsEditing(true); }}
              className="text-slate-400 hover:text-indigo-500 transition-colors text-xs">✏️</button>
          </div>
        )}
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-300">{t('used')} {formatCurrency(currentMonthTotal)}</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">{budgetLimit > 0 ? `${percentage.toFixed(0)}%` : '0%'}</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${progressColor}`} style={{ width: `${budgetLimit > 0 ? percentage : 0}%` }} />
        </div>
        {budgetLimit > 0 && percentage >= 90 && (
          <p className="text-xs text-rose-500 font-medium">{t('budget_exceeded')}</p>
        )}
        {budgetLimit > 0 && percentage >= 75 && percentage < 90 && (
          <p className="text-xs text-amber-500 font-medium">{t('budget_warning')}</p>
        )}
      </div>
    </div>
  );
}