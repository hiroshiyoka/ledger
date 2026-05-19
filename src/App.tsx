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
  const [showRecurring, setShowRecurring] = useState(false);

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-300 dark:to-purple-300">
              📊 {t('app_title')}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-indigo-200/60">
              {t('app_subtitle')}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
            <AppSettings />
            <DataActions 
              items={filteredItems}
              onImport={(data: any) => importTransactions(data)}
            />
          </div>
        </header>

        {/* Filter */}
        <div className="mb-6">
          <FilterBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
          />
        </div>

        {/* Budget */}
        <div className="mb-6">
          <BudgetProgress 
            items={items.filter(i => i.type === 'expense')}
            budgetLimit={budgetLimit} 
            setBudgetLimit={setBudgetLimit} 
          />
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard type="income" total={totalIncome} />
          <SummaryCard type="expense" total={totalExpense} />
          <SummaryCard type="net" total={netBalance} />
        </div>

        {/* Charts */}
        <div className="mb-6">
          <DashboardCharts items={filteredItems} />
        </div>

        {/* Transaction Form */}
        <div className="mb-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-5 shadow-lg">
          <h2 className="mb-4 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            {editItem ? `✏️ ${t('edit')}` : `➕ ${t('add_transaction')}`}
          </h2>
          <SpendForm
            key={editItem?.id ?? 'new'}
            onSubmit={handleSubmit}
            editItem={editItem}
            onCancelEdit={() => setEditItem(null)}
          />
        </div>

        {/* Recurring Section */}
        <div className="mb-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 shadow-lg overflow-hidden">
          <button
            onClick={() => setShowRecurring(!showRecurring)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
              🔄 {t('recurring_transaction')}
              {recurringItems.length > 0 && (
                <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full">
                  {recurringItems.length}
                </span>
              )}
            </h2>
            <span className={`text-slate-400 transition-transform ${showRecurring ? 'rotate-180' : ''}`}>
              ▾
            </span>
          </button>
          {showRecurring && (
            <div className="px-5 pb-5 space-y-4 border-t border-slate-100 dark:border-white/10">
              <div className="pt-4">
                <RecurringForm
                  key={editRecurring?.id ?? 'new-recurring'}
                  onSubmit={handleRecurringSubmit}
                  existingItem={editRecurring}
                  onCancelEdit={() => setEditRecurring(null)}
                />
              </div>
              <RecurringList
                items={recurringItems}
                onEdit={setEditRecurring}
                onDelete={deleteRecurring}
              />
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-5 shadow-lg">
          <h2 className="mb-4 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
            📋 {t('transaction_history')}
          </h2>
          <SpendList
            items={sortedItems}
            onEdit={setEditItem}
            onDelete={deleteTransaction}
          />
        </div>
      </div>
    </div>
  );
}