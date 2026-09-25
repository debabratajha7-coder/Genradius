"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function SizeGuideModal({ imageUrl }: { imageUrl: string }) {
  const titleId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!imageUrl) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="section-link text-[10px]"
      >
        Size guide
        <span className="btn-arrow" aria-hidden>
          ↗
        </span>
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--ink-deep)]/70 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="relative max-h-[90dvh] w-full max-w-lg overflow-auto rounded-[24px] bg-[var(--background)] p-4"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 24, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 16, scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3
                  id={titleId}
                  className="font-[family-name:var(--font-heavy)] text-xl leading-none tracking-tight uppercase"
                >
                  Size guide
                </h3>
                <button
                  type="button"
                  className="icon-chip h-9 w-9 text-base"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[18px] bg-white">
                <Image
                  src={imageUrl}
                  alt="Size guide"
                  fill
                  className="object-contain"
                  sizes="512px"
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
