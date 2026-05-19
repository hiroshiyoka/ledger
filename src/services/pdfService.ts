import jsPDF from 'jspdf';
import { TFunction } from 'i18next';
import autoTable from 'jspdf-autotable';

import type { SpendItem } from '../types';

import { formatCurrency } from '../utils/format';

type ExportScope = 'daily' | 'big' | 'all';

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) return dateStr;
  
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function generateSpendPDF(
  dailyItems: SpendItem[],
  bigItems: SpendItem[],
  scope: ExportScope,
  t: TFunction
): void {
  const SCOPE_LABEL: Record<ExportScope, string> = {
    daily: t('daily_spend'),
    big: t('big_spend'),
    all: t('app_title'),
  };

  const doc = new jsPDF();
  const margin = 20;
  const today = new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let filteredItems: SpendItem[];
  let dailyTotal = 0;
  let bigTotal = 0;

  if (scope === 'daily') {
    filteredItems = dailyItems;
    dailyTotal = dailyItems.reduce((s, i) => s + i.amount, 0);
  } else if (scope === 'big') {
    filteredItems = bigItems;
    bigTotal = bigItems.reduce((s, i) => s + i.amount, 0);
  } else {
    filteredItems = [...dailyItems, ...bigItems].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    dailyTotal = dailyItems.reduce((s, i) => s + i.amount, 0);
    bigTotal = bigItems.reduce((s, i) => s + i.amount, 0);
  }

  const grandTotal = dailyTotal + bigTotal;

  // --- Header ---
  doc.setFontSize(22);
  doc.setTextColor(30, 30, 30);
  doc.text('Ledger', margin, 25);

  doc.setFontSize(11);
  doc.setTextColor(120, 120, 120);
  doc.text(SCOPE_LABEL[scope], margin, 33);
  doc.text('Dicetak: ' + today, margin, 40);

  // --- Summary ---
  let summaryY = 52;
  doc.setFontSize(13);
  doc.setTextColor(50, 50, 50);
  doc.text('Summary', margin, summaryY);
  summaryY += 7;

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);

  if (scope === 'all' || scope === 'daily') {
    doc.text(
      `${t('daily_spend')}:     ` + formatCurrency(dailyTotal),
      margin, summaryY
    );
    summaryY += 5;
  }

  if (scope === 'all' || scope === 'big') {
    doc.text(
      `${t('big_spend')}:        ` + formatCurrency(bigTotal),
      margin, summaryY
    );
    summaryY += 5;
  }
  
  if (scope === 'all') {
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text(
      `${t('total')}: ` + formatCurrency(grandTotal),
      margin, summaryY
    );
  }

  // --- Table ---
  const tableStartY = (scope === 'all' ? summaryY + 8 : summaryY + 8);

  const columns: string[] = scope === 'all'
    ? ['No', t('expense_name'), t('amount'), t('date'), t('category')]
    : ['No', t('expense_name'), t('amount'), t('date')];

  const rows: (string | number)[][] = filteredItems.map((item, index) => {
    const base = [
      index + 1,
      item.name,
      'Rp ' + item.amount.toLocaleString('id-ID'),
      formatDateShort(item.date),
    ];

    if (scope === 'all') {
      base.push(item.category === 'daily' ? 'Daily' : 'Big');
    }
    
    return base;
  });

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: tableStartY,
    margin: { horizontal: margin },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [79, 70, 186],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 250],
    },
  });

  // --- Footer ---
  const pageCount = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(
      'Ledger - Laporan Pengeluaran | Halaman ' + i + ' dari ' + pageCount,
      margin,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // --- Empty state ---
  if (filteredItems.length === 0) {
    doc.setFontSize(11);
    doc.setTextColor(150, 150, 150);
    doc.text('Belum ada data pengeluaran untuk ditampilkan.', margin, tableStartY + 10);
  }

  doc.save('ledger-' + scope + '-' + new Date().toISOString().slice(0, 10) + '.pdf');
}
