"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";

export function SizeGuideModal({ imageUrl }: { imageUrl: string }) {
  const titleId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!imageUrl) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[10px] font-extrabold tracking-[0.16em] text-[var(--moss)] uppercase underline-offset-2 hover:underline"
      >
        Size guide
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--ink)]/50 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-h-[90dvh] w-full max-w-lg overflow-auto rounded-md border-2 border-[var(--ink)] bg-[var(--sand)] p-3 shadow-[6px_6px_0_0_var(--ink)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3
                id={titleId}
                className="font-[family-name:var(--font-display)] text-sm tracking-wide uppercase"
              >
                Size guide
              </h3>
              <button
                type="button"
                className="rounded-md border-2 border-[var(--ink)] bg-white px-2 py-1 text-xs font-bold"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md border-2 border-[var(--ink)] bg-white">
              <Image
                src={imageUrl}
                alt="Size guide"
                fill
                className="object-contain"
                sizes="512px"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
