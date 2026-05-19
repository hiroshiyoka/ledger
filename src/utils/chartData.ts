import type { Transaction, Category } from '../types';

export interface PieData {
  name: string;
  value: number;
  color: string;
}

export interface TrendData {
  dateLabel: string;
  income: number;
  expense: number;
  rawDate: number;
}

// Convert Tailwind classes like 'bg-teal-500' to hex for Recharts
const COLOR_MAP: Record<string, string> = {
  'bg-teal-500': '#14b8a6',
  'bg-blue-500': '#3b82f6',
  'bg-purple-500': '#a855f7',
  'bg-rose-500': '#f43f5e',
  'bg-orange-500': '#f97316',
  'bg-slate-500': '#64748b',
  'bg-emerald-500': '#10b981',
  'bg-cyan-500': '#06b6d4',
};

export function getPieChartData(transactions: Transaction[], categories: Category[], type: 'expense' | 'income' = 'expense'): PieData[] {
  const filtered = transactions.filter(t => t.type === type);
  
  const grouped = filtered.reduce((acc, t) => {
    if (!acc[t.categoryId]) acc[t.categoryId] = 0;
    acc[t.categoryId] += t.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped)
    .map(([catId, value]) => {
      const cat = categories.find(c => c.id === catId);
      return {
        name: cat?.name || 'Unknown',
        value,
        color: cat ? COLOR_MAP[cat.color] || '#cbd5e1' : '#cbd5e1',
      };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value); // Sort desc
}

export function getTrendChartData(items: Transaction[], limitDays: number = 7): TrendData[] {
  const grouped = items.reduce((acc, item) => {
    const dateStr = item.date.split('T')[0];

    if (!acc[dateStr]) {
      acc[dateStr] = { income: 0, expense: 0 };
    }

    if (item.type === 'income') {
      acc[dateStr].income += item.amount;
    } else {
      acc[dateStr].expense += item.amount;
    }
    return acc;
  }, {} as Record<string, { income: number, expense: number }>);

  return Object.entries(grouped)
    .map(([dateStr, totals]) => {
      const dateObj = new Date(dateStr);
      
      return {
        dateLabel: dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        income: totals.income,
        expense: totals.expense,
        rawDate: dateObj.getTime(),
      };
    })
    .sort((a, b) => a.rawDate - b.rawDate)
    .slice(-limitDays);
}
