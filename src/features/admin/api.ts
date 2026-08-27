import { apiClient } from '@/lib/api-client'
import type { PaginatedResponse, ApiEnvelope } from '@/types/api'
import type { AdminBooking, AssignmentAvailability, BookingStatus, DashboardStats } from '@/types/domain'

export interface AdminBookingFilters { page?: number; per_page?: number; booking_status?: BookingStatus; date_from?: string; date_to?: string; search?: string; car_id?: number; driver_id?: number }
export type DirectoryType='tours'|'destinations'|'cars'|'drivers'
export interface DirectoryItem { id:number; slug?:string; brand?:string; model?:string; plate_number?:string; first_name?:string; last_name?:string; active:boolean; featured?:boolean; available_for_booking?:boolean; translations?:Array<{locale:string;name?:string;title?:string}> }
export interface DirectoryResponse { data:DirectoryItem[]; current_page:number; last_page:number; total:number }

export const adminApi = {
  dashboard: async (): Promise<DashboardStats> =>
    (await apiClient.get<ApiEnvelope<DashboardStats>>('/admin/dashboard')).data.data,
  bookings: async (filters: AdminBookingFilters = {}): Promise<PaginatedResponse<AdminBooking>> =>
    (await apiClient.get<PaginatedResponse<AdminBooking>>('/admin/bookings', { params: filters })).data,
  booking: async (id: number): Promise<AdminBooking> =>
    (await apiClient.get<ApiEnvelope<AdminBooking>>(`/admin/bookings/${id}`)).data.data,
  calendar:async(dateFrom:string,dateTo:string):Promise<AdminBooking[]>=>(await apiClient.get<ApiEnvelope<AdminBooking[]>>('/admin/bookings/calendar',{params:{date_from:dateFrom,date_to:dateTo}})).data.data,
  confirm: async (id: number, note?: string): Promise<AdminBooking> =>
    (await apiClient.post<ApiEnvelope<AdminBooking>>(`/admin/bookings/${id}/confirm`, { note })).data.data,
  assign: async (id: number, carId: number, driverId: number, note?: string): Promise<AdminBooking> =>
    (await apiClient.post<ApiEnvelope<AdminBooking>>(`/admin/bookings/${id}/assign`, { car_id: carId, driver_id: driverId, note })).data.data,
  cancel: async (id: number, note?: string): Promise<AdminBooking> =>
    (await apiClient.post<ApiEnvelope<AdminBooking>>(`/admin/bookings/${id}/cancel`, { note })).data.data,
  availability: async (id: number): Promise<AssignmentAvailability> =>
    (await apiClient.get<ApiEnvelope<AssignmentAvailability>>(`/admin/bookings/${id}/availability`)).data.data,
  directory:async(type:DirectoryType):Promise<DirectoryResponse>=>(await apiClient.get<DirectoryResponse>(`/admin/directory/${type}`)).data,
  updateDirectory:async(type:DirectoryType,id:number,input:{active?:boolean;featured?:boolean;available_for_booking?:boolean}):Promise<DirectoryItem>=>(await apiClient.patch<ApiEnvelope<DirectoryItem>>(`/admin/directory/${type}/${id}`,input)).data.data,
}
