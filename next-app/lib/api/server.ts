import "server-only";
import { headers } from "next/headers";
import type { ApiEnvelope, PaginatedResponse } from "../../../src/types/api";
import type { Car, Destination, PublicBooking, Tour, TourCategory, TourFormat } from "../../../src/types/domain";

const apiBaseUrl = (process.env.LARAVEL_INTERNAL_API_URL ?? "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");

export async function getServerLocale(): Promise<"en" | "ru" | "hy" | "fa"> {
  const locale = (await headers()).get("x-site-locale");
  return locale === "ru" || locale === "hy" || locale === "fa" ? locale : "en";
}

export class PublicApiError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = "PublicApiError";
  }
}

async function getJson<T>(path: string, tags: string[]): Promise<T> {
  const locale = await getServerLocale();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: { Accept: "application/json", "Accept-Language": locale },
    next: { revalidate: 300, tags },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new PublicApiError(response.status, `Laravel returned ${response.status} for ${path}`);
  return response.json() as Promise<T>;
}

async function getPrivateJson<T>(path: string): Promise<T> {
  const locale = await getServerLocale();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: { Accept: "application/json", "Accept-Language": locale },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new PublicApiError(response.status, `Laravel returned ${response.status} for a private resource`);
  return response.json() as Promise<T>;
}

export async function getEnglishTour(slug: string): Promise<Tour> {
  const locale = await getServerLocale();
  const payload = await getJson<ApiEnvelope<Tour>>(`/tours/${encodeURIComponent(slug)}?locale=${locale}`, [`tour:${locale}:${slug}`, `tours:${locale}`]);
  if (!payload.data?.id || !payload.data.slug || !payload.data.title) throw new PublicApiError(502, "Laravel returned an invalid tour response");
  return payload.data;
}

export interface TourListFilters {
  page?: number;
  perPage?: number;
  format?: TourFormat;
  featured?: boolean;
  category?: string;
}

export interface CarListFilters {
  page?: number;
  perPage?: number;
  category?: Car["category"];
  type?: Car["type"];
  sort?: "recommended" | "price_asc" | "capacity_desc";
}

export async function getEnglishCars(filters: CarListFilters = {}): Promise<PaginatedResponse<Car>> {
  const query = new URLSearchParams({
    per_page: String(filters.perPage ?? 9),
    page: String(filters.page ?? 1),
  });
  if (filters.category) query.set("category", filters.category);
  if (filters.type) query.set("type", filters.type);
  if (filters.sort) query.set("sort", filters.sort);
  const payload = await getJson<PaginatedResponse<Car>>(`/cars?${query}`, ["cars"]);
  if (!Array.isArray(payload.data) || !payload.meta) throw new PublicApiError(502, "Laravel returned an invalid car collection");
  return payload;
}

export async function getEnglishTours(filters: TourListFilters = {}): Promise<PaginatedResponse<Tour>> {
  const locale = await getServerLocale();
  const query = new URLSearchParams({ locale, per_page: String(filters.perPage ?? 9), page: String(filters.page ?? 1) });
  if (filters.format) query.set("format", filters.format);
  if (filters.featured !== undefined) query.set("featured", filters.featured ? "1" : "0");
  const prefix = filters.category ? `/tour-categories/${encodeURIComponent(filters.category)}/tours` : "/tours";
  const payload = await getJson<PaginatedResponse<Tour>>(`${prefix}?${query}`, [`tours:${locale}`]);
  if (!Array.isArray(payload.data) || !payload.meta) throw new PublicApiError(502, "Laravel returned an invalid tour collection");
  return payload;
}

export async function getEnglishCategories(): Promise<TourCategory[]> {
  const locale = await getServerLocale();
  const payload = await getJson<ApiEnvelope<TourCategory[]>>(`/tour-categories?locale=${locale}`, [`tour-categories:${locale}`]);
  if (!Array.isArray(payload.data)) throw new PublicApiError(502, "Laravel returned an invalid category collection");
  return payload.data;
}

export async function getEnglishCategory(slug: string): Promise<TourCategory> {
  const locale = await getServerLocale();
  const payload = await getJson<ApiEnvelope<TourCategory>>(`/tour-categories/${encodeURIComponent(slug)}?locale=${locale}`, [`tour-category:${locale}:${slug}`]);
  if (!payload.data?.id || !payload.data.slug || !payload.data.name) throw new PublicApiError(502, "Laravel returned an invalid category response");
  return payload.data;
}

export async function getEnglishDestinations(perPage = 30, page = 1): Promise<PaginatedResponse<Destination>> {
  const locale = await getServerLocale();
  const payload = await getJson<PaginatedResponse<Destination>>(`/destinations?locale=${locale}&per_page=${perPage}&page=${page}`, [`destinations:${locale}`]);
  if (!Array.isArray(payload.data) || !payload.meta) throw new PublicApiError(502, "Laravel returned an invalid destination collection");
  return payload;
}

export async function getAllEnglishDestinations(): Promise<Destination[]> {
  const first = await getEnglishDestinations(100);
  const destinations = [...first.data];
  for (let page = 2; page <= first.meta.last_page; page += 1) {
    if (page > 100) throw new PublicApiError(502, "Laravel returned too many destination pages");
    destinations.push(...(await getEnglishDestinations(100, page)).data);
  }
  return destinations;
}

export async function getEnglishDestination(slug: string): Promise<Destination> {
  const locale = await getServerLocale();
  const payload = await getJson<ApiEnvelope<Destination>>(`/destinations/${encodeURIComponent(slug)}?locale=${locale}`, [`destination:${locale}:${slug}`, `destinations:${locale}`]);
  if (!payload.data?.id || !payload.data.slug || !payload.data.name) throw new PublicApiError(502, "Laravel returned an invalid destination response");
  return payload.data;
}

export interface PublicFaqItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  sort_order: number;
}

export async function getEnglishFaqs(): Promise<PublicFaqItem[]> {
  const locale = await getServerLocale();
  const payload = await getJson<ApiEnvelope<PublicFaqItem[]>>(`/faqs?locale=${locale}`, [`faqs:${locale}`]);
  if (!Array.isArray(payload.data)) throw new PublicApiError(502, "Laravel returned an invalid FAQ response");
  return payload.data;
}

export async function getPublicSettings(): Promise<Record<string, string>> {
  const payload = await getJson<ApiEnvelope<Record<string, string>>>("/settings", ["public-settings"]);
  if (!payload.data || typeof payload.data !== "object") throw new PublicApiError(502, "Laravel returned invalid public settings");
  return payload.data;
}

export async function getPublicBooking(bookingNumber: string, token: string): Promise<PublicBooking> {
  const payload = await getPrivateJson<ApiEnvelope<PublicBooking>>(`/bookings/${encodeURIComponent(bookingNumber)}/${encodeURIComponent(token)}`);
  if (!payload.data?.booking_number) throw new PublicApiError(502, "Laravel returned an invalid booking response");
  return payload.data;
}

export async function getAllEnglishTours(): Promise<Tour[]> {
  const first = await getEnglishTours({ perPage: 100 });
  const tours = [...first.data];
  for (let page = 2; page <= first.meta.last_page; page += 1) {
    if (page > 100) throw new PublicApiError(502, "Laravel returned too many tour pages");
    tours.push(...(await getEnglishTours({ page, perPage: 100 })).data);
  }
  return tours;
}
