import { describe, expect, it } from 'vitest'
import { formatMoney } from './money'

describe('formatMoney', () => {
  it('formats euro and dollar values from minor units', () => {
    expect(formatMoney(9_500, 'EUR', 'en')).toContain('95.00')
    expect(formatMoney(12_345, 'USD', 'en')).toContain('123.45')
  })

  it('treats Armenian dram as a zero-decimal currency', () => {
    expect(formatMoney(42_000, 'AMD', 'en')).toContain('42,000')
  })
})
