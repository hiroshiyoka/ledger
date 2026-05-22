import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Navbar from './components/Navbar';
import SpendForm from './components/SpendForm';
import SpendList from './components/SpendList';
import FilterBar from './components/FilterBar';
import SummaryCard from './components/SummaryCard';
import DashboardCharts from './components/ExpenseCharts';
import BudgetProgress from './components/BudgetProgress';
import RecurringForm from './components/RecurringForm';
import RecurringList from './components/RecurringList';

import type { Transaction, RecurringTransaction } from './types';

import { useTransactions } from './hooks/useTransactions';
import { useBudget } from './hooks/useBudget';
import { useRecurring } from './hooks/useRecurring';

import CalendarView from './components/CalendarView';

export default function App() {
  const { t } = useTranslation();
  const { 
    items, filteredItems, totalIncome, totalExpense, netBalance,
    searchQuery, setSearchQuery, dateFilter, setDateFilter,
    addTransaction, updateTransaction, deleteTransaction, importTransactions 
  } = useTransactions();
  
  const { budgetLimit, setBudgetLimit } = useBudget();
  const { recurringItems, addRecurring, updateRecurring, deleteRecurring, generateTransactions } = useRecurring();
  const [editItem, setEditItem] = useState<Transaction | null>(null);
  const [editRecurring, setEditRecurring] = useState<RecurringTransaction | null>(null);
  const [showRecurring, setShowRecurring] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    const newTx = generateTransactions();
    if (newTx.length > 0) newTx.forEach(tx => addTransaction(tx));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (data: Omit<Transaction, 'id'>) => {
    if (editItem) { updateTransaction(editItem.id, data); setEditItem(null); }
    else addTransaction(data);
  };

  const handleRecurringSubmit = (data: Omit<RecurringTransaction, 'id'>) => {
    if (editRecurring) { updateRecurring(editRecurring.id, data); setEditRecurring(null); }
    else addRecurring(data);
  };

  const sortedItems = [...filteredItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <Navbar items={filteredItems} onImport={(data: any) => importTransactions(data)} />
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {/* Intro Text */}
        <div className="mb-8">
          <p className="text-lg text-slate-500 dark:text-indigo-200/60">{t('app_subtitle')}</p>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <FilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} dateFilter={dateFilter} onDateFilterChange={setDateFilter} />
        </div>

        {/* Budget */}
        <div className="mb-8">
          <BudgetProgress items={items.filter(i => i.type === 'expense')} budgetLimit={budgetLimit} setBudgetLimit={setBudgetLimit} />
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard type="income" total={totalIncome} />
          <SummaryCard type="expense" total={totalExpense} />
          <SummaryCard type="net" total={netBalance} />
        </div>

        {/* Charts */}
        <div className="mb-8">
          <DashboardCharts items={filteredItems} />
        </div>

        {/* Transaction Form */}
        <div className="mb-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 shadow-md">
          <h2 className="mb-5 text-lg font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            {editItem ? `✏️ ${t('edit')}` : `➕ ${t('add_transaction')}`}
          </h2>
          <SpendForm key={editItem?.id ?? 'new'} onSubmit={handleSubmit} editItem={editItem} onCancelEdit={() => setEditItem(null)} />
        </div>

        {/* Recurring Section */}
        <div className="mb-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 shadow-md overflow-hidden">
          <button onClick={() => setShowRecurring(!showRecurring)} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <h2 className="text-lg font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-3">
              🔄 {t('recurring_transaction')}
              {recurringItems.length > 0 && (
                <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-sm px-3 py-1 rounded-full font-bold">{recurringItems.length}</span>
              )}
            </h2>
            <span className={`text-slate-400 text-xl transition-transform ${showRecurring ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {showRecurring && (
            <div className="px-6 pb-6 space-y-5 border-t border-slate-100 dark:border-white/10">
              <div className="pt-5">
                <RecurringForm key={editRecurring?.id ?? 'new-recurring'} onSubmit={handleRecurringSubmit} existingItem={editRecurring} onCancelEdit={() => setEditRecurring(null)} />
              </div>
              <RecurringList items={recurringItems} onEdit={setEditRecurring} onDelete={deleteRecurring} />
            </div>
          )}
        </div>

        {/* Transaction History / Calendar */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <h2 className="text-lg font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-3">
              📋 {t('transaction_history')}
            </h2>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
              <button 
                onClick={() => setViewMode('list')}
                className={`flex-1 px-4 py-1.5 text-sm font-bold rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                📋 {t('filter_all') || 'List'}
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={`flex-1 px-4 py-1.5 text-sm font-bold rounded-lg transition-all duration-200 ${viewMode === 'calendar' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                📅 {t('calendar') || 'Calendar'}
              </button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <SpendList items={sortedItems} onEdit={setEditItem} onDelete={deleteTransaction} />
          ) : (
            <div className="-mx-2 sm:mx-0">
              <CalendarView items={filteredItems} onEdit={setEditItem} onDelete={deleteTransaction} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}