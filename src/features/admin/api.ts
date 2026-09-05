import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse, ApiEnvelope } from "@/types/api";
import type {
  AdminBooking,
  AssignmentAvailability,
  BookingStatus,
  Currency,
  DashboardStats,
  Media,
  PricingType,
  Tour,
  TourFormat,
} from "@/types/domain";

export interface AdminBookingFilters {
  page?: number;
  per_page?: number;
  booking_status?: BookingStatus;
  date_from?: string;
  date_to?: string;
  search?: string;
  car_id?: number;
  driver_id?: number;
}
export type DirectoryType = "tours" | "destinations" | "cars" | "drivers";
export interface DirectoryItem {
  id: number;
  slug?: string;
  brand?: string;
  model?: string;
  year?: number;
  plate_number?: string;
  color?: string | null;
  category?: string;
  passenger_capacity?: number;
  luggage_capacity?: number;
  transmission?: string | null;
  air_conditioning?: boolean;
  wifi?: boolean;
  child_seat_available?: boolean;
  base_price_minor?: number;
  price_per_km_minor?: number;
  price_per_hour_minor?: number;
  currency?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string | null;
  locale?: string;
  languages?: string[];
  experience_years?: number;
  license_number?: string;
  rating?: number | null;
  preferred_car_id?: number | null;
  car_ids?: number[];
  cars?: Array<{ id: number; name: string; plate_number: string }>;
  telegram_connected?: boolean;
  profile_image?: Media | null;
  active: boolean;
  featured?: boolean;
  available_for_booking?: boolean;
  is_fallback?: boolean;
  translations?: Array<{ locale: string; name?: string; title?: string }>;
  cover_image?: Media | null;
}
export type CarCategory =
  "economy" | "comfort" | "business" | "suv" | "minivan" | "premium" | "bus";
export interface CarAdminInput {
  brand: string;
  model: string;
  year: number;
  plate_number: string;
  color: string | null;
  category: CarCategory;
  passenger_capacity: number;
  luggage_capacity: number;
  transmission: string | null;
  air_conditioning: boolean;
  wifi: boolean;
  child_seat_available: boolean;
  active: boolean;
  available_for_booking: boolean;
}
export interface CarCategoryPrice {
  category: CarCategory;
  fixed_price_minor: number;
  currency: Currency;
}
export interface DriverAdminInput {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password?: string;
  locale: "en" | "ru" | "hy";
  languages: string[];
  experience_years: number;
  license_number: string;
  rating: number | null;
  active: boolean;
  preferred_car_id: number | null;
  car_ids: number[];
}
export interface DirectoryResponse {
  data: DirectoryItem[];
  current_page: number;
  last_page: number;
  total: number;
}
export interface AdminTranslation {
  locale: "en" | "ru" | "hy";
  title?: string;
  name?: string;
  short_description: string | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
}
export interface TourItineraryInput {
  destination_id: number;
  day_number: number;
  duration_minutes: number | null;
  optional: boolean;
  notes: string | null;
}
export interface AdminTourItineraryStop extends TourItineraryInput {
  id: number;
  stop_order: number;
  destination: { id: number; slug: string; name: string | null } | null;
}
export interface TourAdminInput {
  category_id: number | null;
  slug: string;
  duration_minutes: number;
  approximate_distance_km: number | null;
  starting_price_minor: number;
  currency: Currency;
  pricing_type: PricingType;
  format: TourFormat;
  start_time: string | null;
  meeting_point: string | null;
  active: boolean;
  featured: boolean;
  max_passengers: number | null;
  pickup_available: boolean;
  dropoff_available: boolean;
  free_cancellation_hours: number;
  sort_order: number;
  translations: Array<AdminTranslation & { title: string }>;
  itinerary: TourItineraryInput[];
}
export interface AdminTour extends Omit<TourAdminInput, "itinerary"> {
  id: number;
  itinerary: AdminTourItineraryStop[];
  cover_image: Media | null;
  gallery?: Media[];
  video: Media | null;
}
export interface DestinationAdminInput {
  slug: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  active: boolean;
  featured: boolean;
  sort_order: number;
  translations: Array<AdminTranslation & { name: string }>;
}
export interface AdminDestination extends DestinationAdminInput {
  id: number;
  cover_image: Media | null;
}
export interface AdminTourCategory {
  id: number;
  slug: string;
  active: boolean;
  translations: Array<{ locale: string; name: string }>;
}
export interface CatalogResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}
export type CmsType =
  "customers" | "reviews" | "promo-codes" | "faqs" | "inquiries" | "audit-logs";
export interface CmsItem {
  id: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  customer_name?: string;
  rating?: number;
  title?: string;
  review?: string;
  code?: string;
  type?: string;
  value?: number;
  currency?: string;
  category?: string;
  active?: boolean;
  verified?: boolean;
  status?: string;
  subject?: string;
  message?: string;
  bookings_count?: number;
  action?: string;
  created_at?: string;
  sort_order?: number;
  translations?: Array<{ locale: string; question: string; answer: string }>;
  user?: { name: string } | null;
}
export interface CmsResponse {
  data: CmsItem[];
  current_page: number;
  last_page: number;
  total: number;
}
export interface SettingItem {
  id: number;
  key: string;
  value: string | null;
  type: string;
  is_public: boolean;
}

export const adminApi = {
  dashboard: async (): Promise<DashboardStats> =>
    (await apiClient.get<ApiEnvelope<DashboardStats>>("/admin/dashboard")).data
      .data,
  bookings: async (
    filters: AdminBookingFilters = {},
  ): Promise<PaginatedResponse<AdminBooking>> =>
    (
      await apiClient.get<PaginatedResponse<AdminBooking>>("/admin/bookings", {
        params: filters,
      })
    ).data,
  booking: async (id: number): Promise<AdminBooking> =>
    (await apiClient.get<ApiEnvelope<AdminBooking>>(`/admin/bookings/${id}`))
      .data.data,
  calendar: async (dateFrom: string, dateTo: string): Promise<AdminBooking[]> =>
    (
      await apiClient.get<ApiEnvelope<AdminBooking[]>>(
        "/admin/bookings/calendar",
        { params: { date_from: dateFrom, date_to: dateTo } },
      )
    ).data.data,
  confirm: async (id: number, note?: string): Promise<AdminBooking> =>
    (
      await apiClient.post<ApiEnvelope<AdminBooking>>(
        `/admin/bookings/${id}/confirm`,
        { note },
      )
    ).data.data,
  assign: async (
    id: number,
    carId: number,
    driverId: number,
    note?: string,
  ): Promise<AdminBooking> =>
    (
      await apiClient.post<ApiEnvelope<AdminBooking>>(
        `/admin/bookings/${id}/assign`,
        { car_id: carId, driver_id: driverId, note },
      )
    ).data.data,
  cancel: async (id: number, note?: string): Promise<AdminBooking> =>
    (
      await apiClient.post<ApiEnvelope<AdminBooking>>(
        `/admin/bookings/${id}/cancel`,
        { note },
      )
    ).data.data,
  availability: async (id: number): Promise<AssignmentAvailability> =>
    (
      await apiClient.get<ApiEnvelope<AssignmentAvailability>>(
        `/admin/bookings/${id}/availability`,
      )
    ).data.data,
  directory: async (type: DirectoryType): Promise<DirectoryResponse> =>
    (await apiClient.get<DirectoryResponse>(`/admin/directory/${type}`)).data,
  updateDirectory: async (
    type: DirectoryType,
    id: number,
    input: Partial<CarAdminInput> & {
      active?: boolean;
      featured?: boolean;
      available_for_booking?: boolean;
    },
  ): Promise<DirectoryItem> =>
    (
      await apiClient.patch<ApiEnvelope<DirectoryItem>>(
        `/admin/directory/${type}/${id}`,
        input,
      )
    ).data.data,
  createCar: async (input: CarAdminInput): Promise<DirectoryItem> =>
    (
      await apiClient.post<ApiEnvelope<DirectoryItem>>(
        "/admin/directory/cars",
        input,
      )
    ).data.data,
  carCategoryPrices: async (): Promise<CarCategoryPrice[]> =>
    (
      await apiClient.get<ApiEnvelope<CarCategoryPrice[]>>(
        "/admin/directory/car-category-prices",
      )
    ).data.data,
  updateCarCategoryPrice: async (
    category: CarCategory,
    input: Pick<CarCategoryPrice, "fixed_price_minor" | "currency">,
  ): Promise<CarCategoryPrice> =>
    (
      await apiClient.patch<ApiEnvelope<CarCategoryPrice>>(
        `/admin/directory/car-category-prices/${category}`,
        input,
      )
    ).data.data,
  deleteCar: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/directory/cars/${id}`);
  },
  createDriver: async (input: DriverAdminInput): Promise<DirectoryItem> =>
    (
      await apiClient.post<ApiEnvelope<DirectoryItem>>(
        "/admin/directory/drivers",
        input,
      )
    ).data.data,
  updateDriver: async (
    id: number,
    input: Partial<DriverAdminInput>,
  ): Promise<DirectoryItem> =>
    (
      await apiClient.patch<ApiEnvelope<DirectoryItem>>(
        `/admin/directory/drivers/${id}`,
        input,
      )
    ).data.data,
  deleteDriver: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/directory/drivers/${id}`);
  },
  tours: async (): Promise<CatalogResponse<AdminTour>> =>
    (
      await apiClient.get<CatalogResponse<AdminTour>>(
        "/admin/directory/tours",
        { params: { per_page: 100 } },
      )
    ).data,
  createTour: async (input: TourAdminInput): Promise<AdminTour> =>
    (
      await apiClient.post<ApiEnvelope<AdminTour>>(
        "/admin/directory/tours",
        input,
      )
    ).data.data,
  updateTour: async (
    id: number,
    input: Partial<TourAdminInput>,
  ): Promise<AdminTour> =>
    (
      await apiClient.patch<ApiEnvelope<AdminTour>>(
        `/admin/directory/tours/${id}`,
        input,
      )
    ).data.data,
  deleteTour: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/directory/tours/${id}`);
  },
  destinations: async (): Promise<CatalogResponse<AdminDestination>> =>
    (
      await apiClient.get<CatalogResponse<AdminDestination>>(
        "/admin/directory/destinations",
        { params: { per_page: 100 } },
      )
    ).data,
  createDestination: async (
    input: DestinationAdminInput,
  ): Promise<AdminDestination> =>
    (
      await apiClient.post<ApiEnvelope<AdminDestination>>(
        "/admin/directory/destinations",
        input,
      )
    ).data.data,
  updateDestination: async (
    id: number,
    input: Partial<DestinationAdminInput>,
  ): Promise<AdminDestination> =>
    (
      await apiClient.patch<ApiEnvelope<AdminDestination>>(
        `/admin/directory/destinations/${id}`,
        input,
      )
    ).data.data,
  deleteDestination: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/directory/destinations/${id}`);
  },
  tourCategories: async (): Promise<AdminTourCategory[]> =>
    (
      await apiClient.get<ApiEnvelope<AdminTourCategory[]>>(
        "/admin/directory/tour-categories",
      )
    ).data.data,
  media: async (type: DirectoryType, id: number): Promise<Media[]> =>
    (await apiClient.get<ApiEnvelope<Media[]>>(`/admin/media/${type}/${id}`))
      .data.data,
  tourMedia: async (id: number, slug: string): Promise<Media[]> => {
    try {
      return (
        await apiClient.get<ApiEnvelope<Media[]>>(`/admin/media/tours/${id}`)
      ).data.data;
    } catch {
      const tour = (
        await apiClient.get<ApiEnvelope<Tour>>(`/tours/${slug}`, {
          params: { locale: "en" },
        })
      ).data.data;
      const gallery = (tour.gallery ?? []).map((image) => ({
        ...image,
        collection: "gallery" as const,
      }));
      const images =
        tour.cover_image &&
        !gallery.some((image) => image.id === tour.cover_image?.id)
          ? [{ ...tour.cover_image, collection: "cover" as const }, ...gallery]
          : gallery;
      return tour.video
        ? [...images, { ...tour.video, collection: "video" as const }]
        : images;
    }
  },
  uploadMedia: async (
    type: DirectoryType,
    id: number,
    file: File,
    collection?: "cover" | "gallery" | "profile" | "video",
    sortOrder?: number,
  ): Promise<Media> => {
    const form = new FormData();
    form.append("file", file);
    form.append(
      "collection",
      collection ?? (type === "drivers" ? "profile" : "cover"),
    );
    if (sortOrder !== undefined) form.append("sort_order", String(sortOrder));
    return (
      await apiClient.post<ApiEnvelope<Media>>(
        `/admin/media/${type}/${id}`,
        form,
      )
    ).data.data;
  },
  deleteMedia: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/media/${id}`);
  },
  cms: async (type: CmsType): Promise<CmsResponse> =>
    (await apiClient.get<CmsResponse>(`/admin/${type}`)).data,
  updateReview: async (id: number, active: boolean): Promise<CmsItem> =>
    (
      await apiClient.patch<ApiEnvelope<CmsItem>>(`/admin/reviews/${id}`, {
        active,
      })
    ).data.data,
  updatePromo: async (id: number, active: boolean): Promise<CmsItem> =>
    (
      await apiClient.patch<ApiEnvelope<CmsItem>>(`/admin/promo-codes/${id}`, {
        active,
      })
    ).data.data,
  createPromo: async (input: {
    code: string;
    type: "percentage" | "fixed";
    value: number;
    currency: string;
    active: boolean;
  }): Promise<CmsItem> =>
    (await apiClient.post<ApiEnvelope<CmsItem>>("/admin/promo-codes", input))
      .data.data,
  createFaq: async (input: {
    category: string;
    active: boolean;
    sort_order: number;
    translations: Array<{ locale: string; question: string; answer: string }>;
  }): Promise<CmsItem> =>
    (await apiClient.post<ApiEnvelope<CmsItem>>("/admin/faqs", input)).data
      .data,
  updateFaq: async (item: CmsItem, active: boolean): Promise<CmsItem> =>
    (
      await apiClient.patch<ApiEnvelope<CmsItem>>(`/admin/faqs/${item.id}`, {
        category: item.category,
        active,
        sort_order: item.sort_order ?? 0,
        translations: item.translations,
      })
    ).data.data,
  updateInquiry: async (
    id: number,
    status: "new" | "in_progress" | "resolved",
  ): Promise<CmsItem> =>
    (
      await apiClient.patch<ApiEnvelope<CmsItem>>(`/admin/inquiries/${id}`, {
        status,
      })
    ).data.data,
  settings: async (): Promise<SettingItem[]> =>
    (await apiClient.get<ApiEnvelope<SettingItem[]>>("/admin/settings")).data
      .data,
  updateSetting: async (id: number, value: string): Promise<SettingItem> =>
    (
      await apiClient.patch<ApiEnvelope<SettingItem>>(`/admin/settings/${id}`, {
        value,
      })
    ).data.data,
};
