import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import { BookingStatusPage } from "../../../../components/legacy/PublicPages";
import { QueryHydration } from "../../../../components/QueryHydration";
import { getPublicBooking, getPublicSettings, PublicApiError, getServerLocale } from "../../../../lib/api/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Your booking",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function Page({ params }: { params: Promise<{ bookingNumber: string; token: string }> }) {
  const locale = await getServerLocale();
  const { bookingNumber, token } = await params;
  let booking;
  try {
    booking = await getPublicBooking(bookingNumber, token);
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 404) notFound();
    throw error;
  }
  const settings = await getPublicSettings();
  const queryClient = new QueryClient();
  queryClient.setQueryData(["booking", bookingNumber, token, locale], booking);
  queryClient.setQueryData(["public-settings"], settings);
  return <QueryHydration state={dehydrate(queryClient)}><BookingStatusPage /></QueryHydration>;
}
