import { useTranslation } from 'react-i18next';

import { useTheme } from '../hooks/useTheme';

export default function AppSettings() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as 'light' | 'dark' | 'system');
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0">
      <div className="relative">
        <select
          value={theme}
          onChange={handleThemeChange}
          className="appearance-none rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-800/50 py-2 pl-3 pr-8 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors focus:border-indigo-500 focus:outline-none cursor-pointer"
        >
          <option value="light">☀️ {t('theme_light')}</option>
          <option value="dark">🌙 {t('theme_dark')}</option>
          <option value="system">💻 {t('theme_system')}</option>
        </select>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-500 text-xs">
          ▼
        </span>
      </div>

      <div className="relative">
        <select
          value={i18n.resolvedLanguage || 'id'}
          onChange={handleLangChange}
          className="appearance-none rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-800/50 py-2 pl-3 pr-8 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors focus:border-indigo-500 focus:outline-none cursor-pointer"
        >
          <option value="id">🇮🇩 ID</option>
          <option value="en">🇬🇧 EN</option>
          <option value="zh">🇨🇳 ZH</option>
          <option value="es">🇪🇸 ES</option>
          <option value="ja">🇯🇵 JA</option>
          <option value="ar">🇸🇦 AR</option>
        </select>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-500 text-xs">
          ▼
        </span>
      </div>
    </div>
  );
}
