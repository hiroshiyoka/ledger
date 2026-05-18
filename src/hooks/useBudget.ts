import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';

export function useBudget() {
  const [budgetLimit, setBudgetLimit] = useState<number>(() => {
    // Kita menyimpan number tunggal sebelumnya, tetapi loadFromStorage mengasumsikan T[] default
    // Jika kita memaksa T sebagai number (bukan array), kita butuh menyesuaikannya.
    // Tetapi karena T default-nya di loadFromStorage mungkin mengembalikan array jika tidak dimodif,
    // kita parse saja raw itemnya.
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGET_LIMIT);
    if (!raw) return 0;
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'number' && !isNaN(parsed)) return parsed;
    } catch {
      // ignore
    }
    return 0;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGET_LIMIT, JSON.stringify(budgetLimit));
  }, [budgetLimit]);

  return { budgetLimit, setBudgetLimit };
}
