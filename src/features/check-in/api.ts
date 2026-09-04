import { apiClient } from '@/lib/api-client'
import type { ApiEnvelope } from '@/types/api'
import type { CheckInBooking } from '@/types/domain'

export const checkInApi = {
  lookup: async (token: string): Promise<CheckInBooking> =>
    (await apiClient.post<ApiEnvelope<CheckInBooking>>('/check-ins/lookup', { token })).data.data,
  confirm: async (token: string, passengers: number, notes?: string): Promise<CheckInBooking> =>
    (await apiClient.post<ApiEnvelope<CheckInBooking>>('/check-ins', { token, passengers, ...(notes ? { notes } : {}) })).data.data,
}
