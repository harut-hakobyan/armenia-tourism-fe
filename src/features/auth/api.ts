import { apiClient } from '@/lib/api-client'
import type { ApiEnvelope } from '@/types/api'
import type { User } from '@/types/domain'

export interface LoginInput { email: string; password: string; device_name?: string }
export interface LoginResult { user: User; token: string }

export const authApi = {
  login: async (input: LoginInput): Promise<LoginResult> =>
    (await apiClient.post<ApiEnvelope<LoginResult>>('/auth/login', { device_name: 'tourism-web', ...input })).data.data,
  me: async (): Promise<User> => (await apiClient.get<ApiEnvelope<User>>('/auth/me')).data.data,
  logout: async (): Promise<void> => { await apiClient.post('/auth/logout') },
}
