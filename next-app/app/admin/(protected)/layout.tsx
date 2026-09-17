import { Suspense, type PropsWithChildren } from "react";
import { AdminShell } from "../../../components/operations/OperationsShells";

export const dynamic = "force-dynamic";
export default function Layout({ children }: PropsWithChildren) { return <Suspense fallback={<div className="min-h-screen animate-pulse bg-stone" />}><AdminShell>{children}</AdminShell></Suspense>; }
