export type Currency = 'EUR' | 'USD' | 'AMD'
export type UserRole = 'admin' | 'manager' | 'driver' | 'customer'
export type ServiceType = 'tour' | 'airport_transfer' | 'private_driver' | 'custom_trip'
export type PricingType = 'per_car' | 'per_person' | 'fixed' | 'custom'
export type TourFormat = 'private' | 'group'
export type BookingStatus = 'pending' | 'confirmed' | 'assigned' | 'driver_on_the_way' | 'driver_arrived' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
export type DriverTripStatus = 'assigned' | 'on_the_way' | 'arrived' | 'passenger_picked_up' | 'trip_started' | 'completed'

export interface Media { id: number; uuid: string; url: string; alt_text: string | null; mime_type: string }
export interface SeoFields { title: string | null; description: string | null }

export interface Destination {
  id: number
  slug: string
  locale: string
  name: string
  short_description: string | null
  description: string | null
  coordinates: { latitude: number | null; longitude: number | null }
  address: string | null
  featured: boolean
  cover_image: Media | null
  gallery: Media[]
  seo: SeoFields
}

export interface TourCategory { id: number; slug: string; locale: string; name: string; description: string | null; seo: SeoFields }

export interface TourStop {
  day_number: number
  stop_order: number
  duration_minutes: number | null
  optional: boolean
  notes: string | null
  destination: { slug: string; name: string; latitude: number | null; longitude: number | null } | null
}

export interface Tour {
  id: number
  slug: string
  locale: string
  title: string
  short_description: string | null
  description: string | null
  category: TourCategory | null
  duration_minutes: number
  approximate_distance_km: number | null
  starting_price: { amount_minor: number; currency: Currency; pricing_type: PricingType }
  format: TourFormat
  max_passengers: number | null
  pickup_available: boolean
  dropoff_available: boolean
  free_cancellation_hours: number
  featured: boolean
  cover_image: Media | null
  gallery: Media[]
  itinerary?: TourStop[]
  days?: Array<{ day_number: number; title: string | null; description: string | null; overnight_location: string | null }>
  upcoming_departures?: GroupTourDeparture[]
  seo: SeoFields
}

export interface GroupTourDeparture {
  id: number
  starts_at: string
  ends_at: string
  meeting_point: string
  capacity: number
  remaining_seats: number
  price_per_person: { amount_minor: number; currency: Currency }
}

export interface Car {
  id: number
  name: string
  brand: string
  model: string
  year: number
  color: string
  category: 'economy' | 'comfort' | 'business' | 'suv' | 'minivan' | 'premium'
  passenger_capacity: number
  luggage_capacity: number
  transmission: string
  features: { air_conditioning: boolean; wifi: boolean; child_seat_available: boolean }
  rates: { base_minor: number; per_km_minor: number; per_hour_minor: number; currency: Currency }
  cover_image: Media | null
  gallery: Media[]
}

export interface User { id: number; name: string; first_name: string | null; last_name: string | null; email: string; phone: string | null; role: UserRole; locale: string }

export interface PriceBreakdown { base_minor: number; adjustments: Record<string, number>; subtotal_minor: number; discount_minor: number; total_minor: number; currency: Currency; promo_code: string | null }
export interface RoutePoint { latitude: number; longitude: number; label?: string }

export interface Estimate {
  service_type: ServiceType
  car: { id: number; name: string }
  tour_format?: TourFormat
  group_tour_departure_id?: number
  starts_at?: string
  meeting_point?: string
  remaining_seats?: number
  passengers: number
  duration_minutes?: number
  estimated_distance_meters?: number
  estimated_driving_minutes?: number
  estimated_duration_minutes?: number
  route_provider?: string
  route_points?: RoutePoint[]
  price: PriceBreakdown
}

export interface Booking {
  booking_number: string
  service_type: ServiceType
  booking_status: BookingStatus
  driver_trip_status: DriverTripStatus | null
  payment_status: string
  payment_method: string
  booking_date: string
  pickup_time: string
  starts_at: string
  planned_end_at: string
  pickup: { address: string; latitude: string | null; longitude: string | null }
  dropoff: { address: string | null; latitude: string | null; longitude: string | null }
  passengers: number
  attendance: { status: AttendanceStatus; checked_in_passengers: number; remaining_passengers: number; last_checked_in_at: string | null }
  customer: { name: string; email: string | null; phone: string; whatsapp: string | null; nationality: string | null }
  car: { id: number; name: string; category: string }
  driver: { name: string; phone: string } | null
  price: { subtotal_minor: number; discount_minor: number; deposit_amount_minor: number; total_minor: number; currency: Currency; breakdown: PriceBreakdown }
  service_details: unknown
  created_at: string
}

export type AttendanceStatus = 'expected' | 'partially_checked_in' | 'checked_in'
export interface CreatedBooking extends Booking { secure_token: string; public_url: string; qr_payload: string }
export interface PublicBooking extends Booking { qr_payload: string }
export interface CheckInBooking {
  id: number
  booking_number: string
  service_type: ServiceType
  booking_status: BookingStatus
  tour: { id: number; title: string | null } | null
  customer: { name: string; phone: string }
  starts_at: string
  pickup_address: string
  passengers: number
  car: { id: number; name: string } | null
  driver: { id: number; name: string } | null
  attendance: Booking['attendance']
  check_ins: Array<{ id:number; passengers_checked_in:number; total_checked_in:number; checked_in_at:string; checked_in_by:{id:number;name:string;role:UserRole}|null }>
}
export interface AdminBooking extends Booking { id: number; customer_id: number | null; tour_id: number | null; car_id: number; driver_id: number | null; promo_code_id: number | null; admin_notes: string | null; updated_at: string }
export interface DriverBooking extends Booking { id: number }
export interface DashboardStats { counts: { today: number; upcoming: number; pending: number; completed: number }; revenue: { total_minor: number; month_minor: number; currency: Currency }; top_tours: Array<{ id: number; slug: string; bookings_count: number }>; top_cars: Array<{ id: number; name: string; bookings_count: number }> }
export interface AssignmentAvailability { cars: Array<{ id: number; name: string; plate_number: string; category: string; passenger_capacity: number; is_fallback: boolean }>; drivers: Array<{ id: number; name: string; phone: string; rating: string; car_ids: number[] }> }
