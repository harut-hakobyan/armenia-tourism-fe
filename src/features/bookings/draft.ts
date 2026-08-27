import type { Estimate, RoutePoint, ServiceType } from '@/types/domain'

export interface BookingDraft { service_type: ServiceType; car_id?: number; tour_id?: number; duration_minutes?: number; route_points?: RoutePoint[]; dropoff_address?: string; service_options?: Record<string, unknown>; estimate?: Estimate }
const key='amt.booking.draft'
export const bookingDraft={get:():BookingDraft|null=>{try{return JSON.parse(sessionStorage.getItem(key)??'null') as BookingDraft|null}catch{return null}},set:(draft:BookingDraft)=>sessionStorage.setItem(key,JSON.stringify(draft)),clear:()=>sessionStorage.removeItem(key)}
