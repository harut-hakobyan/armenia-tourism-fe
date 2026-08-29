import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supportedLocales, type Locale } from '@/i18n/resources'

const labels: Record<Locale, string> = { en: 'EN', ru: 'RU', hy: 'ՀՅ' }

export function LanguageSelector() {
  const { i18n, t } = useTranslation()
  return <label className="flex items-center gap-2 text-sm font-semibold text-forest">
    <Languages className="size-4" aria-hidden />
    <span className="sr-only">{t('common.language')}</span>
    <select data-unstyled="true" className="cursor-pointer bg-transparent py-2 outline-none" value={i18n.language} onChange={(event) => void i18n.changeLanguage(event.target.value)}>
      {supportedLocales.map((locale) => <option value={locale} key={locale}>{labels[locale]}</option>)}
    </select>
  </label>
}
