# Genradius

Men's streetwear storefront — Veirdo-inspired layout and energy, original **Genradius** brand.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- MongoDB + Mongoose (optional for local demo)
- Client cart via `localStorage`

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

By default `.env.local` sets `USE_MEMORY_CATALOG=true`, so the seeded catalog in `src/data/catalog.ts` loads without MongoDB.

## Admin + media

1. Create a MongoDB Atlas cluster and set `MONGODB_URI`.
2. Set `USE_MEMORY_CATALOG=false`, `ADMIN_PASSWORD`, `ADMIN_SECRET`.
3. Create a Cloudinary account and set `CLOUDINARY_*` vars.
4. `npm run seed` then open `/admin/login`.

Admin can: add/edit/delete products, upload images (or paste URLs), paste Instagram reel links for Watch & Buy, manage categories.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run seed` | Wipe & seed Mongo collections |
| `npm run lint` | ESLint |

## Routes

- `/` — home (ticker, hero, categories, carousels)
- `/shop` — all products (`?collection=radius-range` supported)
- `/shop/[category]` — category PLP
- `/product/[slug]` — PDP + add to cart

## GitHub

Repo: https://github.com/debabratajha7-coder/Genradius

## Go live (genradius.in)

1. Deploy to Vercel (import the GitHub repo).
2. Set env vars from `.env.example` — especially `MONGODB_URI`, `USE_MEMORY_CATALOG=false`, admin secrets, Cloudinary, and **`NEXT_PUBLIC_APP_URL=https://genradius.in`**.
3. Attach domain `genradius.in` (+ `www`) in Vercel → Domains, then point DNS as instructed.
4. In Google Cloud OAuth, add redirect URI: `https://genradius.in/api/auth/google/callback`.
5. Redeploy and smoke-test shop, admin login, and checkout.

See [AGENTS.md](./AGENTS.md) for architecture notes aimed at future Cursor sessions.
