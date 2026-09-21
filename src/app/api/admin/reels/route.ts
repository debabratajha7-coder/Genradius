import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { connectDB, useMemoryCatalog } from "@/lib/db";
import Reel from "@/models/Reel";
import { parseInstagramReel } from "@/lib/slug";

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
  const denied = await requireAdminApi("reels");
  if (denied) return denied;
  const mem = mongoRequired();
  if (mem) return mem;

  await connectDB();
  const rows = await Reel.find().sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const denied = await requireAdminApi("reels");
  if (denied) return denied;
  const mem = mongoRequired();
  if (mem) return mem;

  try {
    const body = await req.json();
    const parsed = parseInstagramReel(String(body.instagramUrl || ""));
    if (!parsed) {
      return NextResponse.json(
        {
          error:
            "Paste a valid Instagram reel URL (instagram.com/reel/... or /p/...)",
        },
        { status: 400 },
      );
    }

    await connectDB();
    const doc = await Reel.create({
      title: String(body.title || `Reel ${parsed.shortcode}`).trim(),
      instagramUrl: parsed.permalink,
      embedUrl: parsed.embedUrl,
      shortcode: parsed.shortcode,
      thumbnailUrl: String(body.thumbnailUrl || ""),
      videoUrl: String(body.videoUrl || ""),
      productSlug: String(body.productSlug || ""),
      active: body.active !== false,
      order: Number(body.order) || 0,
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
