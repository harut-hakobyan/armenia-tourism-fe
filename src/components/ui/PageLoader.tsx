import { useTranslation } from 'react-i18next'

export function PageLoader() {
  const { t } = useTranslation()
  return <div className="grid min-h-[45vh] place-items-center" role="status"><span className="size-9 animate-spin rounded-full border-3 border-sand border-t-apricot" /><span className="sr-only">{t('common.loading')}</span></div>
}
