import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import SpendForm from './components/SpendForm';
import SpendList from './components/SpendList';
import FilterBar from './components/FilterBar';
import SummaryCard from './components/SummaryCard';
import DataActions from './components/DataActions';
import AppSettings from './components/AppSettings';
import ExpenseCharts from './components/ExpenseCharts';
import BudgetProgress from './components/BudgetProgress';

import type { SpendItem } from './types';

import { useSpendItems } from './hooks/useSpendItems';
import { useBudget } from './hooks/useBudget';
import { generateSpendPDF } from './services/pdfService';

export default function App() {
  const { t } = useTranslation();
  const { 
    items,
    filteredItems, 
    dailyItems, 
    bigItems, 
    dailyTotal, 
    bigTotal, 
    searchQuery,
    setSearchQuery,
    dateFilter,
    setDateFilter,
    addItem, 
    updateItem, 
    deleteItem, 
    importItems 
  } = useSpendItems();
  
  const { budgetLimit, setBudgetLimit } = useBudget();
  const [editItem, setEditItem] = useState<SpendItem | null>(null);

  const handleSubmit = (data: Omit<SpendItem, 'id'>) => {
    if (editItem) {
      updateItem(editItem.id, data);
      setEditItem(null);
    } else {
      addItem(data);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-violet-950 text-slate-800 dark:text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-300">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left animate-slide-up opacity-0">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-300 dark:to-purple-300">
              💸 {t('app_title')}
            </h1>
            <p className="mt-2 text-slate-600 dark:text-indigo-200/60 font-medium">
              {t('app_subtitle')}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <AppSettings />
            <DataActions 
              items={filteredItems}
              dailyItems={dailyItems} 
              bigItems={bigItems} 
              onImport={importItems}
            />
          </div>
        </header>

        <FilterBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />

        <BudgetProgress 
          items={items} 
          budgetLimit={budgetLimit} 
          setBudgetLimit={setBudgetLimit} 
        />

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 animate-slide-up opacity-0" style={{ animationDelay: '100ms' }}>
          <SummaryCard category="daily" total={dailyTotal} count={dailyItems.length} />
          <SummaryCard category="big" total={bigTotal} count={bigItems.length} />
        </div>

        <ExpenseCharts items={filteredItems} dailyTotal={dailyTotal} bigTotal={bigTotal} />

        <div className="mb-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl dark:shadow-2xl dark:shadow-black/50 sm:p-8 relative overflow-hidden animate-slide-up opacity-0 transition-colors duration-300" style={{ animationDelay: '200ms' }}>
          <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-[0.03] pointer-events-none">
             <span className="text-8xl">✍️</span>
          </div>
          <h2 className="mb-5 text-base font-bold text-indigo-600 dark:text-indigo-200 uppercase tracking-wider relative z-10 flex items-center gap-2">
            {editItem ? `✏️ ${t('edit_expense')}` : `✨ ${t('add_expense')}`}
          </h2>
          <div className="relative z-10">
            <SpendForm
              key={editItem?.id ?? 'new'}
              onSubmit={handleSubmit}
              editItem={editItem}
              onCancelEdit={() => setEditItem(null)}
            />
          </div>
        </div>

        <div className="space-y-8">
          <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl dark:shadow-2xl dark:shadow-black/50 sm:p-8 animate-slide-up opacity-0 transition-colors duration-300" style={{ animationDelay: '300ms' }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-teal-600 dark:text-teal-300 uppercase tracking-wider flex items-center gap-2">
                <span>🍔</span> {t('daily_spend')}
              </h2>
              <button
                onClick={() => generateSpendPDF(dailyItems, bigItems, 'daily', t)}
                className="text-teal-600/70 hover:text-teal-600 dark:text-teal-300/70 dark:hover:text-teal-300 transition-colors"
                title={t('download_pdf_daily')}
              >
                📥
              </button>
            </div>
            <SpendList
              items={dailyItems}
              onEdit={setEditItem}
              onDelete={deleteItem}
            />
          </section>

          <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl dark:shadow-2xl dark:shadow-black/50 sm:p-8 animate-slide-up opacity-0 transition-colors duration-300" style={{ animationDelay: '400ms' }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-rose-600 dark:text-rose-300 uppercase tracking-wider flex items-center gap-2">
                <span>🚀</span> {t('big_spend')}
              </h2>
              <button
                onClick={() => generateSpendPDF(dailyItems, bigItems, 'big', t)}
                className="text-rose-600/70 hover:text-rose-600 dark:text-rose-300/70 dark:hover:text-rose-300 transition-colors"
                title={t('download_pdf_big')}
              >
                📥
              </button>
            </div>
            <SpendList
              items={bigItems}
              onEdit={setEditItem}
              onDelete={deleteItem}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
