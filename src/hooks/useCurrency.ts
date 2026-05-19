import { useState, useEffect } from 'react';
import type { CurrencyConfig } from '../types';
import { STORAGE_KEYS } from '../constants';

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'IDR', symbol: 'Rp', locale: 'id-ID' },
  { code: 'USD', symbol: '$', locale: 'en-US' },
  { code: 'EUR', symbol: '€', locale: 'de-DE' },
  { code: 'JPY', symbol: '¥', locale: 'ja-JP' },
  { code: 'CNY', symbol: '¥', locale: 'zh-CN' },
  { code: 'GBP', symbol: '£', locale: 'en-GB' },
  { code: 'MYR', symbol: 'RM', locale: 'ms-MY' },
  { code: 'SGD', symbol: 'S$', locale: 'en-SG' },
  { code: 'THB', symbol: '฿', locale: 'th-TH' },
  { code: 'AUD', symbol: 'A$', locale: 'en-AU' },
];

export function useCurrency() {
  const [currency, setCurrency] = useState<CurrencyConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load currency from localStorage', error);
    }
    return CURRENCIES[0]; // Default to IDR
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, JSON.stringify(currency));
  }, [currency]);

  return { currency, setCurrency, currencies: CURRENCIES };
}