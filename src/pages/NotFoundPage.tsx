import { Link } from 'react-router-dom'
import { buttonStyles } from '@/components/ui/button-styles'
import { Container } from '@/components/ui/Container'

export function NotFoundPage() { return <Container className="grid min-h-[70vh] place-items-center py-20 text-center"><div><p className="text-display text-8xl text-apricot">404</p><h1 className="mt-4 text-3xl font-bold">This road ends here.</h1><p className="mt-3 text-ink/60">Let’s take you back to Armenia’s journeys.</p><Link className={`${buttonStyles()} mt-7`} to="/">Return home</Link></div></Container> }
