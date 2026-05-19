import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import SpendForm from './components/SpendForm';
import SpendList from './components/SpendList';
import FilterBar from './components/FilterBar';
import SummaryCard from './components/SummaryCard';
import DataActions from './components/DataActions';
import AppSettings from './components/AppSettings';
import DashboardCharts from './components/ExpenseCharts';
import BudgetProgress from './components/BudgetProgress';
import RecurringForm from './components/RecurringForm';
import RecurringList from './components/RecurringList';

import type { Transaction, RecurringTransaction } from './types';

import { useTransactions } from './hooks/useTransactions';
import { useBudget } from './hooks/useBudget';
import { useRecurring } from './hooks/useRecurring';

export default function App() {
  const { t } = useTranslation();
  const { 
    items,
    filteredItems,
    totalIncome,
    totalExpense,
    netBalance,
    searchQuery,
    setSearchQuery,
    dateFilter,
    setDateFilter,
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    importTransactions 
  } = useTransactions();
  
  const { budgetLimit, setBudgetLimit } = useBudget();
  const { recurringItems, addRecurring, updateRecurring, deleteRecurring, generateTransactions } = useRecurring();
  const [editItem, setEditItem] = useState<Transaction | null>(null);
  const [editRecurring, setEditRecurring] = useState<RecurringTransaction | null>(null);

  // Generate recurring transactions on mount
  useEffect(() => {
    const newTx = generateTransactions();
    if (newTx.length > 0) {
      newTx.forEach(tx => addTransaction(tx));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (data: Omit<Transaction, 'id'>) => {
    if (editItem) {
      updateTransaction(editItem.id, data);
      setEditItem(null);
    } else {
      addTransaction(data);
    }
  };

  const handleRecurringSubmit = (data: Omit<RecurringTransaction, 'id'>) => {
    if (editRecurring) {
      updateRecurring(editRecurring.id, data);
      setEditRecurring(null);
    } else {
      addRecurring(data);
    }
  };

  const sortedItems = [...filteredItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-violet-950 text-slate-800 dark:text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-300">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left animate-slide-up opacity-0">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-300 dark:to-purple-300">
              📊 {t('app_title')}
            </h1>
            <p className="mt-2 text-slate-600 dark:text-indigo-200/60 font-medium">
              {t('app_subtitle')}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <AppSettings />
            <DataActions 
              items={filteredItems}
              onImport={(data: any) => importTransactions(data)}
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
          items={items.filter(i => i.type === 'expense')}
          budgetLimit={budgetLimit} 
          setBudgetLimit={setBudgetLimit} 
        />

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3 animate-slide-up opacity-0" style={{ animationDelay: '100ms' }}>
          <SummaryCard type="income" total={totalIncome} />
          <SummaryCard type="expense" total={totalExpense} />
          <SummaryCard type="net" total={netBalance} />
        </div>

        <DashboardCharts items={filteredItems} />

        {/* Main Transaction Form */}
        <div className="mb-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl dark:shadow-2xl dark:shadow-black/50 sm:p-8 relative overflow-hidden animate-slide-up opacity-0 transition-colors duration-300" style={{ animationDelay: '200ms' }}>
          <h2 className="mb-5 text-base font-bold text-indigo-600 dark:text-indigo-200 uppercase tracking-wider relative z-10 flex items-center gap-2">
            {editItem ? `✏️ ${t('edit')}` : `➕ ${t('add_transaction')}`}
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

        {/* Recurring Transactions Section */}
        <div className="mb-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl dark:shadow-2xl dark:shadow-black/50 sm:p-8 relative overflow-hidden animate-slide-up opacity-0 transition-colors duration-300" style={{ animationDelay: '250ms' }}>
          <h2 className="mb-5 text-base font-bold text-indigo-600 dark:text-indigo-200 uppercase tracking-wider relative z-10 flex items-center gap-2">
            🔄 {t('recurring_transaction')}
          </h2>
          <div className="space-y-4">
            <RecurringForm
              key={editRecurring?.id ?? 'new-recurring'}
              onSubmit={handleRecurringSubmit}
              existingItem={editRecurring}
              onCancelEdit={() => setEditRecurring(null)}
            />
            <RecurringList
              items={recurringItems}
              onEdit={setEditRecurring}
              onDelete={deleteRecurring}
            />
          </div>
        </div>

        <div className="space-y-8">
          <section className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow-xl dark:shadow-2xl dark:shadow-black/50 sm:p-8 animate-slide-up opacity-0 transition-colors duration-300" style={{ animationDelay: '300ms' }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <span>📋</span> {t('transaction_history')}
              </h2>
            </div>
            <SpendList
              items={sortedItems}
              onEdit={setEditItem}
              onDelete={deleteTransaction}
            />
          </section>
        </div>
      </div>
    </div>
  );
}