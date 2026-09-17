import type { Metadata } from "next";
import { Suspense } from "react";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import { ToursPage } from "../../../../components/legacy/PublicPages";
import { QueryHydration } from "../../../../components/QueryHydration";
import { getEnglishCategory, getEnglishTours, getServerLocale } from "../../../../lib/api/server";
import { serverCatalogKeys } from "../../../../lib/api/query-keys";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const category = await getEnglishCategory((await params).slug);
  return {
    title: { absolute: category.seo.title?.trim() || `${category.name} Tours in Armenia | Armenia Journeys` },
    description: (category.seo.description?.trim() || category.description || `Browse ${category.name} tours across Armenia.`).slice(0, 160),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const locale = await getServerLocale();
  const { slug } = await params;
  const filters = { format: "group" as const, category: slug, per_page: 24 };
  const tours = await getEnglishTours({ format: "group", category: slug, perPage: 24 });
  const queryClient = new QueryClient();
  queryClient.setQueryData(serverCatalogKeys.tours(locale, filters), tours);
  return <QueryHydration state={dehydrate(queryClient)}><Suspense fallback={<div className="min-h-[70vh] animate-pulse bg-mist" />}><ToursPage /></Suspense></QueryHydration>;
}
