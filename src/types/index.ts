export type SpendCategory = 'daily' | 'big';

export interface SpendItem {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: SpendCategory;
}
