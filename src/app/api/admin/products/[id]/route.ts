import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { connectDB, useMemoryCatalog } from "@/lib/db";
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

export async function GET(_req: Request, ctx: Ctx) {
  const denied = await requireAdminApi();
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
  const denied = await requireAdminApi();
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
    if (body.badges != null) {
      update.badges = Array.isArray(body.badges)
        ? body.badges
        : String(body.badges)
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
    }
    if (body.categorySlugs != null) {
      update.categorySlugs = Array.isArray(body.categorySlugs)
        ? body.categorySlugs
        : String(body.categorySlugs)
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
    }
    if (body.collectionTags != null) {
      update.collectionTags = Array.isArray(body.collectionTags)
        ? body.collectionTags
        : String(body.collectionTags)
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
    }
    if (body.sizes != null) {
      update.sizes = Array.isArray(body.sizes)
        ? body.sizes
        : String(body.sizes)
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
    }
    if (body.featured != null) update.featured = Boolean(body.featured);
    if (body.active != null) update.active = Boolean(body.active);
    if (body.rating != null) update.rating = Number(body.rating);
    if (body.reviewCount != null) update.reviewCount = Number(body.reviewCount);
    if (body.bestPrice != null) update.bestPrice = Number(body.bestPrice);
    if (body.stockBySize != null) update.stockBySize = body.stockBySize;

    const row = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const mem = mongoRequired();
  if (mem) return mem;

  const { id } = await ctx.params;
  await connectDB();
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
