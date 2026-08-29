import { apiClient } from '@/lib/api-client'
import type { ApiEnvelope } from '@/types/api'
import type { Estimate, RoutePoint } from '@/types/domain'

interface BaseEstimateInput { car_id?: number; passengers: number; promo_code?: string; customer_email?: string }
export interface TourEstimateInput extends BaseEstimateInput { tour_id: number; booking_date: string; group_tour_departure_id?: number }
export interface RouteEstimateInput extends BaseEstimateInput { car_id: number; route_points: RoutePoint[] }
export interface TransferEstimateInput extends RouteEstimateInput { extra_waiting_minutes?: number }
export interface PrivateDriverEstimateInput extends BaseEstimateInput { car_id: number; duration_minutes: number }

async function postEstimate(path: string, input: object): Promise<Estimate> {
  return (await apiClient.post<ApiEnvelope<Estimate>>(path, input)).data.data
}

export const estimateApi = {
  tour: (input: TourEstimateInput) => postEstimate('/pricing/tours/estimate', input),
  transfer: (input: TransferEstimateInput) => postEstimate('/transfers/estimate', input),
  privateDriver: (input: PrivateDriverEstimateInput) => postEstimate('/private-driver/estimate', input),
  customTrip: (input: RouteEstimateInput) => postEstimate('/custom-trips/estimate', input),
}
