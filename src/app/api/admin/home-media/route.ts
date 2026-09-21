import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { useMemoryCatalog } from "@/lib/db";
import { getHomeMediaAdmin, updateHomeMedia } from "@/lib/home-media";
import type { HomeMediaLean } from "@/lib/home-media-defaults";

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
  const denied = await requireAdminApi("home");
  if (denied) return denied;
  const mem = mongoRequired();
  if (mem) return mem;

  try {
    const media = await getHomeMediaAdmin();
    return NextResponse.json(media);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const denied = await requireAdminApi("home");
  if (denied) return denied;
  const mem = mongoRequired();
  if (mem) return mem;

  try {
    const body = (await req.json()) as Partial<HomeMediaLean>;
    const media = await updateHomeMedia(body);
    return NextResponse.json(media);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
