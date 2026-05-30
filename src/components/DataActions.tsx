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
    <div className={`flex ${isVertical ? 'flex flex-col items-stretch' : 'flex-wrap items-center'} gap-2 w-full sm:w-auto`}>
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleImportClick}
        className={`capitalize ${isVertical ? 'w-full justify-start' : ''} flex items-center gap-2 rounded-lg border border-hairline-strong bg-surface-card/70 px-4 py-2 text-body-sm font-[500] text-body transition-colors hover:bg-surface-elevated active:bg-surface-elevated  `}
        title={t('import_tooltip')}
      >
        📥 {t('import')}
      </button>
      <button
        onClick={handleExportJson}
        className={`capitalize ${isVertical ? 'w-full justify-start' : ''} flex items-center gap-2 rounded-lg border border-hairline-strong bg-surface-card/70 px-4 py-2 text-body-sm font-[500] text-body transition-colors hover:bg-surface-elevated active:bg-surface-elevated  `}
        title={t('backup_tooltip')}
      >
        💾 {t('backup')}
      </button>
      <button
        onClick={handleExportCsv}
        className={`capitalize ${isVertical ? 'w-full justify-start' : ''} flex items-center gap-2 rounded-lg border-emerald-200 bg-surface-card px-4 py-2 text-body-sm font-[500] text-emerald-700 transition-colors hover:bg-surface-elevated active:bg-emerald-200   `}
        title={t('download_csv')}
      >
        📊 {t('csv')}
      </button>
      <div className={`relative ${isVertical ? 'w-full' : ''}`} ref={pdfMenuRef}>
        <button
          onClick={() => setShowPdfMenu(!showPdfMenu)}
          className={`capitalize ${isVertical ? 'w-full justify-between' : ''} flex items-center gap-2 rounded-lg border-hairline-strong bg-surface-elevated px-4 py-2 text-body-sm font-[500] text-accent-blue transition-colors hover:bg-surface-elevated active:bg-surface-elevated   `}
        >
          <span>📄 {t('pdf')}</span>
          <span className="text-caption">▼</span>
        </button>
        {showPdfMenu && (
          <div className="absolute top-full left-0 mt-2 z-20 w-52 bg-surface-card border border-hairline-strong rounded-lg overflow-hidden">
            <button
              onClick={() => handleGeneratePDF('all')}
              className="capitalize w-full text-left px-4 py-3 text-body-sm text-body hover:bg-surface-elevated transition-colors border-b border border-hairline"
            >
              📋 {t('download_pdf_all')}
            </button>
            <button
              onClick={() => handleGeneratePDF('income')}
              className="capitalize w-full text-left px-4 py-3 text-body-sm text-accent-green hover:bg-surface-elevated transition-colors border-b border border-hairline"
            >
              📈 {t('download_pdf_income')}
            </button>
            <button
              onClick={() => handleGeneratePDF('expense')}
              className="capitalize w-full text-left px-4 py-3 text-body-sm text-rose-600 hover:bg-surface-elevated transition-colors"
            >
              📉 {t('download_pdf_expense')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}