import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useWallets } from '../hooks/useWallets';
import { useCategories } from '../hooks/useCategories';

import { DEFAULT_WALLET_ID } from '../constants';
import type { Transaction, TransactionType } from '../types';
import { sanitizeName, validateAmount, parseAmount, validateDate } from '../utils/validation';

interface SpendFormProps {
  onSubmit: (item: Omit<Transaction, 'id'>) => void;
  editItem?: Transaction | null;
  onCancelEdit?: () => void;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function SpendForm({ onSubmit, editItem, onCancelEdit }: SpendFormProps) {
  const { t } = useTranslation();
  const { categories } = useCategories();
  const { wallets } = useWallets();

  const [type, setType] = useState<TransactionType>(editItem?.type ?? 'expense');
  const [name, setName] = useState(editItem?.name ?? '');
  const [amount, setAmount] = useState(editItem ? String(editItem.amount) : '');
  const [date, setDate] = useState(editItem?.date ?? todayISO());
  const [walletId, setWalletId] = useState<string>(editItem?.walletId ?? DEFAULT_WALLET_ID);
  
  // Filter categories based on type
  const typeCategories = useMemo(() => categories.filter(c => c.type === type), [categories, type]);
  
  // Auto-select first category if the current one is invalid for the type
  const defaultCategory = typeCategories.length > 0 ? typeCategories[0].id : '';
  const [categoryId, setCategoryId] = useState<string>(editItem?.categoryId ?? defaultCategory);

  // Sync category when type changes
  useMemo(() => {
    if (!editItem || editItem.type !== type) {
      if (typeCategories.length > 0 && !typeCategories.find(c => c.id === categoryId)) {
        setCategoryId(typeCategories[0].id);
      }
    }
  }, [type, typeCategories, categoryId, editItem]);

  const [error, setError] = useState('');

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

    if (!validateDate(date)) {
      setError('Tanggal tidak valid');
      return;
    }

    if (!categoryId) {
      setError('Kategori tidak valid');
      return;
    }

    if (!walletId) {
      setError('Dompet tidak valid');
      return;
    }

    onSubmit({ name: cleanName, amount: parseAmount(amount), date, type, categoryId, walletId });

    if (!editItem) {
      setName('');
      setAmount('');
      setDate(todayISO());
      // Keep selected type, wallet, category for ease of multiple entries
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Toggle */}
      <div className="flex bg-slate-100 dark:bg-black/30 p-1 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            type === 'expense' 
              ? 'bg-white dark:bg-slate-700 text-rose-500 dark:text-rose-400 shadow-sm' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          {t('expense')}
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            type === 'income' 
              ? 'bg-white dark:bg-slate-700 text-emerald-500 dark:text-emerald-400 shadow-sm' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          {t('income')}
        </button>
      </div>

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
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          className="w-40 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-50 dark:focus:bg-black/40 transition-all shadow-inner cursor-pointer"
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
      {error && <p className="text-sm font-bold text-rose-500 dark:text-rose-400">{error}</p>}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-2xl bg-indigo-600 dark:bg-indigo-500 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 dark:hover:bg-indigo-400 active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} strokeWidth={3} />
          {editItem ? t('edit') : t('add_transaction')}
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
