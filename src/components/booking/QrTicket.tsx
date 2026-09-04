import { useRef } from 'react'
import { CheckCircle2, Download, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import type { AttendanceStatus } from '@/types/domain'

export function QrTicket({ bookingNumber, payload, status }: { bookingNumber:string; payload:string; status:AttendanceStatus }) {
  const qr = useRef<HTMLDivElement>(null)
  const checkedIn = status === 'checked_in'

  function download() {
    const svg = qr.current?.querySelector('svg')
    if (!svg) return
    const source = new XMLSerializer().serializeToString(svg)
    const url = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${bookingNumber}-check-in-qr.svg`
    link.click()
    URL.revokeObjectURL(url)
  }

  return <section className="overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-soft">
    <div className="flex items-center gap-3 bg-forest px-6 py-4 text-white"><QrCode className="size-5"/><div><p className="text-xs font-bold uppercase tracking-widest text-white/60">Arrival ticket</p><h2 className="font-bold">Your check-in QR</h2></div></div>
    <div className="grid items-center gap-6 p-6 sm:grid-cols-[220px_1fr] sm:p-8">
      <div ref={qr} className={cn('mx-auto rounded-2xl border border-black/8 bg-white p-4', checkedIn && 'opacity-45')}><QRCodeSVG value={payload} size={184} level="H" marginSize={1} bgColor="#ffffff" fgColor="#17231d" title={`Check-in QR for ${bookingNumber}`} /></div>
      <div>{checkedIn ? <div className="flex items-center gap-2 font-bold text-forest"><CheckCircle2 className="size-5"/>Checked in</div> : <p className="font-bold text-forest">Show this code when you arrive</p>}<p className="mt-3 text-sm leading-6 text-ink/55">An administrator, manager, or your assigned driver will scan it. The code contains no personal information.</p><p className="mt-3 text-xs font-semibold text-ink/40">Ticket {bookingNumber}</p><Button variant="secondary" onClick={download} className="mt-5"><Download className="mr-2 size-4"/>Download QR</Button></div>
    </div>
  </section>
}
