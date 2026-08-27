import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Destination } from '@/types/domain'

export function DestinationCard({ destination }: { destination: Destination }) {
  return <Link to={`/destinations/${destination.slug}`} className="group relative min-h-80 overflow-hidden rounded-3xl bg-forest shadow-soft"><div className="absolute inset-0 bg-[linear-gradient(145deg,#244b3a,#d87948)]">{destination.cover_image && <img src={destination.cover_image.url} alt={destination.cover_image.alt_text ?? destination.name} className="size-full object-cover transition duration-500 group-hover:scale-105" />}</div><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" /><div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white"><div><h2 className="text-display text-3xl">{destination.name}</h2><p className="mt-2 line-clamp-2 text-sm text-white/70">{destination.short_description}</p></div><ArrowUpRight className="shrink-0 text-apricot-light" /></div></Link>
}
