import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

import { useWallets } from '../hooks/useWallets';
import { useCategories } from '../hooks/useCategories';

import type { Transaction } from '../types';
import { ITEMS_PER_PAGE } from '../constants';
import { formatCurrency, formatDate } from '../utils/format';

interface SpendListProps {
  items: Transaction[];
  onEdit: (item: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function SpendList({ items, onEdit, onDelete }: SpendListProps) {
  const { t } = useTranslation();
  const { categories } = useCategories();
  const { wallets } = useWallets();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  useEffect(() => {
    // Kembalikan ke halaman sebelumnya jika item di halaman terakhir habis dihapus
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [items.length, totalPages, currentPage]);

  if (items.length === 0) {
    return (
      <div className="text-center py-10 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-black/20">
        <p className="text-indigo-600 dark:text-indigo-300 font-bold text-lg mb-1">{t('empty_list')} 🍃</p>
        <p className="text-indigo-600/60 dark:text-indigo-300/60 text-sm">{t('no_expenses')}</p>
      </div>
    );
  }

  const paginatedItems = items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 shadow-inner">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 text-indigo-600 dark:text-indigo-300">
              <th className="text-left py-3 px-4 font-bold">{t('name')}</th>
              <th className="text-left py-3 px-4 font-bold">{t('category')}</th>
              <th className="text-left py-3 px-4 font-bold">{t('wallet')}</th>
              <th className="text-right py-3 px-4 font-bold">{t('amount')}</th>
              <th className="text-left py-3 px-4 font-bold">{t('date')}</th>
              <th className="text-center py-3 px-4 font-bold w-24">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item, index) => {
              const category = categories.find(c => c.id === item.categoryId);
              const wallet = wallets.find(w => w.id === item.walletId);
              const isIncome = item.type === 'income';

              return (
                <tr 
                  key={item.id} 
                  className={`border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${
                    index === paginatedItems.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-200 font-medium">
                    {item.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white ${category?.color || 'bg-slate-500'}`}>
                      {category?.name || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                    {wallet?.name || 'Unknown'}
                  </td>
                  <td className={`py-3 px-4 text-right font-bold ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">{formatDate(item.date)}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="rounded-xl p-2 text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 active:scale-90 transition-all"
                        title={t('edit')}
                      >
                        <Pencil size={16} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="rounded-xl p-2 text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/20 active:scale-90 transition-all"
                        title={t('delete')}
                      >
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {t('page')} <span className="text-indigo-700 dark:text-indigo-300">{currentPage}</span> {t('of')} {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-indigo-600 dark:text-indigo-300 hover:bg-slate-50 dark:hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white dark:disabled:opacity-30 dark:disabled:hover:bg-white/5 transition-all shadow-sm active:scale-95"
            >
              <ChevronLeft size={18} strokeWidth={3} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-indigo-600 dark:text-indigo-300 hover:bg-slate-50 dark:hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white dark:disabled:opacity-30 dark:disabled:hover:bg-white/5 transition-all shadow-sm active:scale-95"
            >
              <ChevronRight size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}