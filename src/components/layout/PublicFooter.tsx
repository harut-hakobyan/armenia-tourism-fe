import { Mountain } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container } from '@/components/ui/Container'

export function PublicFooter() {
  const { t } = useTranslation()
  return <footer className="bg-ink py-12 text-white/70"><Container className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end"><div><div className="mb-4 flex items-center gap-3 text-lg font-bold text-white"><Mountain className="text-apricot-light" />{t('brand')}</div><p className="max-w-xl text-sm leading-6">{t('home.promise')}</p></div><div className="flex flex-wrap gap-5 text-sm"><Link to="/about">{t('footer.about')}</Link><Link to="/contact">{t('actions.contact')}</Link><Link to="/faq">{t('footer.faq')}</Link></div></Container></footer>
}
