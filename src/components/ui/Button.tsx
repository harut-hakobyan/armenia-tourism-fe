import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { buttonStyles } from './button-styles'

export function Button({ className, type = 'button', variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
  return <button type={type} className={cn(buttonStyles(variant), className)} {...props} />
}
