import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { StatusBadge } from '@/components/operations/StatusBadge'
import { Button } from '@/components/ui/Button'
import { adminApi } from '@/features/admin/api'
import { toApiError } from '@/lib/api-client'
import { formatMoney } from '@/lib/money'

export function AdminBookingDetailsPage() {
  const id = Number(useParams().id)
  const navigate = useNavigate()
  const client = useQueryClient()
  const [car, setCar] = useState(0)
  const [driver, setDriver] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const booking = useQuery({ queryKey: ['admin', 'booking', id], queryFn: () => adminApi.booking(id) })
  const availability = useQuery({
    queryKey: ['admin', 'booking', id, 'availability'],
    queryFn: () => adminApi.availability(id),
    enabled: booking.data?.booking_status === 'confirmed' || booking.data?.booking_status === 'assigned',
  })
  const action = useMutation({
    mutationFn: async (type: 'confirm' | 'cancel' | 'assign') => type === 'confirm'
      ? adminApi.confirm(id)
      : type === 'cancel' ? adminApi.cancel(id) : adminApi.assign(id, car, driver),
    onSuccess: async () => { await client.invalidateQueries({ queryKey: ['admin'] }) },
    onError: (reason) => setError(toApiError(reason).message),
  })

  if (!booking.data) return <p>Loading booking...</p>
  const current = booking.data
  const compatibleDrivers = availability.data?.drivers.filter((item) => !car || item.car_ids.includes(car)) ?? []

  return <div>
    <button onClick={() => void navigate(-1)} className="text-sm font-bold text-forest">← Back</button>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-ink/45">{current.booking_number}</p><h1 className="text-3xl font-bold">{current.customer.name}</h1></div><StatusBadge status={current.booking_status} /></div>
    <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="font-bold">Trip details</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2"><Item label="Service" value={current.service_type.replaceAll('_', ' ')} /><Item label="Date & time" value={`${current.booking_date} · ${current.pickup_time.slice(0, 5)}`} /><Item label="Pickup" value={current.pickup.address} /><Item label="Passengers" value={String(current.passengers)} /><Item label="Attendance" value={`${current.attendance.checked_in_passengers} / ${current.passengers} checked in`} /><Item label="Car" value={current.car.name} /><Item label="Total" value={formatMoney(current.price.total_minor, current.price.currency)} /></dl></section>
        <section className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="font-bold">Customer</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2"><Item label="Phone" value={current.customer.phone} /><Item label="Email" value={current.customer.email ?? '—'} /><Item label="WhatsApp" value={current.customer.whatsapp ?? '—'} /><Item label="Nationality" value={current.customer.nationality ?? '—'} /></dl></section>
      </div>
      <aside className="space-y-5"><section className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="font-bold">Actions</h2>
        {current.booking_status === 'pending' && <Button onClick={() => action.mutate('confirm')} className="mt-5 w-full">Confirm booking</Button>}
        {(current.booking_status === 'confirmed' || current.booking_status === 'assigned') && <><label className="mt-5 block text-sm font-semibold">Available car<select value={car} onChange={(event) => { setCar(Number(event.target.value)); setDriver(0) }} className="mt-2 min-h-11 w-full rounded-xl border border-black/10 px-3"><option value="0">Choose car</option>{availability.data?.cars.map((item) => <option value={item.id} key={item.id}>{item.name} · {item.plate_number}</option>)}</select></label><label className="mt-4 block text-sm font-semibold">Available driver<select value={driver} onChange={(event) => setDriver(Number(event.target.value))} className="mt-2 min-h-11 w-full rounded-xl border border-black/10 px-3"><option value="0">Choose driver</option>{compatibleDrivers.map((item) => <option value={item.id} key={item.id}>{item.name} · ★ {item.rating}</option>)}</select></label><Button disabled={!car || !driver || action.isPending} onClick={() => action.mutate('assign')} className="mt-5 w-full">Assign trip</Button></>}
        {!['completed', 'cancelled', 'no_show'].includes(current.booking_status) && <Button variant="ghost" onClick={() => action.mutate('cancel')} className="mt-3 w-full text-danger">Cancel booking</Button>}
        {error && <p className="mt-4 text-sm text-danger">{error}</p>}
      </section></aside>
    </div>
  </div>
}

function Item({ label, value }: {label: string; value: string}) {
  return <div><dt className="text-xs uppercase tracking-wider text-ink/40">{label}</dt><dd className="mt-1 font-semibold capitalize">{value}</dd></div>
}
