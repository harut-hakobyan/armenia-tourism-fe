import { cn } from '@/lib/cn'

export function buttonStyles(variant: 'primary' | 'secondary' | 'ghost' = 'primary'): string {
  return cn(
    'inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50',
    variant === 'primary' && 'bg-apricot text-white shadow-lg shadow-apricot/20 hover:-translate-y-0.5 hover:bg-[#c96a3d]',
    variant === 'secondary' && 'border border-forest/20 bg-white/90 text-forest hover:border-forest/40 hover:bg-white',
    variant === 'ghost' && 'text-forest hover:bg-forest/8',
  )
}
