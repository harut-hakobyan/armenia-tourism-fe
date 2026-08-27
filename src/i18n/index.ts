import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources, supportedLocales, type Locale } from './resources'

const storedLocale = localStorage.getItem('amt.locale')
const browserLocale = navigator.language.split('-')[0]
const initialLocale = supportedLocales.includes(storedLocale as Locale)
  ? (storedLocale as Locale)
  : supportedLocales.includes(browserLocale as Locale) ? (browserLocale as Locale) : 'en'

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLocale,
  fallbackLng: 'en',
  supportedLngs: supportedLocales,
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (locale) => {
  document.documentElement.lang = locale
  localStorage.setItem('amt.locale', locale)
})

document.documentElement.lang = initialLocale

export { i18n }
