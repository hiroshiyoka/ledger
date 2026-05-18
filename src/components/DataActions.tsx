import { useRef } from 'react';

import type { SpendItem } from '../types';

import { generateSpendPDF } from '../services/pdfService';
import { exportToJson, importFromJson } from '../services/dataService';

interface DataActionsProps {
  items: SpendItem[];
  dailyItems: SpendItem[];
  bigItems: SpendItem[];
  onImport: (items: SpendItem[]) => void;
}

export default function DataActions({ items, dailyItems, bigItems, onImport }: DataActionsProps) {
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

      if (window.confirm(`Berhasil membaca ${importedItems.length} data. Apakah Anda yakin ingin menimpa data saat ini?`)) {
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
        className="flex items-center gap-2 rounded-xl bg-slate-800/50 px-4 py-2 font-medium text-slate-300 transition-colors hover:bg-slate-700/50 active:bg-slate-600/50 border border-slate-700/50"
        title="Import Data (JSON)"
      >
        <span>📂</span> Import
      </button>
      <button
        onClick={handleExportJson}
        className="flex items-center gap-2 rounded-xl bg-slate-800/50 px-4 py-2 font-medium text-slate-300 transition-colors hover:bg-slate-700/50 active:bg-slate-600/50 border border-slate-700/50"
        title="Backup Data (JSON)"
      >
        <span>💾</span> Backup
      </button>
      <button
        onClick={() => generateSpendPDF(dailyItems, bigItems, 'all')}
        className="flex items-center gap-2 rounded-xl bg-indigo-500/20 px-4 py-2 font-medium text-indigo-300 transition-colors hover:bg-indigo-500/30 active:bg-indigo-500/40 border border-indigo-500/30"
        title="Download PDF Semua Pengeluaran"
      >
        <span>📥</span> PDF
      </button>
    </div>
  );
}
