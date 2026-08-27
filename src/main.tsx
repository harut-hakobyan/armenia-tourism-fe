import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import '@/i18n'
import '@/styles/global.css'
import { AppProviders } from '@/app/AppProviders'
import { router } from '@/app/router'

const root = document.getElementById('root')
if (!root) throw new Error('Application root element was not found.')

createRoot(root).render(<StrictMode><AppProviders><RouterProvider router={router} /></AppProviders></StrictMode>)
