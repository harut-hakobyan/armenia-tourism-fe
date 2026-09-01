import { useState } from 'react'
import { CalendarDays, Check, Clock3 } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { NumericInput } from '@/components/ui/NumericInput'
import { carsQuery, toursQuery } from '@/features/catalog/api'
import { bookingApi } from '@/features/bookings/api'
import { bookingDraft } from '@/features/bookings/draft'
import { estimateApi } from '@/features/estimates/api'
import { formatMoney } from '@/lib/money'
import { toApiError } from '@/lib/api-client'
import type { ServiceType } from '@/types/domain'

const today = new Date().toISOString().slice(0,10)
const defaultRoute = [{latitude:40.1473,longitude:44.3959,label:'Zvartnots Airport'},{latitude:40.1776,longitude:44.5126,label:'Yerevan'}]
type BookingChoice = 'group_tour' | 'private_tour' | 'custom_trip'

export function BookingPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const draft = bookingDraft.get()
  const requestedService = params.get('service') ?? draft?.service_type
  const initialService: Extract<ServiceType, 'tour' | 'custom_trip'> = requestedService === 'custom_trip' ? 'custom_trip' : 'tour'
  const initialChoice: BookingChoice = initialService === 'custom_trip' ? 'custom_trip' : 'group_tour'
  const serviceLocked = params.has('service') || Boolean(draft?.service_type)
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string|null>(null)
  const [bookingChoice, setBookingChoice] = useState<BookingChoice>(initialChoice)
  const [form, setForm] = useState({service:initialService,tour:Number(params.get('tour')??draft?.tour_id??0),departure:Number(params.get('departure')??0),date:'',time:'09:00',passengers:2,pickup:'',name:'',email:'',phone:'',whatsapp:'',notes:''})
  const cars = useQuery(carsQuery({passengers:form.passengers,per_page:30}))
  const tours = useQuery(toursQuery('en',{per_page:50}))
  const selectedTour = tours.data?.data.find((tour) => tour.id === form.tour)
  const effectiveBookingChoice: BookingChoice = serviceLocked && selectedTour
    ? selectedTour.format === 'group' ? 'group_tour' : 'private_tour'
    : bookingChoice
  const selectedDeparture = selectedTour?.upcoming_departures?.find((departure) => departure.id === form.departure)
  const group = effectiveBookingChoice === 'group_tour'
  const automaticCarId = cars.data?.data.find((car) => car.id === draft?.car_id)?.id ?? cars.data?.data[0]?.id ?? 0
  const effectiveDate = group && selectedDeparture ? selectedDeparture.starts_at.slice(0,10) : form.date
  const effectiveTime = group && selectedDeparture ? selectedDeparture.starts_at.slice(11,16) : form.time
  const effectivePickup = group && selectedDeparture ? selectedDeparture.meeting_point : form.pickup

  const estimate = useMutation({mutationFn:()=>{
    const contact = {passengers:form.passengers,...(form.email?{customer_email:form.email}:{})}
    if(form.service==='tour') return estimateApi.tour({...contact,tour_id:form.tour,booking_date:effectiveDate,...(group?{group_tour_departure_id:form.departure}:{car_id:automaticCarId})})
    const base={...contact,car_id:automaticCarId}
    const route=draft?.route_points??defaultRoute
    return estimateApi.customTrip({...base,route_points:route})
  }})
  const create = useMutation({mutationFn:bookingApi.create})

  function update<K extends keyof typeof form>(key:K,value:(typeof form)[K]) { setForm(current=>({...current,[key]:value})) }
  function chooseTour(tourId: number) { setForm(current => ({...current, tour: tourId, departure: 0, date: ''})) }
  function chooseService(choice: BookingChoice) {
    setBookingChoice(choice)
    setForm((current) => ({ ...current, service: choice === 'custom_trip' ? 'custom_trip' : 'tour', tour: 0, departure: 0, date: '' }))
  }
  const journeyReady = form.service === 'tour'
    ? Boolean(form.tour && (group ? form.departure : form.date && automaticCarId))
    : Boolean(form.date && automaticCarId)

  async function review() {
    setError(null)
    if (!journeyReady) { setError(group ? 'Choose an available group departure.' : form.service === 'custom_trip' ? 'Choose a date first.' : 'Choose a tour and date first.'); return }
    try { await estimate.mutateAsync(); setStep(3) } catch(reason) { setError(toApiError(reason).message) }
  }

  async function submit() {
    setError(null)
    try {
      const routeService=form.service==='custom_trip'
      const result=await create.mutateAsync({
        idempotency_key:crypto.randomUUID(),service_type:form.service,
        ...(form.tour?{tour_id:form.tour}:{}),...(group?{group_tour_departure_id:form.departure}:{car_id:automaticCarId}),
        booking_date:effectiveDate,pickup_time:effectiveTime,passengers:form.passengers,pickup_address:effectivePickup,
        customer_name:form.name,...(form.email?{customer_email:form.email}:{}),customer_phone:form.phone,
        ...(form.whatsapp?{customer_whatsapp:form.whatsapp}:{}),...(form.notes?{customer_notes:form.notes}:{}),payment_method:'pay_driver',
        ...(routeService?{route_points:draft?.route_points??defaultRoute}:{}),
        ...(draft?.dropoff_address?{dropoff_address:draft.dropoff_address}:{}),...(draft?.service_options?{service_options:draft.service_options}:{})
      })
      bookingDraft.clear(); void navigate('/booking/confirmation',{state:{booking:result}})
    } catch(reason) { setError(toApiError(reason).message) }
  }

  const labels=['Journey','Pickup & contact','Review']
  return <Container className="py-12 sm:py-20"><div className="mx-auto max-w-4xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-apricot">Book securely</p><h1 className="text-display mt-2 text-5xl">Your Armenia journey</h1><div className="mt-8 grid grid-cols-3 gap-2">{labels.map((label,index)=><div key={label} className={`rounded-xl px-3 py-3 text-center text-xs font-bold ${step>=index+1?'bg-forest text-white':'bg-stone text-ink/40'}`}>{step>index+1?<Check className="mx-auto size-4"/>:label}</div>)}</div>
    <div className="mt-8 rounded-3xl bg-white p-6 shadow-soft sm:p-8">
      {step===1&&<div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold sm:col-span-2">Service<select value={effectiveBookingChoice} disabled={serviceLocked} onChange={e=>chooseService(e.target.value as BookingChoice)} className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4 disabled:cursor-not-allowed disabled:bg-stone disabled:text-ink/55"><option value="group_tour">Group tour</option><option value="private_tour">Private tour</option><option value="custom_trip">Custom trip</option></select></label>
        {form.service==='tour'&&<label className="text-sm font-semibold sm:col-span-2">Tour<select value={form.tour} onChange={e=>chooseTour(Number(e.target.value))} className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4"><option value="0">Choose a tour</option>{tours.data?.data.filter(t=>t.format === (group ? 'group' : 'private')).map(t=><option key={t.id} value={t.id}>{t.title}</option>)}</select></label>}
        {form.service==='tour'&&group&&<label className="text-sm font-semibold sm:col-span-2">Scheduled departure<select value={form.departure} onChange={e=>update('departure',Number(e.target.value))} className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4"><option value="0">Choose a departure</option>{selectedTour?.upcoming_departures?.filter(d=>d.remaining_seats>0).map(d=><option key={d.id} value={d.id}>{new Intl.DateTimeFormat('en',{dateStyle:'medium',timeStyle:'short'}).format(new Date(d.starts_at))} · {d.remaining_seats} seats left</option>)}</select></label>}
        {!group&&<>
          <label className="min-w-0 text-sm font-semibold">Date
            <span className="group mt-2 flex h-12 w-full items-center rounded-xl border border-black/10 bg-white px-4 shadow-[0_1px_2px_rgb(23_35_29/0.04)] transition hover:border-forest/35 focus-within:border-forest-light focus-within:ring-4 focus-within:ring-forest-light/10">
              <CalendarDays aria-hidden="true" className="mr-3 size-5 shrink-0 text-forest/55 transition group-focus-within:text-forest" />
              <input aria-label="Date" type="date" min={today} value={form.date} onChange={e=>update('date',e.target.value)} className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 font-medium text-ink outline-none [color-scheme:light] focus-visible:outline-none"/>
            </span>
          </label>
          <label className="min-w-0 text-sm font-semibold">Pickup time
            <span className="group mt-2 flex h-12 w-full items-center rounded-xl border border-black/10 bg-white px-4 shadow-[0_1px_2px_rgb(23_35_29/0.04)] transition hover:border-forest/35 focus-within:border-forest-light focus-within:ring-4 focus-within:ring-forest-light/10">
              <Clock3 aria-hidden="true" className="mr-3 size-5 shrink-0 text-forest/55 transition group-focus-within:text-forest" />
              <input aria-label="Pickup time" type="time" value={form.time} onChange={e=>update('time',e.target.value)} className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 font-medium text-ink outline-none [color-scheme:light] focus-visible:outline-none"/>
            </span>
          </label>
        </>}
        <label className="text-sm font-semibold">{group ? 'Seats' : 'Passengers'}<NumericInput required min={1} max={group ? selectedDeparture?.remaining_seats ?? 7 : 7} value={form.passengers} onValueChange={(value)=>{if(value!==null)update('passengers',value)}} className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4"/></label>
        {!group&&<div className="rounded-2xl bg-stone p-4 text-sm sm:col-span-2"><strong>Transport:</strong> A suitable vehicle will be assigned based on your group size.</div>}
        {group&&selectedDeparture&&<div className="rounded-2xl bg-stone p-4 text-sm sm:col-span-2"><strong>Meeting point:</strong> {selectedDeparture.meeting_point}</div>}
        <Button onClick={()=>setStep(2)} disabled={!journeyReady} className="sm:col-span-2">Continue</Button></div>}
      {step===2&&<div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold sm:col-span-2">{group ? 'Meeting point' : 'Pickup address'}<input value={effectivePickup} readOnly={group} onChange={e=>update('pickup',e.target.value)} placeholder="Hotel, Airbnb, airport, or address" className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4 read-only:bg-stone"/></label><label className="text-sm font-semibold">Full name<input value={form.name} onChange={e=>update('name',e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4"/></label><label className="text-sm font-semibold">Phone<input value={form.phone} onChange={e=>update('phone',e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4"/></label><label className="text-sm font-semibold">Email<input type="email" value={form.email} onChange={e=>update('email',e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4"/></label><label className="text-sm font-semibold">WhatsApp<input value={form.whatsapp} onChange={e=>update('whatsapp',e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4"/></label><label className="text-sm font-semibold sm:col-span-2">Notes<textarea value={form.notes} onChange={e=>update('notes',e.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-black/10 p-4"/></label><div className="flex gap-3 sm:col-span-2"><Button variant="secondary" onClick={()=>setStep(1)}>Back</Button><Button onClick={()=>void review()} disabled={!effectivePickup||!form.name||!form.phone||estimate.isPending} className="flex-1">{estimate.isPending?'Checking price...':'Review booking'}</Button></div></div>}
      {step===3&&estimate.data&&<div><h2 className="text-display text-3xl">Booking summary</h2><dl className="mt-6 grid gap-4 rounded-2xl bg-stone p-5 sm:grid-cols-2"><div><dt className="text-xs uppercase text-ink/45">Service</dt><dd className="mt-1 font-semibold">{effectiveBookingChoice === 'group_tour' ? 'Group tour' : effectiveBookingChoice === 'private_tour' ? 'Private tour' : 'Custom trip'}</dd></div><div><dt className="text-xs uppercase text-ink/45">Date & time</dt><dd className="mt-1 font-semibold">{effectiveDate} · {effectiveTime}</dd></div><div><dt className="text-xs uppercase text-ink/45">{group?'Seats':'Passengers'}</dt><dd className="mt-1 font-semibold">{form.passengers}</dd></div><div><dt className="text-xs uppercase text-ink/45">{group?'Meeting point':'Pickup'}</dt><dd className="mt-1 font-semibold">{effectivePickup}</dd></div></dl><div className="mt-6 flex items-end justify-between border-t border-black/8 pt-6"><div><p className="text-sm text-ink/50">{group?'Total for selected seats':'Total for the car'}</p><p className="mt-1 text-3xl font-bold text-forest">{formatMoney(estimate.data.price.total_minor,estimate.data.price.currency)}</p></div><span className="rounded-full bg-stone px-3 py-1 text-xs font-bold">Pay driver</span></div><div className="mt-7 flex gap-3"><Button variant="secondary" onClick={()=>setStep(2)}>Back</Button><Button onClick={()=>void submit()} disabled={create.isPending} className="flex-1">{create.isPending?'Confirming...':'Confirm booking'}</Button></div></div>}
      {error&&<p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-danger">{error}</p>}
    </div></div></Container>
}
