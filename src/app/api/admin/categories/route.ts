import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { connectDB, useMemoryCatalog } from "@/lib/db";
import Category from "@/models/Category";
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
  const rows = await Category.find().sort({ order: 1 }).lean();
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const mem = mongoRequired();
  if (mem) return mem;

  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }
    await connectDB();
    const doc = await Category.create({
      name,
      slug: slugify(String(body.slug || name)),
      image: String(body.image || ""),
      order: Number(body.order) || 0,
    });
    return NextResponse.json(doc, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const mem = mongoRequired();
  if (mem) return mem;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  await connectDB();
  await Category.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
