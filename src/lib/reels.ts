import { connectDB, useMemoryCatalog } from "@/lib/db";
import Reel from "@/models/Reel";
import type { ReelLean } from "@/types/catalog";

export async function getActiveReels(limit = 12): Promise<ReelLean[]> {
  if (useMemoryCatalog()) return [];

  await connectDB();
  const rows = await Reel.find({ active: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit)
    .lean();

  return rows.map((r) => ({
    _id: String(r._id),
    title: r.title,
    instagramUrl: r.instagramUrl,
    embedUrl: r.embedUrl,
    shortcode: r.shortcode,
    thumbnailUrl: r.thumbnailUrl ?? "",
    productSlug: r.productSlug ?? "",
    active: Boolean(r.active),
    order: r.order ?? 0,
  }));
}
