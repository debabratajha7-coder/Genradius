<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Genradius — agent guide

Men's streetwear storefront inspired by Veirdo's **layout rhythm + voice**, not their assets. Brand: **Genradius**.

## Stack
- Next.js App Router + TypeScript + Tailwind v4
- MongoDB via Mongoose (`src/models/*`) — Atlas for production
- Cloudinary for admin image uploads (`src/lib/cloudinary.ts`)
- Admin panel at `/admin` (password cookie via `jose`)
- Storefront cart: `localStorage` + React context

## Folders
| Path | Role |
|------|------|
| `src/app/(shop)/` | Storefront routes (`/`, `/shop`, `/product`) |
| `src/app/admin/` | Admin UI (dashboard, products, reels, categories) |
| `src/app/api/admin/` | Protected admin APIs |
| `src/components/admin/` | Admin forms / shell / uploaders |
| `src/components/home` | Storefront sections |
| `src/lib/db.ts` | Mongo singleton + memory flag |
| `src/lib/products.ts` | Storefront product reads |
| `src/lib/reels.ts` | Active Instagram reels for Watch & Buy |
| `src/lib/admin-auth.ts` | Admin session helpers |
| `src/lib/cloudinary.ts` | Upload helper |
| `src/lib/phonepe.ts` | PhonePe Checkout v2 OAuth + pay/status |
| `src/lib/shiprocket.ts` | Shiprocket auth + adhoc create |
| `src/lib/order-lifecycle.ts` | markPaid / COD confirm / cancel / fulfillment |
| `src/lib/site-settings.ts` | Fees, COD toggle, free-shipping threshold |
| `src/models/` | Product, Category, Promo, Reel, Order, SiteSettings, User |

## Checkout
- Prepaid: PhonePe redirect → webhook `/api/webhooks/phonepe` + success poll
- COD: optional OTP if Twilio configured; Shiprocket `payment_method=COD`
- Fulfillment webhook: `/api/webhooks/fulfillment` (token auth)
- Stock: `priceCart` checks `stockBySize` when set; **does not decrement**
- Admin: `/admin/settings` (fees), `/admin/orders` (retry Shiprocket)

## Env (see `.env.example`)
- `MONGODB_URI` + `USE_MEMORY_CATALOG=false` for admin/catalog writes
- `ADMIN_PASSWORD` + `ADMIN_SECRET`
- `CLOUDINARY_CLOUD_NAME` / `API_KEY` / `API_SECRET`
- PhonePe / Shiprocket / Resend / Twilio — see `.env.example` webhook URLs

## Commands
```bash
npm run dev
npm run seed          # needs Mongo
npm run build
```

Open admin: http://localhost:3000/admin/login

## UI
- Palette: [Coolors](https://coolors.co/be9c7d-cbcfd0-878c64-88986b-535539-443f20-2a291e)
- Fonts: Syne / Outfit / Unbounded logo
- Neo-brutalist buttons (`.btn-accent`)

## Do / don't
- **Do** keep Genradius copy original.
- **Do** fetch storefront catalog via `src/lib/products.ts` / `src/lib/reels.ts`.
- **Don't** import `src/models/*` into client components.
- **Don't** copy Veirdo/licensed assets.
