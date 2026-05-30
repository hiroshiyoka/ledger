import { useTranslation } from 'react-i18next';
import { useCurrency, CURRENCIES } from '../hooks/useCurrency';

export default function CurrencySettings() {
  const { t } = useTranslation();
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="space-y-3">
      <h3 className="text-body-sm font-[500] text-charcoal uppercase tracking-wider">
        💰 {t('currency')}
      </h3>
      <div className="grid grid-cols-2 sm:grid grid-cols-3 gap-2">
        {CURRENCIES.map(curr => (
          <button
            key={curr.code}
            onClick={() => setCurrency(curr)}
            className={`p-2 rounded-lg border text-left transition-all text-body-sm font-[500] ${
              currency.code === curr.code
                ? 'border border-hairline-strong bg-surface-elevated  text-ink '
                : 'border border-hairline-strong  bg-surface-card  text-charcoal  hover:bg-surface-elevated '
            }`}
          >
            <span className="font-[500]">{curr.symbol}</span> {curr.code}
          </button>
        ))}
      </div>
    </div>
  );
}