import type { Currency } from '@/types/domain'

export function formatMoney(amountMinor: number, currency: Currency, locale = 'en'): string {
  const digits = currency === 'AMD' ? 0 : 2
  return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: digits, maximumFractionDigits: digits })
    .format(amountMinor / (currency === 'AMD' ? 1 : 100))
}
