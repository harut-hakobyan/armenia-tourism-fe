import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Container } from '@/components/ui/Container'
import { DestinationCard } from '@/components/catalog/DestinationCard'
import { QueryError } from '@/components/ui/QueryState'
import { destinationsQuery } from '@/features/catalog/api'

export function DestinationsPage() { const { i18n,t }=useTranslation(); const query=useQuery(destinationsQuery(i18n.language,{per_page:30})); return <Container className="py-16 sm:py-24"><p className="text-sm font-bold uppercase tracking-[.2em] text-apricot">{t('destinations.eyebrow')}</p><h1 className="text-display mt-3 text-5xl sm:text-6xl">{t('destinations.title')}</h1><p className="mt-5 max-w-2xl text-lg text-ink/60">{t('destinations.description')}</p>{query.isError?<div className="mt-10"><QueryError retry={()=>void query.refetch()} /></div>:<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{query.isPending?[1,2,3,4,5,6].map(i=><div key={i} className="h-80 animate-pulse rounded-3xl bg-sand/50"/>):query.data.data.map(item=><DestinationCard key={item.id} destination={item}/>)}</div>}</Container> }
