import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import type { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

type ExportScope = 'income' | 'expense' | 'all';

export function generateSpendPDF(
  transactions: Transaction[],
  scope: ExportScope,
  t: (key: string) => string
): void {
  const SCOPE_LABEL: Record<ExportScope, string> = {
    income: t('total_income'),
    expense: t('total_expense'),
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

  let filteredItems: Transaction[] = transactions;
  let incomeTotal = 0;
  let expenseTotal = 0;

  if (scope === 'income') {
    filteredItems = transactions.filter(t => t.type === 'income');
    incomeTotal = filteredItems.reduce((s, i) => s + i.amount, 0);
  } else if (scope === 'expense') {
    filteredItems = transactions.filter(t => t.type === 'expense');
    expenseTotal = filteredItems.reduce((s, i) => s + i.amount, 0);
  } else {
    incomeTotal = transactions.filter(t => t.type === 'income').reduce((s, i) => s + i.amount, 0);
    expenseTotal = transactions.filter(t => t.type === 'expense').reduce((s, i) => s + i.amount, 0);
  }

  const grandTotal = incomeTotal - expenseTotal;

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

  if (scope === 'all' || scope === 'income') {
    doc.setTextColor(16, 185, 129); // Emerald
    doc.text(
      `${t('total_income')}:  ` + formatCurrency(incomeTotal),
      margin, summaryY
    );
    summaryY += 5;
  }

  if (scope === 'all' || scope === 'expense') {
    doc.setTextColor(244, 63, 94); // Rose
    doc.text(
      `${t('total_expense')}: ` + formatCurrency(expenseTotal),
      margin, summaryY
    );
    summaryY += 5;
  }
  
  if (scope === 'all') {
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text(
      `${t('net_balance')}:  ` + formatCurrency(grandTotal),
      margin, summaryY
    );
  }

  // --- Table ---
  const tableStartY = summaryY + 8;

  const columns: string[] = ['No', t('date'), t('name'), t('type'), t('amount')];

  const rows: (string | number)[][] = filteredItems
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((item, index) => [
      index + 1,
      formatDate(item.date),
      item.name,
      item.type === 'income' ? t('income') : t('expense'),
      formatCurrency(item.amount),
    ]);

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
      'Ledger - ' + SCOPE_LABEL[scope] + ' | Halaman ' + i + ' dari ' + pageCount,
      margin,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // --- Empty state ---
  if (filteredItems.length === 0) {
    doc.setFontSize(11);
    doc.setTextColor(150, 150, 150);
    doc.text('Belum ada data untuk ditampilkan.', margin, tableStartY + 10);
  }

  doc.save('ledger-' + scope + '-' + new Date().toISOString().slice(0, 10) + '.pdf');
}