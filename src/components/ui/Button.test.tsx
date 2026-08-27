import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'
import { buttonStyles } from './button-styles'

describe('Button', () => {
  it('renders an accessible native button with the primary treatment', () => {
    render(<Button>Book now</Button>)
    const button = screen.getByRole('button', { name: 'Book now' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('bg-apricot')
  })

  it('provides reusable link styling variants', () => {
    expect(buttonStyles('secondary')).toContain('border-forest/20')
  })
})
