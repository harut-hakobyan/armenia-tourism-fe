import type { Metadata } from "next";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import { CarsPage } from "../../components/legacy/PublicPages";
import { QueryHydration } from "../../components/QueryHydration";
import { serverCatalogKeys } from "../../lib/api/query-keys";
import { getEnglishCars } from "../../lib/api/server";
import { pageMetadata } from "../../lib/i18n/page-metadata";

export const dynamic = "force-dynamic";

export const generateMetadata = (): Promise<Metadata> => pageMetadata("cars");

export default async function Page() {
  const cars = await getEnglishCars({ perPage: 30 });
  const queryClient = new QueryClient();
  queryClient.setQueryData(serverCatalogKeys.cars({ per_page: 30 }), cars);
  return <QueryHydration state={dehydrate(queryClient)}><CarsPage /></QueryHydration>;
}
