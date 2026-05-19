import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { RecurringTransaction, RecurringFrequency } from '../types';
import { useCategories } from '../hooks/useCategories';
import { useWallets } from '../hooks/useWallets';

import { sanitizeName, validateAmount, parseAmount } from '../utils/validation';
import { DEFAULT_WALLET_ID } from '../constants';

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
  const { wallets } = useWallets();

  const [name, setName] = useState(existingItem?.name ?? '');
  const [amount, setAmount] = useState(existingItem ? String(existingItem.amount) : '');
  const [type, setType] = useState<'income' | 'expense'>(existingItem?.type ?? 'expense');
  const [categoryId, setCategoryId] = useState(existingItem?.categoryId ?? categories.find(c => c.type === type)?.id ?? '');
  const [walletId, setWalletId] = useState(existingItem?.walletId ?? DEFAULT_WALLET_ID);
  const [frequency, setFrequency] = useState<RecurringFrequency>(existingItem?.frequency ?? 'monthly');
  const [startDate, setStartDate] = useState(existingItem?.startDate ?? todayISO());
  const [endDate, setEndDate] = useState(existingItem?.endDate ?? '');
  const [error, setError] = useState('');

  const typeCategories = useMemo(() => categories.filter(c => c.type === type), [categories, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = sanitizeName(name);
    if (!cleanName) {
      setError('Nama transaksi tidak boleh kosong');
      return;
    }

    if (!validateAmount(amount)) {
      setError('Nominal harus berupa angka positif');
      return;
    }

    if (!categoryId) {
      setError('Kategori tidak valid');
      return;
    }

    onSubmit({
      name: cleanName,
      amount: parseAmount(amount),
      type,
      categoryId,
      walletId,
      frequency,
      startDate,
      endDate: endDate || undefined,
    });

    if (!existingItem) {
      setName('');
      setAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder={t('expense_name')}
          value={name}
          onChange={e => setName(e.target.value)}
          className="flex-1 min-w-[160px] rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-50 dark:focus:bg-black/40 transition-all shadow-inner"
          required
        />
        <input
          type="number"
          placeholder={t('amount')}
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-36 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-50 dark:focus:bg-black/40 transition-all shadow-inner"
          min={0}
          step="0.01"
          required
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          className="flex-1 min-w-[140px] rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-50 dark:focus:bg-black/40 transition-all shadow-inner cursor-pointer"
          required
        >
          {typeCategories.map(cat => (
            <option key={cat.id} value={cat.id} className="bg-white text-slate-800 dark:bg-slate-800 dark:text-white">
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={walletId}
          onChange={e => setWalletId(e.target.value)}
          className="w-40 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-50 dark:focus:bg-black/40 transition-all shadow-inner cursor-pointer"
          required
        >
          {wallets.map(w => (
            <option key={w.id} value={w.id} className="bg-white text-slate-800 dark:bg-slate-800 dark:text-white">
              {w.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={type}
          onChange={e => setType(e.target.value as 'income' | 'expense')}
          className="w-36 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-50 dark:focus:bg-black/40 transition-all shadow-inner cursor-pointer"
        >
          <option value="expense" className="bg-white text-slate-800 dark:bg-slate-800 dark:text-white">{t('expense')}</option>
          <option value="income" className="bg-white text-slate-800 dark:bg-slate-800 dark:text-white">{t('income')}</option>
        </select>
        <select
          value={frequency}
          onChange={e => setFrequency(e.target.value as RecurringFrequency)}
          className="w-40 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-50 dark:focus:bg-black/40 transition-all shadow-inner cursor-pointer"
        >
          <option value="daily" className="bg-white text-slate-800 dark:bg-slate-800 dark:text-white">{t('frequency_daily')}</option>
          <option value="weekly" className="bg-white text-slate-800 dark:bg-slate-800 dark:text-white">{t('frequency_weekly')}</option>
          <option value="monthly" className="bg-white text-slate-800 dark:bg-slate-800 dark:text-white">{t('frequency_monthly')}</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('start_date')}</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-50 dark:focus:bg-black/40 transition-all shadow-inner"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('end_date')} ({t('optional')})</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-50 dark:focus:bg-black/40 transition-all shadow-inner"
          />
        </div>
      </div>

      {error && <p className="text-sm font-bold text-rose-500 dark:text-rose-400">{error}</p>}

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-2xl bg-indigo-600 dark:bg-indigo-500 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 dark:hover:bg-indigo-400 active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} strokeWidth={3} />
          {existingItem ? t('edit') : t('save')}
        </button>
        {existingItem && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-2xl border border-slate-300 dark:border-white/20 px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 transition-all"
          >
            {t('cancel')}
          </button>
        )}
      </div>
    </form>
  );
}