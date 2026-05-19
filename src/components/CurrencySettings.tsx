import { useTranslation } from 'react-i18next';
import { useCurrency, CURRENCIES } from '../hooks/useCurrency';

export default function CurrencySettings() {
  const { t } = useTranslation();
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
        💰 {t('currency')}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {CURRENCIES.map(curr => (
          <button
            key={curr.code}
            onClick={() => setCurrency(curr)}
            className={`p-2 rounded-xl border text-left transition-all text-sm font-medium ${
              currency.code === curr.code
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                : 'border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10'
            }`}
          >
            <span className="font-bold">{curr.symbol}</span> {curr.code}
          </button>
        ))}
      </div>
    </div>
  );
}