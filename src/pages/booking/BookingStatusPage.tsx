import { CalendarDays, CarFront, MapPin, Phone, Users, type LucideIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { QrTicket } from '@/components/booking/QrTicket'
import { Container } from '@/components/ui/Container'
import { PageLoader } from '@/components/ui/PageLoader'
import { QueryError } from '@/components/ui/QueryState'
import { bookingApi } from '@/features/bookings/api'
import { formatMoney } from '@/lib/money'

export function BookingStatusPage() {
  const { bookingNumber = '', token = '' } = useParams()
  const query = useQuery({ queryKey:['booking', bookingNumber, token], queryFn:()=>bookingApi.findPublic(bookingNumber, token), retry:false })
  if (query.isPending) return <PageLoader />
  if (query.isError) return <Container className="py-20"><QueryError retry={()=>void query.refetch()}/></Container>
  const booking = query.data
  const attendance = booking.attendance
  const qrPayload = booking.qr_payload

  return <Container className="py-16 sm:py-24"><div className="mx-auto max-w-3xl">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-wider text-apricot">{booking.booking_number}</p><h1 className="text-display mt-2 text-5xl">Your booking</h1></div><span className="rounded-full bg-forest px-4 py-2 text-sm font-bold capitalize text-white">{booking.booking_status.replaceAll('_',' ')}</span></div>
    <div className="mt-9 grid gap-4 sm:grid-cols-2"><Info icon={CalendarDays} label="Date & time" value={`${booking.booking_date} · ${booking.pickup_time.slice(0,5)}`}/><Info icon={CarFront} label="Car" value={booking.car.name}/><Info icon={MapPin} label="Pickup" value={booking.pickup.address}/><Info icon={Phone} label="Driver" value={booking.driver?`${booking.driver.name} · ${booking.driver.phone}`:'Assigned after confirmation'}/>{attendance && <Info icon={Users} label="Attendance" value={`${attendance.checked_in_passengers} of ${booking.passengers} checked in`}/>}</div>
    {qrPayload && attendance
      ? <div className="mt-6"><QrTicket bookingNumber={booking.booking_number} payload={qrPayload} status={attendance.status}/></div>
      : <p className="mt-6 rounded-2xl bg-amber-50 p-5 text-center text-sm text-amber-900">The booking is available, but its QR ticket is waiting for the backend QR migration.</p>}
    <div className="mt-6 rounded-3xl bg-white p-6 shadow-soft"><div className="flex items-end justify-between"><div><p className="text-sm text-ink/50">Total</p><p className="mt-1 text-3xl font-bold text-forest">{formatMoney(booking.price.total_minor,booking.price.currency)}</p></div><div className="text-right text-sm text-ink/55"><p>Paid: {formatMoney(booking.price.deposit_amount_minor,booking.price.currency)}</p><p>Remaining: {formatMoney(booking.price.total_minor-booking.price.deposit_amount_minor,booking.price.currency)}</p></div></div></div>
  </div></Container>
}

function Info({icon:Icon,label,value}:{icon:LucideIcon;label:string;value:string}) { return <div className="rounded-2xl bg-white p-5 shadow-sm"><Icon className="size-5 text-apricot"/><p className="mt-3 text-xs uppercase text-ink/40">{label}</p><p className="mt-1 font-semibold">{value}</p></div> }
