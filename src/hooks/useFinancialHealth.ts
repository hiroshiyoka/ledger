import { useState, useEffect, useMemo } from 'react';

import type { Transaction, FinancialHealthSettings } from '../types';

interface MetricResult {
  score: number;
  value: number;
  maxValue: number;
  label: string;
}

interface FinancialHealthResult {
  overallScore: number;
  grade: string;
  gradeColor: string;
  savingsRate: MetricResult;
  emergencyFund: MetricResult;
  consistency: MetricResult;
  budgetAdherence: MetricResult;
  settings: FinancialHealthSettings;
  setSavingsAmount: (amount: number) => void;
  setMonthlyExpenseTarget: (amount: number) => void;
}

function calculateScore(value: number, thresholds: [number, number][], defaultValue = 0): number {
  for (const [threshold, score] of thresholds) {
    if (value >= threshold) return score;
  }
  return defaultValue;
}

function getGrade(score: number): { grade: string; color: string } {
  if (score >= 85) return { grade: 'A', color: 'text-emerald-500' };
  if (score >= 70) return { grade: 'B', color: 'text-blue-500' };
  if (score >= 50) return { grade: 'C', color: 'text-amber-500' };
  if (score >= 30) return { grade: 'D', color: 'text-orange-500' };

  return { grade: 'F', color: 'text-rose-500' };
}

function getMonthlyData(items: Transaction[], months: number) {
  const now = new Date();
  const monthlyMap: Record<string, { income: number; expense: number }> = {};

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyMap[key] = { income: 0, expense: 0 };
  }

  items.forEach(item => {
    const key = item.date.slice(0, 7);

    if (monthlyMap[key]) {
      if (item.type === 'income') monthlyMap[key].income += item.amount;
      else monthlyMap[key].expense += item.amount;
    }
  });

  return monthlyMap;
}

const SETTINGS_KEY = 'ledger-financial-health-settings';

function loadSettings(): FinancialHealthSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { savingsAmount: 0, monthlyExpenseTarget: 0 };
}

function saveSettings(settings: FinancialHealthSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function useFinancialHealth(items: Transaction[], budgetLimit: number): FinancialHealthResult {
  const [settings, setSettings] = useState<FinancialHealthSettings>(loadSettings);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const setSavingsAmount = (amount: number) => {
    setSettings(prev => ({ ...prev, savingsAmount: amount }));
  };

  const setMonthlyExpenseTarget = (amount: number) => {
    setSettings(prev => ({ ...prev, monthlyExpenseTarget: amount }));
  };

  return useMemo(() => {
    const monthlyData = getMonthlyData(items, 6);
    const monthKeys = Object.keys(monthlyData);
    const recentMonths = monthKeys.slice(-3);

    let totalIncome = 0;
    let totalExpense = 0;
    recentMonths.forEach(key => {
      totalIncome += monthlyData[key].income;
      totalExpense += monthlyData[key].expense;
    });

    const avgMonthlyIncome = recentMonths.length > 0 ? totalIncome / recentMonths.length : 0;
    const avgMonthlyExpense = recentMonths.length > 0 ? totalExpense / recentMonths.length : 0;

    const savingsRateValue = avgMonthlyIncome > 0 ? (avgMonthlyIncome - avgMonthlyExpense) / avgMonthlyIncome : 0;
    const savingsRateScore = avgMonthlyIncome > 0
      ? calculateScore(savingsRateValue, [[0.3, 100], [0.2, 80], [0.1, 50], [0, 20], [-Infinity, 0]])
      : 0;

    const emFundMonths = avgMonthlyExpense > 0 ? settings.savingsAmount / avgMonthlyExpense : 0;
    const emFundScore = settings.savingsAmount > 0
      ? calculateScore(emFundMonths, [[6, 100], [3, 80], [1, 40], [0, 10]])
      : 0;

    const expenses = monthKeys.map(k => monthlyData[k].expense);
    const mean = expenses.reduce((a, b) => a + b, 0) / expenses.length;
    const variance = expenses.reduce((a, b) => a + (b - mean) ** 2, 0) / expenses.length;
    const stdDev = Math.sqrt(variance);
    const cv = mean > 0 ? stdDev / mean : 0;
    const consistencyScore = expenses.length > 0
      ? calculateScore(cv, [[0, 100], [0.15, 80], [0.25, 50], [0.4, 20], [Infinity, 0]])
      : 100;

    const currentMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const currentExpense = monthlyData[currentMonthKey]?.expense || 0;
    const budgetRatio = budgetLimit > 0 ? currentExpense / budgetLimit : 0;
    const budgetScore = budgetLimit > 0
      ? calculateScore(budgetRatio, [[0, 100], [0.8, 70], [1, 40], [Infinity, 10]])
      : 50;

    const overallScore = Math.round(
      savingsRateScore * 0.30 +
      emFundScore * 0.25 +
      consistencyScore * 0.20 +
      budgetScore * 0.25
    );

    const { grade, color } = getGrade(overallScore);

    return {
      overallScore,
      grade,
      gradeColor: color,
      savingsRate: {
        score: savingsRateScore,
        value: savingsRateValue,
        maxValue: 1,
        label: 'Savings Rate',
      },
      emergencyFund: {
        score: emFundScore,
        value: emFundMonths,
        maxValue: 12,
        label: 'Emergency Fund',
      },
      consistency: {
        score: consistencyScore,
        value: cv,
        maxValue: 1,
        label: 'Consistency',
      },
      budgetAdherence: {
        score: budgetScore,
        value: budgetRatio,
        maxValue: 1,
        label: 'Budget Adherence',
      },
      settings,
      setSavingsAmount,
      setMonthlyExpenseTarget,
    };
  }, [items, budgetLimit, settings]);
}
