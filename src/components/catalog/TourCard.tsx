import { ArrowUpRight, Clock3, Route } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Tour } from '@/types/domain'
import { formatMoney } from '@/lib/money'
import { TourSlideshow } from './TourSlideshow'

export function TourCard({ tour }: { tour: Tour }) {
  const { i18n, t } = useTranslation()
  const href = `/tours/${tour.slug}`
  return <article className="group overflow-hidden rounded-3xl bg-white shadow-soft transition hover:-translate-y-1">
    <div className="relative h-56 bg-[linear-gradient(145deg,#244b3a,#d87948)]"><TourSlideshow title={tour.title} coverImage={tour.cover_image} gallery={tour.gallery} href={href} className="size-full" imageClassName="transition duration-500 group-hover:scale-105" /><div className="pointer-events-none absolute left-4 top-4 flex gap-2"><span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-forest backdrop-blur">{tour.category?.name}</span><span className={`rounded-full px-3 py-1 text-xs font-bold text-white backdrop-blur ${tour.format === 'group' ? 'bg-[#a9874c]/95' : 'bg-forest/90'}`}>{t(`common.${tour.format}`)}</span></div></div>
    <Link to={href} className="block p-6"><div className="flex items-start justify-between gap-4"><h2 className="text-display text-2xl leading-tight">{tour.title}</h2><ArrowUpRight className="mt-1 size-5 shrink-0 text-apricot" /></div><p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/60">{tour.short_description}</p><div className="mt-5 flex items-center gap-4 text-xs font-semibold text-ink/55"><span className="flex items-center gap-1.5"><Clock3 className="size-4" />{Math.round(tour.duration_minutes / 60)}h</span>{tour.approximate_distance_km && <span className="flex items-center gap-1.5"><Route className="size-4" />{tour.approximate_distance_km} km</span>}</div><div className="mt-5 border-t border-black/6 pt-4"><span className="text-sm text-ink/50">{t('common.from')} </span><strong className="text-lg text-forest">{formatMoney(tour.starting_price.amount_minor, tour.starting_price.currency, i18n.language)}</strong><span className="text-sm text-ink/50"> / {t(tour.format === 'group' ? 'common.person' : 'common.car')}</span></div></Link>
  </article>
}
