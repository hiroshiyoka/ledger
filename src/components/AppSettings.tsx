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
    <div className={`flex ${isVertical ? 'flex flex-col items-stretch' : 'flex-wrap items-center'} gap-2 w-full sm:w-auto`}>
      {/* Theme */}
      <div className={`relative ${isVertical ? 'w-full' : ''}`}>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
          className={`capitalize ${isVertical ? 'w-full' : ''} appearance-none rounded-lg border border-hairline-strong  bg-surface-card bg-surface-elevated py-2 pl-3 pr-8 text-caption font-[500] text-charcoal  transition-colors cursor-pointer focus:outline-none focus:border-ink`}
        >
          <option value="light">☀️ {t('theme_light')}</option>
          <option value="dark">🌙 {t('theme_dark')}</option>
          <option value="system">💻 {t('theme_system')}</option>
        </select>
        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-ash text-caption">▼</span>
      </div>

      {/* Language */}
      <div className={`relative ${isVertical ? 'w-full' : ''}`}>
        <select
          value={i18n.resolvedLanguage || 'id'}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className={`capitalize ${isVertical ? 'w-full' : ''} appearance-none rounded-lg border border-hairline-strong  bg-surface-card bg-surface-elevated py-2 pl-3 pr-8 text-caption font-[500] text-charcoal  transition-colors cursor-pointer focus:outline-none focus:border-ink`}
        >
          <option value="id">🇮🇩 ID</option>
          <option value="en">🇬🇧 EN</option>
          <option value="zh">🇨🇳 ZH</option>
          <option value="es">🇪🇸 ES</option>
          <option value="ja">🇯🇵 JA</option>
          <option value="ar">🇸🇦 AR</option>
        </select>
        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-ash text-caption">▼</span>
      </div>

      {/* Currency */}
      <div className={`relative ${isVertical ? 'w-full' : ''}`}>
        <button
          onClick={() => setShowCurrency(!showCurrency)}
          className={`${isVertical ? 'w-full justify-between' : ''} flex items-center gap-1 rounded-lg border border-hairline-strong  bg-surface-card bg-surface-elevated py-2 pl-3 pr-8 text-caption font-[500] text-primary-on  transition-colors hover:bg-surface-elevated  focus:outline-none focus:border-ink`}
        >
          <span>💰 {currency.code}</span>
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-ash text-caption">▼</span>
        </button>
        {showCurrency && (
          <div className="absolute top-full right-0 mt-2 z-50 w-56 bg-surface-card border border-hairline-strong rounded-lg overflow-hidden">
            <div className="p-2 border-b border border-hairline">
              <p className="text-caption font-[500] text-ash uppercase px-2">{t('currency')}</p>
            </div>
            <div className="max-h-64 overflow-y-auto p-1">
              {CURRENCIES.map(curr => (
                <button
                  key={curr.code}
                  onClick={() => {
                    setCurrency(curr);
                    setShowCurrency(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-caption rounded-lg transition-colors ${
                    currency.code === curr.code
                      ? 'bg-surface-elevated  text-accent-blue  font-[500]'
                      : 'text-charcoal  hover:bg-surface-elevated '
                  }`}
                >
                  <span className="text-base">{curr.symbol}</span>
                  <span>{curr.code}</span>
                  {currency.code === curr.code && <span className="ml-auto text-accent-blue">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}