import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BellRing, ExternalLink, Link2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/auth-context'
import { telegramApi } from '@/features/telegram/api'
import { toApiError } from '@/lib/api-client'

export function TelegramConnectionPage() {
  const { user } = useAuth()
  const client = useQueryClient()
  const [now, setNow] = useState(0)
  const status = useQuery({
    queryKey: ['telegram'],
    queryFn: telegramApi.status,
    refetchInterval: (query) => query.state.data?.configured && !query.state.data.connected ? 3_000 : false,
  })
  const link = useMutation({ mutationFn: telegramApi.link, onSuccess: () => setNow(Date.now()) })
  const preferences = useMutation({ mutationFn: telegramApi.preferences, onSuccess: (updated) => client.setQueryData(['telegram'], updated) })
  const disconnect = useMutation({ mutationFn: telegramApi.disconnect, onSuccess: async () => { link.reset(); preferences.reset(); await client.invalidateQueries({ queryKey: ['telegram'] }) } })
  const expiresAt = link.data?.expires_at ? new Date(link.data.expires_at).getTime() : null
  const linkExpired = expiresAt !== null && expiresAt <= now
  const remainingSeconds = expiresAt === null ? 0 : Math.max(0, Math.ceil((expiresAt - now) / 1_000))
  const activeLink = linkExpired ? undefined : link.data
  const data = status.data?.connected ? status.data : activeLink ?? preferences.data ?? status.data
  useEffect(() => {
    if (expiresAt === null || status.data?.connected) return undefined
    const timer = window.setInterval(() => setNow(Date.now()), 1_000)
    return () => window.clearInterval(timer)
  }, [expiresAt, status.data?.connected])
  const operationalActions = user?.role === 'driver'
    ? ['Receive newly assigned trips', 'View customer, pickup, time, and vehicle details', 'Update every trip stage through inline buttons']
    : ['Receive every new booking', 'Confirm or cancel pending bookings', 'Select available cars and drivers for confirmed trips']
  const error = link.error ?? preferences.error ?? disconnect.error ?? status.error

  return <div className="max-w-3xl">
    <p className="text-sm font-semibold uppercase tracking-widest text-apricot">Notifications & actions</p>
    <h1 className="mt-2 text-3xl font-bold">Telegram bot</h1>
    <p className="mt-4 leading-7 text-ink/60">Connect your private Telegram chat to receive operational alerts and perform role-authorized actions without opening the web panel.</p>
    <div className="mt-7 rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-2xl bg-forest text-white"><BellRing /></span><div><p className="font-bold">{data?.connected ? 'Telegram connected' : 'Telegram not connected'}</p><p className="text-sm text-ink/50">{data?.connected ? `@${data.username ?? 'private account'}` : 'Connection is personal and protected by a one-time link.'}</p></div></div>
      {data && !data.configured && <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">Telegram is not configured on the backend yet. Add the BotFather token, bot username, and webhook secret to the backend environment before creating a connection link.</p>}
      <ul className="mt-6 space-y-3">{operationalActions.map((action) => <li key={action} className="flex gap-3 text-sm text-ink/65"><ShieldCheck className="size-5 shrink-0 text-apricot" />{action}</li>)}</ul>
      {!data?.connected && (!link.data || linkExpired) && <div className="mt-7">{linkExpired && <p className="mb-3 text-sm font-semibold text-danger">The previous connection link expired. Generate a new one.</p>}<Button onClick={() => link.mutate()} disabled={link.isPending || !data?.configured}><Link2 className="mr-2 size-4" />{link.isPending ? 'Creating secure link…' : linkExpired ? 'Create new connection link' : 'Create connection link'}</Button></div>}
      {!data?.connected && activeLink?.link_url && <div className="mt-7 rounded-2xl bg-stone p-5"><p className="text-sm text-ink/60">Single-use link · expires in {Math.floor(remainingSeconds / 60)}:{String(remainingSeconds % 60).padStart(2, '0')}</p><a href={activeLink.link_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-forest px-5 font-semibold text-white">Open Telegram <ExternalLink className="ml-2 size-4" /></a><p className="mt-4 break-all text-xs text-ink/40">Manual code: {activeLink.link_code}</p></div>}
      {data?.connected && <div className="mt-7 flex flex-wrap gap-3"><Button variant="ghost" onClick={() => preferences.mutate(!data.notifications_enabled)} disabled={preferences.isPending}>{data.notifications_enabled ? 'Pause notifications' : 'Enable notifications'}</Button><Button variant="ghost" onClick={() => disconnect.mutate()} disabled={disconnect.isPending} className="text-danger">Disconnect Telegram</Button></div>}
      {error && <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-danger">{toApiError(error).message}</p>}
    </div>
  </div>
}
