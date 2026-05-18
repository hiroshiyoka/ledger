import { useState, useEffect, useCallback, useMemo } from 'react';

import type { SpendItem, DateFilterType } from '../types';
import { STORAGE_KEYS } from '../constants';

import { loadFromStorage, saveToStorage } from '../utils/storage';
import { createSpendItem, filterByCategory, calculateTotal } from '../services/spendService';

export function useSpendItems() {
  const [items, setItems] = useState<SpendItem[]>(() =>
    loadFromStorage<SpendItem>(STORAGE_KEYS.SPEND_ITEMS)
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('month');

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

  const importItems = useCallback((newItems: SpendItem[]) => {
    setItems(newItems);
  }, []);

  const filteredItems = useMemo(() => {
    const now = new Date();
    // Offset local timezone difference so the date matches current local day
    const localNow = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    const todayStr = localNow.toISOString().split('T')[0];

    const weekAgo = new Date(localNow);
    weekAgo.setDate(localNow.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    const firstOfMonthStr = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, '0')}-01`;

    return items.filter(item => {
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      const itemDateStr = item.date.split('T')[0];
      
      if (dateFilter === 'today' && itemDateStr !== todayStr) return false;
      if (dateFilter === 'week' && itemDateStr < weekAgoStr) return false;
      if (dateFilter === 'month' && itemDateStr < firstOfMonthStr) return false;

      return true;
    });
  }, [items, searchQuery, dateFilter]);

  const dailyItems = useMemo(() => filterByCategory(filteredItems, 'daily'), [filteredItems]);
  const bigItems = useMemo(() => filterByCategory(filteredItems, 'big'), [filteredItems]);
  const dailyTotal = useMemo(() => calculateTotal(filteredItems, 'daily'), [filteredItems]);
  const bigTotal = useMemo(() => calculateTotal(filteredItems, 'big'), [filteredItems]);

  return { 
    items, // Raw all items
    filteredItems, // Filtered items for charts/export
    dailyItems, 
    bigItems, 
    dailyTotal, 
    bigTotal, 
    searchQuery,
    setSearchQuery,
    dateFilter,
    setDateFilter,
    addItem, 
    updateItem, 
    deleteItem, 
    importItems 
  };
}
