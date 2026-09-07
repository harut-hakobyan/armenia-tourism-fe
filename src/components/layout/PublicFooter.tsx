import { Mail, MessageCircle, Mountain, Phone, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Container } from '@/components/ui/Container'
import { contentApi } from '@/features/content/api'

export function PublicFooter() {
  const { t } = useTranslation()
  const settings = useQuery({ queryKey: ['public-settings'], queryFn: contentApi.settings })
  const phone = settings.data?.company_phone?.trim()
  const email = settings.data?.company_email?.trim()
  const phoneDigits = phone?.replace(/\D/g, '')
  const phoneLink = phone ? `tel:${phone.replace(/[^+\d]/g, '')}` : undefined
  const whatsappLink = phoneDigits ? `https://wa.me/${phoneDigits}` : undefined
  const viberLink = phone ? `viber://chat?number=${encodeURIComponent(phone.replace(/[^+\d]/g, ''))}` : undefined
  const telegramLink = phoneDigits ? `https://t.me/+${phoneDigits}` : undefined

  return <footer className="bg-ink py-12 text-white/70"><Container className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end"><div><div className="mb-4 flex items-center gap-3 text-lg font-bold text-white"><Mountain className="text-apricot-light" />{t('brand')}</div><p className="max-w-xl text-sm leading-6">{t('home.promise')}</p>{(phone || email) && <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">{phone && <><a href={phoneLink} className="inline-flex items-center gap-2 text-white hover:text-apricot-light"><Phone className="size-4" />{phone}</a>{whatsappLink && <a href={whatsappLink} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="rounded-full border border-white/15 p-2 text-white hover:border-apricot-light hover:text-apricot-light"><MessageCircle className="size-4" /></a>}{viberLink && <a href={viberLink} aria-label="Viber" className="rounded-full border border-white/15 px-2.5 py-1.5 text-xs font-bold text-white hover:border-apricot-light hover:text-apricot-light">Viber</a>}{telegramLink && <a href={telegramLink} target="_blank" rel="noreferrer" aria-label="Telegram" className="rounded-full border border-white/15 p-2 text-white hover:border-apricot-light hover:text-apricot-light"><Send className="size-4" /></a>}</>}{email && <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-white hover:text-apricot-light"><Mail className="size-4" />{email}</a>}</div>}</div><div className="flex flex-wrap gap-5 text-sm"><Link to="/about">{t('footer.about')}</Link><Link to="/contact">{t('actions.contact')}</Link><Link to="/faq">{t('footer.faq')}</Link></div></Container></footer>
}
