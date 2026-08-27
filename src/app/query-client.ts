import { QueryClient } from '@tanstack/react-query'
import { toApiError } from '@/lib/api-client'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: (count, error) => toApiError(error).status !== 404 && count < 2, refetchOnWindowFocus: false },
    mutations: { retry: false },
  },
})
