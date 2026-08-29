import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BellRing, ExternalLink, Link2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/auth-context'
import { telegramApi } from '@/features/telegram/api'
import { toApiError } from '@/lib/api-client'

export function TelegramConnectionPage() {
  const { user } = useAuth()
  const client = useQueryClient()
  const status = useQuery({ queryKey: ['telegram'], queryFn: telegramApi.status })
  const link = useMutation({ mutationFn: telegramApi.link })
  const disconnect = useMutation({ mutationFn: telegramApi.disconnect, onSuccess: async () => { link.reset(); await client.invalidateQueries({ queryKey: ['telegram'] }) } })
  const data = link.data ?? status.data
  const operationalActions = user?.role === 'driver'
    ? ['Receive newly assigned trips', 'View customer, pickup, time, and vehicle details', 'Update every trip stage through inline buttons']
    : ['Receive every new booking', 'Confirm or cancel pending bookings', 'Select available cars and drivers for confirmed trips']
  const error = link.error ?? disconnect.error ?? status.error

  return <div className="max-w-3xl">
    <p className="text-sm font-semibold uppercase tracking-widest text-apricot">Notifications & actions</p>
    <h1 className="mt-2 text-3xl font-bold">Telegram bot</h1>
    <p className="mt-4 leading-7 text-ink/60">Connect your private Telegram chat to receive operational alerts and perform role-authorized actions without opening the web panel.</p>
    <div className="mt-7 rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-2xl bg-forest text-white"><BellRing /></span><div><p className="font-bold">{data?.connected ? 'Telegram connected' : 'Telegram not connected'}</p><p className="text-sm text-ink/50">{data?.connected ? `@${data.username ?? 'private account'}` : 'Connection is personal and protected by a one-time link.'}</p></div></div>
      <ul className="mt-6 space-y-3">{operationalActions.map((action) => <li key={action} className="flex gap-3 text-sm text-ink/65"><ShieldCheck className="size-5 shrink-0 text-apricot" />{action}</li>)}</ul>
      {!data?.connected && !link.data && <Button onClick={() => link.mutate()} disabled={link.isPending} className="mt-7"><Link2 className="mr-2 size-4" />{link.isPending ? 'Creating secure link…' : 'Create connection link'}</Button>}
      {!data?.connected && link.data?.link_url && <div className="mt-7 rounded-2xl bg-stone p-5"><p className="text-sm text-ink/60">This link expires in 15 minutes and can be used once.</p><a href={link.data.link_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-forest px-5 font-semibold text-white">Open Telegram <ExternalLink className="ml-2 size-4" /></a><p className="mt-4 break-all text-xs text-ink/40">Manual code: {link.data.link_code}</p></div>}
      {data?.connected && <Button variant="ghost" onClick={() => disconnect.mutate()} disabled={disconnect.isPending} className="mt-7 text-danger">Disconnect Telegram</Button>}
      {error && <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-danger">{toApiError(error).message}</p>}
    </div>
  </div>
}
