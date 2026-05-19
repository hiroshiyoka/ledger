import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { ITEMS_PER_PAGE } from '../constants';
import { useCategories } from '../hooks/useCategories';
import { useWallets } from '../hooks/useWallets';

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
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [items.length, totalPages, currentPage]);

  if (items.length === 0) {
    return (
      <div className="text-center py-12 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/10">
        <p className="text-lg font-bold text-slate-400 dark:text-slate-500 mb-1">{t('empty_list')} 🍃</p>
        <p className="text-base text-slate-400/60">{t('no_expenses')}</p>
      </div>
    );
  }

  const paginatedItems = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 shadow-sm">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/10 text-slate-500 dark:text-slate-400">
              <th className="text-left py-4 px-5 font-bold">{t('name')}</th>
              <th className="text-left py-4 px-5 font-bold">{t('category')}</th>
              <th className="text-left py-4 px-5 font-bold">{t('wallet')}</th>
              <th className="text-right py-4 px-5 font-bold">{t('amount')}</th>
              <th className="text-left py-4 px-5 font-bold">{t('date')}</th>
              <th className="text-center py-4 px-5 font-bold w-28">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item, index) => {
              const category = categories.find(c => c.id === item.categoryId);
              const wallet = wallets.find(w => w.id === item.walletId);
              const isIncome = item.type === 'income';

              return (
                <tr key={item.id} className={`border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${index === paginatedItems.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="py-4 px-5 font-medium text-slate-700 dark:text-slate-200">{item.name}</td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium text-white ${category?.color || 'bg-slate-500'}`}>
                      {category?.name || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-500 dark:text-slate-400">{wallet?.name || 'Unknown'}</td>
                  <td className={`py-4 px-5 text-right font-bold text-lg ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
                  </td>
                  <td className="py-4 px-5 text-slate-500 dark:text-slate-400 font-medium">{formatDate(item.date)}</td>
                  <td className="py-4 px-5">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => onEdit(item)} className="p-2 rounded-lg text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 transition-all" title={t('edit')}>
                        <Pencil size={18} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => onDelete(item.id)} className="p-2 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/20 transition-all" title={t('delete')}>
                        <Trash2 size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-base font-medium text-slate-500 dark:text-slate-400">
            {t('page')} <span className="font-bold text-slate-700 dark:text-slate-200">{currentPage}</span> {t('of')} <span className="font-bold text-slate-700 dark:text-slate-200">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-all">
              <ChevronLeft size={20} strokeWidth={3} />
            </button>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 transition-all">
              <ChevronRight size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}