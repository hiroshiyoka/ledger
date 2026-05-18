export type SpendCategory = 'daily' | 'big';

export type DateFilterType = 'all' | 'today' | 'week' | 'month';

export interface SpendItem {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: SpendCategory;
}
