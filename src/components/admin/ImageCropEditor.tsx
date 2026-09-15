"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

type AspectOption = {
  label: string;
  value: number | undefined;
};

const ASPECTS: AspectOption[] = [
  { label: "Free", value: undefined },
  { label: "16:9 Hero", value: 16 / 9 },
  { label: "4:5 Story", value: 4 / 5 },
  { label: "3:4 Product", value: 3 / 4 },
  { label: "1:1 Square", value: 1 },
];

async function cropToFile(
  imageSrc: string,
  pixelCrop: Area,
  fileName: string,
): Promise<File> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const maxEdge = 2400;
  const scale = Math.min(
    1,
    maxEdge / Math.max(pixelCrop.width, pixelCrop.height),
  );
  canvas.width = Math.max(1, Math.round(pixelCrop.width * scale));
  canvas.height = Math.max(1, Math.round(pixelCrop.height * scale));

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare crop canvas");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Crop failed"))),
      "image/jpeg",
      0.88,
    );
  });

  const name = fileName.replace(/\.\w+$/, "") + "-crop.jpg";
  return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", () => reject(new Error("Failed to load image")));
    img.src = src;
  });
}

export function ImageCropEditor({
  file,
  queueLabel,
  defaultAspect,
  onCancel,
  onConfirm,
}: {
  file: File;
  queueLabel?: string;
  defaultAspect?: number;
  onCancel: () => void;
  onConfirm: (file: File) => void;
}) {
  const [src] = useState(() => URL.createObjectURL(file));
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(
    defaultAspect ?? 16 / 9,
  );
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function apply() {
    if (!croppedAreaPixels) return;
    setBusy(true);
    setError("");
    try {
      const out = await cropToFile(src, croppedAreaPixels, file.name);
      URL.revokeObjectURL(src);
      onConfirm(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not crop image");
      setBusy(false);
    }
  }

  function cancel() {
    URL.revokeObjectURL(src);
    onCancel();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[var(--ink)]/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[100dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border-2 border-[var(--ink)] bg-[var(--background)] shadow-[8px_8px_0_0_var(--ink)] sm:max-h-[90dvh] sm:rounded-md">
        <div className="flex items-center justify-between border-b-2 border-[var(--ink)] px-4 py-3">
          <div>
            <p className="text-xs font-extrabold tracking-wider uppercase">
              Edit photo
            </p>
            <p className="text-[11px] text-[var(--moss)]">
              {queueLabel || file.name} — crop &amp; zoom before upload
            </p>
          </div>
          <button
            type="button"
            className="text-xs font-extrabold tracking-wider uppercase underline"
            onClick={cancel}
            disabled={busy}
          >
            Cancel
          </button>
        </div>

        <div className="relative h-[min(52dvh,420px)] bg-[var(--ink)]">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            objectFit="contain"
            showGrid
          />
        </div>

        <div className="space-y-4 border-t border-[var(--border)] px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div>
            <label className="mb-2 flex items-center justify-between text-[10px] font-extrabold tracking-wider uppercase">
              <span>Zoom</span>
              <span className="text-[var(--moss)]">{zoom.toFixed(1)}×</span>
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-[var(--sand)]"
            />
          </div>

          <div>
            <p className="mb-2 text-[10px] font-extrabold tracking-wider uppercase">
              Aspect
            </p>
            <div className="flex flex-wrap gap-2">
              {ASPECTS.map((opt) => {
                const active = aspect === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setAspect(opt.value)}
                    className={`rounded-md border-2 border-[var(--ink)] px-2.5 py-1.5 text-[10px] font-extrabold tracking-wider uppercase shadow-[2px_2px_0_0_var(--ink)] ${
                      active
                        ? "bg-[var(--sand)]"
                        : "bg-white hover:bg-[var(--accent-soft)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-700">{error}</p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="btn-accent flex-1 py-3.5 text-sm"
              disabled={busy || !croppedAreaPixels}
              onClick={() => void apply()}
            >
              {busy ? "Applying…" : "Use this crop & upload"}
            </button>
            <button
              type="button"
              className="rounded-md border-2 border-[var(--ink)] bg-white px-4 py-3.5 text-xs font-extrabold tracking-wider uppercase shadow-[2px_2px_0_0_var(--ink)]"
              disabled={busy}
              onClick={cancel}
            >
              Skip this image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
