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

type Ctx = { params: Promise<{ id: string }> };

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

function splitList(value: unknown): string[] {
  if (Array.isArray(value))
    return value.map(String).map((s) => s.trim()).filter(Boolean);
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function GET(_req: Request, ctx: Ctx) {
  const denied = await requireAdminApi("products");
  if (denied) return denied;
  const mem = mongoRequired();
  if (mem) return mem;

  const { id } = await ctx.params;
  await connectDB();
  const row = await Product.findById(id).lean();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(req: Request, ctx: Ctx) {
  const denied = await requireAdminApi("products");
  if (denied) return denied;
  const mem = mongoRequired();
  if (mem) return mem;

  try {
    const { id } = await ctx.params;
    const body = await req.json();
    await connectDB();

    const update: Record<string, unknown> = {};
    if (body.title != null) update.title = String(body.title).trim();
    if (body.slug != null) update.slug = slugify(String(body.slug));
    if (body.description != null) update.description = String(body.description);
    if (body.images != null) update.images = body.images;
    if (body.price != null) update.price = Number(body.price);
    if (body.compareAtPrice != null)
      update.compareAtPrice = Number(body.compareAtPrice);
    if (body.badges != null) update.badges = splitList(body.badges);
    if (body.categorySlugs != null)
      update.categorySlugs = splitList(body.categorySlugs);
    if (body.collectionTags != null)
      update.collectionTags = splitList(body.collectionTags);
    if (body.sizes != null) update.sizes = splitList(body.sizes);
    if (body.featured != null) update.featured = Boolean(body.featured);
    if (body.active != null) update.active = Boolean(body.active);
    if (body.rating != null) update.rating = Number(body.rating);
    if (body.stockBySize != null) update.stockBySize = body.stockBySize;
    if (body.bestPrice !== undefined) {
      update.bestPrice =
        body.bestPrice === "" || body.bestPrice == null
          ? null
          : Number(body.bestPrice);
    }
    if (body.offerTitle != null)
      update.offerTitle = String(body.offerTitle).trim();
    if (body.offerDetail != null)
      update.offerDetail = String(body.offerDetail).trim();
    if (body.offerPrice !== undefined) {
      update.offerPrice =
        body.offerPrice === "" || body.offerPrice == null
          ? null
          : Number(body.offerPrice);
    }
    if (body.socialProof != null)
      update.socialProof = String(body.socialProof).trim();
    if (body.sizeGuideImage != null)
      update.sizeGuideImage = String(body.sizeGuideImage).trim();
    if (body.careFit != null) update.careFit = String(body.careFit).trim();
    if (body.highlights != null)
      update.highlights = normalizeHighlights(body.highlights);
    if (body.specs != null) update.specs = normalizeSpecs(body.specs);
    if (body.reviews != null) {
      const reviews = normalizeReviews(body.reviews);
      update.reviews = reviews;
      if (body.reviewCount == null || body.reviewCount === "") {
        update.reviewCount = reviews.length;
      }
    }
    if (body.reviewCount != null && body.reviewCount !== "") {
      update.reviewCount = Number(body.reviewCount);
    }

    const row = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/product/${row.slug}`);
    return NextResponse.json(row);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await requireAdminApi("products");
  if (denied) return denied;
  const mem = mongoRequired();
  if (mem) return mem;

  const { id } = await ctx.params;
  await connectDB();
  const existing = await Product.findById(id).lean();
  await Product.findByIdAndDelete(id);
  revalidatePath("/");
  revalidatePath("/shop");
  if (existing?.slug) revalidatePath(`/product/${existing.slug}`);
  return NextResponse.json({ ok: true });
}
