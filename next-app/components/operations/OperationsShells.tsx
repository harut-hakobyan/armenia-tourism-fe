"use client";

import type { PropsWithChildren } from "react";
import { OperationsLayout } from "@/components/layout/OperationsLayout";
import { RequireRole } from "@/features/auth/RequireRole";

export function AdminShell({ children }: PropsWithChildren) {
  return <RequireRole roles={["admin", "manager"]}><OperationsLayout>{children}</OperationsLayout></RequireRole>;
}

export function DriverShell({ children }: PropsWithChildren) {
  return <RequireRole roles={["driver"]}><OperationsLayout driver>{children}</OperationsLayout></RequireRole>;
}
