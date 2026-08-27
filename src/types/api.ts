export interface ApiEnvelope<T> { data: T }

export interface PaginationLink { url: string | null; label: string; active: boolean }

export interface PaginatedResponse<T> {
  data: T[]
  links: { first: string | null; last: string | null; prev: string | null; next: string | null }
  meta: { current_page: number; from: number | null; last_page: number; links: PaginationLink[]; path: string; per_page: number; to: number | null; total: number }
}

export interface ValidationErrorResponse {
  message: string
  errors?: Record<string, string[]>
}
