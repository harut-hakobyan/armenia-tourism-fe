import { apiClient } from '@/lib/api-client'
import type { ApiEnvelope } from '@/types/api'
import type { CreatedBooking, PublicBooking, RoutePoint, ServiceType } from '@/types/domain'

export interface CreateBookingInput {
  idempotency_key: string
  service_type: ServiceType
  tour_id?: number
  car_id?: number
  booking_date: string
  pickup_time: string
  passengers: number
  pickup_address: string
  pickup_latitude?: number
  pickup_longitude?: number
  dropoff_address?: string
  dropoff_latitude?: number
  dropoff_longitude?: number
  customer_name: string
  customer_email?: string
  customer_phone: string
  customer_whatsapp?: string
  customer_nationality?: string
  customer_notes?: string
  payment_method: 'pay_driver' | 'deposit' | 'full_online'
  promo_code?: string
  duration_minutes?: number
  route_points?: RoutePoint[]
  service_options?: Record<string, unknown>
}

export const bookingApi = {
  create: async (input: CreateBookingInput): Promise<CreatedBooking> =>
    (await apiClient.post<ApiEnvelope<CreatedBooking>>('/bookings', input)).data.data,
  findPublic: async (bookingNumber: string, token: string): Promise<PublicBooking> =>
    (await apiClient.get<ApiEnvelope<PublicBooking>>(`/bookings/${bookingNumber}/${token}`)).data.data,
}
