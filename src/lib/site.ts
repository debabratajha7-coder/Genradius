/** Public site origin for SEO, OAuth, emails */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://genradius.in";
}

export const SITE = {
  name: "Genradius",
  tagline: "Own Your Radius",
  description:
    "Men's streetwear that refuses to blend in. Oversized tees, polos, cargos — Genradius.",
  locale: "en_IN",
  twitter: "@genradius",
} as const;
