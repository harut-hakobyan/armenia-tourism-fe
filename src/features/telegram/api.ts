import { apiClient } from '@/lib/api-client'
import type { ApiEnvelope } from '@/types/api'

export interface TelegramConnection {
  connected: boolean
  username: string | null
  notifications_enabled: boolean
  bot_username: string | null
  link_url?: string | null
  link_code?: string
  expires_at?: string
}

export const telegramApi = {
  status: async (): Promise<TelegramConnection> =>
    (await apiClient.get<ApiEnvelope<TelegramConnection>>('/telegram')).data.data,
  link: async (): Promise<TelegramConnection> =>
    (await apiClient.post<ApiEnvelope<TelegramConnection>>('/telegram/link')).data.data,
  disconnect: async (): Promise<void> => { await apiClient.delete('/telegram') },
}
