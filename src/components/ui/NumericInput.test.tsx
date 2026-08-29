import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { NumericInput } from './NumericInput'

describe('NumericInput', () => {
  it('rejects non-numeric characters without changing the value', () => {
    const onValueChange = vi.fn()
    render(<NumericInput aria-label="Passengers" value={4} onValueChange={onValueChange} />)

    fireEvent.change(screen.getByLabelText('Passengers'), { target: { value: '4a' } })

    expect(screen.getByLabelText('Passengers')).toHaveValue('4')
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('supports decimal values without number-input spinner behavior', () => {
    const onValueChange = vi.fn()
    render(<NumericInput aria-label="Price" value={10} decimal onValueChange={onValueChange} />)

    const input = screen.getByLabelText('Price')
    fireEvent.change(input, { target: { value: '10.50' } })

    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveAttribute('inputmode', 'decimal')
    expect(input).toHaveValue('10.50')
    expect(onValueChange).toHaveBeenLastCalledWith(10.5)
  })
})
