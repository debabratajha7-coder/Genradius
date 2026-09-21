import { NextResponse } from "next/server";
import {
  adminHasPermission,
  getAdminSession,
  requireAdminApi,
} from "@/lib/admin-auth";
import {
  isCloudinaryConfigured,
  uploadImageBuffer,
  uploadVideoBuffer,
} from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const MAX_VIDEO_BYTES = 80 * 1024 * 1024;

const UPLOAD_PERMS = ["products", "hero", "home", "reels", "categories"] as const;

export async function POST(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const session = await getAdminSession();
  if (
    !session ||
    !UPLOAD_PERMS.some((p) => adminHasPermission(session, p))
  ) {
    return NextResponse.json(
      { error: "You don’t have permission to upload media" },
      { status: 403 },
    );
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        error:
          "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.",
      },
      { status: 503 },
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") || "genradius/products");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: "Only image or video uploads are allowed" },
        { status: 400 },
      );
    }

    const max = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > max) {
      return NextResponse.json(
        {
          error: isVideo
            ? `Video is ${(file.size / 1024 / 1024).toFixed(1)}MB — max is 80MB.`
            : `File is ${(file.size / 1024 / 1024).toFixed(1)}MB — max is 12MB after compression.`,
        },
        { status: 413 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = isVideo
      ? await uploadVideoBuffer(buffer, folder)
      : await uploadImageBuffer(buffer, folder);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
