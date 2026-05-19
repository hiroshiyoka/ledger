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
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">🔍</span>
        <input
          type="text"
          placeholder={t('search_placeholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>
      <div className="relative">
        <select
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value as DateFilterType)}
          className="appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 py-2.5 pl-4 pr-8 text-sm text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        >
          <option value="month">{t('filter_month')}</option>
          <option value="week">{t('filter_week')}</option>
          <option value="today">{t('filter_today')}</option>
          <option value="all">{t('filter_all')}</option>
        </select>
        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400 text-xs">▼</span>
      </div>
    </div>
  );
}