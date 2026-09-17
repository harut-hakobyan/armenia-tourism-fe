import type { Metadata } from "next";
import { Suspense } from "react";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import { CustomTripPage } from "../../components/legacy/PublicPages";
import { QueryHydration } from "../../components/QueryHydration";
import { serverCatalogKeys } from "../../lib/api/query-keys";
import { getEnglishCars, getEnglishDestinations, getServerLocale } from "../../lib/api/server";
import { pageMetadata } from "../../lib/i18n/page-metadata";

export const dynamic = "force-dynamic";
export const generateMetadata = (): Promise<Metadata> => pageMetadata("customTrip");

type Search = Record<string, string | string[] | undefined>;

export default async function Page({ searchParams }: { searchParams: Promise<Search> }) {
  const locale = await getServerLocale();
  const search = await searchParams;
  const premium = (Array.isArray(search.vehicle) ? search.vehicle[0] : search.vehicle) === "premium";
  const carFilters = { ...(premium ? { category: "premium" as const } : {}), sort: "price_asc" as const, per_page: 30 };
  const [destinations, cars] = await Promise.all([
    getEnglishDestinations(50),
    getEnglishCars({ ...(premium ? { category: "premium" as const } : {}), sort: "price_asc", perPage: 30 }),
  ]);
  const queryClient = new QueryClient();
  queryClient.setQueryData(serverCatalogKeys.destinations(locale, { per_page: 50 }), destinations);
  queryClient.setQueryData(serverCatalogKeys.cars(carFilters), cars);
  return <QueryHydration state={dehydrate(queryClient)}><Suspense fallback={<div className="min-h-[70vh] animate-pulse bg-mist" />}><CustomTripPage /></Suspense></QueryHydration>;
}
