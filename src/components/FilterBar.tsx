import { useTranslation } from 'react-i18next';

import type { DateFilterType } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  dateFilter: DateFilterType;
  onDateFilterChange: (val: DateFilterType) => void;
}

export default function FilterBar({ searchQuery, onSearchChange, dateFilter, onDateFilterChange }: FilterBarProps) {
  const { t } = useTranslation();
  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-4 animate-slide-up opacity-0" style={{ animationDelay: '50ms' }}>
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 text-lg">🔍</span>
        <input
          type="text"
          placeholder={t('search_placeholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-2xl border border-slate-300 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 py-3 pl-12 pr-4 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 backdrop-blur-xl transition-colors focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900/80 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-xl dark:shadow-black/20"
        />
      </div>
      <div className="relative">
        <select
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value as DateFilterType)}
          className="w-full appearance-none rounded-2xl border border-slate-300 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 py-3 pl-4 pr-10 text-slate-800 dark:text-slate-200 backdrop-blur-xl transition-colors focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900/80 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-48 shadow-xl dark:shadow-black/20 cursor-pointer"
        >
          <option value="month">{t('filter_month')}</option>
          <option value="week">{t('filter_week')}</option>
          <option value="today">{t('filter_today')}</option>
          <option value="all">{t('filter_all')}</option>
        </select>
        <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-500 text-xs">
          ▼
        </span>
      </div>
    </div>
  );
}
