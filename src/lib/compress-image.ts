/** Resize/compress images in the browser before uploading to Cloudinary. */
export async function prepareImageForUpload(
  file: File,
  opts: { maxEdge?: number; quality?: number; maxBytes?: number } = {},
): Promise<File> {
  const maxEdge = opts.maxEdge ?? 2400;
  const quality = opts.quality ?? 0.82;
  const maxBytes = opts.maxBytes ?? 8 * 1024 * 1024;

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  if (file.size > 40 * 1024 * 1024) {
    throw new Error("Image is too large (max 40MB). Choose a smaller file.");
  }

  // Already small — skip work
  if (file.size <= 1.2 * 1024 * 1024 && file.type !== "image/heic") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
    if (!blob) return file;

    let out = blob;
    if (out.size > maxBytes) {
      const tighter = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.7),
      );
      if (tighter) out = tighter;
    }

    const name = file.name.replace(/\.\w+$/, "") + ".jpg";
    return new File([out], name, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    // Canvas/HEIC edge cases — fall back to original
    if (file.size > maxBytes) {
      throw new Error(
        "Couldn’t compress this image and it’s too large to upload. Try JPG under 8MB.",
      );
    }
    return file;
  }
}
