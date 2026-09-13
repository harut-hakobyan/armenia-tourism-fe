export type CatalogLocale = 'en' | 'ru' | 'hy'

export interface LocalizedContent {
  locale: CatalogLocale
  label: string
  short_description: string
  description: string
  inclusions: string
  exclusions: string
  seo_title: string
  seo_description: string
}

export const emptyTranslations = (): LocalizedContent[] => (['en', 'ru', 'hy'] as const).map((locale) => ({
  locale, label: '', short_description: '', description: '', inclusions: '', exclusions: '', seo_title: '', seo_description: '',
}))
