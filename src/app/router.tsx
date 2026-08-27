import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { OperationsLayout } from '@/components/layout/OperationsLayout'
import { RequireRole } from '@/features/auth/RequireRole'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OperationsPage } from '@/pages/OperationsPage'

const ToursPage = lazy(() => import('@/pages/catalog/ToursPage').then((module) => ({ default: module.ToursPage })))
const TourDetailsPage = lazy(() => import('@/pages/catalog/TourDetailsPage').then((module) => ({ default: module.TourDetailsPage })))
const DestinationsPage = lazy(() => import('@/pages/catalog/DestinationsPage').then((module) => ({ default: module.DestinationsPage })))
const DestinationDetailsPage = lazy(() => import('@/pages/catalog/DestinationDetailsPage').then((module) => ({ default: module.DestinationDetailsPage })))
const CarsPage = lazy(() => import('@/pages/catalog/CarsPage').then((module) => ({ default: module.CarsPage })))
const ServiceEstimatorPage = lazy(() => import('@/pages/services/ServiceEstimatorPage').then((module) => ({ default: module.ServiceEstimatorPage })))
const CustomTripPage = lazy(() => import('@/pages/services/CustomTripPage').then((module) => ({ default: module.CustomTripPage })))
const BookingPage = lazy(() => import('@/pages/booking/BookingPage').then((module) => ({ default: module.BookingPage })))
const BookingConfirmationPage = lazy(() => import('@/pages/booking/BookingConfirmationPage').then((module) => ({ default: module.BookingConfirmationPage })))
const BookingStatusPage = lazy(() => import('@/pages/booking/BookingStatusPage').then((module) => ({ default: module.BookingStatusPage })))
const contentPages = () => import('@/pages/content/ContentPages')
const AboutPage = lazy(() => contentPages().then((module) => ({ default: module.AboutPage })))
const ContactPage = lazy(() => contentPages().then((module) => ({ default: module.ContactPage })))
const FaqPage = lazy(() => contentPages().then((module) => ({ default: module.FaqPage })))

const operation = (title: string) => <OperationsPage title={title} />

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'tours', element: <ToursPage /> },
      { path: 'tours/category/:slug', element: <ToursPage /> },
      { path: 'tours/:slug', element: <TourDetailsPage /> },
      { path: 'destinations', element: <DestinationsPage /> },
      { path: 'destinations/:slug', element: <DestinationDetailsPage /> },
      { path: 'cars', element: <CarsPage /> },
      { path: 'airport-transfer', element: <ServiceEstimatorPage type="airport_transfer" /> },
      { path: 'private-driver', element: <ServiceEstimatorPage type="private_driver" /> },
      { path: 'build-your-trip', element: <CustomTripPage /> },
      { path: 'booking', element: <BookingPage /> },
      { path: 'booking/confirmation', element: <BookingConfirmationPage /> },
      { path: 'booking/:bookingNumber/:token', element: <BookingStatusPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'faq', element: <FaqPage /> },
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
