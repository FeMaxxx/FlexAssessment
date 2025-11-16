# Flex Living Reviews Dashboard

A Next.js App Router project that aggregates reviews from Hostaway mock data, normalizes them into a
consistent schema, and provides management (approve/unapprove) and public display per property.

Project: Reviews Dashboard - A dashboard for managers to curate and publish approved reviews to
property pages, with basic analytics and filters.

## Tech stack

- Next.js (App Router) + Next.js API routes
- TypeScript
- TailwindCSS
- Local JSON persistence for approval state (`data/reviewState.json`)
- Zustand (client-side filters on dashboard)
- date-fns (deterministic date formatting)

## Key design & logic decisions

- Normalization strategy: Hostaway mock is normalized to a stable `NormalizedReview` interface. We
  map `listingName` to `listingId`, fold `publicReview` into `text`, and convert 0–10 ratings to a
  0–5 scale for consistent UI.
- Separation of concerns: Approval state is stored in `data/reviewState.json` and merged into
  normalized results at read time; the raw mock data remains read-only.
- Deterministic dates: All dates are rendered via a fixed `formatDate(iso)` to avoid hydration and
  locale mismatches between server and client.
- Server fetching + client UI: Server Components fetch reviews; Client Components (Zustand) handle
  filtering, sorting, and approve/unapprove interactions (optimistic updates).
- Caching invalidation: `revalidateTag('reviews')` and `router.refresh()` ensure navigation reflects
  recent approvals. API routes use `noStore()` to avoid stale payloads.
- Filters and sorting: Manager dashboard supports rating range, channel, category match, date range,
  and sorting (newest, highest, lowest).
- Property routing: Public property pages are `slugify(listingName)` under `/property/[listingSlug]`
  and display only approved reviews.
- Simple analytics: Dashboard provides average rating per property (and optional monthly counts).

## API behaviors

### GET /api/reviews/hostaway

Reads `data/hostaway-sample.json`, normalizes to `NormalizedReview[]`, merges `approvedForWebsite`
from `data/reviewState.json`.

Example request:

```http
GET /api/reviews/hostaway
```

Example response:

```json
{
  "status": "success",
  "result": [
    {
      "id": 1002,
      "listingId": "Penthouse - Canary Wharf View",
      "type": "guest-to-host",
      "status": "published",
      "ratingOverall": 4.5,
      "categories": [{ "name": "communication", "rating": 5 }],
      "text": "Great location and very responsive host.",
      "submittedAt": "2022-07-19T10:11:02.000Z",
      "guestName": "Laura Smith",
      "channel": "hostaway",
      "approvedForWebsite": false
    }
  ]
}
```

### PUT /api/reviews/:id/approve

Sets `approvedForWebsite` to true in `data/reviewState.json`.

Example request:

```http
PUT /api/reviews/1002/approve
```

Example response:

```json
{ "status": "success" }
```

### PUT /api/reviews/:id/unapprove

Sets `approvedForWebsite` to false in `data/reviewState.json`.

Example request:

```http
PUT /api/reviews/1002/unapprove
```

Example response:

```json
{ "status": "success" }
```

## Normalized review schema

```ts
type ReviewChannel = "hostaway" | "google";

interface NormalizedReview {
  id: number;
  listingId: string;
  type: string;
  status: string;
  ratingOverall: number | null;
  categories: { name: string; rating: number }[];
  text: string | null;
  submittedAt: string;
  guestName: string;
  channel: ReviewChannel;
  approvedForWebsite: boolean;
}
```

## Google Reviews findings (short)

- Feasible via Google Places API (Place Details) with `fields=reviews` and a valid `place_id`.
- Requires API key and billing; quotas apply and may limit availability/volume.
- Reviews are sometimes partial; no granular categories like cleanliness, etc.
- For production: server-side fetching with caching and rate limiting; map to the same normalized
  schema (channel: `"google"`).
- Not implemented beyond an optional route due to billing constraints; mock Hostaway data suffices
  for the test scope.

## Local setup instructions

1. Clone and install

```sh
git clone <repo-url>
cd <repo-folder>
npm install
```

2. Create a file named `.env.local` in the project root with the following (adjust as needed):

```ini
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Optional for /api/reviews/google
# GOOGLE_MAPS_API_KEY=your_key
```

3. Run the dev server and open the app

```sh
npm run dev
```
