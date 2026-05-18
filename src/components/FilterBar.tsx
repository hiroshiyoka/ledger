import type { DateFilterType } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  dateFilter: DateFilterType;
  onDateFilterChange: (val: DateFilterType) => void;
}

export default function FilterBar({ searchQuery, onSearchChange, dateFilter, onDateFilterChange }: FilterBarProps) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-4 animate-slide-up opacity-0" style={{ animationDelay: '50ms' }}>
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 text-lg">🔍</span>
        <input
          type="text"
          placeholder="Cari pengeluaran..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-slate-900/50 py-3 pl-12 pr-4 text-slate-200 placeholder-slate-500 backdrop-blur-xl transition-colors focus:border-indigo-500 focus:bg-slate-900/80 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-xl shadow-black/20"
        />
      </div>
      <div className="relative">
        <select
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value as DateFilterType)}
          className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-900/50 py-3 pl-4 pr-10 text-slate-200 backdrop-blur-xl transition-colors focus:border-indigo-500 focus:bg-slate-900/80 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-48 shadow-xl shadow-black/20 cursor-pointer"
        >
          <option value="month">Bulan Ini</option>
          <option value="week">7 Hari Terakhir</option>
          <option value="today">Hari Ini</option>
          <option value="all">Semua Waktu</option>
        </select>
        <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-500 text-xs">
          ▼
        </span>
      </div>
    </div>
  );
}
