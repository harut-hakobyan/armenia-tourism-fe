import type { Metadata } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { AppProviders } from "../components/AppProviders";
import { SiteChrome } from "../components/site/SiteChrome";
import "../../src/styles/global.css";
import { defaultLocale, isSiteLocale, locales } from "../lib/i18n/locales";

const siteUrl = (process.env.SITE_URL ?? "https://tour-armenia.com").replace(/\/$/, "");
const siteName = process.env.BUSINESS_NAME ?? "Armenia Journeys";
const description = "Private and small-group tours across Armenia with local drivers and flexible itineraries.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const requestedLocale = requestHeaders.get("x-site-locale");
  const locale = isSiteLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const requestPath = requestHeaders.get("x-site-path") ?? `/${locale}`;
  const suffix = requestPath.replace(/^\/(en|ru|hy|fa)(?=\/|$)/, "") || "";
  const languages = Object.fromEntries(locales.map((language) => [language, `/${language}${suffix}`]));
  return {
    metadataBase: new URL(siteUrl),
    title: { default: "Tours in Armenia | Armenia Journeys", template: "%s | Armenia Journeys" },
    description,
    applicationName: siteName,
    alternates: { canonical: requestPath, languages: { ...languages, "x-default": `/en${suffix}` } },
    openGraph: { type: "website", siteName, title: "Tours in Armenia | Armenia Journeys", description, url: requestPath, locale, images: [{ url: "/images/armenia-garni-hero.png", alt: "Garni Temple in the Armenian highlands" }] },
    twitter: { card: "summary_large_image", title: "Tours in Armenia | Armenia Journeys", description, images: ["/images/armenia-garni-hero.png"] },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const requestedLocale = (await headers()).get("x-site-locale");
  const locale = isSiteLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const sameAs = (process.env.BUSINESS_SOCIAL_URLS ?? "").split(",").map((url) => url.trim()).filter(Boolean);
  const telephone = process.env.BUSINESS_PHONE ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        ...(telephone ? { telephone: `+${telephone.replace(/^\+/, "")}` } : {}),
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        inLanguage: ["en", "ru", "hy", "fa"],
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };

  return <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}><body><AppProviders locale={locale}><SiteChrome>{children}</SiteChrome></AppProviders><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /></body></html>;
}
