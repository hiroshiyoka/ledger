import { useState, useEffect, useCallback } from 'react';
import type { RecurringTransaction, Transaction } from '../types';
import { STORAGE_KEYS } from '../constants';

export function useRecurring() {
  const [recurringItems, setRecurringItems] = useState<RecurringTransaction[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECURRING);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load recurring from localStorage', error);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(recurringItems));
  }, [recurringItems]);

  const addRecurring = useCallback((data: Omit<RecurringTransaction, 'id'>) => {
    const newItem: RecurringTransaction = { ...data, id: crypto.randomUUID() };
    setRecurringItems(prev => [...prev, newItem]);
  }, []);

  const updateRecurring = useCallback((id: string, data: Partial<Omit<RecurringTransaction, 'id'>>) => {
    setRecurringItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...data } : item))
    );
  }, []);

  const deleteRecurring = useCallback((id: string) => {
    setRecurringItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const generateTransactions = useCallback((): Omit<Transaction, 'id'>[] => {
    const newTransactions: Omit<Transaction, 'id'>[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setRecurringItems(prev => {
      const updated = prev.map(item => {
        let lastGen = item.lastGeneratedDate ? new Date(item.lastGeneratedDate) : new Date(item.startDate);
        lastGen.setHours(0, 0, 0, 0);

        // Check if start date is in the future
        const startDate = new Date(item.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (startDate > today) return item;

        // Check if end date is set and passed
        if (item.endDate) {
          const endDate = new Date(item.endDate);
          endDate.setHours(23, 59, 59, 999);
          if (endDate < today) return item;
        }

        // Generate transactions based on frequency
        let nextDate = new Date(lastGen);
        const generatedDates: string[] = [];

        while (nextDate <= today) {
          if (nextDate >= startDate && nextDate > lastGen) {
            const dateStr = nextDate.toISOString().split('T')[0];
            // Skip if we already generated for this date
            if (!generatedDates.includes(dateStr)) {
              generatedDates.push(dateStr);
              newTransactions.push({
                name: item.name,
                amount: item.amount,
                date: dateStr,
                type: item.type,
                categoryId: item.categoryId,
                walletId: item.walletId,
              });
            }
          }

          // Calculate next occurrence
          if (item.frequency === 'daily') {
            nextDate.setDate(nextDate.getDate() + 1);
          } else if (item.frequency === 'weekly') {
            nextDate.setDate(nextDate.getDate() + 7);
          } else if (item.frequency === 'monthly') {
            nextDate.setMonth(nextDate.getMonth() + 1);
          }
        }

        // Update lastGeneratedDate to today if we generated any
        if (generatedDates.length > 0) {
          return { ...item, lastGeneratedDate: today.toISOString().split('T')[0] };
        }
        return item;
      });
      return updated;
    });

    return newTransactions;
  }, [setRecurringItems]);

  return { recurringItems, addRecurring, updateRecurring, deleteRecurring, generateTransactions };
}