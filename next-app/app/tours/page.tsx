import type { Metadata } from "next";
import { Suspense } from "react";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import { ToursPage } from "../../components/legacy/PublicPages";
import { QueryHydration } from "../../components/QueryHydration";
import { getEnglishCars, getEnglishTours, getServerLocale } from "../../lib/api/server";
import { serverCatalogKeys } from "../../lib/api/query-keys";
import { pageMetadata } from "../../lib/i18n/page-metadata";

export const generateMetadata = (): Promise<Metadata> => pageMetadata("tours");

type Search = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Page({ searchParams }: { searchParams: Promise<Search> }) {
  const locale = await getServerLocale();
  const formatParam = first((await searchParams).format);
  const view = formatParam === "private" || formatParam === "all" || formatParam === "premium" ? formatParam : "group";
  const format: "group" | "private" | undefined = view === "all" ? undefined : view === "premium" ? "private" : view;
  const tourFilters = { ...(format ? { format } : {}), per_page: 24 };
  const queryClient = new QueryClient();
  const requests: Promise<unknown>[] = [
    getEnglishTours({ ...(format ? { format } : {}), perPage: 24 }).then((tours) => {
      queryClient.setQueryData(serverCatalogKeys.tours(locale, tourFilters), tours);
    }),
  ];
  if (view === "premium") {
    const carFilters = { category: "premium" as const, per_page: 12 };
    requests.push(getEnglishCars({ category: "premium", perPage: 12 }).then((cars) => {
      queryClient.setQueryData(serverCatalogKeys.cars(carFilters), cars);
    }));
  }
  await Promise.all(requests);

  return <QueryHydration state={dehydrate(queryClient)}><Suspense fallback={<div className="min-h-[70vh] animate-pulse bg-mist" />}><ToursPage /></Suspense></QueryHydration>;
}
