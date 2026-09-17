import type { Metadata } from "next";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import { DestinationsPage } from "../../components/legacy/PublicPages";
import { QueryHydration } from "../../components/QueryHydration";
import { serverCatalogKeys } from "../../lib/api/query-keys";
import { getEnglishDestinations, getServerLocale } from "../../lib/api/server";
import { pageMetadata } from "../../lib/i18n/page-metadata";

export const dynamic = "force-dynamic";

export const generateMetadata = (): Promise<Metadata> => pageMetadata("destinations");

export default async function Page() {
  const locale = await getServerLocale();
  const destinations = await getEnglishDestinations(30);
  const queryClient = new QueryClient();
  queryClient.setQueryData(serverCatalogKeys.destinations(locale, { per_page: 30 }), destinations);
  return <QueryHydration state={dehydrate(queryClient)}><DestinationsPage /></QueryHydration>;
}
