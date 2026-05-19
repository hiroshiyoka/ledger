import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { RecurringTransaction, RecurringFrequency } from '../types';
import { useCategories } from '../hooks/useCategories';
import { DEFAULT_WALLET_ID } from '../constants';
import { sanitizeName, validateAmount, parseAmount } from '../utils/validation';

interface RecurringFormProps {
  onSubmit: (item: Omit<RecurringTransaction, 'id'>) => void;
  existingItem?: RecurringTransaction | null;
  onCancelEdit?: () => void;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function RecurringForm({ onSubmit, existingItem, onCancelEdit }: RecurringFormProps) {
  const { t } = useTranslation();
  const { categories } = useCategories();
  const [type, setType] = useState<'income' | 'expense'>(existingItem?.type ?? 'expense');
  const [name, setName] = useState(existingItem?.name ?? '');
  const [amount, setAmount] = useState(existingItem ? String(existingItem.amount) : '');
  const [categoryId, setCategoryId] = useState(existingItem?.categoryId ?? '');
  const [walletId] = useState<string>(existingItem?.walletId ?? DEFAULT_WALLET_ID);
  const [frequency, setFrequency] = useState<RecurringFrequency>(existingItem?.frequency ?? 'monthly');
  const [startDate, setStartDate] = useState(existingItem?.startDate ?? todayISO());
  const [endDate, setEndDate] = useState(existingItem?.endDate ?? '');
  const [error, setError] = useState('');

  const typeCategories = useMemo(() => categories.filter(c => c.type === type), [categories, type]);

  useMemo(() => {
    if (!existingItem && typeCategories.length > 0) {
      setCategoryId(typeCategories[0].id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanName = sanitizeName(name);
    if (!cleanName) { setError('Nama tidak boleh kosong'); return; }
    if (!validateAmount(amount)) { setError('Nominal harus positif'); return; }
    if (!categoryId) { setError('Kategori tidak valid'); return; }

    onSubmit({ name: cleanName, amount: parseAmount(amount), type, categoryId, walletId, frequency, startDate, endDate: endDate || undefined });
    if (!existingItem) { setName(''); setAmount(''); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-wrap gap-2 items-center">
        <select value={type} onChange={e => setType(e.target.value as 'income' | 'expense')}
          className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 px-2 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
          <option value="expense">📉 {t('expense')}</option>
          <option value="income">📈 {t('income')}</option>
        </select>
        <select value={frequency} onChange={e => setFrequency(e.target.value as RecurringFrequency)}
          className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 px-2 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
          <option value="daily">🔁 {t('frequency_daily')}</option>
          <option value="weekly">📅 {t('frequency_weekly')}</option>
          <option value="monthly">📆 {t('frequency_monthly')}</option>
        </select>
        <input type="text" placeholder={t('expense_name')} value={name} onChange={e => setName(e.target.value)}
          className="flex-1 min-w-[100px] rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 px-2 py-1.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required />
        <input type="number" placeholder={t('amount')} value={amount} onChange={e => setAmount(e.target.value)}
          className="w-24 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 px-2 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          min={0} step="0.01" required />
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
          className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 px-2 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
          {typeCategories.map(cat => (
            <option key={cat.id} value={cat.id} className="bg-white text-slate-800 dark:bg-slate-800 dark:text-white">{cat.name}</option>
          ))}
        </select>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
          className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 px-2 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
          className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 px-2 py-1.5 text-xs text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          title={t('optional')} />
        <button type="submit"
          className="flex items-center gap-1 rounded-lg bg-indigo-600 dark:bg-indigo-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 dark:hover:bg-indigo-400 active:scale-95 transition-all">
          <Plus size={14} strokeWidth={3} />
          {existingItem ? t('edit') : t('save')}
        </button>
        {existingItem && (
          <button type="button" onClick={onCancelEdit}
            className="rounded-lg border border-slate-200 dark:border-white/20 px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
            {t('cancel')}
          </button>
        )}
      </div>
      {error && <p className="text-xs font-bold text-rose-500 dark:text-rose-400">{error}</p>}
    </form>
  );
}