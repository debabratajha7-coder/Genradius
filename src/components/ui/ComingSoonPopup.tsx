"use client";

import { useEffect, useId, useState } from "react";

type ComingSoonPopupProps = {
  /** Section / category label shown under the headline */
  label?: string;
  /** Inline empty-state card (default) vs modal dialog */
  variant?: "inline" | "modal";
  /** Auto-open modal once when mounted (modal variant only) */
  autoOpen?: boolean;
  className?: string;
};

export function ComingSoonPopup({
  label,
  variant = "inline",
  autoOpen = true,
  className = "",
}: ComingSoonPopupProps) {
  const titleId = useId();
  const [open, setOpen] = useState(variant === "modal" ? autoOpen : true);

  useEffect(() => {
    if (variant !== "modal" || !open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [variant, open]);

  const card = (
    <div
      role="status"
      aria-labelledby={titleId}
      className={`relative w-full max-w-sm rounded-[24px] bg-[var(--background)] px-6 py-8 text-center ${className}`}
    >
      <p className="text-[10px] font-extrabold tracking-[0.22em] text-[var(--moss)] uppercase">
        Genradius
      </p>
      <h3
        id={titleId}
        className="mt-2 font-[family-name:var(--font-heavy)] text-3xl leading-none tracking-tight text-[var(--ink)] uppercase sm:text-4xl"
      >
        Coming soon
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--moss)]">
        {label
          ? `${label} is still in the works — drop lands soon.`
          : "This drop is still in the works — check back soon."}
      </p>
      {variant === "modal" ? (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn-accent mt-6 w-full px-6 py-3 text-sm"
        >
          Got it
        </button>
      ) : null}
    </div>
  );

  if (variant === "inline") {
    return (
      <div className="flex min-h-[220px] items-center justify-center px-2 py-10 sm:min-h-[260px] sm:py-14">
        {card}
      </div>
    );
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--ink)]/45 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={() => setOpen(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>{card}</div>
    </div>
  );
}
