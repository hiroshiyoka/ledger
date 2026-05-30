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
      <div className="text-center py-12 rounded-lg border-2 border-dashed border-hairline-strong">
        <p className="text-body-lg font-[500] text-ash mb-1">{t('empty_list')} 🍃</p>
        <p className="text-base text-ash">{t('no_expenses')}</p>
      </div>
    );
  }

  const paginatedItems = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-hairline-strong bg-surface-card">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-hairline text-mute">
              <th className="text-left py-4 px-5 font-[500]">{t('name')}</th>
              <th className="text-left py-4 px-5 font-[500]">{t('category')}</th>
              <th className="text-left py-4 px-5 font-[500]">{t('wallet')}</th>
              <th className="text-right py-4 px-5 font-[500]">{t('amount')}</th>
              <th className="text-left py-4 px-5 font-[500]">{t('date')}</th>
              <th className="text-center py-4 px-5 font-[500] w-28">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item, index) => {
              const category = categories.find(c => c.id === item.categoryId);
              const wallet = wallets.find(w => w.id === item.walletId);
              const isIncome = item.type === 'income';

              return (
                <tr key={item.id} className={`border-b border-hairline  hover:bg-surface-elevated  transition-colors ${index === paginatedItems.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="py-4 px-5 font-[500] text-body">{item.name}</td>
                  <td className="py-4 px-5">
                    <span className="inline-flex px-[10px] py-[4px] rounded-full text-caption font-[400] text-body bg-surface-elevated">
                      {category?.name || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-mute">{wallet?.name || 'Unknown'}</td>
                  <td className={`py-4 px-5 text-right font-[500] text-body-lg ${isIncome ? 'text-accent-green' : 'text-ink'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
                  </td>
                  <td className="py-4 px-5 text-mute font-[500]">{formatDate(item.date)}</td>
                  <td className="py-4 px-5">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => onEdit(item)} className="p-2 rounded-lg text-accent-blue hover:text-ink hover:bg-surface-elevated transition-all" title={t('edit')}>
                        <Pencil size={18} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => onDelete(item.id)} className="p-2 rounded-lg text-accent-red hover:text-ink hover:bg-surface-elevated transition-all" title={t('delete')}>
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
          <span className="text-base font-[500] text-mute">
            {t('page')} <span className="font-[500] text-body">{currentPage}</span> {t('of')} <span className="font-[500] text-body">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
              className="p-2.5 rounded-lg bg-surface-card border border-hairline-strong text-charcoal hover:bg-surface-elevated disabled:opacity-40 transition-all">
              <ChevronLeft size={20} strokeWidth={3} />
            </button>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
              className="p-2.5 rounded-lg bg-surface-card border border-hairline-strong text-charcoal hover:bg-surface-elevated disabled:opacity-40 transition-all">
              <ChevronRight size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}