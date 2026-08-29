import { queryOptions } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { ApiEnvelope, PaginatedResponse } from '@/types/api'
import type { Car, Destination, Tour, TourCategory } from '@/types/domain'

export interface CatalogFilters { page?: number; per_page?: number; featured?: boolean; search?: string }
export interface TourFilters extends CatalogFilters { category?: string; format?: 'private' | 'group'; passengers?: number; sort?: 'recommended' | 'price_asc' | 'price_desc' | 'duration_asc' }
export interface CarFilters extends Pick<CatalogFilters, 'page' | 'per_page'> { category?: Car['category']; passengers?: number; luggage?: number; child_seat?: boolean; sort?: 'recommended' | 'price_asc' | 'capacity_desc' }

export const catalogKeys = {
  all: ['catalog'] as const,
  tours: (locale: string, filters: TourFilters) => [...catalogKeys.all, 'tours', locale, filters] as const,
  tour: (locale: string, slug: string) => [...catalogKeys.all, 'tour', locale, slug] as const,
  destinations: (locale: string, filters: CatalogFilters) => [...catalogKeys.all, 'destinations', locale, filters] as const,
  destination: (locale: string, slug: string) => [...catalogKeys.all, 'destination', locale, slug] as const,
  categories: (locale: string) => [...catalogKeys.all, 'categories', locale] as const,
  cars: (filters: CarFilters) => [...catalogKeys.all, 'cars', filters] as const,
}

export const toursQuery = (locale: string, filters: TourFilters = {}) => queryOptions({
  queryKey: catalogKeys.tours(locale, filters),
  queryFn: async () => (await apiClient.get<PaginatedResponse<Tour>>('/tours', { params: { locale, ...filters } })).data,
})

export const tourQuery = (locale: string, slug: string) => queryOptions({
  queryKey: catalogKeys.tour(locale, slug),
  queryFn: async () => (await apiClient.get<ApiEnvelope<Tour>>(`/tours/${slug}`, { params: { locale } })).data.data,
})

export const destinationsQuery = (locale: string, filters: CatalogFilters = {}) => queryOptions({
  queryKey: catalogKeys.destinations(locale, filters),
  queryFn: async () => (await apiClient.get<PaginatedResponse<Destination>>('/destinations', { params: { locale, ...filters } })).data,
})

export const destinationQuery = (locale: string, slug: string) => queryOptions({
  queryKey: catalogKeys.destination(locale, slug),
  queryFn: async () => (await apiClient.get<ApiEnvelope<Destination>>(`/destinations/${slug}`, { params: { locale } })).data.data,
})

export const categoriesQuery = (locale: string) => queryOptions({
  queryKey: catalogKeys.categories(locale),
  queryFn: async () => (await apiClient.get<ApiEnvelope<TourCategory[]>>('/tour-categories', { params: { locale } })).data.data,
})

export const carsQuery = (filters: CarFilters = {}) => queryOptions({
  queryKey: catalogKeys.cars(filters),
  queryFn: async () => (await apiClient.get<PaginatedResponse<Car>>('/cars', { params: filters })).data,
})
