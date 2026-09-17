"use client";

import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";

export function SiteChrome({ children }: PropsWithChildren) { const pathname = usePathname(); const operations = pathname.startsWith("/admin") || pathname.startsWith("/driver"); return <div className="page-shell">{!operations && <PublicHeader/>}{children}{!operations && <PublicFooter/>}</div>; }
