import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { UserRole } from '@/types/domain'
import { PageLoader } from '@/components/ui/PageLoader'
import { useAuth } from './auth-context'

export function RequireRole({ roles, children }: PropsWithChildren<{ roles: UserRole[] }>) {
  const auth = useAuth()
  const location = useLocation()
  if (auth.isLoading) return <PageLoader />
  if (!auth.isAuthenticated) return <Navigate to="/admin/login" state={{ from: location }} replace />
  if (!auth.user || !roles.includes(auth.user.role)) return <Navigate to="/" replace />
  return children
}
