import type { Transaction } from '../types';

export function exportToCsv(items: Transaction[], currencyCode: string = 'IDR'): void {
  const headers = ['Date', 'Name', 'Type', 'Amount', 'Category ID', 'Wallet ID'];
  const rows = items.map(item => [
    item.date,
    `"${item.name.replace(/"/g, '""')}"`, // Escape quotes in CSV
    item.type,
    item.amount,
    item.categoryId,
    item.walletId,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ledger-${currencyCode}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}