import type { Metadata } from "next";
import { Suspense } from "react";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import { BookingPage } from "../../components/legacy/PublicPages";
import { QueryHydration } from "../../components/QueryHydration";
import { serverCatalogKeys } from "../../lib/api/query-keys";
import { getEnglishCars, getEnglishTours, getServerLocale } from "../../lib/api/server";
import { pageMetadata } from "../../lib/i18n/page-metadata";

export const dynamic = "force-dynamic";
export const generateMetadata = (): Promise<Metadata> => pageMetadata("booking");

type Search = Record<string, string | string[] | undefined>;

export default async function Page({ searchParams }: { searchParams: Promise<Search> }) {
  const locale = await getServerLocale();
  const search = await searchParams;
  const premium = (Array.isArray(search.vehicle) ? search.vehicle[0] : search.vehicle) === "premium";
  const carFilters = { ...(premium ? { category: "premium" as const } : {}), per_page: 100, sort: "price_asc" as const };
  const premierFilters = { type: "premier" as const, per_page: 100, sort: "price_asc" as const };
  const [tours, cars, premierCars] = await Promise.all([
    getEnglishTours({ perPage: 50 }),
    getEnglishCars({ ...(premium ? { category: "premium" as const } : {}), perPage: 100, sort: "price_asc" }),
    getEnglishCars({ type: "premier", perPage: 100, sort: "price_asc" }),
  ]);
  const queryClient = new QueryClient();
  queryClient.setQueryData(serverCatalogKeys.tours(locale, { per_page: 50 }), tours);
  queryClient.setQueryData(serverCatalogKeys.cars(carFilters), cars);
  queryClient.setQueryData(serverCatalogKeys.cars(premierFilters), premierCars);
  return <QueryHydration state={dehydrate(queryClient)}><Suspense fallback={<div className="min-h-[70vh] animate-pulse bg-mist" />}><BookingPage /></Suspense></QueryHydration>;
}
