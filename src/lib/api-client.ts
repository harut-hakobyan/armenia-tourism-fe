import axios, { AxiosError } from 'axios'
import { i18n } from '@/i18n'
import { authStorage } from './auth-storage'
import type { ValidationErrorResponse } from '@/types/api'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1',
  timeout: 15_000,
  headers: { Accept: 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  config.headers.set('Accept-Language', i18n.language)
  const token = authStorage.get()
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  return config
})

export class ApiError extends Error {
  constructor(message: string, readonly status: number | undefined, readonly fields: Record<string, string[]> = {}) {
    super(message)
    this.name = 'ApiError'
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (error instanceof AxiosError) {
    const response = error.response?.data as ValidationErrorResponse | undefined
    return new ApiError(response?.message ?? error.message, error.response?.status, response?.errors)
  }
  return new ApiError(error instanceof Error ? error.message : 'Unexpected error', undefined)
}
