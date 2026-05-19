import { useState, useEffect, useCallback, useMemo } from 'react';

import { STORAGE_KEYS, DEFAULT_WALLET_ID } from '../constants';
import type { Transaction, SpendItem, DateFilterType } from '../types';

export function useTransactions() {
  const [items, setItems] = useState<Transaction[]>(() => {
    try {
      const storedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);

      if (storedTransactions) {
        return JSON.parse(storedTransactions) as Transaction[];
      }

      const legacyItemsStr = localStorage.getItem(STORAGE_KEYS.SPEND_ITEMS);

      if (legacyItemsStr) {
        const legacyItems = JSON.parse(legacyItemsStr) as SpendItem[];
        console.log(`Migrating ${legacyItems.length} legacy items to Transactions...`);
        
        const migrated: Transaction[] = legacyItems.map(item => ({
          id: item.id,
          name: item.name,
          amount: item.amount,
          date: item.date,
          type: 'expense',
          categoryId: item.category === 'daily' ? 'cat-exp-food' : 'cat-exp-shopping',
          walletId: DEFAULT_WALLET_ID
        }));

        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(migrated));
        return migrated;
      }
    } catch (error) {
      console.error('Failed to load/migrate transactions', error);
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('month');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(items));
  }, [items]);

  const addTransaction = useCallback((data: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = { ...data, id: crypto.randomUUID() };
    setItems(prev => [...prev, newTransaction]);
  }, []);

  const updateTransaction = useCallback((id: string, data: Partial<Omit<Transaction, 'id'>>) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...data } : item))
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const importTransactions = useCallback((newItems: Transaction[]) => {
    setItems(newItems);
  }, []);

  const filteredItems = useMemo(() => {
    const now = new Date();
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

  const totalIncome = useMemo(() => 
    filteredItems.filter(i => i.type === 'income').reduce((acc, curr) => acc + curr.amount, 0),
  [filteredItems]);

  const totalExpense = useMemo(() => 
    filteredItems.filter(i => i.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0),
  [filteredItems]);

  const netBalance = totalIncome - totalExpense;

  return { 
    items, // Raw all items
    filteredItems,
    totalIncome,
    totalExpense,
    netBalance,
    searchQuery,
    setSearchQuery,
    dateFilter,
    setDateFilter,
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    importTransactions 
  };
}
