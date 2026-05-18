export const STORAGE_KEYS = {
  SPEND_ITEMS: 'spend-tracker-items',
  BUDGET_LIMIT: 'spend-tracker-budget',
} as const;

export const MAX_NAME_LENGTH = 100;
export const ITEMS_PER_PAGE = 5;

export const CATEGORY_CONFIG = {
  daily: { 
    label: 'Daily Spend 🍟', 
    color: 'text-teal-300',
    bg: 'bg-gradient-to-br from-teal-900/40 to-emerald-900/40',
    border: 'border-teal-700/50'
  },
  big: { 
    label: 'Big Spend 🚀', 
    color: 'text-rose-300',
    bg: 'bg-gradient-to-br from-rose-900/40 to-orange-900/40',
    border: 'border-rose-700/50'
  },
} as const;
