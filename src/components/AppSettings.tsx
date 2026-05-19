import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../hooks/useTheme';
import { useCurrency, CURRENCIES } from '../hooks/useCurrency';

export default function AppSettings({ isVertical = false }: { isVertical?: boolean }) {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const [showCurrency, setShowCurrency] = useState(false);

  return (
    <div className={`flex ${isVertical ? 'flex-col items-stretch' : 'flex-wrap items-center'} gap-2 w-full sm:w-auto`}>
      {/* Theme */}
      <div className={`relative ${isVertical ? 'w-full' : ''}`}>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
          className={`capitalize ${isVertical ? 'w-full' : ''} appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/70 py-2 pl-3 pr-8 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          <option value="light">☀️ {t('theme_light')}</option>
          <option value="dark">🌙 {t('theme_dark')}</option>
          <option value="system">💻 {t('theme_system')}</option>
        </select>
        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400 text-xs">▼</span>
      </div>

      {/* Language */}
      <div className={`relative ${isVertical ? 'w-full' : ''}`}>
        <select
          value={i18n.resolvedLanguage || 'id'}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className={`capitalize ${isVertical ? 'w-full' : ''} appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/70 py-2 pl-3 pr-8 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          <option value="id">🇮🇩 ID</option>
          <option value="en">🇬🇧 EN</option>
          <option value="zh">🇨🇳 ZH</option>
          <option value="es">🇪🇸 ES</option>
          <option value="ja">🇯🇵 JA</option>
          <option value="ar">🇸🇦 AR</option>
        </select>
        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400 text-xs">▼</span>
      </div>

      {/* Currency */}
      <div className={`relative ${isVertical ? 'w-full' : ''}`}>
        <button
          onClick={() => setShowCurrency(!showCurrency)}
          className={`${isVertical ? 'w-full justify-between' : ''} flex items-center gap-1 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/70 py-2 pl-3 pr-8 text-xs font-bold text-indigo-600 dark:text-indigo-300 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/90 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          <span>💰 {currency.code}</span>
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400 text-xs">▼</span>
        </button>
        {showCurrency && (
          <div className="absolute top-full right-0 mt-2 z-50 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/20 rounded-xl shadow-xl overflow-hidden">
            <div className="p-2 border-b border-slate-100 dark:border-white/10">
              <p className="text-xs font-bold text-slate-400 uppercase px-2">{t('currency')}</p>
            </div>
            <div className="max-h-64 overflow-y-auto p-1">
              {CURRENCIES.map(curr => (
                <button
                  key={curr.code}
                  onClick={() => {
                    setCurrency(curr);
                    setShowCurrency(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors ${
                    currency.code === curr.code
                      ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span className="text-base">{curr.symbol}</span>
                  <span>{curr.code}</span>
                  {currency.code === curr.code && <span className="ml-auto text-indigo-400">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}