import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { connectDB, useMemoryCatalog } from "@/lib/db";
import Reel from "@/models/Reel";
import { parseInstagramReel } from "@/lib/slug";

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

export async function PUT(req: Request, ctx: Ctx) {
  const denied = await requireAdminApi("reels");
  if (denied) return denied;
  const mem = mongoRequired();
  if (mem) return mem;

  try {
    const { id } = await ctx.params;
    const body = await req.json();
    await connectDB();

    const update: Record<string, unknown> = {};
    if (body.title != null) update.title = String(body.title).trim();
    if (body.instagramUrl != null) {
      const parsed = parseInstagramReel(String(body.instagramUrl));
      if (!parsed) {
        return NextResponse.json(
          { error: "Invalid Instagram reel URL" },
          { status: 400 },
        );
      }
      update.instagramUrl = parsed.permalink;
      update.embedUrl = parsed.embedUrl;
      update.shortcode = parsed.shortcode;
    }
    if (body.thumbnailUrl != null)
      update.thumbnailUrl = String(body.thumbnailUrl);
    if (body.videoUrl != null) update.videoUrl = String(body.videoUrl);
    if (body.productSlug != null) update.productSlug = String(body.productSlug);
    if (body.active != null) update.active = Boolean(body.active);
    if (body.order != null) update.order = Number(body.order);

    const row = await Reel.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true },
    ).lean();
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      ...row,
      _id: String(row._id),
      videoUrl: row.videoUrl ?? "",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await requireAdminApi("reels");
  if (denied) return denied;
  const mem = mongoRequired();
  if (mem) return mem;

  const { id } = await ctx.params;
  await connectDB();
  await Reel.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
