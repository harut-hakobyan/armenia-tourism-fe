import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources, supportedLocales, type Locale } from './resources'

const browser = typeof window !== 'undefined'

export function getPreferredLocale(): Locale {
  if (!browser) return 'en'
  const storedLocale = localStorage.getItem('amt.locale')
  const browserLocale = navigator.language.split('-')[0]
  if (supportedLocales.includes(storedLocale as Locale)) return storedLocale as Locale
  return supportedLocales.includes(browserLocale as Locale) ? browserLocale as Locale : 'en'
}

void i18n.use(initReactI18next).init({
  resources,
  // The server renders English, so the hydration render must start in English too.
  // AppProviders applies the browser preference immediately after hydration.
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: supportedLocales,
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (locale) => {
  if (browser) {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr'
    localStorage.setItem('amt.locale', locale)
  }
})

export { i18n }
