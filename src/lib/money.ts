import type { Currency } from '@/types/domain'

export function minorUnitFactor(currency: Currency): number {
  return currency === 'AMD' ? 1 : 100
}

export function fromMinorUnits(amountMinor: number, currency: Currency): number {
  return amountMinor / minorUnitFactor(currency)
}

export function toMinorUnits(amount: number, currency: Currency): number {
  return Math.round(amount * minorUnitFactor(currency))
}

export function formatMoney(amountMinor: number, currency: Currency, locale = 'en'): string {
  const digits = currency === 'AMD' ? 0 : 2
  return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: digits, maximumFractionDigits: digits })
    .format(fromMinorUnits(amountMinor, currency))
}
