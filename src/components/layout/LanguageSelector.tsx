import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePathname, useRouter } from 'next/navigation'
import { supportedLocales, type Locale } from '@/i18n/resources'

const labels: Record<Locale, string> = { en: 'EN', ru: 'RU', hy: 'ՀՅ', fa: 'FA' }

export function LanguageSelector() {
  const { i18n, t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()
  const changeLocale = (locale: Locale) => {
    const segments = pathname.split('/').filter(Boolean)
    if (supportedLocales.includes(segments[0] as Locale)) segments.shift()
    const nextPath = `/${locale}${segments.length ? `/${segments.join('/')}` : ''}`
    void i18n.changeLanguage(locale)
    router.push(nextPath)
  }
  return <label className="flex items-center gap-2 text-sm font-semibold text-forest">
    <Languages className="size-4" aria-hidden />
    <span className="sr-only">{t('common.language')}</span>
    <select data-unstyled="true" className="cursor-pointer bg-transparent py-2 outline-none" value={i18n.language} onChange={(event) => changeLocale(event.target.value as Locale)}>
      {supportedLocales.map((locale) => <option value={locale} key={locale}>{labels[locale]}</option>)}
    </select>
  </label>
}
