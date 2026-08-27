import { apiClient } from '@/lib/api-client'
import type { ApiEnvelope, PaginatedResponse } from '@/types/api'
import type { DriverBooking, DriverTripStatus } from '@/types/domain'

export const driverApi={
  trips:async(status?:DriverTripStatus):Promise<PaginatedResponse<DriverBooking>>=>(await apiClient.get<PaginatedResponse<DriverBooking>>('/driver/trips',{params:{status,per_page:50}})).data,
  trip:async(id:number):Promise<DriverBooking>=>(await apiClient.get<ApiEnvelope<DriverBooking>>(`/driver/trips/${id}`)).data.data,
  status:async(id:number,status:DriverTripStatus,note?:string):Promise<DriverBooking>=>(await apiClient.post<ApiEnvelope<DriverBooking>>(`/driver/trips/${id}/status`,{status,note})).data.data,
}
