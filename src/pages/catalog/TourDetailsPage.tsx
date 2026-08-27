import { Check, Clock3, MapPin, Route } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container } from '@/components/ui/Container'
import { PageLoader } from '@/components/ui/PageLoader'
import { QueryError } from '@/components/ui/QueryState'
import { buttonStyles } from '@/components/ui/button-styles'
import { tourQuery } from '@/features/catalog/api'
import { formatMoney } from '@/lib/money'

export function TourDetailsPage() {
  const { slug = '' } = useParams(); const { i18n } = useTranslation(); const tour = useQuery(tourQuery(i18n.language, slug))
  if (tour.isPending) return <PageLoader />
  if (tour.isError) return <Container className="py-20"><QueryError retry={() => void tour.refetch()} /></Container>
  const item = tour.data
  return <><section className="relative min-h-[520px] overflow-hidden bg-ink text-white"><img src={item.cover_image?.url ?? '/images/armenia-garni-hero.png'} alt={item.cover_image?.alt_text ?? item.title} className="absolute inset-0 size-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" /><Container className="relative flex min-h-[520px] items-end py-16"><div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-apricot-light">{item.category?.name}</p><h1 className="text-display mt-3 text-5xl sm:text-7xl">{item.title}</h1><p className="mt-5 max-w-2xl text-lg text-white/75">{item.short_description}</p><div className="mt-7 flex flex-wrap gap-5 text-sm font-semibold"><span className="flex gap-2"><Clock3 />{Math.round(item.duration_minutes/60)} hours</span><span className="flex gap-2"><Route />{item.approximate_distance_km} km</span><span className="flex gap-2"><Check />Private car</span></div></div></Container></section><Container className="grid gap-12 py-16 lg:grid-cols-[1fr_340px]"><div><h2 className="text-display text-4xl">The journey</h2><p className="mt-5 leading-8 text-ink/65">{item.description}</p><h2 className="text-display mt-14 text-4xl">Itinerary</h2><div className="mt-8 space-y-0">{item.itinerary?.map((stop, index)=><div className="relative flex gap-5 pb-8" key={`${stop.day_number}-${stop.stop_order}`}><div className="flex flex-col items-center"><span className="grid size-10 place-items-center rounded-full bg-forest text-sm font-bold text-white">{index+1}</span>{index < (item.itinerary?.length ?? 0)-1 && <span className="h-full w-px bg-sand" />}</div><div className="pt-2"><h3 className="font-bold">{stop.destination?.name ?? 'Scenic stop'}</h3>{stop.duration_minutes && <p className="mt-1 text-sm text-ink/50">About {stop.duration_minutes} minutes</p>}</div></div>)}</div></div><aside><div className="sticky top-24 rounded-3xl bg-white p-6 shadow-soft"><p className="text-sm text-ink/50">Private tour from</p><p className="mt-1 text-3xl font-bold text-forest">{formatMoney(item.starting_price.amount_minor,item.starting_price.currency,i18n.language)} <span className="text-sm font-normal text-ink/50">/ car</span></p><ul className="mt-6 space-y-3 text-sm text-ink/65"><li className="flex gap-2"><MapPin className="size-4 text-apricot" />Hotel pickup available</li><li className="flex gap-2"><Check className="size-4 text-apricot" />Free cancellation up to {item.free_cancellation_hours}h</li></ul><Link to={`/booking?service=tour&tour=${item.id}`} className={`${buttonStyles()} mt-7 w-full`}>Choose date & car</Link></div></aside></Container></>
}
