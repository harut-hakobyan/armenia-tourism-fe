import { useEffect, useRef, useState } from 'react'
import { BrowserQRCodeReader, type IScannerControls } from '@zxing/browser'
import { useMutation } from '@tanstack/react-query'
import { CalendarDays, Camera, CheckCircle2, MapPin, QrCode, RotateCcw, UserRound, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { NumericInput } from '@/components/ui/NumericInput'
import { checkInApi } from '@/features/check-in/api'
import { toApiError } from '@/lib/api-client'
import type { CheckInBooking } from '@/types/domain'

export function CheckInPage() {
  const video = useRef<HTMLVideoElement>(null)
  const controls = useRef<IScannerControls | null>(null)
  const decoding = useRef(false)
  const [scanning, setScanning] = useState(false)
  const [manualToken, setManualToken] = useState('')
  const [activeToken, setActiveToken] = useState('')
  const [booking, setBooking] = useState<CheckInBooking | null>(null)
  const [passengers, setPassengers] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string|null>(null)
  const lookup = useMutation({ mutationFn:checkInApi.lookup })
  const confirm = useMutation({ mutationFn:({token,count}:{token:string;count:number})=>checkInApi.confirm(token,count,notes) })

  useEffect(()=>()=>controls.current?.stop(),[])

  async function find(payload:string) {
    const token = payload.trim()
    if (!token) return
    setError(null)
    setBooking(null)
    setActiveToken(token)
    try {
      const result = await lookup.mutateAsync(token)
      setBooking(result)
      setPassengers(result.attendance.remaining_passengers || null)
    } catch (reason) {
      setError(toApiError(reason).status === 404 ? 'This QR ticket is invalid or no longer available.' : toApiError(reason).message)
    }
  }

  async function startCamera() {
    setError(null)
    setScanning(true)
    decoding.current = false
    try {
      const preview = video.current
      if (!preview) throw new Error('Camera preview is unavailable.')
      const reader = new BrowserQRCodeReader()
      controls.current = await reader.decodeFromConstraints(
        { video:{ facingMode:{ ideal:'environment' } }, audio:false },
        preview,
        (result, _error, scanner) => {
          if (!result || decoding.current) return
          decoding.current = true
          scanner.stop()
          setScanning(false)
          void find(result.getText())
        },
      )
    } catch {
      setScanning(false)
      setError('Camera access failed. Allow camera permission, use HTTPS, or enter the QR value manually.')
    }
  }

  function stopCamera() { controls.current?.stop(); controls.current=null; setScanning(false) }
  function reset() { stopCamera(); lookup.reset(); confirm.reset(); setBooking(null); setActiveToken(''); setManualToken(''); setPassengers(null); setNotes(''); setError(null) }

  async function checkIn() {
    if (!booking || passengers === null) return
    setError(null)
    try {
      const updated = await confirm.mutateAsync({token:activeToken,count:passengers})
      setBooking(updated)
      setPassengers(updated.attendance.remaining_passengers || null)
    } catch (reason) { setError(toApiError(reason).message) }
  }

  const complete = booking?.attendance.status === 'checked_in'
  return <div className="mx-auto max-w-4xl">
    <p className="text-sm font-semibold uppercase tracking-widest text-apricot">Attendance</p><h1 className="mt-2 text-3xl font-bold">QR check-in</h1><p className="mt-3 max-w-2xl text-ink/55">Scan the customer’s arrival ticket, verify the booking, then confirm how many passengers are present.</p>

    {!booking&&<div className="mt-7 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
      <section className="overflow-hidden rounded-3xl bg-ink text-white shadow-xl"><div className="relative aspect-[4/3] bg-black/30"><video ref={video} muted playsInline autoPlay className={`h-full w-full object-cover ${scanning?'block':'hidden'}`}/>{scanning?<div className="pointer-events-none absolute inset-[15%] rounded-3xl border-2 border-white/80 shadow-[0_0_0_999px_rgb(0_0_0/.25)]"/>:<div className="grid h-full place-items-center text-center"><div><QrCode className="mx-auto size-16 text-apricot-light"/><p className="mt-4 font-semibold">Ready to scan a ticket</p><p className="mt-2 text-sm text-white/50">Works best with the rear camera</p></div></div>}</div><div className="p-4">{scanning?<Button variant="secondary" onClick={stopCamera} className="w-full">Stop camera</Button>:<Button onClick={()=>void startCamera()} className="w-full"><Camera className="mr-2 size-4"/>Open camera</Button>}</div></section>
      <section className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="font-bold">Enter code manually</h2><p className="mt-2 text-sm leading-6 text-ink/50">Use this if camera access is unavailable.</p><textarea value={manualToken} onChange={event=>setManualToken(event.target.value)} rows={4} placeholder="AMT-CHECKIN:..." className="mt-5 w-full resize-none rounded-2xl border border-black/10 p-4 font-mono text-sm outline-none focus:border-forest focus:ring-4 focus:ring-forest/10"/><Button disabled={!manualToken.trim()||lookup.isPending} onClick={()=>void find(manualToken)} className="mt-4 w-full">{lookup.isPending?'Checking...':'Find booking'}</Button></section>
    </div>}

    {booking&&<section className="mt-7 overflow-hidden rounded-3xl bg-white shadow-soft"><div className={`flex items-center justify-between gap-4 px-6 py-5 ${complete?'bg-forest text-white':'bg-stone'}`}><div><p className={`text-xs font-bold uppercase tracking-widest ${complete?'text-white/60':'text-ink/40'}`}>{booking.booking_number}</p><h2 className="mt-1 text-2xl font-bold">{complete?'Arrival confirmed':'Verify passenger arrival'}</h2></div>{complete?<CheckCircle2 className="size-9"/>:<QrCode className="size-8 text-forest"/>}</div><div className="p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2"><Detail icon={UserRound} label="Customer" value={booking.customer.name}/><Detail icon={Users} label="Party" value={`${booking.passengers} passengers`}/><Detail icon={CalendarDays} label="Departure" value={new Intl.DateTimeFormat('en',{dateStyle:'medium',timeStyle:'short'}).format(new Date(booking.starts_at))}/><Detail icon={MapPin} label="Pickup / meeting point" value={booking.pickup_address}/></div>
      {booking.tour&&<div className="mt-4 rounded-2xl bg-stone p-4"><p className="text-xs uppercase text-ink/40">Tour</p><p className="mt-1 font-bold">{booking.tour.title}</p></div>}
      <div className="mt-6 rounded-2xl border border-forest/10 p-5"><div className="flex items-center justify-between gap-3"><span className="font-semibold">Attendance</span><span className="rounded-full bg-stone px-3 py-1 text-sm font-bold text-forest">{booking.attendance.checked_in_passengers} / {booking.passengers}</span></div>{!complete&&<><label className="mt-5 block text-sm font-semibold">Passengers arriving now<NumericInput value={passengers} onValueChange={setPassengers} min={1} max={booking.attendance.remaining_passengers} required className="mt-2 h-12 w-full rounded-xl border border-black/10 px-4"/></label><label className="mt-4 block text-sm font-semibold">Optional note<textarea value={notes} onChange={event=>setNotes(event.target.value)} rows={2} className="mt-2 w-full rounded-xl border border-black/10 p-3"/></label><Button disabled={passengers===null||confirm.isPending} onClick={()=>void checkIn()} className="mt-5 w-full">{confirm.isPending?'Confirming...':`Confirm ${passengers??0} passenger${passengers===1?'':'s'}`}</Button></>}</div>
      {error&&<p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-danger">{error}</p>}<Button variant="ghost" onClick={reset} className="mt-5 w-full"><RotateCcw className="mr-2 size-4"/>Scan another ticket</Button>
    </div></section>}
    {error&&!booking&&<p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-danger">{error}</p>}
  </div>
}

function Detail({icon:Icon,label,value}:{icon:typeof UserRound;label:string;value:string}) { return <div className="rounded-2xl border border-black/6 p-4"><Icon className="size-5 text-apricot"/><p className="mt-3 text-xs uppercase text-ink/40">{label}</p><p className="mt-1 font-semibold">{value}</p></div> }
