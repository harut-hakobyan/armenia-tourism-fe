import { createBrowserRouter } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { OperationsLayout } from '@/components/layout/OperationsLayout'
import { RequireRole } from '@/features/auth/RequireRole'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OperationsPage } from '@/pages/OperationsPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'

const page = (title: string, description?: string) => <PlaceholderPage title={title} {...(description ? { description } : {})} />
const operation = (title: string) => <OperationsPage title={title} />

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'tours', element: page('Private Tours') },
      { path: 'tours/category/:slug', element: page('Tour Collection') },
      { path: 'tours/:slug', element: page('Tour Details') },
      { path: 'destinations', element: page('Destinations') },
      { path: 'destinations/:slug', element: page('Destination Details') },
      { path: 'cars', element: page('Our Cars') },
      { path: 'airport-transfer', element: page('Airport Transfer') },
      { path: 'private-driver', element: page('Private Driver in Armenia') },
      { path: 'build-your-trip', element: page('Build Your Trip') },
      { path: 'booking', element: page('Book Your Armenia Adventure') },
      { path: 'booking/confirmation', element: page('Booking Confirmed') },
      { path: 'booking/:bookingNumber/:token', element: page('My Booking') },
      { path: 'about', element: page('About Us') },
      { path: 'contact', element: page('Contact') },
      { path: 'faq', element: page('Frequently Asked Questions') },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '/admin/login', element: <LoginPage /> },
  {
    path: '/admin',
    element: <RequireRole roles={['admin', 'manager']}><OperationsLayout /></RequireRole>,
    children: [
      { index: true, element: operation('Dashboard') },
      { path: 'bookings', element: operation('Bookings') },
      { path: 'bookings/:id', element: operation('Booking Details') },
      { path: 'tours', element: operation('Tours') },
      { path: 'tours/create', element: operation('Create Tour') },
      { path: 'tours/:id/edit', element: operation('Edit Tour') },
      { path: 'destinations', element: operation('Destinations') },
      { path: 'cars', element: operation('Cars') },
      { path: 'drivers', element: operation('Drivers') },
      { path: 'customers', element: operation('Customers') },
      { path: 'reviews', element: operation('Reviews') },
      { path: 'promo-codes', element: operation('Promo Codes') },
      { path: 'settings', element: operation('Settings') },
    ],
  },
  {
    path: '/driver',
    element: <RequireRole roles={['driver']}><OperationsLayout driver /></RequireRole>,
    children: [
      { index: true, element: operation('My Assigned Trips') },
      { path: 'trips/:id', element: operation('Trip Details') },
    ],
  },
])
