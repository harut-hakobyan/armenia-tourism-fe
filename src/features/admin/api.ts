import { apiClient } from '@/lib/api-client'
import type { PaginatedResponse, ApiEnvelope } from '@/types/api'
import type { AdminBooking, AssignmentAvailability, BookingStatus, DashboardStats, Media } from '@/types/domain'

export interface AdminBookingFilters { page?: number; per_page?: number; booking_status?: BookingStatus; date_from?: string; date_to?: string; search?: string; car_id?: number; driver_id?: number }
export type DirectoryType='tours'|'destinations'|'cars'|'drivers'
export interface DirectoryItem { id:number; slug?:string; brand?:string; model?:string; year?:number; plate_number?:string; color?:string|null; category?:string; passenger_capacity?:number; luggage_capacity?:number; transmission?:string|null; air_conditioning?:boolean; wifi?:boolean; child_seat_available?:boolean; base_price_minor?:number; price_per_km_minor?:number; price_per_hour_minor?:number; currency?:string; first_name?:string; last_name?:string; active:boolean; featured?:boolean; available_for_booking?:boolean; translations?:Array<{locale:string;name?:string;title?:string}> }
export interface CarAdminInput { brand:string; model:string; year:number; plate_number:string; color:string|null; category:'economy'|'comfort'|'business'|'suv'|'minivan'|'premium'; passenger_capacity:number; luggage_capacity:number; transmission:string|null; air_conditioning:boolean; wifi:boolean; child_seat_available:boolean; base_price_minor:number; price_per_km_minor:number; price_per_hour_minor:number; currency:'EUR'|'USD'|'AMD'; active:boolean; available_for_booking:boolean }
export interface DirectoryResponse { data:DirectoryItem[]; current_page:number; last_page:number; total:number }
export type CmsType='customers'|'reviews'|'promo-codes'|'faqs'|'inquiries'|'audit-logs'
export interface CmsItem { id:number; name?:string; first_name?:string; last_name?:string; email?:string; phone?:string; customer_name?:string; rating?:number; title?:string; review?:string; code?:string; type?:string; value?:number; currency?:string; category?:string; active?:boolean; verified?:boolean; status?:string; subject?:string; message?:string; bookings_count?:number; action?:string; created_at?:string; sort_order?:number; translations?:Array<{locale:string;question:string;answer:string}>; user?:{name:string}|null }
export interface CmsResponse { data:CmsItem[]; current_page:number; last_page:number; total:number }
export interface SettingItem { id:number; key:string; value:string|null; type:string; is_public:boolean }

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
  updateDirectory:async(type:DirectoryType,id:number,input:Partial<CarAdminInput>&{active?:boolean;featured?:boolean;available_for_booking?:boolean}):Promise<DirectoryItem>=>(await apiClient.patch<ApiEnvelope<DirectoryItem>>(`/admin/directory/${type}/${id}`,input)).data.data,
  createCar:async(input:CarAdminInput):Promise<DirectoryItem>=>(await apiClient.post<ApiEnvelope<DirectoryItem>>('/admin/directory/cars',input)).data.data,
  deleteCar:async(id:number):Promise<void>=>{await apiClient.delete(`/admin/directory/cars/${id}`)},
  uploadMedia:async(type:DirectoryType,id:number,file:File,collection?:'cover'|'gallery'|'profile'):Promise<Media>=>{const form=new FormData();form.append('file',file);form.append('collection',collection??(type==='drivers'?'profile':'gallery'));return (await apiClient.post<ApiEnvelope<Media>>(`/admin/media/${type}/${id}`,form)).data.data},
  cms:async(type:CmsType):Promise<CmsResponse>=>(await apiClient.get<CmsResponse>(`/admin/${type}`)).data,
  updateReview:async(id:number,active:boolean):Promise<CmsItem>=>(await apiClient.patch<ApiEnvelope<CmsItem>>(`/admin/reviews/${id}`,{active})).data.data,
  updatePromo:async(id:number,active:boolean):Promise<CmsItem>=>(await apiClient.patch<ApiEnvelope<CmsItem>>(`/admin/promo-codes/${id}`,{active})).data.data,
  createPromo:async(input:{code:string;type:'percentage'|'fixed';value:number;currency:string;active:boolean}):Promise<CmsItem>=>(await apiClient.post<ApiEnvelope<CmsItem>>('/admin/promo-codes',input)).data.data,
  createFaq:async(input:{category:string;active:boolean;sort_order:number;translations:Array<{locale:string;question:string;answer:string}>}):Promise<CmsItem>=>(await apiClient.post<ApiEnvelope<CmsItem>>('/admin/faqs',input)).data.data,
  updateFaq:async(item:CmsItem,active:boolean):Promise<CmsItem>=>(await apiClient.patch<ApiEnvelope<CmsItem>>(`/admin/faqs/${item.id}`,{category:item.category,active,sort_order:item.sort_order??0,translations:item.translations})).data.data,
  updateInquiry:async(id:number,status:'new'|'in_progress'|'resolved'):Promise<CmsItem>=>(await apiClient.patch<ApiEnvelope<CmsItem>>(`/admin/inquiries/${id}`,{status})).data.data,
  settings:async():Promise<SettingItem[]>=>(await apiClient.get<ApiEnvelope<SettingItem[]>>('/admin/settings')).data.data,
  updateSetting:async(id:number,value:string):Promise<SettingItem>=>(await apiClient.patch<ApiEnvelope<SettingItem>>(`/admin/settings/${id}`,{value})).data.data,
}
