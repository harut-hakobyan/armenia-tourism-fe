import { describe, expect, it } from 'vitest'
import { formatMoney, fromMinorUnits, toMinorUnits } from './money'

describe('formatMoney', () => {
  it('formats euro and dollar values from minor units', () => {
    expect(formatMoney(9_500, 'EUR', 'en')).toContain('95.00')
    expect(formatMoney(12_345, 'USD', 'en')).toContain('123.45')
  })

  it('treats Armenian dram as a zero-decimal currency', () => {
    expect(formatMoney(42_000, 'AMD', 'en')).toContain('42,000')
  })

  it('converts form amounts to and from currency minor units', () => {
    expect(toMinorUnits(70, 'EUR')).toBe(7_000)
    expect(fromMinorUnits(7_000, 'EUR')).toBe(70)
    expect(toMinorUnits(7_000, 'AMD')).toBe(7_000)
    expect(fromMinorUnits(7_000, 'AMD')).toBe(7_000)
  })
})
