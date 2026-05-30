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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-card p-4 rounded-lg border border-hairline-strong">
        <h2 className="text-heading-sm font-[500] text-ink">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-surface-elevated transition-colors text-charcoal">
            ◀
          </button>
          <button onClick={goToday} className="px-4 py-2 rounded-lg hover:bg-surface-elevated transition-colors text-body-sm font-[500] text-charcoal">
            {t('filter_today') || 'Today'}
          </button>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-surface-elevated transition-colors text-charcoal">
            ▶
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-surface-card rounded-lg border border-hairline-strong overflow-hidden">
        <div className="grid grid-cols-7 border-b border border-hairline-strong bg-surface-card">
          {WEEKDAYS.map(wd => (
            <div key={wd} className="py-3 text-center text-caption font-[500] text-mute uppercase tracking-wider">
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
                  relative min-h-[5rem] sm:min-h-[6rem] p-1 sm:p-2 border-r border-b border border-hairline  transition-all text-left flex flex-col hover:bg-surface-elevated  focus:outline-none
                  ${!isCurrentMonth ? 'opacity-40 bg-canvas/50 bg-canvas' : ''}
                  ${isSelected ? 'ring-2 ring-inset ring-ink bg-surface-elevated  z-10' : ''}
                `}
              >
                <div className={`
                  w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-caption sm:text-body-sm font-[500] mb-1
                  ${isToday ? 'bg-primary text-primary-on shadow-none' : 'text-body '}
                `}>
                  {d.getDate()}
                </div>
                
                {dayData && (
                  <div className="flex flex-col gap-0.5 mt-auto w-full">
                    {dayData.income > 0 && (
                      <div className="text-[10px] sm:text-caption font-[500] text-accent-green bg-surface-card px-1 rounded truncate w-full" title={`+${dayData.income}`}>
                        +{formatCurrency(dayData.income, currency)}
                      </div>
                    )}
                    {dayData.expense > 0 && (
                      <div className="text-[10px] sm:text-caption font-[500] text-rose-600 bg-rose-50 px-1 rounded truncate w-full" title={`-${dayData.expense}`}>
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
        <div className="rounded-lg border border-hairline-strong bg-surface-card p-6 mt-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-body-lg font-[500] text-ink flex items-center gap-2">
              📅 {new Date(selectedDate).toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
            <button onClick={() => setSelectedDate(null)} className="text-ash hover:text-charcoal">
              ✕
            </button>
          </div>
          
          {selectedItems.length > 0 ? (
            <SpendList items={selectedItems} onEdit={onEdit} onDelete={onDelete} />
          ) : (
            <div className="text-center py-10 text-mute">
              <p>📭 {t('no_data') || 'No transactions on this date.'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
