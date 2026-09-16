import { AdminGate } from "@/components/admin/AdminGate";
import { connectDB, useMemoryCatalog } from "@/lib/db";
import Reel from "@/models/Reel";
import { ReelsManager } from "@/components/admin/ReelsManager";

export default async function AdminReelsPage() {
  let reels: Array<{
    _id: string;
    title: string;
    instagramUrl: string;
    thumbnailUrl?: string;
    videoUrl?: string;
    productSlug?: string;
    active?: boolean;
    order?: number;
  }> = [];

  if (!useMemoryCatalog()) {
    await connectDB();
    const rows = await Reel.find().sort({ order: 1, createdAt: -1 }).lean();
    reels = rows.map((r) => ({
      _id: String(r._id),
      title: r.title,
      instagramUrl: r.instagramUrl,
      thumbnailUrl: r.thumbnailUrl,
      videoUrl: r.videoUrl,
      productSlug: r.productSlug,
      active: r.active,
      order: r.order,
    }));
  }

  return (
    <AdminGate>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
        Instagram reels
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--moss)]">
        Upload an MP4 to autoplay on Watch &amp; Buy. Instagram URL is the
        fallback tap target (and optional product link).
      </p>
      <div className="mt-6">
        <ReelsManager initial={reels} />
      </div>
    </AdminGate>
  );
}
