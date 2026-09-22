import type { ProductLean } from "@/types/catalog";
import { getSiteUrl, SITE } from "@/lib/site";

export function ProductJsonLd({ product }: { product: ProductLean }) {
  const base = getSiteUrl();
  const url = `${base}/product/${encodeURIComponent(product.slug)}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images?.length ? product.images : undefined,
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: SITE.name,
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(product.rating > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: Math.max(1, product.reviewCount || 1),
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const base = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: base,
    description: SITE.description,
    logo: `${base}/icon.png`,
    email: SITE.email,
    telephone: SITE.phone,
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
