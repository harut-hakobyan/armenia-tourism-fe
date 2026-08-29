import { useState } from 'react'
import { Menu, Mountain, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/cn'
import { buttonStyles } from '@/components/ui/button-styles'
import { Container } from '@/components/ui/Container'
import { LanguageSelector } from './LanguageSelector'

const links = [
  ['/tours', 'nav.tours'], ['/destinations', 'nav.destinations'], ['/cars', 'nav.cars'],
] as const

export function PublicHeader() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  return <header className="sticky top-0 z-50 border-b border-forest/8 bg-mist/90 backdrop-blur-xl">
    <Container className="flex min-h-18 items-center justify-between gap-6">
      <NavLink to="/" className="flex items-center gap-3 font-bold text-forest" onClick={() => setOpen(false)}>
        <span className="grid size-10 place-items-center rounded-full bg-forest text-white"><Mountain className="size-5" /></span>
        <span className="hidden max-w-44 leading-tight sm:block">{t('brand')}</span>
      </NavLink>
      <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
        {links.map(([to, key]) => <NavLink key={to} to={to} className={({ isActive }) => cn('text-sm font-semibold text-ink/70 hover:text-forest', isActive && 'text-forest')}>{t(key)}</NavLink>)}
      </nav>
      <div className="flex items-center gap-2">
        <LanguageSelector />
        <NavLink to="/booking" className={cn(buttonStyles(), 'hidden sm:inline-flex')}>{t('actions.book')}</NavLink>
        <button className="grid size-11 place-items-center rounded-full text-forest lg:hidden" aria-label={t('common.menu')} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button>
      </div>
    </Container>
    {open && <nav className="border-t border-forest/8 bg-mist px-5 py-5 lg:hidden" aria-label="Mobile">
      <div className="mx-auto grid max-w-7xl gap-1">{links.map(([to, key]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 font-semibold hover:bg-white">{t(key)}</NavLink>)}<NavLink to="/booking" onClick={() => setOpen(false)} className={cn(buttonStyles(), 'mt-3')}>{t('actions.book')}</NavLink></div>
    </nav>}
  </header>
}
