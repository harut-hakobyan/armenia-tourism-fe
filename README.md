# Armenia Tourism Frontend

Next.js application for private tours, airport transfers, drivers, and custom journeys across Armenia. It consumes the versioned Laravel API in `../armenia-tourism-be` and contains separate public, admin, and driver route areas.

## Stack

- React 19 and strict TypeScript
- Next.js 16 App Router
- Axios and TanStack Query 5
- Tailwind CSS 4
- i18next with English, Russian, and Armenian catalogs

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Set `NEXT_PUBLIC_API_BASE_URL` for browser requests, `LARAVEL_INTERNAL_API_URL` for server requests, and `SITE_URL` for canonical URLs.

## Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Next.js application

The App Router lives in `next-app`. Search-facing pages use server rendering and Laravel data. Booking, account, admin, and driver screens run as client components under the same Next.js route tree.

```bash
npm run dev
npm run build
npm run start
npm run test:next:smoke
```

Set `LARAVEL_INTERNAL_API_URL` to the server-reachable Laravel `/api/v1` URL and `SITE_URL` to the canonical website origin. Build the production image with `docker build -t armenia-tourism-next .`.

When both services use Docker, attach Next.js to the backend network and use the Laravel Nginx service name, for example `LARAVEL_INTERNAL_API_URL=http://nginx/api/v1`. The smoke test expects a running production server at `http://127.0.0.1:3100` by default; override `NEXT_SMOKE_ORIGIN` when needed.

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
- downloadable customer QR arrival ticket on confirmation and secure booking pages
- API-backed About, contact inquiry/WhatsApp, multilingual FAQ, responsive navigation, and route metadata

## Implemented operations experience

- role-protected admin dashboard, booking table, calendar, booking details, and conflict-safe assignment
- active-state directories for tours, destinations, cars, and drivers with validated image upload
- customers, review moderation, promo codes, FAQs, contact inquiries, website settings, and audit history
- mobile-first driver trip list, customer contact actions, and controlled status progression
- role-authorized QR check-in scanner for admins/managers and assigned drivers, with manual entry fallback and partial-party attendance

The camera scanner is available at `/admin/check-in` and `/driver/check-in`. Browser camera access requires HTTPS in production; manual ticket entry remains available when permission or camera hardware is unavailable.

## Production image

```bash
docker build --build-arg NEXT_PUBLIC_API_BASE_URL=/api/v1 -t armenia-tourism-fe .
docker run --rm -p 3000:3000 -e SITE_URL=https://tour-armenia.com -e LARAVEL_INTERNAL_API_URL=http://backend/api/v1 armenia-tourism-fe
```

The image runs the standalone Next.js server. TLS and `/api/v1` proxy routing should terminate at the deployment edge. Copy `.env.production.example` into the deployment environment, replace business values, then validate it before deployment:

```bash
SITE_URL=https://tour-armenia.com LARAVEL_INTERNAL_API_URL=http://nginx/api/v1 NEXT_PUBLIC_API_BASE_URL=/api/v1 npm run test:production-env
```

After DNS and HTTPS are active, run the external production check followed by the complete SEO crawl:

```bash
npm run test:live
NEXT_SMOKE_ORIGIN=https://tour-armenia.com npm run test:seo
```
