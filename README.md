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

Create an empty repo, then:

```bash
git remote add origin git@github.com:YOUR_USER/genradius.git
git add .
git commit -m "Initial Genradius storefront MVP"
git push -u origin main
```

See [AGENTS.md](./AGENTS.md) for architecture notes aimed at future Cursor sessions.
