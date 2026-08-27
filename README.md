# Armenia Tourism Frontend

Mobile-first React application for private tours, airport transfers, drivers, and custom journeys across Armenia. It consumes the versioned Laravel API in `../armenia-tourism-be` and contains separate public, admin, and driver route areas.

## Stack

- React 19 and strict TypeScript
- Vite 8
- React Router 7
- Axios and TanStack Query 5
- Tailwind CSS 4
- i18next with English, Russian, and Armenian catalogs

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` to the Laravel `/api/v1` URL. No domain is hardcoded in application code.

## Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Structure

```text
src/
  app/          providers, router, query client
  components/   shared UI and layouts
  features/     domain-owned API and feature modules
  i18n/         interface translations
  lib/          HTTP, auth storage, formatting utilities
  pages/        route composition
  styles/       design tokens and global styles
  types/        API contract types
```

Authentication uses a Sanctum bearer token stored in browser storage. Resource access is still authoritatively enforced by Laravel policies; frontend guards are navigation UX, not a security boundary.

## Implemented public experience

- premium API-backed home page and original Armenia hero photography
- tour collections, category filters, tour details, and visual itineraries
- destination collections/details and fleet catalog
- airport transfer and private-driver live estimates
- reorderable custom-trip builder with route and price estimates
- mobile-first three-stage guest booking flow
- booking confirmation and secure public booking-status page
- About, Contact/WhatsApp, FAQ, responsive navigation, and route metadata
