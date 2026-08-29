import { ArrowRight, CarFront, MapPinned, ShieldCheck } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container } from '@/components/ui/Container'
import { TourCard } from '@/components/catalog/TourCard'
import { buttonStyles } from '@/components/ui/button-styles'
import { QueryError } from '@/components/ui/QueryState'
import { carsQuery, toursQuery } from '@/features/catalog/api'
import { cn } from '@/lib/cn'

const promises = [
  { icon: ShieldCheck, label: 'Friendly small groups' },
  { icon: ShieldCheck, label: 'Private tours' },
  { icon: CarFront, label: 'Comfortable transport' },
  { icon: MapPinned, label: 'Scheduled departures' },
] as const

export function HomePage() {
  const { t, i18n } = useTranslation()
  const tours = useQuery(toursQuery(i18n.language, { featured: true, format: 'group', per_page: 6 }))
  const cars = useQuery(carsQuery({ per_page: 3 }))
  return <>
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <img src="/images/armenia-garni-hero.png" alt="Garni Temple overlooking the Armenian highlands" className="absolute inset-0 -z-20 size-full object-cover object-[68%_center]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(16,28,22,.94)_0%,rgba(16,28,22,.78)_42%,rgba(16,28,22,.12)_78%)]" />
      <div className="absolute -right-20 top-16 -z-10 size-96 rounded-full border border-white/10" />
      <Container className="grid min-h-[650px] items-center py-24 lg:grid-cols-[1fr_0.7fr]">
        <div className="max-w-3xl"><p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-apricot-light">{t('home.eyebrow')}</p><h1 className="text-display text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">{t('home.title')}</h1><p className="mt-7 text-lg text-white/75 sm:text-xl">{t('home.subtitle')}</p><div className="mt-9 flex flex-wrap gap-3"><Link to="/tours?format=group" className={buttonStyles()}>{t('actions.explore')}<ArrowRight className="ml-2 size-4" /></Link><Link to="/build-your-trip" className={cn(buttonStyles('secondary'), 'border-[#a9874c] bg-[#a9874c] text-white shadow-lg shadow-[#a9874c]/20 hover:-translate-y-0.5 hover:border-[#967641] hover:bg-[#967641]')}>{t('actions.build')}<ArrowRight className="ml-2 size-4" /></Link></div><p className="mt-5 text-sm text-white/60">{t('home.privateAvailable')} <Link to="/tours?format=private" className="font-semibold text-white underline decoration-white/35 underline-offset-4 hover:decoration-white">{t('actions.viewPrivate')}</Link></p></div>
        <div className="mt-16 grid gap-3 sm:grid-cols-3 lg:mt-0 lg:grid-cols-1">{promises.map(({ icon: Icon, label }) => <div key={label} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/7 p-4 backdrop-blur"><Icon className="text-apricot-light" /><span className="font-semibold">{label}</span></div>)}</div>
      </Container>
    </section>
    <section className="py-20 sm:py-28"><Container><div className="mb-10 flex items-end justify-between gap-5"><div><p className="text-sm font-bold uppercase tracking-widest text-apricot">Scheduled adventures</p><h2 className="text-display mt-2 text-4xl sm:text-5xl">Popular group tours</h2><p className="mt-4 max-w-2xl text-ink/60">Join a welcoming small group, meet fellow travelers, and explore Armenia with simple per-person pricing.</p></div><Link to="/tours?format=group" className="hidden font-semibold text-forest sm:block">View all →</Link></div>
      {tours.isError ? <QueryError retry={() => void tours.refetch()} /> : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{tours.isPending ? [1, 2, 3].map((item) => <div key={item} className="h-96 animate-pulse rounded-3xl bg-sand/60" />) : tours.data.data.map((tour) => <TourCard key={tour.id} tour={tour} />)}</div>}
    </Container></section>
    <section className="bg-ink py-20 text-white"><Container><div className="flex items-end justify-between gap-5"><div><p className="text-sm font-bold uppercase tracking-widest text-apricot-light">Our fleet</p><h2 className="text-display mt-2 text-4xl sm:text-5xl">Comfortable cars for every journey</h2><p className="mt-4 max-w-2xl text-white/60">See the vehicles our guests travel in. We assign the right available car for your group and route.</p></div><Link to="/cars" className="hidden font-semibold text-white sm:block">View all →</Link></div><div className="mt-10 grid gap-6 md:grid-cols-3">{cars.data?.data.map((car) => <Link to="/cars" key={car.id} className="overflow-hidden rounded-3xl bg-white text-ink"><div className="grid h-48 place-items-center bg-stone">{car.cover_image ? <img src={car.cover_image.url} alt={car.name} className="size-full object-cover" /> : <CarFront className="size-14 text-forest/25" />}</div><div className="p-6"><p className="text-xs font-bold uppercase tracking-wider text-apricot">{car.category} · {car.year}</p><h3 className="text-display mt-2 text-2xl">{car.name}</h3><p className="mt-4 text-sm text-ink/55">Up to {car.passenger_capacity} guests · {car.luggage_capacity} bags</p></div></Link>)}</div></Container></section>
    <section className="bg-stone py-20"><Container className="grid gap-10 lg:grid-cols-2 lg:items-center"><div><p className="text-sm font-bold uppercase tracking-widest text-apricot">Prefer a private journey?</p><h2 className="text-display mt-3 text-4xl sm:text-5xl">Build a route entirely around you.</h2><p className="mt-5 max-w-xl leading-7 text-ink/65">{t('home.promise')}</p></div><div className="rounded-[2rem] bg-white p-8 shadow-soft"><div className="space-y-4">{['Yerevan', 'Garni', 'Geghard', 'Lake Sevan'].map((place, index) => <div key={place} className="flex items-center gap-4"><span className="grid size-9 place-items-center rounded-full bg-forest text-sm font-bold text-white">{index + 1}</span><span className="font-semibold">{place}</span></div>)}</div><Link to="/build-your-trip" className={cn(buttonStyles(), 'mt-8 w-full')}>{t('actions.build')}</Link></div></Container></section>
  </>
}
