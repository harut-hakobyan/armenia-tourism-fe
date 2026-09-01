import { CheckCircle2 } from 'lucide-react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { QrTicket } from '@/components/booking/QrTicket'
import { Container } from '@/components/ui/Container'
import { buttonStyles } from '@/components/ui/button-styles'
import type { CreatedBooking } from '@/types/domain'

export function BookingConfirmationPage() {
  const state = useLocation().state as {booking?:CreatedBooking}|null
  const booking = state?.booking
  if (!booking) return <Navigate to="/booking" replace/>
  const qrPayload = booking.qr_payload
  const attendanceStatus = booking.attendance?.status ?? 'expected'

  return <Container className="py-16"><div className="mx-auto max-w-3xl">
    <div className="rounded-[2rem] bg-white p-8 text-center shadow-soft sm:p-12"><CheckCircle2 className="mx-auto size-16 text-forest"/><p className="mt-6 text-sm font-bold uppercase tracking-wider text-apricot">Booking received</p><h1 className="text-display mt-2 text-5xl">Your journey is reserved.</h1><p className="mt-5 text-ink/60">Booking <strong>{booking.booking_number}</strong> is pending confirmation. Save your check-in QR and secure booking link.</p><Link to={`/booking/${booking.booking_number}/${booking.secure_token}`} className={`${buttonStyles()} mt-8 w-full`}>View my booking</Link></div>
    {qrPayload
      ? <div className="mt-7"><QrTicket bookingNumber={booking.booking_number} payload={qrPayload} status={attendanceStatus}/></div>
      : <p className="mt-7 rounded-2xl bg-amber-50 p-5 text-center text-sm text-amber-900">Your booking was created successfully. The QR ticket will appear after the backend QR update is deployed.</p>}
  </div></Container>
}
