"use client";

import type { ProductSpec } from "@/types/catalog";

export function ProductSpecs({ specs }: { specs?: ProductSpec[] }) {
  if (!specs?.length) return null;

  return (
    <section className="mt-10">
      <span className="section-index">Details</span>
      <h2 className="section-title">
        The <em>specs</em>
      </h2>
      <dl className="panel mt-5 grid grid-cols-2 gap-x-6 gap-y-5 p-5 sm:grid-cols-3 sm:p-6">
        {specs.map((s) => (
          <div key={`${s.label}-${s.value}`}>
            <dt className="text-[10px] font-bold tracking-[0.18em] text-[var(--muted)] uppercase">
              {s.label}
            </dt>
            <dd className="mt-1.5 text-sm font-semibold text-[var(--ink)]">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
