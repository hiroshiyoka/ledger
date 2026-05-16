import type { SpendItem, SpendCategory } from '../types';

export function createSpendItem(data: Omit<SpendItem, 'id'>): SpendItem {
  return { ...data, id: crypto.randomUUID() };
}

export function filterByCategory(items: SpendItem[], category: SpendCategory): SpendItem[] {
  return items.filter(item => item.category === category);
}

export function calculateTotal(items: SpendItem[], category: SpendCategory): number {
  return filterByCategory(items, category).reduce((sum, item) => sum + item.amount, 0);
}
