import { Wallet, Category } from '../types';

export const STORAGE_KEYS = {
  SPEND_ITEMS: 'spend-tracker-items', // legacy
  TRANSACTIONS: 'ledger-transactions',
  WALLETS: 'ledger-wallets',
  CATEGORIES: 'ledger-categories',
  BUDGET_LIMIT: 'spend-tracker-budget',
  CURRENCY: 'ledger-currency',
  RECURRING: 'ledger-recurring',
} as const;

export const MAX_NAME_LENGTH = 100;
export const ITEMS_PER_PAGE = 5;

export const DEFAULT_WALLET_ID = 'wallet-default-cash';

export const DEFAULT_WALLETS: Wallet[] = [
  {
    id: DEFAULT_WALLET_ID,
    name: 'Cash / Dompet Utama',
    color: 'bg-surface-light',
    icon: 'Wallet'
  }
];

export const DEFAULT_CATEGORIES: Category[] = [
  // Expenses
  { id: 'cat-exp-food', name: 'Food & Drink', type: 'expense', color: 'bg-accent-orange', icon: 'Utensils' },
  { id: 'cat-exp-transport', name: 'Transport', type: 'expense', color: 'bg-accent-blue', icon: 'Car' },
  { id: 'cat-exp-entertainment', name: 'Entertainment', type: 'expense', color: 'bg-accent-orange', icon: 'Film' },
  { id: 'cat-exp-shopping', name: 'Shopping', type: 'expense', color: 'bg-accent-red', icon: 'ShoppingBag' },
  { id: 'cat-exp-bills', name: 'Bills & Utilities', type: 'expense', color: 'bg-accent-orange', icon: 'Zap' },
  { id: 'cat-exp-other', name: 'Other Expense', type: 'expense', color: 'bg-accent-yellow', icon: 'Box' },
  // Incomes
  { id: 'cat-inc-salary', name: 'Salary', type: 'income', color: 'bg-accent-green', icon: 'Briefcase' },
  { id: 'cat-inc-investment', name: 'Investment', type: 'income', color: 'bg-accent-green', icon: 'TrendingUp' },
  { id: 'cat-inc-other', name: 'Other Income', type: 'income', color: 'bg-accent-blue', icon: 'PlusCircle' }
];

export const CATEGORY_CONFIG = {
  daily: { 
    label: 'Daily Spend 🛒', 
    color: 'text-accent-blue',
    bg: 'bg-surface-card',
    border: 'border-hairline-strong'
  },
  big: { 
    label: 'Big Spend 💰', 
    color: 'text-accent-red',
    bg: 'bg-surface-card',
    border: 'border-hairline-strong'
  },
} as const;
