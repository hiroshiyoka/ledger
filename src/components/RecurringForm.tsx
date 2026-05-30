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
    if (!existingItem && typeCategories.length > 0) setCategoryId(typeCategories[0].id);
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-wrap gap-3 items-center">
        <select value={type} onChange={e => setType(e.target.value as 'income' | 'expense')}
          className="rounded-lg border border-hairline-strong bg-surface-card px-4 py-3 text-base text-ink focus:outline-none focus:outline-none focus:border-ink cursor-pointer">
          <option value="expense">📉 {t('expense')}</option>
          <option value="income">📈 {t('income')}</option>
        </select>
        <select value={frequency} onChange={e => setFrequency(e.target.value as RecurringFrequency)}
          className="rounded-lg border border-hairline-strong bg-surface-card px-4 py-3 text-base text-ink focus:outline-none focus:outline-none focus:border-ink cursor-pointer">
          <option value="daily">🔁 {t('frequency_daily')}</option>
          <option value="weekly">📅 {t('frequency_weekly')}</option>
          <option value="monthly">📆 {t('frequency_monthly')}</option>
        </select>
        <input type="text" placeholder={t('expense_name')} value={name} onChange={e => setName(e.target.value)}
          className="flex-1 min-w-[180px] rounded-lg border border-hairline-strong bg-surface-card px-4 py-3 text-base text-ink placeholder-ash focus:outline-none focus:outline-none focus:border-ink"
          required />
        <input type="number" placeholder={t('amount')} value={amount} onChange={e => setAmount(e.target.value)}
          className="w-32 rounded-lg border border-hairline-strong bg-surface-card px-4 py-3 text-base text-ink focus:outline-none focus:outline-none focus:border-ink"
          min={0} step="0.01" required />
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
          className="rounded-lg border border-hairline-strong bg-surface-card px-4 py-3 text-base text-ink focus:outline-none focus:outline-none focus:border-ink cursor-pointer">
          {typeCategories.map(cat => (
            <option key={cat.id} value={cat.id} className="bg-surface-card text-ink">{cat.name}</option>
          ))}
        </select>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
          className="rounded-lg border border-hairline-strong bg-surface-card px-4 py-3 text-base text-ink focus:outline-none focus:outline-none focus:border-ink"
          required />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
          className="rounded-lg border border-hairline-strong bg-surface-card px-4 py-3 text-base text-mute focus:outline-none focus:outline-none focus:border-ink"
          title={t('optional')} />
        <button type="submit"
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-base font-[500] text-primary-on hover:bg-surface-light active:scale-95 transition-all">
          <Plus size={18} strokeWidth={3} />
          {existingItem ? t('edit') : t('save')}
        </button>
        {existingItem && (
          <button type="button" onClick={onCancelEdit}
            className="rounded-lg border border-hairline-strong px-5 py-3 text-base font-[500] text-charcoal hover:bg-surface-elevated transition-all">
            {t('cancel')}
          </button>
        )}
      </div>
      {error && <p className="text-body-sm font-[500] text-rose-500">{error}</p>}
    </form>
  );
}