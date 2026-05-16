export function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) return dateStr;
  
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
