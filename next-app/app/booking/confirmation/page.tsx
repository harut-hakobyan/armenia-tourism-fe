import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingConfirmationPage } from "../../../components/legacy/PublicPages";

export const metadata: Metadata = {
  title: "Booking confirmation",
  robots: { index: false, follow: false, noarchive: true },
};

export default function Page() {
  return <Suspense fallback={<div className="min-h-[70vh] animate-pulse bg-mist" />}><BookingConfirmationPage /></Suspense>;
}
