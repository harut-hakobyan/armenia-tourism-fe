import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Briefcase, Crown, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container } from '@/components/ui/Container'
import { TourCard } from '@/components/catalog/TourCard'
import { QueryError } from '@/components/ui/QueryState'
import { buttonStyles } from '@/components/ui/button-styles'
import { carsQuery, categoriesQuery, toursQuery } from '@/features/catalog/api'
import { cn } from '@/lib/cn'
import type { Car, TourFormat } from '@/types/domain'

type TourView = TourFormat | 'all' | 'premium'

const viewCopy: Record<TourView, { eyebrow: string; title: string; description: string }> = {
  all: {
    eyebrow: 'See Armenia your way',
    title: 'Tours across Armenia',
    description: 'Choose a sociable scheduled departure or enjoy the freedom of a private journey, led by local experts in comfortable vehicles.',
  },
  group: {
    eyebrow: 'Travel together, discover more',
    title: 'Group tours across Armenia',
    description: 'Join a scheduled small-group departure with a local guide, comfortable transport, and transparent per-person pricing.',
  },
  private: {
    eyebrow: 'Your journey, your pace',
    title: 'Private tours across Armenia',
    description: 'Enjoy a flexible itinerary for your party, with hotel pickup, a professional local driver, and pricing for the whole car.',
  },
  premium: {
    eyebrow: 'Elevated private travel',
    title: 'Premium Private Tours',
    description: 'Discover Armenia in exceptional comfort with a private itinerary, discreet service, and one of our premium-class vehicles.',
  },
}

function PremiumCarCard({ car }: { car: Car }) {
  return <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/7 shadow-2xl shadow-black/15 backdrop-blur-sm">
    <div className="relative aspect-[16/10] overflow-hidden bg-white/10">
      {car.cover_image
        ? <img src={car.cover_image.url} alt={car.name} className="size-full object-cover transition duration-500 hover:scale-105" />
        : <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_top,#b99a62_0%,#203e31_70%)]"><Crown className="size-14 text-white/60" /></div>}
      <span className="absolute left-4 top-4 rounded-full bg-[#a9874c] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">Premium class</span>
    </div>
    <div className="p-6">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#d8bc87]">{car.brand} · {car.year}</p>
      <h3 className="text-display mt-2 text-3xl text-white">{car.name}</h3>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/70">
        <span className="flex items-center gap-2"><Users className="size-4 text-[#d8bc87]" />{car.passenger_capacity} guests</span>
        <span className="flex items-center gap-2"><Briefcase className="size-4 text-[#d8bc87]" />{car.luggage_capacity} bags</span>
        {car.features.wifi && <span className="flex items-center gap-2"><Sparkles className="size-4 text-[#d8bc87]" />Wi-Fi</span>}
      </div>
    </div>
  </article>
}

export function ToursPage() {
  const { i18n } = useTranslation()
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? undefined
  const formatParam = params.get('format')
  const view: TourView = formatParam === 'private' || formatParam === 'all' || formatParam === 'premium' ? formatParam : 'group'
  const format: TourFormat | undefined = view === 'all' ? undefined : view === 'premium' ? 'private' : view
  const tours = useQuery(toursQuery(i18n.language, { ...(category ? { category } : {}), ...(format ? { format } : {}), per_page: 24 }))
  const categories = useQuery(categoriesQuery(i18n.language))
  const premiumCars = useQuery({ ...carsQuery({ category: 'premium', per_page: 12 }), enabled: view === 'premium' })
  const copy = viewCopy[view]

  function selectCategory(next?: string) {
    const updated = new URLSearchParams(params)
    if (next) updated.set('category', next)
    else updated.delete('category')
    setParams(updated)
  }

  return <Container className="py-16 sm:py-24">
    <p className="text-sm font-bold uppercase tracking-[.2em] text-apricot">{copy.eyebrow}</p>
    <h1 className="text-display mt-3 text-5xl sm:text-6xl">{copy.title}</h1>
    <p className="mt-5 max-w-2xl text-lg text-ink/60">{copy.description}</p>
    <div className="mt-9 flex gap-2 overflow-x-auto pb-2"><button onClick={() => selectCategory()} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${!category ? 'bg-forest text-white' : 'bg-white text-forest'}`}>All categories</button>{categories.data?.map((item) => <button key={item.id} onClick={() => selectCategory(item.slug)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${category === item.slug ? 'bg-forest text-white' : 'bg-white text-forest'}`}>{item.name}</button>)}</div>
    {view === 'premium' && <section className="mt-10 overflow-hidden rounded-[2rem] bg-forest px-6 py-8 sm:px-9 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div><div className="flex items-center gap-2 text-[#d8bc87]"><ShieldCheck className="size-5" /><p className="text-xs font-bold uppercase tracking-[.2em]">Your premium fleet</p></div><h2 className="text-display mt-3 text-3xl text-white sm:text-4xl">Travel in first-class comfort</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">Select your preferred private itinerary below, or create a completely custom route with one of our premium vehicles.</p></div>
        <Link to="/build-your-trip?vehicle=premium" className={cn(buttonStyles('secondary'), 'shrink-0 border-[#d8bc87] bg-[#d8bc87] text-forest hover:border-[#efd49d] hover:bg-[#efd49d]')}>Build your premium trip<ArrowRight className="ml-2 size-4" /></Link>
      </div>
      {premiumCars.isError ? <div className="mt-7 rounded-2xl bg-white p-5"><QueryError retry={() => void premiumCars.refetch()} /></div> : <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{premiumCars.isPending ? [1,2,3].map((item) => <div key={item} className="h-80 animate-pulse rounded-3xl bg-white/10" />) : premiumCars.data.data.length ? premiumCars.data.data.map((car) => <PremiumCarCard key={car.id} car={car} />) : <p className="rounded-2xl bg-white/10 p-5 text-sm text-white/70 md:col-span-2 lg:col-span-3">Our premium vehicles are being updated. Contact us and we’ll arrange the best available option for your journey.</p>}</div>}
    </section>}
    {view === 'premium' && <div className="mt-14"><p className="text-sm font-bold uppercase tracking-[.2em] text-apricot">Choose your itinerary</p><h2 className="text-display mt-2 text-4xl">Private tours, elevated</h2></div>}
    {tours.isError ? <div className="mt-10"><QueryError retry={() => void tours.refetch()} /></div> : <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{tours.isPending ? [1,2,3,4,5,6].map((i)=><div key={i} className="h-96 animate-pulse rounded-3xl bg-sand/50" />) : tours.data.data.map((tour)=><TourCard key={tour.id} tour={tour} />)}</div>}
  </Container>
}
