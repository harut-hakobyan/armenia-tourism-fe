import { useEffect, useRef, useState, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface NumericInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange' | 'inputMode' | 'pattern'> {
  value: number | null
  onValueChange: (value: number | null) => void
  decimal?: boolean
  allowNegative?: boolean
}

export function NumericInput({ value, onValueChange, decimal = false, allowNegative = false, min, max, required, className, ...props }: NumericInputProps) {
  const [draft, setDraft] = useState(value === null ? '' : String(value))
  const lastEmitted = useRef<number | null>(value)
  const sign = allowNegative ? '-?' : ''
  const editingPattern = decimal ? new RegExp(`^${sign}[0-9]*(?:[.,][0-9]*)?$`) : new RegExp(`^${sign}[0-9]*$`)
  const finalPattern = decimal ? `${sign}(?:[0-9]+(?:[.,][0-9]*)?|[.,][0-9]+)` : `${sign}[0-9]+`

  useEffect(() => {
    if (value === lastEmitted.current) return
    lastEmitted.current = value
    setDraft(value === null ? '' : String(value))
  }, [value])

  function validate(input: HTMLInputElement, nextValue: string, parsed: number | null) {
    input.setCustomValidity('')
    if (nextValue === '' || parsed === null) return
    if (min !== undefined && parsed < Number(min)) input.setCustomValidity(`Enter a value of at least ${min}.`)
    if (max !== undefined && parsed > Number(max)) input.setCustomValidity(`Enter a value no greater than ${max}.`)
  }

  return <input {...props} type="text" inputMode={decimal ? 'decimal' : 'numeric'} pattern={finalPattern} value={draft} required={required}
    aria-valuemin={min === undefined ? undefined : Number(min)} aria-valuemax={max === undefined ? undefined : Number(max)} className={cn('tabular-nums', className)}
    onChange={(event) => {
      const next = event.target.value
      if (!editingPattern.test(next)) return
      setDraft(next)
      if (next === '') {
        validate(event.target, next, null)
        if (!required) { lastEmitted.current = null; onValueChange(null) }
        return
      }
      const parsed = Number(next.replace(',', '.'))
      if (!Number.isFinite(parsed)) { validate(event.target, next, null); return }
      validate(event.target, next, parsed)
      lastEmitted.current = parsed
      onValueChange(parsed)
    }} />
}
