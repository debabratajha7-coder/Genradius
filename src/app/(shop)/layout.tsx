import { SiteShell } from "@/components/layout/SiteShell";
import { getPromos } from "@/lib/products";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const promos = await getPromos();
  const promoTexts = promos.map((p) => p.text);

  return <SiteShell promoTexts={promoTexts}>{children}</SiteShell>;
}
