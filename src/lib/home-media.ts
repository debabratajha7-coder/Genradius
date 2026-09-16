import { connectDB, useMemoryCatalog } from "@/lib/db";
import {
  DEFAULT_HOME_MEDIA,
  type CollectionTileLean,
  type HomeMediaLean,
} from "@/lib/home-media-defaults";
import HomeMedia from "@/models/HomeMedia";

declare global {
  // eslint-disable-next-line no-var
  var __genradiusHomeMedia: HomeMediaLean | undefined;
}

function memoryMedia(): HomeMediaLean {
  if (!global.__genradiusHomeMedia) {
    global.__genradiusHomeMedia = structuredClone(DEFAULT_HOME_MEDIA);
  }
  return global.__genradiusHomeMedia;
}

function normalizeCollections(
  rows: Partial<CollectionTileLean>[] | undefined,
): CollectionTileLean[] {
  const byKey = new Map(
    (rows ?? []).map((c) => [String(c.key || "").toLowerCase(), c]),
  );
  return DEFAULT_HOME_MEDIA.collections.map((fallback) => {
    const hit = byKey.get(fallback.key);
    if (!hit) return { ...fallback };
    return {
      key: fallback.key,
      label: String(hit.label || fallback.label).trim() || fallback.label,
      href: String(hit.href || fallback.href).trim() || fallback.href,
      image: String(hit.image ?? fallback.image),
      bg: String(hit.bg || fallback.bg),
    };
  });
}

function toLean(doc: {
  aboutPhoneBanner?: string | null;
  aboutVideoPoster?: string | null;
  aboutVideoUrl?: string | null;
  aboutCollage?: string[] | null;
  collections?: Partial<CollectionTileLean>[] | null;
}): HomeMediaLean {
  const collage = [...(doc.aboutCollage ?? [])];
  while (collage.length < 3) collage.push(DEFAULT_HOME_MEDIA.aboutCollage[collage.length]);
  return {
    aboutPhoneBanner:
      doc.aboutPhoneBanner || DEFAULT_HOME_MEDIA.aboutPhoneBanner,
    aboutVideoPoster:
      doc.aboutVideoPoster || DEFAULT_HOME_MEDIA.aboutVideoPoster,
    aboutVideoUrl: doc.aboutVideoUrl || "",
    aboutCollage: [
      collage[0] || DEFAULT_HOME_MEDIA.aboutCollage[0],
      collage[1] || DEFAULT_HOME_MEDIA.aboutCollage[1],
      collage[2] || DEFAULT_HOME_MEDIA.aboutCollage[2],
    ],
    collections: normalizeCollections(doc.collections ?? undefined),
  };
}

async function ensureDoc() {
  await connectDB();
  let doc = await HomeMedia.findOne({ key: "default" });
  if (!doc) {
    doc = await HomeMedia.create({
      key: "default",
      ...DEFAULT_HOME_MEDIA,
      aboutCollage: [...DEFAULT_HOME_MEDIA.aboutCollage],
      collections: DEFAULT_HOME_MEDIA.collections.map((c) => ({ ...c })),
    });
  }
  return doc;
}

export async function getHomeMedia(): Promise<HomeMediaLean> {
  if (useMemoryCatalog()) return structuredClone(memoryMedia());

  try {
    const doc = await ensureDoc();
    return toLean(doc.toObject());
  } catch {
    return structuredClone(DEFAULT_HOME_MEDIA);
  }
}

export async function getHomeMediaAdmin(): Promise<HomeMediaLean> {
  if (useMemoryCatalog()) return structuredClone(memoryMedia());
  const doc = await ensureDoc();
  return toLean(doc.toObject());
}

export async function updateHomeMedia(
  patch: Partial<HomeMediaLean>,
): Promise<HomeMediaLean> {
  if (useMemoryCatalog()) {
    const cur = memoryMedia();
    if (patch.aboutPhoneBanner != null)
      cur.aboutPhoneBanner = patch.aboutPhoneBanner;
    if (patch.aboutVideoPoster != null)
      cur.aboutVideoPoster = patch.aboutVideoPoster;
    if (patch.aboutVideoUrl != null) cur.aboutVideoUrl = patch.aboutVideoUrl;
    if (patch.aboutCollage != null) {
      cur.aboutCollage = [
        patch.aboutCollage[0] || cur.aboutCollage[0],
        patch.aboutCollage[1] || cur.aboutCollage[1],
        patch.aboutCollage[2] || cur.aboutCollage[2],
      ];
    }
    if (patch.collections != null) {
      cur.collections = normalizeCollections(patch.collections);
    }
    return structuredClone(cur);
  }

  const doc = await ensureDoc();
  if (patch.aboutPhoneBanner != null)
    doc.aboutPhoneBanner = patch.aboutPhoneBanner;
  if (patch.aboutVideoPoster != null)
    doc.aboutVideoPoster = patch.aboutVideoPoster;
  if (patch.aboutVideoUrl != null) doc.aboutVideoUrl = patch.aboutVideoUrl;
  if (patch.aboutCollage != null) {
    doc.aboutCollage = [
      patch.aboutCollage[0] || "",
      patch.aboutCollage[1] || "",
      patch.aboutCollage[2] || "",
    ];
  }
  if (patch.collections != null) {
    doc.set("collections", normalizeCollections(patch.collections));
  }
  await doc.save();
  return toLean(doc.toObject());
}
