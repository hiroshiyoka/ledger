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
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <h2 className="text-base font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest flex items-center gap-3">
          🎯 {t('budget_title')}
        </h2>
        {isEditing ? (
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
              className="w-48 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 py-2.5 px-4 text-base text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              autoFocus
            />
            <button onClick={() => { const v = parseInt(tempBudget.replace(/[^0-9]/g, ''), 10); setBudgetLimit(isNaN(v) ? 0 : v); setIsEditing(false); }}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
              {t('save')}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 dark:text-slate-400">{t('limit')}</span>
            <span className="text-xl font-bold text-slate-700 dark:text-slate-100">{budgetLimit > 0 ? formatCurrency(budgetLimit) : t('not_set')}</span>
            <button onClick={() => { setTempBudget(budgetLimit.toString()); setIsEditing(true); }}
              className="text-slate-400 hover:text-indigo-500 transition-colors p-1" title={t('budget_edit_tooltip')}>
              ✏️
            </button>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-base font-medium text-slate-600 dark:text-slate-300">{t('used')} <span className="font-bold text-slate-800 dark:text-slate-100">{formatCurrency(currentMonthTotal)}</span></span>
          <span className="text-lg font-bold text-slate-700 dark:text-slate-100">{budgetLimit > 0 ? `${percentage.toFixed(0)}%` : '0%'}</span>
        </div>
        <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner">
          <div className={`h-full rounded-full transition-all duration-500 ${progressColor}`} style={{ width: `${budgetLimit > 0 ? percentage : 0}%` }} />
        </div>
        {budgetLimit > 0 && percentage >= 90 && (
          <p className="text-base text-rose-500 font-bold">{t('budget_exceeded')}</p>
        )}
        {budgetLimit > 0 && percentage >= 75 && percentage < 90 && (
          <p className="text-base text-amber-500 font-bold">{t('budget_warning')}</p>
        )}
      </div>
    </div>
  );
}