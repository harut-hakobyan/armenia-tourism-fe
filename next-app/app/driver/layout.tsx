import type { Metadata } from "next";
import { Suspense, type PropsWithChildren } from "react";
import { DriverShell } from "../../components/operations/OperationsShells";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false, noarchive: true } };
export default function Layout({ children }: PropsWithChildren) { return <Suspense fallback={<div className="min-h-screen animate-pulse bg-stone" />}><DriverShell>{children}</DriverShell></Suspense>; }
