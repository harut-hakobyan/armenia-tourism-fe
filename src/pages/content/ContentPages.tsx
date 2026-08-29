import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { MessageCircle, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { buttonStyles } from '@/components/ui/button-styles'
import { contentApi } from '@/features/content/api'

const values=[{icon:Users,title:'Local drivers',text:'Professional people who know the roads and the stories.'},{icon:ShieldCheck,title:'Clear and dependable',text:'Confirmed details, transparent prices, and direct support.'},{icon:Sparkles,title:'Made around you',text:'Your pace, pickup point, car, and route—not a crowded bus timetable.'}] as const

export function AboutPage(){return <Container className="py-16 sm:py-24"><div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-apricot">Local by nature</p><h1 className="text-display mt-3 text-5xl sm:text-7xl">Armenia is better shared.</h1><p className="mt-6 text-xl leading-9 text-ink/60">Our scheduled small-group tours bring travelers together through comfortable journeys, transparent per-person prices, and genuine local knowledge. Private journeys are available too.</p></div><div className="mt-14 grid gap-5 md:grid-cols-3">{values.map(({icon:Icon,title,text})=><div key={title} className="rounded-3xl bg-white p-7 shadow-soft"><Icon className="text-apricot"/><h2 className="mt-4 text-xl font-bold">{title}</h2><p className="mt-3 leading-7 text-ink/60">{text}</p></div>)}</div></Container>}
export function ContactPage() {
  const settings = useQuery({ queryKey: ['public-settings'], queryFn: contentApi.settings })
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const contact = useMutation({ mutationFn: contentApi.contact })
  const number = settings.data?.whatsapp_number ?? import.meta.env.VITE_WHATSAPP_NUMBER ?? '37499123456'

  return <Container className="py-16 sm:py-24"><div className="mx-auto max-w-2xl"><div className="text-center"><MessageCircle className="mx-auto size-12 text-apricot"/><h1 className="text-display mt-5 text-6xl">Let’s plan your Armenia trip.</h1><p className="mt-6 text-lg leading-8 text-ink/60">Ask about a route, luggage, child seats, airport pickup, or a special schedule.</p><a className={`${buttonStyles()} mt-8`} href={`https://wa.me/${number}`} target="_blank" rel="noreferrer">Chat on WhatsApp</a></div>
    <form className="mt-12 grid gap-4 rounded-3xl bg-white p-6 shadow-soft" onSubmit={(event) => { event.preventDefault(); contact.mutate(form) }}>
      <div className="grid gap-4 sm:grid-cols-2"><input required className="rounded-xl border border-black/10 px-4 py-3" placeholder="Your name" value={form.name} onChange={(event) => setForm({...form,name:event.target.value})}/><input required type="email" className="rounded-xl border border-black/10 px-4 py-3" placeholder="Email" value={form.email} onChange={(event) => setForm({...form,email:event.target.value})}/></div>
      <div className="grid gap-4 sm:grid-cols-2"><input className="rounded-xl border border-black/10 px-4 py-3" placeholder="Phone" value={form.phone} onChange={(event) => setForm({...form,phone:event.target.value})}/><input required className="rounded-xl border border-black/10 px-4 py-3" placeholder="Subject" value={form.subject} onChange={(event) => setForm({...form,subject:event.target.value})}/></div>
      <textarea required minLength={10} rows={5} className="rounded-xl border border-black/10 px-4 py-3" placeholder="How can we help?" value={form.message} onChange={(event) => setForm({...form,message:event.target.value})}/>
      <button className={buttonStyles()} disabled={contact.isPending}>{contact.isPending?'Sending…':'Send inquiry'}</button>
      {contact.isSuccess&&<p className="text-sm font-semibold text-emerald-700">Thank you. Your inquiry has been received.</p>}
      {contact.isError&&<p className="text-sm font-semibold text-red-700">We could not send your inquiry. Please try again.</p>}
    </form></div></Container>
}

export function FaqPage() {
  const query = useQuery({ queryKey: ['faqs'], queryFn: contentApi.faqs })
  return <Container className="py-16 sm:py-24"><div className="mx-auto max-w-3xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-apricot">Good to know</p><h1 className="text-display mt-3 text-6xl">Frequently asked questions</h1><div className="mt-10 divide-y divide-black/8 rounded-3xl bg-white px-6 shadow-soft">{query.data?.map((item)=><details key={item.id} className="group py-6"><summary className="cursor-pointer list-none pr-8 text-lg font-bold">{item.question}</summary><p className="mt-3 leading-7 text-ink/60">{item.answer}</p></details>)}</div></div></Container>
}
