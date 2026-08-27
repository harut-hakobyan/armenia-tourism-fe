import { useMemo, type PropsWithChildren } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authStorage } from '@/lib/auth-storage'
import { authApi } from './api'
import { AuthContext, type AuthContextValue } from './auth-context'
const meKey = ['auth', 'me'] as const

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient()
  const me = useQuery({ queryKey: meKey, queryFn: authApi.me, enabled: Boolean(authStorage.get()), retry: false })
  const loginMutation = useMutation({ mutationFn: authApi.login })
  const logoutMutation = useMutation({ mutationFn: authApi.logout })

  const value = useMemo<AuthContextValue>(() => ({
    user: me.data ?? null,
    isLoading: me.isLoading && Boolean(authStorage.get()),
    isAuthenticated: Boolean(me.data && authStorage.get()),
    login: async (input) => {
      const result = await loginMutation.mutateAsync(input)
      authStorage.set(result.token)
      queryClient.setQueryData(meKey, result.user)
      return result.user
    },
    logout: async () => {
      try { await logoutMutation.mutateAsync() } finally {
        authStorage.clear()
        queryClient.removeQueries({ queryKey: ['auth'] })
      }
    },
  }), [loginMutation, logoutMutation, me.data, me.isLoading, queryClient])

  return <AuthContext value={value}>{children}</AuthContext>
}
