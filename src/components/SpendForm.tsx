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
  const [categoryId, setCategoryId] = useState<string>(editItem?.categoryId ?? '');
  const [error, setError] = useState('');

  const typeCategories = useMemo(() => categories.filter(c => c.type === type), [categories, type]);

  useMemo(() => {
    if (!editItem || editItem.type !== type) {
      if (typeCategories.length > 0 && !typeCategories.find(c => c.id === categoryId)) {
        setCategoryId(typeCategories[0].id);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = sanitizeName(name);
    if (!cleanName) { setError('Nama transaksi tidak boleh kosong'); return; }
    if (!validateAmount(amount)) { setError('Nominal harus berupa angka positif'); return; }
    if (!validateDate(date)) { setError('Tanggal tidak valid'); return; }
    if (!categoryId) { setError('Kategori tidak valid'); return; }
    if (!walletId) { setError('Dompet tidak valid'); return; }

    onSubmit({ name: cleanName, amount: parseAmount(amount), date, type, categoryId, walletId });

    if (!editItem) {
      setName('');
      setAmount('');
      setDate(todayISO());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Toggle */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-surface-elevated p-1.5 rounded-lg w-full sm:w-auto">
          <button type="button" onClick={() => setType('expense')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-body-sm font-[500] transition-all ${type === 'expense' ? 'bg-surface-card text-accent-red shadow-none' : 'text-mute hover:text-ink'}`}>
            📉 {t('expense')}
          </button>
          <button type="button" onClick={() => setType('income')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-body-sm font-[500] transition-all ${type === 'income' ? 'bg-surface-card text-accent-green shadow-none' : 'text-mute hover:text-ink'}`}>
            📈 {t('income')}
          </button>
        </div>

        <input
          type="text"
          placeholder={t('expense_name')}
          value={name}
          onChange={e => setName(e.target.value)}
          className="flex-1 min-w-[200px] rounded-lg border border-hairline-strong bg-canvas px-4 py-3 text-base text-ink placeholder-ash focus:outline-none focus:border-ink"
          required
        />
        <input
          type="number"
          placeholder={t('amount')}
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-36 rounded-lg border border-hairline-strong bg-canvas px-4 py-3 text-base text-ink focus:outline-none focus:border-ink"
          min={0} step="0.01" required
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-44 rounded-lg border border-hairline-strong bg-canvas px-4 py-3 text-base text-ink focus:outline-none focus:border-ink"
          required
        />
        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          className="rounded-lg border border-hairline-strong bg-canvas px-4 py-3 text-base text-ink focus:outline-none focus:border-ink cursor-pointer"
          required
        >
          {typeCategories.map(cat => (
            <option key={cat.id} value={cat.id} className="bg-canvas text-ink">{cat.name}</option>
          ))}
        </select>
        <select
          value={walletId}
          onChange={e => setWalletId(e.target.value)}
          className="rounded-lg border border-hairline-strong bg-canvas px-4 py-3 text-base text-ink focus:outline-none focus:border-ink cursor-pointer"
          required
        >
          {wallets.map(w => (
            <option key={w.id} value={w.id} className="bg-canvas text-ink">{w.name}</option>
          ))}
        </select>
      </div>
      {error && <p className="text-body-sm font-[500] text-accent-red">{error}</p>}
      <div className="flex items-center gap-3">
        <button type="submit"
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-[500] text-primary-on hover:bg-surface-light active:scale-95 transition-all">
          <Plus size={20} strokeWidth={3} />
          {editItem ? t('edit') : t('add_transaction')}
        </button>
        {editItem && (
          <button type="button" onClick={onCancelEdit}
            className="rounded-lg border border-hairline-strong px-6 py-3 text-base font-[500] text-charcoal hover:bg-surface-elevated active:scale-95 transition-all">
            {t('cancel')}
          </button>
        )}
      </div>
    </form>
  );
}