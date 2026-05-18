import { useState, useMemo } from 'react';
import type { SpendItem } from '../types';
import { formatCurrency } from '../utils/format';

interface BudgetProgressProps {
  items: SpendItem[];
  budgetLimit: number;
  setBudgetLimit: (limit: number) => void;
}

export default function BudgetProgress({ items, budgetLimit, setBudgetLimit }: BudgetProgressProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(budgetLimit.toString());

  // Hitung total pengeluaran khusus di bulan ini saja
  const currentMonthTotal = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return items.reduce((total, item) => {
      const itemDate = new Date(item.date);
      if (itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear) {
        return total + item.amount;
      }
      return total;
    }, 0);
  }, [items]);

  const percentage = budgetLimit > 0 ? Math.min((currentMonthTotal / budgetLimit) * 100, 100) : 0;
  
  // Tentukan warna progress bar
  let progressColor = 'bg-teal-400';
  if (percentage >= 90) {
    progressColor = 'bg-rose-500';
  } else if (percentage >= 75) {
    progressColor = 'bg-amber-400';
  }

  const handleSaveBudget = () => {
    const value = parseInt(tempBudget.replace(/[^0-9]/g, ''), 10);
    setBudgetLimit(isNaN(value) ? 0 : value);
    setIsEditing(false);
  };

  return (
    <div className="mb-8 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-6 shadow-2xl shadow-black/50 sm:p-8 animate-slide-up opacity-0" style={{ animationDelay: '150ms' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <span>🎯</span> Anggaran Bulan Ini
        </h2>
        
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
              className="w-32 rounded-xl border border-white/10 bg-slate-800 py-1.5 px-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
              placeholder="Rp 0"
              autoFocus
            />
            <button
              onClick={handleSaveBudget}
              className="rounded-xl bg-indigo-500/20 px-3 py-1.5 text-sm font-medium text-indigo-300 hover:bg-indigo-500/30"
            >
              Simpan
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-400">
              Limit: <span className="text-slate-200">{budgetLimit > 0 ? formatCurrency(budgetLimit) : 'Belum diatur'}</span>
            </span>
            <button
              onClick={() => {
                setTempBudget(budgetLimit.toString());
                setIsEditing(true);
              }}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
              title="Atur Anggaran"
            >
              ✏️
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-slate-300">
            Terpakai: {formatCurrency(currentMonthTotal)}
          </span>
          <span className="font-medium text-slate-300">
            {budgetLimit > 0 ? `${percentage.toFixed(1)}%` : '0%'}
          </span>
        </div>
        
        <div className="h-4 w-full overflow-hidden rounded-full bg-slate-800/80 shadow-inner">
          <div
            className={`h-full transition-all duration-1000 ease-out ${progressColor}`}
            style={{ width: `${budgetLimit > 0 ? percentage : 0}%` }}
          />
        </div>
        
        {budgetLimit > 0 && percentage >= 100 && (
          <p className="text-xs text-rose-400 mt-2 font-medium">
            ⚠️ Pengeluaran Anda sudah melebihi batas anggaran!
          </p>
        )}
        {budgetLimit > 0 && percentage >= 75 && percentage < 100 && (
          <p className="text-xs text-amber-400 mt-2 font-medium">
            ⚠️ Hati-hati, pengeluaran mendekati batas anggaran!
          </p>
        )}
      </div>
    </div>
  );
}
