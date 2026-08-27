import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container } from '@/components/ui/Container'
import { PageLoader } from '@/components/ui/PageLoader'
import { QueryError } from '@/components/ui/QueryState'
import { buttonStyles } from '@/components/ui/button-styles'
import { destinationQuery } from '@/features/catalog/api'

export function DestinationDetailsPage(){const {slug=''}=useParams();const {i18n}=useTranslation();const query=useQuery(destinationQuery(i18n.language,slug));if(query.isPending)return <PageLoader/>;if(query.isError)return <Container className="py-20"><QueryError retry={()=>void query.refetch()}/></Container>;const item=query.data;return <><section className="relative min-h-[480px] bg-forest text-white"><img src={item.cover_image?.url??'/images/armenia-garni-hero.png'} alt={item.name} className="absolute inset-0 size-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/><Container className="relative flex min-h-[480px] items-end py-14"><div><p className="text-sm uppercase tracking-[.2em] text-apricot-light">Destination</p><h1 className="text-display mt-2 text-6xl sm:text-7xl">{item.name}</h1><p className="mt-4 max-w-2xl text-lg text-white/75">{item.short_description}</p></div></Container></section><Container className="grid gap-10 py-16 lg:grid-cols-[1fr_300px]"><div><h2 className="text-display text-4xl">Why visit</h2><p className="mt-5 leading-8 text-ink/65">{item.description}</p></div><div className="rounded-3xl bg-stone p-6"><p className="text-sm font-bold uppercase tracking-wider text-apricot">Travel your way</p><p className="mt-3 text-sm leading-6 text-ink/60">Add {item.name} to a private custom route with your preferred car and pickup time.</p><Link to="/build-your-trip" className={`${buttonStyles()} mt-6 w-full`}>Add to my trip</Link></div></Container></>}
