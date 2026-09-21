"use client";

import type { ProductSpec } from "@/types/catalog";

export function ProductSpecs({ specs }: { specs?: ProductSpec[] }) {
  if (!specs?.length) return null;

  return (
    <section className="mt-8">
      <h2 className="section-title">Product details</h2>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-md border-2 border-[var(--ink)] bg-white p-4 shadow-[3px_3px_0_0_var(--ink)] sm:gap-x-8">
        {specs.map((s) => (
          <div key={`${s.label}-${s.value}`}>
            <dt className="text-[10px] font-extrabold tracking-[0.14em] text-[var(--muted)] uppercase">
              {s.label}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--ink)]">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
