import type { SpendItem } from '../types';

export interface PieData {
  name: string;
  value: number;
  color: string;
}

export interface TrendData {
  dateLabel: string;
  total: number;
  rawDate: number;
}

export function getPieChartData(dailyTotal: number, bigTotal: number): PieData[] {
  return [
    { name: 'Daily Spend', value: dailyTotal, color: '#2dd4bf' },
    { name: 'Big Spend', value: bigTotal, color: '#fb7185' },
  ].filter(item => item.value > 0);
}

export function getTrendChartData(items: SpendItem[], limitDays: number = 7): TrendData[] {
  const grouped = items.reduce((acc, item) => {
    const dateStr = item.date.split('T')[0];

    if (!acc[dateStr]) {
      acc[dateStr] = 0;
    }

    acc[dateStr] += item.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped)
    .map(([dateStr, total]) => {
      const dateObj = new Date(dateStr);
      
      return {
        dateLabel: dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        total,
        rawDate: dateObj.getTime(),
      };
    })
    .sort((a, b) => a.rawDate - b.rawDate)
    .slice(-limitDays);
}
