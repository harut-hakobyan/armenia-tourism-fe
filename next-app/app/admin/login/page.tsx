import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPage } from "../../../components/operations/OperationsPages";

export const metadata: Metadata = { title: "Operations sign in" };
export default function Page() { return <Suspense fallback={<div className="min-h-screen animate-pulse bg-ink" />}><LoginPage /></Suspense>; }
