import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container } from '@/components/ui/Container'
import { buttonStyles } from '@/components/ui/button-styles'

export function NotFoundPage() {
  const { t } = useTranslation()

  return <Container className="grid min-h-[70vh] place-items-center py-20 text-center"><div><p className="text-display text-8xl text-apricot">404</p><h1 className="mt-4 text-3xl font-bold">{t('notFound.title')}</h1><p className="mt-3 text-ink/60">{t('notFound.text')}</p><Link className={`${buttonStyles()} mt-7`} to="/">{t('notFound.home')}</Link></div></Container>
}
