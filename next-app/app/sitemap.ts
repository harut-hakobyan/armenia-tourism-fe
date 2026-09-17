import type { MetadataRoute } from "next";
import { getAllEnglishDestinations, getAllEnglishTours, getEnglishCategories } from "../lib/api/server";
import { locales } from "../lib/i18n/locales";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.SITE_URL ?? "https://tour-armenia.com").replace(/\/$/, "");
  const [tours, categories, destinations] = await Promise.all([getAllEnglishTours(), getEnglishCategories(), getAllEnglishDestinations()]);
  const usedCategories = new Set(tours.flatMap((tour) => tour.category?.slug ? [tour.category.slug] : []));
  const pages = [
    { path: "", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/tours", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/destinations", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/cars", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/faq", changeFrequency: "monthly" as const, priority: 0.6 },
    ...categories.filter((category) => usedCategories.has(category.slug)).map((category) => ({ path: `/tours/category/${encodeURIComponent(category.slug)}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...tours.map((tour) => ({ path: `/tours/${encodeURIComponent(tour.slug)}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...destinations.map((destination) => ({ path: `/destinations/${encodeURIComponent(destination.slug)}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
  return pages.flatMap((page) => locales.map((locale) => ({
    url: `${siteUrl}/${locale}${page.path}`,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    alternates: { languages: Object.fromEntries(locales.map((language) => [language, `${siteUrl}/${language}${page.path}`])) },
  })));
}
