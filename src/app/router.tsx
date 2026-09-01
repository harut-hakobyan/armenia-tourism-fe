import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { OperationsLayout } from '@/components/layout/OperationsLayout'
import { RequireRole } from '@/features/auth/RequireRole'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminBookingsPage } from '@/pages/admin/AdminBookingsPage'
import { AdminBookingDetailsPage } from '@/pages/admin/AdminBookingDetailsPage'
import { AdminCalendarPage } from '@/pages/admin/AdminCalendarPage'
import { AdminDriversPage } from '@/pages/admin/AdminDriversPage'
import { AdminCarsPage } from '@/pages/admin/AdminCarsPage'
import { AdminToursPage } from '@/pages/admin/AdminToursPage'
import { AdminDestinationsPage } from '@/pages/admin/AdminDestinationsPage'
import { AdminCmsPage, AdminSettingsPage } from '@/pages/admin/AdminCmsPage'
import { DriverTripsPage } from '@/pages/driver/DriverTripsPage'
import { DriverTripDetailsPage } from '@/pages/driver/DriverTripDetailsPage'
import { TelegramConnectionPage } from '@/pages/TelegramConnectionPage'
import { BookingConfirmationPage } from '@/pages/booking/BookingConfirmationPage'

const ToursPage = lazy(() => import('@/pages/catalog/ToursPage').then((module) => ({ default: module.ToursPage })))
const TourDetailsPage = lazy(() => import('@/pages/catalog/TourDetailsPage').then((module) => ({ default: module.TourDetailsPage })))
const CheckInPage = lazy(() => import('@/pages/CheckInPage').then((module) => ({ default: module.CheckInPage })))
const DestinationsPage = lazy(() => import('@/pages/catalog/DestinationsPage').then((module) => ({ default: module.DestinationsPage })))
const DestinationDetailsPage = lazy(() => import('@/pages/catalog/DestinationDetailsPage').then((module) => ({ default: module.DestinationDetailsPage })))
const CarsPage = lazy(() => import('@/pages/catalog/CarsPage').then((module) => ({ default: module.CarsPage })))
const CustomTripPage = lazy(() => import('@/pages/services/CustomTripPage').then((module) => ({ default: module.CustomTripPage })))
const BookingPage = lazy(() => import('@/pages/booking/BookingPage').then((module) => ({ default: module.BookingPage })))
const BookingStatusPage = lazy(() => import('@/pages/booking/BookingStatusPage').then((module) => ({ default: module.BookingStatusPage })))
const contentPages = () => import('@/pages/content/ContentPages')
const AboutPage = lazy(() => contentPages().then((module) => ({ default: module.AboutPage })))
const ContactPage = lazy(() => contentPages().then((module) => ({ default: module.ContactPage })))
const FaqPage = lazy(() => contentPages().then((module) => ({ default: module.FaqPage })))

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
      { index: true, element: <AdminDashboardPage /> },
      { path: 'bookings', element: <AdminBookingsPage /> },
      { path: 'bookings/:id', element: <AdminBookingDetailsPage /> },
      { path: 'calendar', element: <AdminCalendarPage /> },
      { path: 'tours', element: <AdminToursPage /> },
      { path: 'destinations', element: <AdminDestinationsPage /> },
      { path: 'cars', element: <AdminCarsPage /> },
      { path: 'drivers', element: <AdminDriversPage /> },
      { path: 'customers', element: <AdminCmsPage type="customers" /> },
      { path: 'reviews', element: <AdminCmsPage type="reviews" /> },
      { path: 'promo-codes', element: <AdminCmsPage type="promo-codes" /> },
      { path: 'faqs', element: <AdminCmsPage type="faqs" /> },
      { path: 'inquiries', element: <AdminCmsPage type="inquiries" /> },
      { path: 'settings', element: <AdminSettingsPage /> },
      { path: 'audit-logs', element: <AdminCmsPage type="audit-logs" /> },
      { path: 'telegram', element: <TelegramConnectionPage /> },
      { path: 'check-in', element: <CheckInPage /> },
    ],
  },
  {
    path: '/driver',
    element: <RequireRole roles={['driver']}><OperationsLayout driver /></RequireRole>,
    children: [
      { index: true, element: <DriverTripsPage /> },
      { path: 'trips/:id', element: <DriverTripDetailsPage /> },
      { path: 'telegram', element: <TelegramConnectionPage /> },
      { path: 'check-in', element: <CheckInPage /> },
    ],
  },
])
