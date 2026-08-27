import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { QueryError } from '@/components/ui/QueryState'
import { TourCard } from '@/components/catalog/TourCard'
import { categoriesQuery, toursQuery } from '@/features/catalog/api'

export function ToursPage() {
  const { i18n } = useTranslation(); const route = useParams(); const [params, setParams] = useSearchParams(); const category = route.slug ?? params.get('category') ?? undefined
  const tours = useQuery(toursQuery(i18n.language, { ...(category ? { category } : {}), per_page: 24 }))
  const categories = useQuery(categoriesQuery(i18n.language))
  return <Container className="py-16 sm:py-24"><p className="text-sm font-bold uppercase tracking-[.2em] text-apricot">Travel privately</p><h1 className="text-display mt-3 text-5xl sm:text-6xl">Tours across Armenia</h1><p className="mt-5 max-w-2xl text-lg text-ink/60">One car, one local driver, and a route shaped around your pace. Prices are for the whole car unless stated otherwise.</p><div className="mt-9 flex gap-2 overflow-x-auto pb-2"><button onClick={() => setParams({})} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${!category ? 'bg-forest text-white' : 'bg-white text-forest'}`}>All tours</button>{categories.data?.map((item) => <button key={item.id} onClick={() => setParams({ category: item.slug })} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${category === item.slug ? 'bg-forest text-white' : 'bg-white text-forest'}`}>{item.name}</button>)}</div>{tours.isError ? <div className="mt-10"><QueryError retry={() => void tours.refetch()} /></div> : <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{tours.isPending ? [1,2,3,4,5,6].map((i)=><div key={i} className="h-96 animate-pulse rounded-3xl bg-sand/50" />) : tours.data.data.map((tour)=><TourCard key={tour.id} tour={tour} />)}</div>}</Container>
}
