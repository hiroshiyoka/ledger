import type { CurrencyConfig } from '../types';
import { STORAGE_KEYS } from '../constants';

export function formatCurrency(amount: number, currency?: CurrencyConfig): string {
  const curr = currency || (() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return { code: 'IDR', symbol: 'Rp', locale: 'id-ID' };
  })();

  return `${curr.symbol} ${amount.toLocaleString(curr.locale)}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) return dateStr;
  
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}