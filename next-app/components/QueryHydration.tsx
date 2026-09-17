"use client";

import type { PropsWithChildren } from "react";
import { HydrationBoundary } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/query-core";

export function QueryHydration({ state, children }: PropsWithChildren<{ state: DehydratedState }>) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
