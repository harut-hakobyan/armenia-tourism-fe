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
- API-backed About, contact inquiry/WhatsApp, multilingual FAQ, responsive navigation, and route metadata

## Implemented operations experience

- role-protected admin dashboard, booking table, calendar, booking details, and conflict-safe assignment
- active-state directories for tours, destinations, cars, and drivers with validated image upload
- customers, review moderation, promo codes, FAQs, contact inquiries, website settings, and audit history
- mobile-first driver trip list, customer contact actions, and controlled status progression

## Production image

```bash
docker build --build-arg VITE_API_BASE_URL=https://api.example.com/api/v1 -t armenia-tourism-fe .
docker run --rm -p 8080:80 armenia-tourism-fe
```

The image uses an Nginx SPA fallback and long-lived caching for fingerprinted assets. TLS should terminate at the deployment edge.
