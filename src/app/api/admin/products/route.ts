import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { connectDB, useMemoryCatalog } from "@/lib/db";
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

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const mem = mongoRequired();
  if (mem) return mem;

  await connectDB();
  const rows = await Product.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const denied = await requireAdminApi();
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

    const doc = await Product.create({
      title,
      slug,
      description: String(body.description || ""),
      images,
      price: Number(body.price) || 0,
      compareAtPrice: Number(body.compareAtPrice) || Number(body.price) || 0,
      badges: Array.isArray(body.badges)
        ? body.badges
        : String(body.badges || "")
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
      rating: Number(body.rating) || 4.5,
      reviewCount: Number(body.reviewCount) || 0,
      categorySlugs: Array.isArray(body.categorySlugs)
        ? body.categorySlugs
        : String(body.categorySlugs || "")
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
      sizes: Array.isArray(body.sizes)
        ? body.sizes
        : String(body.sizes || "S,M,L,XL,XXL")
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
      stockBySize: body.stockBySize || {},
      featured: Boolean(body.featured),
      collectionTags: Array.isArray(body.collectionTags)
        ? body.collectionTags
        : String(body.collectionTags || "")
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
      active: body.active !== false,
      bestPrice: body.bestPrice != null ? Number(body.bestPrice) : null,
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
