import type { Metadata } from "next";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import { HomePage } from "../components/legacy/PublicPages";
import { QueryHydration } from "../components/QueryHydration";
import { getEnglishCars, getEnglishTours, getServerLocale } from "../lib/api/server";
import { serverCatalogKeys } from "../lib/api/query-keys";
import { pageMetadata } from "../lib/i18n/page-metadata";

// The API is a runtime Compose service and is intentionally unavailable while
// the frontend image is being built. Render the homepage on request and retain
// the five-minute fetch cache configured by the server API client.
export const dynamic = "force-dynamic";

export const generateMetadata = (): Promise<Metadata> => pageMetadata("home");

export default async function Page() {
  const locale = await getServerLocale();
  const tourFilters = { featured: true, format: "group" as const, per_page: 6 };
  const carFilters = { per_page: 3 };
  const [tours, cars] = await Promise.all([
    getEnglishTours({ featured: true, format: "group", perPage: 6 }),
    getEnglishCars({ perPage: 3 }),
  ]);
  const queryClient = new QueryClient();
  queryClient.setQueryData(serverCatalogKeys.tours(locale, tourFilters), tours);
  queryClient.setQueryData(serverCatalogKeys.cars(carFilters), cars);

  return <QueryHydration state={dehydrate(queryClient)}><HomePage /></QueryHydration>;
}
