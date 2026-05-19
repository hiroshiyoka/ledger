import { useState, useEffect } from 'react';

import type { Category } from '../types';
import { STORAGE_KEYS, DEFAULT_CATEGORIES } from '../constants';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load categories from localStorage', error);
    }
    return DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = { ...category, id: crypto.randomUUID() };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(prev => prev.map(c => (c.id === updatedCategory.id ? updatedCategory : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return { categories, addCategory, updateCategory, deleteCategory };
}
