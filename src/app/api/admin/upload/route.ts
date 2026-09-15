import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { isCloudinaryConfigured, uploadImageBuffer } from "@/lib/cloudinary";

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
    const form = await req.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") || "genradius/products");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImageBuffer(buffer, folder);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
