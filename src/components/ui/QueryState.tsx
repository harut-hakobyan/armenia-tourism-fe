import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from './Button'

export function QueryError({ retry }: { retry: () => void }) {
  const { t } = useTranslation()
  return <div className="rounded-3xl border border-danger/15 bg-white p-8 text-center shadow-soft"><AlertCircle className="mx-auto mb-3 text-danger" /><p>{t('common.error')}</p><Button className="mt-5" onClick={retry}>{t('common.retry')}</Button></div>
}
