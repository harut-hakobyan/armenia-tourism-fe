import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { CarFront, MapPin, MessageCircle, Phone, Users, type LucideIcon } from 'lucide-react'
import { StatusBadge } from '@/components/operations/StatusBadge'
import { Button } from '@/components/ui/Button'
import { driverApi } from '@/features/driver/api'
import { nextDriverAction } from '@/features/driver/workflow'
import type { DriverTripStatus } from '@/types/domain'

export function DriverTripDetailsPage() {
  const id = Number(useParams().id)
  const navigate = useNavigate()
  const client = useQueryClient()
  const query = useQuery({ queryKey: ['driver', 'trip', id], queryFn: () => driverApi.trip(id) })
  const mutation = useMutation({
    mutationFn: (status: DriverTripStatus) => driverApi.status(id, status),
    onSuccess: async () => { await client.invalidateQueries({ queryKey: ['driver'] }) },
  })
  if (!query.data) return <p>Loading trip...</p>
  const trip = query.data
  const action = trip.driver_trip_status ? nextDriverAction(trip.driver_trip_status) : undefined

  return <div className="mx-auto max-w-3xl">
    <button onClick={() => void navigate(-1)} className="text-sm font-bold text-forest">← My trips</button>
    <div className="mt-5 flex items-start justify-between gap-4"><div><p className="text-xs text-ink/40">{trip.booking_number}</p><h1 className="mt-1 text-3xl font-bold">{trip.customer.name}</h1></div><StatusBadge status={trip.driver_trip_status ?? trip.booking_status} /></div>
    <div className="mt-7 grid gap-4 sm:grid-cols-2"><Info icon={MapPin} label="Pickup" value={trip.pickup.address} /><Info icon={CarFront} label="Car" value={trip.car.name} /><Info icon={Users} label="Passengers" value={String(trip.passengers)} /><Info icon={Users} label="Attendance" value={`${trip.attendance.checked_in_passengers} / ${trip.passengers} checked in`} /><Info icon={Phone} label="Phone" value={trip.customer.phone} /></div>
    <div className="mt-5 flex gap-3"><a href={`tel:${trip.customer.phone}`} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-forest/20 bg-white font-bold text-forest"><Phone className="size-4" />Call</a>{trip.customer.whatsapp && <a href={`https://wa.me/${trip.customer.whatsapp.replace(/\D/g, '')}`} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-forest/20 bg-white font-bold text-forest"><MessageCircle className="size-4" />WhatsApp</a>}</div>
    {action && <div className="sticky bottom-4 mt-8 rounded-3xl bg-ink p-4 shadow-2xl"><Button disabled={mutation.isPending} onClick={() => mutation.mutate(action.status)} className="w-full">{mutation.isPending ? 'Updating...' : action.label}</Button></div>}
  </div>
}

function Info({ icon: Icon, label, value }: {icon: LucideIcon; label: string; value: string}) {
  return <div className="rounded-2xl bg-white p-5 shadow-sm"><Icon className="text-apricot" /><p className="mt-3 text-xs uppercase text-ink/40">{label}</p><p className="mt-1 font-semibold">{value}</p></div>
}
