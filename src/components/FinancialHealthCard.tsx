import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, TrendingUp, Shield, BarChart3, PiggyBank, Settings } from 'lucide-react';

import type { Transaction } from '../types';
import { useFinancialHealth } from '../hooks/useFinancialHealth';

interface FinancialHealthCardProps {
  items: Transaction[];
  budgetLimit: number;
}

function CircularScore({ score, grade, gradeColor }: { score: number; grade: string; gradeColor: string }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const trackColor = score >= 85 ? '#10b981' : score >= 70 ? '#3b82f6' : score >= 50 ? '#f59e0b' : score >= 30 ? '#f97316' : '#f43f5e';

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
        <circle
          cx="64" cy="64" r={radius}
          fill="none" stroke={trackColor}
          strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-black ${gradeColor}`}>{grade}</span>
        <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">{score}</span>
      </div>
    </div>
  );
}

function MetricBar({ label, score, value, icon, format }: {
  label: string;
  score: number;
  value: number;
  icon: React.ReactNode;
  format: (v: number) => string;
}) {
  const barColor = score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500';
  const barWidth = Math.max(4, (score / 100) * 100);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          {icon}
          <span>{label}</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{format(value)}</span>
          <span className="text-[10px] text-slate-400 ml-1">/ {score}/100</span>
        </div>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${barWidth}%` }} />
      </div>
    </div>
  );
}

export default function FinancialHealthCard({ items, budgetLimit }: FinancialHealthCardProps) {
  const { t } = useTranslation();
  const health = useFinancialHealth(items, budgetLimit);
  const [showSettings, setShowSettings] = useState(false);

  const formatPct = (v: number) => `${(v * 100).toFixed(1)}%`;
  const formatMonths = (v: number) => `${v.toFixed(1)}mo`;
  const formatRatio = (v: number) => v > 0 ? `${(v * 100).toFixed(0)}%` : 'N/A';

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 shadow-md transition-all hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/30 shadow-sm text-rose-500">
            <Heart size={24} strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold text-slate-600 dark:text-slate-200">
            {t('financial_health') || 'Financial Health'}
          </span>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Settings size={18} strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Score Circle */}
        <CircularScore score={health.overallScore} grade={health.grade} gradeColor={health.gradeColor} />

        {/* Metrics */}
        <div className="flex-1 w-full space-y-3">
          <MetricBar
            label={health.savingsRate.label}
            score={health.savingsRate.score}
            value={health.savingsRate.value}
            icon={<TrendingUp size={14} />}
            format={formatPct}
          />
          <MetricBar
            label={health.emergencyFund.label}
            score={health.emergencyFund.score}
            value={health.emergencyFund.value}
            icon={<Shield size={14} />}
            format={formatMonths}
          />
          <MetricBar
            label={health.consistency.label}
            score={health.consistency.score}
            value={health.consistency.value}
            icon={<BarChart3 size={14} />}
            format={formatRatio}
          />
          <MetricBar
            label={health.budgetAdherence.label}
            score={health.budgetAdherence.score}
            value={health.budgetAdherence.value}
            icon={<PiggyBank size={14} />}
            format={formatRatio}
          />
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-white/10 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('settings') || 'Settings'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                💰 {t('savings_amount') || 'Current Savings Amount'}
              </label>
              <input
                type="number"
                value={health.settings.savingsAmount}
                onChange={(e) => health.setSavingsAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/70 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                📊 {t('monthly_expense_target') || 'Monthly Expense Target'}
              </label>
              <input
                type="number"
                value={health.settings.monthlyExpenseTarget}
                onChange={(e) => health.setMonthlyExpenseTarget(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/70 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
