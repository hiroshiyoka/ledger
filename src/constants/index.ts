import { Wallet, Category } from '../types';

export const STORAGE_KEYS = {
  SPEND_ITEMS: 'spend-tracker-items',
  TRANSACTIONS: 'ledger-transactions',
  WALLETS: 'ledger-wallets',
  CATEGORIES: 'ledger-categories',
  BUDGET_LIMIT: 'spend-tracker-budget',
} as const;

export const MAX_NAME_LENGTH = 100;
export const ITEMS_PER_PAGE = 5;

export const DEFAULT_WALLET_ID = 'wallet-default-cash';

export const DEFAULT_WALLETS: Wallet[] = [
  {
    id: DEFAULT_WALLET_ID,
    name: 'Cash / Dompet Utama',
    color: 'bg-indigo-500',
    icon: 'Wallet'
  }
];

export const DEFAULT_CATEGORIES: Category[] = [
  // Expenses
  { id: 'cat-exp-food', name: 'Food & Drink', type: 'expense', color: 'bg-teal-500', icon: 'Utensils' },
  { id: 'cat-exp-transport', name: 'Transport', type: 'expense', color: 'bg-blue-500', icon: 'Car' },
  { id: 'cat-exp-entertainment', name: 'Entertainment', type: 'expense', color: 'bg-purple-500', icon: 'Film' },
  { id: 'cat-exp-shopping', name: 'Shopping', type: 'expense', color: 'bg-rose-500', icon: 'ShoppingBag' },
  { id: 'cat-exp-bills', name: 'Bills & Utilities', type: 'expense', color: 'bg-orange-500', icon: 'Zap' },
  { id: 'cat-exp-other', name: 'Other Expense', type: 'expense', color: 'bg-slate-500', icon: 'Box' },
  // Incomes
  { id: 'cat-inc-salary', name: 'Salary', type: 'income', color: 'bg-emerald-500', icon: 'Briefcase' },
  { id: 'cat-inc-investment', name: 'Investment', type: 'income', color: 'bg-cyan-500', icon: 'TrendingUp' },
  { id: 'cat-inc-other', name: 'Other Income', type: 'income', color: 'bg-slate-500', icon: 'PlusCircle' }
];

export const CATEGORY_CONFIG = {
  daily: { 
    label: 'Daily Spend 🍟', 
    color: 'text-teal-600 dark:text-teal-300',
    bg: 'bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/40 dark:to-emerald-900/40',
    border: 'border-teal-200 dark:border-teal-700/50'
  },
  big: { 
    label: 'Big Spend 🚀', 
    color: 'text-rose-600 dark:text-rose-300',
    bg: 'bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/40 dark:to-orange-900/40',
    border: 'border-rose-200 dark:border-rose-700/50'
  },
} as const;
