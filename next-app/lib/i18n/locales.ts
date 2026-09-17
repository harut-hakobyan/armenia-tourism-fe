export const locales = ["en", "ru", "hy", "fa"] as const;
export type SiteLocale = (typeof locales)[number];
export const defaultLocale: SiteLocale = "en";

export function isSiteLocale(value: string | null | undefined): value is SiteLocale {
  return locales.includes(value as SiteLocale);
}

export function localePath(locale: SiteLocale, path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}
