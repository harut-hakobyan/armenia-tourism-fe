import { Container } from '@/components/ui/Container'

export function PlaceholderPage({ title, description = 'This screen is connected to the application route and ready for its feature module.' }: { title: string; description?: string }) {
  return <Container className="py-20 sm:py-28"><p className="text-sm font-bold uppercase tracking-[0.2em] text-apricot">Armenia journeys</p><h1 className="text-display mt-3 text-5xl text-ink sm:text-6xl">{title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-ink/60">{description}</p></Container>
}
