import { useState, useEffect } from 'react';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { SpendItem } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { ITEMS_PER_PAGE } from '../constants';

interface SpendListProps {
  items: SpendItem[];
  onEdit: (item: SpendItem) => void;
  onDelete: (id: string) => void;
}

export default function SpendList({ items, onEdit, onDelete }: SpendListProps) {
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
      <div className="text-center py-10 rounded-2xl border-2 border-dashed border-white/10 bg-black/20">
        <p className="text-indigo-300 font-bold text-lg mb-1">Kosong nih! 🍃</p>
        <p className="text-indigo-300/60 text-sm">Belum ada pengeluaran yang dicatat.</p>
      </div>
    );
  }

  const paginatedItems = items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20 shadow-inner">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-indigo-300">
              <th className="text-left py-3 px-4 font-bold">Nama</th>
              <th className="text-right py-3 px-4 font-bold">Nominal</th>
              <th className="text-left py-3 px-4 font-bold">Tanggal</th>
              <th className="text-center py-3 px-4 font-bold w-24">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item, index) => (
              <tr 
                key={item.id} 
                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                  index === paginatedItems.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <td className="py-3 px-4 text-slate-200 font-medium">{item.name}</td>
                <td className="py-3 px-4 text-right font-bold text-white">
                  {formatCurrency(item.amount)}
                </td>
                <td className="py-3 px-4 text-slate-400 font-medium">{formatDate(item.date)}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="rounded-xl p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 active:scale-90 transition-all"
                      title="Ubah"
                    >
                      <Pencil size={16} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="rounded-xl p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 active:scale-90 transition-all"
                      title="Hapus"
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-sm font-bold text-indigo-400">
            Hal. <span className="text-indigo-300">{currentPage}</span> dari {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-indigo-300 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all shadow-sm active:scale-95"
            >
              <ChevronLeft size={18} strokeWidth={3} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-indigo-300 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all shadow-sm active:scale-95"
            >
              <ChevronRight size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
