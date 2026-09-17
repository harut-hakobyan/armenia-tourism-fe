import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import { DestinationDetailsPage } from "../../../components/legacy/PublicPages";
import { QueryHydration } from "../../../components/QueryHydration";
import { serverCatalogKeys } from "../../../lib/api/query-keys";
import { getEnglishDestination, PublicApiError, getServerLocale } from "../../../lib/api/server";

const siteUrl = (process.env.SITE_URL ?? "https://tour-armenia.com").replace(/\/$/, "");
const loadDestination = cache(async (slug: string) => {
  try {
    return await getEnglishDestination(slug);
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 404) notFound();
    throw error;
  }
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const locale = await getServerLocale();
  const destination = await loadDestination((await params).slug);
  const title = destination.seo.title?.trim() || `${destination.name}, Armenia | Armenia Journeys`;
  const description = (destination.seo.description?.trim() || destination.short_description || `Discover ${destination.name} in Armenia.`).replace(/\s+/g, " ").slice(0, 160);
  const canonical = `${siteUrl}/${locale}/destinations/${encodeURIComponent(destination.slug)}`;
  return {
    title: { absolute: title },
    description,
    openGraph: { title, description, url: canonical, ...(destination.cover_image ? { images: [{ url: destination.cover_image.url, alt: destination.cover_image.alt_text || destination.name }] } : {}) },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const locale = await getServerLocale();
  const { slug } = await params;
  const destination = await loadDestination(slug);
  const queryClient = new QueryClient();
  queryClient.setQueryData(serverCatalogKeys.destination(locale, slug), destination);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.short_description || destination.description,
    url: `${siteUrl}/${locale}/destinations/${encodeURIComponent(destination.slug)}`,
  };
  return <QueryHydration state={dehydrate(queryClient)}><DestinationDetailsPage /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /></QueryHydration>;
}
