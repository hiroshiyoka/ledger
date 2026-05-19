import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import type { Transaction } from '../types';

import { exportToJson, importFromJson } from '../services/dataService';
// import { generateSpendPDF } from '../services/pdfService'; // Temporarily disabled for Transaction refactor

interface DataActionsProps {
  items: Transaction[];
  onImport: (items: Transaction[]) => void;
}

export default function DataActions({ items, onImport }: DataActionsProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => {
    exportToJson(items);
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
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0">
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleImportClick}
        className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:active:bg-slate-600/50"
        title={t('import_tooltip')}
      >
        <span>📥</span> {t('import')}
      </button>
      <button
        onClick={handleExportJson}
        className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:active:bg-slate-600/50"
        title={t('backup_tooltip')}
      >
        <span>💾</span> {t('backup')}
      </button>
      <button
        onClick={() => alert('PDF Generation is temporarily disabled during data migration')} // () => generateSpendPDF(items, t)
        className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 font-medium text-indigo-700 transition-colors hover:bg-indigo-100 active:bg-indigo-200 dark:border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300 dark:hover:bg-indigo-500/30 dark:active:bg-indigo-500/40 opacity-50 cursor-not-allowed"
        title={t('download_pdf_all')}
      >
        <span>📄</span> {t('pdf')}
      </button>
    </div>
  );
}