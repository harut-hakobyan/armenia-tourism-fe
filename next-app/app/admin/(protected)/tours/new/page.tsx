import { Suspense } from "react";
import { AdminTourFormPage } from "../../../../../components/operations/OperationsPages";
export default function Page() { return <Suspense fallback={<div className="min-h-96 animate-pulse" />}><AdminTourFormPage /></Suspense>; }
