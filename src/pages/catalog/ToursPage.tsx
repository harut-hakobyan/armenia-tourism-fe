import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container } from '@/components/ui/Container'
import { TourCard } from '@/components/catalog/TourCard'
import { QueryError } from '@/components/ui/QueryState'
import { categoriesQuery, toursQuery } from '@/features/catalog/api'
import type { TourFormat } from '@/types/domain'

export function ToursPage() {
  const { i18n } = useTranslation()
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? undefined
  const format = (params.get('format') as TourFormat | null) ?? undefined
  const tours = useQuery(toursQuery(i18n.language, { ...(category ? { category } : {}), ...(format ? { format } : {}), per_page: 24 }))
  const categories = useQuery(categoriesQuery(i18n.language))

  function selectFormat(next?: TourFormat) {
    const updated = new URLSearchParams(params)
    if (next) updated.set('format', next)
    else updated.delete('format')
    setParams(updated)
  }

  function selectCategory(next?: string) {
    const updated = new URLSearchParams(params)
    if (next) updated.set('category', next)
    else updated.delete('category')
    setParams(updated)
  }

  return <Container className="py-16 sm:py-24">
    <p className="text-sm font-bold uppercase tracking-[.2em] text-apricot">Private freedom or shared discovery</p>
    <h1 className="text-display mt-3 text-5xl sm:text-6xl">Tours across Armenia</h1>
    <p className="mt-5 max-w-2xl text-lg text-ink/60">Choose a private car and flexible route, or join a scheduled small-group departure with transparent per-person pricing.</p>
    <div className="mt-9 flex flex-wrap gap-2">
      {([['All tours', undefined], ['Private tours', 'private'], ['Group tours', 'group']] as const).map(([label, value]) => <button key={label} onClick={() => selectFormat(value)} className={`rounded-full px-5 py-2.5 text-sm font-semibold ${format === value ? 'bg-[#a9874c] text-white' : 'bg-white text-forest'}`}>{label}</button>)}
    </div>
    <div className="mt-4 flex gap-2 overflow-x-auto pb-2"><button onClick={() => selectCategory()} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${!category ? 'bg-forest text-white' : 'bg-white text-forest'}`}>All categories</button>{categories.data?.map((item) => <button key={item.id} onClick={() => selectCategory(item.slug)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${category === item.slug ? 'bg-forest text-white' : 'bg-white text-forest'}`}>{item.name}</button>)}</div>
    {tours.isError ? <div className="mt-10"><QueryError retry={() => void tours.refetch()} /></div> : <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{tours.isPending ? [1,2,3,4,5,6].map((i)=><div key={i} className="h-96 animate-pulse rounded-3xl bg-sand/50" />) : tours.data.data.map((tour)=><TourCard key={tour.id} tour={tour} />)}</div>}
  </Container>
}
