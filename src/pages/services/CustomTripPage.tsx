import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ArrowDown, ArrowUp, MapPin, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { NumericInput } from '@/components/ui/NumericInput'
import { carsQuery, destinationsQuery } from '@/features/catalog/api'
import { estimateApi } from '@/features/estimates/api'
import { bookingDraft } from '@/features/bookings/draft'
import { formatMoney } from '@/lib/money'
import type { Destination, RoutePoint } from '@/types/domain'

const yerevan: RoutePoint = { latitude: 40.1872023, longitude: 44.515209, label: 'Yerevan' }

export function CustomTripPage() {
  const { i18n } = useTranslation(); const navigate = useNavigate()
  const destinations = useQuery(destinationsQuery(i18n.language, { per_page: 50 })); const [selected, setSelected] = useState<Destination[]>([]); const [passengers, setPassengers] = useState(2)
  const cars = useQuery(carsQuery({ passengers, per_page: 30 })); const automaticCarId = cars.data?.data[0]?.id ?? 0
  const points = () => [yerevan, ...selected.map((destination) => ({ latitude: destination.coordinates.latitude!, longitude: destination.coordinates.longitude!, label: destination.name })), yerevan]
  const estimate = useMutation({ mutationFn: () => estimateApi.customTrip({ car_id: automaticCarId, passengers, route_points: points() }) })
  function move(index: number, by: number) { setSelected((items) => { const next = [...items]; const target = index + by; if (target < 0 || target >= next.length) return items; [next[index], next[target]] = [next[target]!, next[index]!]; return next }) }
  function continueBooking() { if (!estimate.data) return; bookingDraft.set({ service_type: 'custom_trip', passengers, car_id: automaticCarId, route_points: estimate.data.route_points ?? points(), estimate: estimate.data, service_options: { return_to_yerevan: true } }); void navigate('/booking?service=custom_trip') }

  return <Container className="py-16 sm:py-24"><p className="text-sm font-bold uppercase tracking-[.2em] text-apricot">Your Armenia</p><h1 className="text-display mt-3 text-5xl sm:text-6xl">Build Your Trip</h1><p className="mt-5 max-w-2xl text-lg text-ink/60">Add destinations, arrange them in your preferred order, and receive an immediate route estimate.</p><div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]"><div><select aria-label="Add destination" value="" onChange={(event) => { const item = destinations.data?.data.find((destination) => destination.id === Number(event.target.value)); if (item && !selected.some((destination) => destination.id === item.id)) setSelected([...selected, item]) }} className="min-h-13 w-full rounded-2xl border border-black/10 bg-white px-4"><option value="">Add a destination...</option>{destinations.data?.data.map((destination) => <option value={destination.id} key={destination.id}>{destination.name}</option>)}</select><div className="mt-6 space-y-3"><div className="flex items-center gap-4 rounded-2xl bg-forest p-4 text-white"><MapPin />Yerevan pickup</div>{selected.map((destination, index) => <div key={destination.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"><span className="grid size-9 place-items-center rounded-full bg-stone font-bold">{index + 1}</span><span className="flex-1 font-semibold">{destination.name}</span><button aria-label="Move up" onClick={() => move(index, -1)}><ArrowUp /></button><button aria-label="Move down" onClick={() => move(index, 1)}><ArrowDown /></button><button aria-label="Remove" onClick={() => setSelected(selected.filter((item) => item.id !== destination.id))}><Trash2 className="text-danger" /></button></div>)}<div className="flex items-center gap-4 rounded-2xl border border-dashed border-forest/25 p-4 text-forest"><MapPin />Return to Yerevan</div></div></div><aside className="rounded-3xl bg-white p-6 shadow-soft"><h2 className="text-xl font-bold">Trip estimate</h2><label className="mt-5 block text-sm font-semibold">Passengers<NumericInput required min={1} max={7} value={passengers} onValueChange={(value) => { if (value !== null) setPassengers(value) }} className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4" /></label><div className="mt-4 rounded-2xl bg-stone p-4 text-sm"><strong>Transport:</strong> A suitable vehicle will be assigned based on your group size.</div><Button disabled={!automaticCarId || selected.length < 1 || estimate.isPending} onClick={() => estimate.mutate()} className="mt-6 w-full">Calculate route</Button>{estimate.data && <div className="mt-5 rounded-2xl bg-stone p-5"><p className="text-sm text-ink/55">{Math.round((estimate.data.estimated_distance_meters ?? 0) / 1000)} km · about {Math.ceil((estimate.data.estimated_duration_minutes ?? 0) / 60)} hours</p><p className="mt-2 text-2xl font-bold text-forest">{formatMoney(estimate.data.price.total_minor, estimate.data.price.currency)}</p><Button className="mt-4 w-full" onClick={continueBooking}>Continue booking</Button></div>}</aside></div></Container>
}
