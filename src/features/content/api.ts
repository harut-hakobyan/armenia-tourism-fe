import { apiClient } from '@/lib/api-client'
import type { ApiEnvelope } from '@/types/api'

export interface FaqItem {
  id: number
  category: string
  question: string
  answer: string
  sort_order: number
}

export interface ContactInput {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export const contentApi = {
  faqs: async (): Promise<FaqItem[]> =>
    (await apiClient.get<ApiEnvelope<FaqItem[]>>('/faqs')).data.data,
  settings: async (): Promise<Record<string, string>> =>
    (await apiClient.get<ApiEnvelope<Record<string, string>>>('/settings')).data.data,
  contact: async (input: ContactInput): Promise<{ id: number; status: string }> =>
    (await apiClient.post<ApiEnvelope<{ id: number; status: string }>>('/contact-inquiries', input)).data.data,
}
