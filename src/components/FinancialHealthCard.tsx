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

  const trackColor = score >= 85 ? '#11ff99' : score >= 70 ? '#3b9eff' : score >= 50 ? '#ffc53d' : score >= 30 ? '#ff801f' : '#ff2047';

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-elevated" />
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
        <span className={`text-4xl font-[500] ${gradeColor.replace('rose-500', 'accent-red').replace('amber-500', 'accent-yellow').replace('emerald-500', 'accent-green').replace('blue-500', 'accent-blue')}`} style={{color: trackColor}}>{grade}</span>
        <span className="text-heading-md font-[500] text-body">{score}</span>
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
  const barColor = score >= 80 ? 'bg-accent-green' : score >= 50 ? 'bg-accent-yellow' : 'bg-accent-red';
  const barWidth = Math.max(4, (score / 100) * 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-body-sm font-[500] text-mute">
          {icon}
          <span className="capitalize">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-body-sm font-[500] text-body">{format(value)}</span>
          <span className="text-caption text-ash ml-1.5">/ {score}/100</span>
        </div>
      </div>
      <div className="h-2.5 bg-surface-elevated rounded-full overflow-hidden">
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
    <div className="rounded-lg border border-hairline-strong bg-surface-card p-6 transition-all hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-surface-elevated text-accent-red">
            <Heart size={24} strokeWidth={2.5} />
          </div>
          <span className="text-body-lg font-[500] text-charcoal capitalize">
            {t('financial_health')}
          </span>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg text-ash hover:text-charcoal hover:bg-surface-elevated transition-colors"
        >
          <Settings size={18} strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Score Circle */}
        <CircularScore score={health.overallScore} grade={health.grade} gradeColor={health.gradeColor} />

        {/* Metrics */}
        <div className="flex-1 w-full space-y-4">
          <MetricBar
            label={t(health.savingsRate.labelKey)}
            score={health.savingsRate.score}
            value={health.savingsRate.value}
            icon={<TrendingUp size={16} />}
            format={formatPct}
          />
          <MetricBar
            label={t(health.emergencyFund.labelKey)}
            score={health.emergencyFund.score}
            value={health.emergencyFund.value}
            icon={<Shield size={16} />}
            format={formatMonths}
          />
          <MetricBar
            label={t(health.consistency.labelKey)}
            score={health.consistency.score}
            value={health.consistency.value}
            icon={<BarChart3 size={16} />}
            format={formatRatio}
          />
          <MetricBar
            label={t(health.budgetAdherence.labelKey)}
            score={health.budgetAdherence.score}
            value={health.budgetAdherence.value}
            icon={<PiggyBank size={16} />}
            format={formatRatio}
          />
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-5 pt-5 border-t border-hairline space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
          <p className="text-body-sm font-[500] text-ash uppercase tracking-wider">{t('settings')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-body-sm font-[500] text-mute mb-1.5">
                💰 {t('savings_amount')}
              </label>
              <input
                type="number"
                value={health.settings.savingsAmount}
                onChange={(e) => health.setSavingsAmount(Number(e.target.value))}
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-4 py-2.5 text-body-sm text-ink focus:outline-none focus:border-ink"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-body-sm font-[500] text-mute mb-1.5">
                🎯 {t('monthly_expense_target')}
              </label>
              <input
                type="number"
                value={health.settings.monthlyExpenseTarget}
                onChange={(e) => health.setMonthlyExpenseTarget(Number(e.target.value))}
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-4 py-2.5 text-body-sm text-ink focus:outline-none focus:border-ink"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
