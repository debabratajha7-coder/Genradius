import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { isCloudinaryConfigured, uploadImageBuffer } from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_BYTES = 12 * 1024 * 1024; // 12MB after client compression

export async function POST(req: Request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

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
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > MAX_BYTES + 512_000) {
      return NextResponse.json(
        {
          error:
            "Image is too large. Use a JPG under ~8–10MB (the uploader compresses automatically).",
        },
        { status: 413 },
      );
    }

    const form = await req.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") || "genradius/products");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image uploads are allowed" },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          error: `File is ${(file.size / 1024 / 1024).toFixed(1)}MB — max is 12MB after compression.`,
        },
        { status: 413 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImageBuffer(buffer, folder);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    // Always JSON so the admin UI never chokes on plain-text errors
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
