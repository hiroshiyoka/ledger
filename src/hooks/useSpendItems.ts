import { useState, useEffect, useCallback, useMemo } from 'react';

import type { SpendItem } from '../types';
import { STORAGE_KEYS } from '../constants';

import { loadFromStorage, saveToStorage } from '../utils/storage';
import { createSpendItem, filterByCategory, calculateTotal } from '../services/spendService';

export function useSpendItems() {
  const [items, setItems] = useState<SpendItem[]>(() =>
    loadFromStorage<SpendItem>(STORAGE_KEYS.SPEND_ITEMS)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SPEND_ITEMS, items);
  }, [items]);

  const addItem = useCallback((data: Omit<SpendItem, 'id'>) => {
    setItems(prev => [...prev, createSpendItem(data)]);
  }, []);

  const updateItem = useCallback((id: string, data: Partial<Omit<SpendItem, 'id' | 'category'>>) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...data } : item))
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const dailyItems = useMemo(() => filterByCategory(items, 'daily'), [items]);
  const bigItems = useMemo(() => filterByCategory(items, 'big'), [items]);
  const dailyTotal = useMemo(() => calculateTotal(items, 'daily'), [items]);
  const bigTotal = useMemo(() => calculateTotal(items, 'big'), [items]);

  return { items, dailyItems, bigItems, dailyTotal, bigTotal, addItem, updateItem, deleteItem };
}
