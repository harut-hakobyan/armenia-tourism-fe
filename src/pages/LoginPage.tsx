import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Mountain } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/auth-context'
import { toApiError } from '@/lib/api-client'

export function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  if (auth.isAuthenticated) return <Navigate to={auth.user?.role === 'driver' ? '/driver' : '/admin'} replace />

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const email = fields.get('email')
    const password = fields.get('password')
    if (typeof email !== 'string' || typeof password !== 'string') return
    setPending(true); setError(null)
    try {
      const user = await auth.login({ email, password })
      const requested = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
      void navigate(requested ?? (user.role === 'driver' ? '/driver' : '/admin'), { replace: true })
    } catch (reason) { setError(toApiError(reason).message) } finally { setPending(false) }
  }

  return <main className="grid min-h-screen place-items-center bg-ink p-5"><form onSubmit={(event) => void submit(event)} className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl sm:p-10"><div className="mb-8 flex items-center gap-3 text-lg font-bold text-forest"><Mountain />Armenia Operations</div><h1 className="text-display text-4xl">Welcome back</h1><p className="mt-2 text-sm text-ink/55">Sign in to manage journeys and assigned trips.</p><label className="mt-8 block text-sm font-semibold">Email<input name="email" type="email" required autoComplete="email" className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4 outline-none focus:border-apricot" /></label><label className="mt-5 block text-sm font-semibold">Password<input name="password" type="password" required autoComplete="current-password" className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4 outline-none focus:border-apricot" /></label>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-danger">{error}</p>}<Button type="submit" disabled={pending} className="mt-7 w-full">{pending ? 'Signing in...' : 'Sign in'}</Button></form></main>
}
