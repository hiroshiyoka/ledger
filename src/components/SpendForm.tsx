import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { SpendItem, SpendCategory } from '../types';

import { sanitizeName, validateAmount, parseAmount, validateDate } from '../utils/validation';

interface SpendFormProps {
  onSubmit: (item: Omit<SpendItem, 'id'>) => void;
  editItem?: SpendItem | null;
  onCancelEdit?: () => void;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function SpendForm({ onSubmit, editItem, onCancelEdit }: SpendFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(editItem?.name ?? '');
  const [amount, setAmount] = useState(editItem ? String(editItem.amount) : '');
  const [date, setDate] = useState(editItem?.date ?? todayISO());
  const [category, setCategory] = useState<SpendCategory>(editItem?.category ?? 'daily');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = sanitizeName(name);

    if (!cleanName) {
      setError('Nama pengeluaran tidak boleh kosong');
      return;
    }

    if (!validateAmount(amount)) {
      setError('Nominal harus berupa angka positif');
      return;
    }

    if (!validateDate(date)) {
      setError('Tanggal tidak valid');
      return;
    }

    onSubmit({ name: cleanName, amount: parseAmount(amount), date, category });

    if (!editItem) {
      setName('');
      setAmount('');
      setDate(todayISO());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-40 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-50 dark:focus:bg-black/40 transition-all shadow-inner"
          required
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value as SpendCategory)}
          className="w-32 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-50 dark:focus:bg-black/40 transition-all shadow-inner cursor-pointer"
        >
          <option value="daily" className="bg-white text-slate-800 dark:bg-slate-800 dark:text-white">Daily 🍔</option>
          <option value="big" className="bg-white text-slate-800 dark:bg-slate-800 dark:text-white">Big 🚀</option>
        </select>
      </div>
      {error && <p className="text-sm font-bold text-rose-500 dark:text-rose-400">{error}</p>}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-2xl bg-indigo-600 dark:bg-indigo-500 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 dark:hover:bg-indigo-400 active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} strokeWidth={3} />
          {editItem ? t('edit') : t('save')}
        </button>
        {editItem && (
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
