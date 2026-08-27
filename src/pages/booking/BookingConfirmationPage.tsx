import { CheckCircle2 } from 'lucide-react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { buttonStyles } from '@/components/ui/button-styles'
import type { CreatedBooking } from '@/types/domain'

export function BookingConfirmationPage(){const state=useLocation().state as {booking?:CreatedBooking}|null;const booking=state?.booking;if(!booking)return <Navigate to="/booking" replace/>;return <Container className="grid min-h-[70vh] place-items-center py-16"><div className="max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-soft sm:p-12"><CheckCircle2 className="mx-auto size-16 text-forest"/><p className="mt-6 text-sm font-bold uppercase tracking-wider text-apricot">Booking received</p><h1 className="text-display mt-2 text-5xl">Your journey is reserved.</h1><p className="mt-5 text-ink/60">Booking <strong>{booking.booking_number}</strong> is pending confirmation. Keep your secure link to follow its status.</p><Link to={`/booking/${booking.booking_number}/${booking.secure_token}`} className={`${buttonStyles()} mt-8 w-full`}>View my booking</Link></div></Container>}
