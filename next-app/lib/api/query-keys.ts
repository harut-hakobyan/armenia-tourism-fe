import type { CarListFilters, TourListFilters } from "./server";

type ClientTourFilters = {
  page?: number;
  per_page?: number;
  featured?: boolean;
  category?: string;
  format?: "private" | "group";
};

type ClientCarFilters = {
  page?: number;
  per_page?: number;
  category?: CarListFilters["category"];
  type?: CarListFilters["type"];
  sort?: CarListFilters["sort"];
};

export const serverCatalogKeys = {
  tours: (locale: string, filters: ClientTourFilters) => ["catalog", "tours", locale, filters] as const,
  tour: (locale: string, slug: string) => ["catalog", "tour", locale, slug] as const,
  cars: (filters: ClientCarFilters) => ["catalog", "cars", filters] as const,
  destinations: (locale: string, filters: { per_page?: number }) => ["catalog", "destinations", locale, filters] as const,
  destination: (locale: string, slug: string) => ["catalog", "destination", locale, slug] as const,
};

export type { TourListFilters };
