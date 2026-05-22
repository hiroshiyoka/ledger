import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import SpendList from './SpendList';

import type { Transaction } from '../types';
import { formatCurrency } from '../utils/format';
import { useCurrency } from '../hooks/useCurrency';

interface CalendarViewProps {
  items: Transaction[];
  onEdit: (item: Transaction) => void;
  onDelete: (id: string) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView({ items, onEdit, onDelete }: CalendarViewProps) {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const toISODate = (d: Date) => {
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');

    return `${yr}-${mo}-${da}`;
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const days = useMemo(() => {
    const arr = [];
    const start = new Date(currentYear, currentMonth, 1);
    const startDay = start.getDay(); 
    const calendarStart = new Date(currentYear, currentMonth, 1 - startDay);

    for (let i = 0; i < 42; i++) {
      const d = new Date(calendarStart);
      d.setDate(d.getDate() + i);
      arr.push(d);
    }

    return arr;
  }, [currentYear, currentMonth]);

  const aggregated = useMemo(() => {
    const acc: Record<string, { income: number; expense: number; items: Transaction[] }> = {};
    items.forEach(item => {
      if (!acc[item.date]) {
        acc[item.date] = { income: 0, expense: 0, items: [] };
      }

      if (item.type === 'income') acc[item.date].income += item.amount;
      
      if (item.type === 'expense') acc[item.date].expense += item.amount;
      
      acc[item.date].items.push(item);
    });
    
    return acc;
  }, [items]);

  const selectedItems = selectedDate && aggregated[selectedDate] ? aggregated[selectedDate].items : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
            ◀
          </button>
          <button onClick={goToday} className="px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-bold text-slate-600 dark:text-slate-300">
            {t('filter_today') || 'Today'}
          </button>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
            ▶
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50">
          {WEEKDAYS.map(wd => (
            <div key={wd} className="py-3 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {wd}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-fr">
          {days.map((d, i) => {
            const iso = toISODate(d);
            const isCurrentMonth = d.getMonth() === currentMonth;
            const isToday = iso === toISODate(new Date());
            const isSelected = iso === selectedDate;
            const dayData = aggregated[iso];

            return (
              <button
                key={iso + i}
                onClick={() => setSelectedDate(iso)}
                className={`
                  relative min-h-[5rem] sm:min-h-[6rem] p-1 sm:p-2 border-r border-b border-slate-100 dark:border-white/5 transition-all text-left flex flex-col hover:bg-slate-50 dark:hover:bg-slate-800/50 focus:outline-none
                  ${!isCurrentMonth ? 'opacity-40 bg-slate-50/50 dark:bg-slate-950/20' : ''}
                  ${isSelected ? 'ring-2 ring-inset ring-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/20 z-10' : ''}
                `}
              >
                <div className={`
                  w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold mb-1
                  ${isToday ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300'}
                `}>
                  {d.getDate()}
                </div>
                
                {dayData && (
                  <div className="flex flex-col gap-0.5 mt-auto w-full">
                    {dayData.income > 0 && (
                      <div className="text-[10px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1 rounded truncate w-full" title={`+${dayData.income}`}>
                        +{formatCurrency(dayData.income, currency)}
                      </div>
                    )}
                    {dayData.expense > 0 && (
                      <div className="text-[10px] sm:text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-1 rounded truncate w-full" title={`-${dayData.expense}`}>
                        -{formatCurrency(dayData.expense, currency)}
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDate && (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 shadow-md mt-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              📅 {new Date(selectedDate).toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
            <button onClick={() => setSelectedDate(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              ✕
            </button>
          </div>
          
          {selectedItems.length > 0 ? (
            <SpendList items={selectedItems} onEdit={onEdit} onDelete={onDelete} />
          ) : (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
              <p>📭 {t('no_data') || 'No transactions on this date.'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
