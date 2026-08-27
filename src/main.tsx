import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import '@/i18n'
import '@/styles/global.css'
import { AppProviders } from '@/app/AppProviders'
import { router } from '@/app/router'
import { PageLoader } from '@/components/ui/PageLoader'

const root = document.getElementById('root')
if (!root) throw new Error('Application root element was not found.')

createRoot(root).render(<StrictMode><AppProviders><Suspense fallback={<PageLoader />}><RouterProvider router={router} /></Suspense></AppProviders></StrictMode>)
