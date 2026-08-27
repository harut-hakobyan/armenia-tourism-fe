import { apiClient } from '@/lib/api-client'
import type { PaginatedResponse, ApiEnvelope } from '@/types/api'
import type { AdminBooking, BookingStatus } from '@/types/domain'

export interface AdminBookingFilters { page?: number; per_page?: number; booking_status?: BookingStatus; date_from?: string; date_to?: string; search?: string; car_id?: number; driver_id?: number }

export const adminApi = {
  bookings: async (filters: AdminBookingFilters = {}): Promise<PaginatedResponse<AdminBooking>> =>
    (await apiClient.get<PaginatedResponse<AdminBooking>>('/admin/bookings', { params: filters })).data,
  booking: async (id: number): Promise<AdminBooking> =>
    (await apiClient.get<ApiEnvelope<AdminBooking>>(`/admin/bookings/${id}`)).data.data,
  confirm: async (id: number, note?: string): Promise<AdminBooking> =>
    (await apiClient.post<ApiEnvelope<AdminBooking>>(`/admin/bookings/${id}/confirm`, { note })).data.data,
  assign: async (id: number, carId: number, driverId: number, note?: string): Promise<AdminBooking> =>
    (await apiClient.post<ApiEnvelope<AdminBooking>>(`/admin/bookings/${id}/assign`, { car_id: carId, driver_id: driverId, note })).data.data,
  cancel: async (id: number, note?: string): Promise<AdminBooking> =>
    (await apiClient.post<ApiEnvelope<AdminBooking>>(`/admin/bookings/${id}/cancel`, { note })).data.data,
}
