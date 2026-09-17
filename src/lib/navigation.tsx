"use client";

import NextLink from "next/link";
import { useParams as useNextParams, usePathname, useRouter, useSearchParams as useNextSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useSyncExternalStore, type AnchorHTMLAttributes, type ReactNode } from "react";

type Destination = string | { pathname?: string; search?: string };
type NavigateOptions = { replace?: boolean; state?: unknown };
const stateKey = (url: string) => `navigation-state:${url}`;
const destination = (to: Destination) => typeof to === "string" ? to : `${to.pathname ?? ""}${to.search ?? ""}`;
const localePattern = /^\/(en|ru|hy|fa)(?:\/|$)/;

function localizedDestination(to: Destination, currentPathname: string): string {
  const href = destination(to);
  const locale = currentPathname.match(localePattern)?.[1];
  if (!locale || !href.startsWith("/") || href.startsWith("//") || localePattern.test(href) || href.startsWith("/admin") || href.startsWith("/driver") || href.startsWith("/api")) return href;
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

export function Link({ to, children, ...props }: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { to: Destination; children?: ReactNode }) {
  const pathname = usePathname();
  return <NextLink href={localizedDestination(to, pathname)} {...props}>{children}</NextLink>;
}

export function NavLink({ to, end, className, children, ...props }: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className"> & { to: Destination; end?: boolean; className?: string | ((state: { isActive: boolean }) => string); children?: ReactNode }) {
  const pathname = usePathname();
  const href = localizedDestination(to, pathname);
  const path = href.split("?")[0];
  const isActive = end ? pathname === path : pathname === path || pathname.startsWith(`${path}/`);
  return <NextLink href={href} className={typeof className === "function" ? className({ isActive }) : className} {...props}>{children}</NextLink>;
}

export function useNavigate() {
  const router = useRouter();
  const pathname = usePathname();
  return useCallback((to: Destination | number, options: NavigateOptions = {}) => {
    if (typeof to === "number") { if (to < 0) router.back(); else window.history.go(to); return; }
    const url = localizedDestination(to, pathname);
    if (options.state !== undefined) sessionStorage.setItem(stateKey(url), JSON.stringify(options.state));
    if (options.replace) router.replace(url); else router.push(url);
  }, [pathname, router]);
}

export function useLocation() {
  const pathname = usePathname();
  const query = useNextSearchParams();
  const search = query.size ? `?${query}` : "";
  const raw = useSyncExternalStore(() => () => undefined, () => sessionStorage.getItem(stateKey(`${pathname}${search}`)), () => null);
  const state = useMemo(() => { if (!raw) return null; try { return JSON.parse(raw) as unknown; } catch { return null; } }, [raw]);
  return { pathname, search, hash: typeof window === "undefined" ? "" : window.location.hash, state, key: pathname };
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string>>() {
  return useNextParams<T>();
}

export function useHydrated(): boolean {
  return useSyncExternalStore(() => () => undefined, () => true, () => false);
}

export function useSearchParams(): [URLSearchParams, (next: URLSearchParams | ((current: URLSearchParams) => URLSearchParams), options?: { replace?: boolean }) => void] {
  const current = useNextSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(current.toString());
  const setParams = (next: URLSearchParams | ((value: URLSearchParams) => URLSearchParams), options?: { replace?: boolean }) => {
    const result = typeof next === "function" ? next(new URLSearchParams(params)) : next;
    const url = `${pathname}${result.size ? `?${result}` : ""}`;
    if (options?.replace) router.replace(url); else router.push(url);
  };
  return [params, setParams];
}

export function Navigate({ to, replace = false, state }: { to: Destination; replace?: boolean; state?: unknown }) {
  const navigate = useNavigate();
  useEffect(() => { navigate(to, { replace, state }); }, [navigate, replace, state, to]);
  return null;
}
