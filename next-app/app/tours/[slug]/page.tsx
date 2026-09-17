import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import { TourDetailsPage } from "../../../components/legacy/PublicPages";
import { QueryHydration } from "../../../components/QueryHydration";
import { getEnglishCars, getEnglishTour, PublicApiError, getServerLocale } from "../../../lib/api/server";
import { serverCatalogKeys } from "../../../lib/api/query-keys";

const siteUrl = (process.env.SITE_URL ?? "https://tour-armenia.com").replace(/\/$/, "");
const loadTour = cache(async (slug: string) => {
  try {
    return await getEnglishTour(slug);
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 404) notFound();
    throw error;
  }
});

function description(value: string | null, fallback: string): string {
  return (value?.replace(/\s+/g, " ").trim() || fallback).slice(0, 160);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const locale = await getServerLocale();
  const tour = await loadTour((await params).slug);
  const title = tour.seo.title?.trim() || `${tour.title} in Armenia`;
  const summary = description(tour.seo.description, tour.short_description || tour.title);
  const canonical = `${siteUrl}/${locale}/tours/${encodeURIComponent(tour.slug)}`;
  return {
    title: { absolute: title },
    description: summary,
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description: summary,
      ...(tour.cover_image ? { images: [{ url: tour.cover_image.url, alt: tour.cover_image.alt_text || tour.title }] } : {}),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const locale = await getServerLocale();
  const { slug } = await params;
  const [tour, cars, premierCars] = await Promise.all([
    loadTour(slug),
    getEnglishCars({ perPage: 100 }),
    getEnglishCars({ type: "premier", perPage: 100, sort: "price_asc" }),
  ]);
  const queryClient = new QueryClient();
  queryClient.setQueryData(serverCatalogKeys.tour(locale, slug), tour);
  queryClient.setQueryData(serverCatalogKeys.cars({ per_page: 100 }), cars);
  queryClient.setQueryData(
    serverCatalogKeys.cars({ type: "premier", per_page: 100, sort: "price_asc" }),
    premierCars,
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: description(tour.short_description, tour.title),
    url: `${siteUrl}/${locale}/tours/${encodeURIComponent(tour.slug)}`,
    touristType: tour.format === "group" ? "Small group" : "Private",
  };

  return <QueryHydration state={dehydrate(queryClient)}><TourDetailsPage /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /></QueryHydration>;
}
