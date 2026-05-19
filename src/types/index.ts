export type TransactionType = 'expense' | 'income';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

export interface Wallet {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId: string;
  walletId: string;
}

export type SpendCategory = 'daily' | 'big';
export interface SpendItem {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: SpendCategory;
}

export type DateFilterType = 'all' | 'today' | 'week' | 'month';
