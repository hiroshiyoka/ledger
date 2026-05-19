import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect } from 'react';

import type { Transaction } from '../types';

import { exportToJson, importFromJson } from '../services/dataService';
import { exportToCsv } from '../services/csvService';
import { generateSpendPDF } from '../services/pdfService';
import { useCurrency } from '../hooks/useCurrency';

interface DataActionsProps {
  items: Transaction[];
  onImport: (items: Transaction[]) => void;
  isVertical?: boolean;
}

export default function DataActions({ items, onImport, isVertical = false }: DataActionsProps) {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPdfMenu, setShowPdfMenu] = useState(false);
  const pdfMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pdfMenuRef.current && !pdfMenuRef.current.contains(event.target as Node)) {
        setShowPdfMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportJson = () => {
    exportToJson(items);
  };

  const handleExportCsv = () => {
    exportToCsv(items, currency.code);
  };

  const handleGeneratePDF = (scope: 'income' | 'expense' | 'all') => {
    setShowPdfMenu(false);
    generateSpendPDF(items, scope, t);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    try {
      const importedItems = await importFromJson(file);

      if (window.confirm(`${importedItems.length} data found. Proceed?`)) {
        onImport(importedItems);
      }
    } catch (error) {
      alert((error as Error).message);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`flex ${isVertical ? 'flex-col items-stretch' : 'flex-wrap items-center'} gap-2 w-full sm:w-auto`}>
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleImportClick}
        className={`capitalize ${isVertical ? 'w-full justify-start' : ''} flex items-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50`}
        title={t('import_tooltip')}
      >
        📥 {t('import')}
      </button>
      <button
        onClick={handleExportJson}
        className={`capitalize ${isVertical ? 'w-full justify-start' : ''} flex items-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50`}
        title={t('backup_tooltip')}
      >
        💾 {t('backup')}
      </button>
      <button
        onClick={handleExportCsv}
        className={`capitalize ${isVertical ? 'w-full justify-start' : ''} flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 active:bg-emerald-200 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300`}
        title={t('download_csv')}
      >
        📊 {t('csv')}
      </button>
      <div className={`relative ${isVertical ? 'w-full' : ''}`} ref={pdfMenuRef}>
        <button
          onClick={() => setShowPdfMenu(!showPdfMenu)}
          className={`capitalize ${isVertical ? 'w-full justify-between' : ''} flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100 active:bg-indigo-200 dark:border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300`}
        >
          <span>📄 {t('pdf')}</span>
          <span className="text-xs">▼</span>
        </button>
        {showPdfMenu && (
          <div className="absolute top-full left-0 mt-2 z-20 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/20 rounded-xl shadow-xl overflow-hidden">
            <button
              onClick={() => handleGeneratePDF('all')}
              className="capitalize w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-white/10"
            >
              📋 {t('download_pdf_all')}
            </button>
            <button
              onClick={() => handleGeneratePDF('income')}
              className="capitalize w-full text-left px-4 py-3 text-sm text-emerald-600 dark:text-emerald-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-white/10"
            >
              📈 {t('download_pdf_income')}
            </button>
            <button
              onClick={() => handleGeneratePDF('expense')}
              className="capitalize w-full text-left px-4 py-3 text-sm text-rose-600 dark:text-rose-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              📉 {t('download_pdf_expense')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}