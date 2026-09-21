import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin-auth";
import { connectDB, useMemoryCatalog } from "@/lib/db";
import {
  normalizeHighlights,
  normalizeReviews,
  normalizeSpecs,
} from "@/lib/product-form";
import Product from "@/models/Product";
import { slugify } from "@/lib/slug";

function mongoRequired() {
  if (useMemoryCatalog()) {
    return NextResponse.json(
      {
        error:
          "Admin writes need MongoDB. Set MONGODB_URI and USE_MEMORY_CATALOG=false.",
      },
      { status: 503 },
    );
  }
  return null;
}

function splitList(value: unknown, fallback = ""): string[] {
  if (Array.isArray(value))
    return value.map(String).map((s) => s.trim()).filter(Boolean);
  return String(value ?? fallback)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function GET() {
  const denied = await requireAdminApi("products");
  if (denied) return denied;
  const mem = mongoRequired();
  if (mem) return mem;

  await connectDB();
  const rows = await Product.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const denied = await requireAdminApi("products");
  if (denied) return denied;
  const mem = mongoRequired();
  if (mem) return mem;

  try {
    const body = await req.json();
    await connectDB();

    const title = String(body.title || "").trim();
    if (!title) {
      return NextResponse.json({ error: "title required" }, { status: 400 });
    }

    const slug = slugify(String(body.slug || title));
    const images = Array.isArray(body.images)
      ? body.images.filter(Boolean)
      : [];

    if (!images.length) {
      return NextResponse.json(
        { error: "At least one image URL required" },
        { status: 400 },
      );
    }

    const reviews = normalizeReviews(body.reviews);
    const reviewCountRaw = Number(body.reviewCount);
    const reviewCount =
      Number.isFinite(reviewCountRaw) && reviewCountRaw > 0
        ? reviewCountRaw
        : reviews.length;

    const doc = await Product.create({
      title,
      slug,
      description: String(body.description || ""),
      images,
      price: Number(body.price) || 0,
      compareAtPrice: Number(body.compareAtPrice) || Number(body.price) || 0,
      badges: splitList(body.badges),
      rating: Number(body.rating) || 4.5,
      reviewCount,
      categorySlugs: splitList(body.categorySlugs),
      sizes: splitList(body.sizes, "S,M,L,XL,XXL"),
      stockBySize: body.stockBySize || {},
      featured: Boolean(body.featured),
      collectionTags: splitList(body.collectionTags),
      active: body.active !== false,
      bestPrice:
        body.bestPrice != null && body.bestPrice !== ""
          ? Number(body.bestPrice)
          : null,
      offerTitle: String(body.offerTitle || "").trim(),
      offerDetail: String(body.offerDetail || "").trim(),
      offerPrice:
        body.offerPrice != null && body.offerPrice !== ""
          ? Number(body.offerPrice)
          : null,
      socialProof: String(body.socialProof || "").trim(),
      sizeGuideImage: String(body.sizeGuideImage || "").trim(),
      highlights: normalizeHighlights(body.highlights),
      specs: normalizeSpecs(body.specs),
      careFit: String(body.careFit || "").trim(),
      reviews,
    });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/product/${doc.slug}`);
    return NextResponse.json(doc, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
