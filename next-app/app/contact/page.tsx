import type { Metadata } from "next";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import { ContactPage } from "../../components/legacy/PublicPages";
import { QueryHydration } from "../../components/QueryHydration";
import { getPublicSettings } from "../../lib/api/server";
import { pageMetadata } from "../../lib/i18n/page-metadata";

export const dynamic = "force-dynamic";

export const generateMetadata = (): Promise<Metadata> => pageMetadata("contact");

export default async function Page() {
  const settings = await getPublicSettings();
  const queryClient = new QueryClient();
  queryClient.setQueryData(["public-settings"], settings);
  return <QueryHydration state={dehydrate(queryClient)}><ContactPage /></QueryHydration>;
}
