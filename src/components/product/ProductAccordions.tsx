"use client";

import { useState } from "react";

const SHIPPING =
  "Free shipping on all orders. We ship pan-India — most metros land in 3–6 days.";
const RETURNS =
  "Easy 7-day returns & exchange. Item must be unused with tags on. Full refund if you don’t love the fit.";

function AccordionItem({
  title,
  subtitle,
  children,
  defaultOpen = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b-2 border-[var(--ink)] last:border-b-0">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>
          <span className="block text-sm font-extrabold tracking-wide uppercase">
            {title}
          </span>
          {subtitle ? (
            <span className="mt-0.5 block text-xs text-[var(--moss)]">
              {subtitle}
            </span>
          ) : null}
        </span>
        <span className="text-lg font-bold" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? (
        <div className="px-4 pb-4 text-sm leading-relaxed text-[var(--moss)] whitespace-pre-wrap">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function ProductAccordions({
  description,
  careFit,
}: {
  description: string;
  careFit?: string;
}) {
  const body = (careFit || "").trim() || description;

  return (
    <section className="mt-8 overflow-hidden rounded-md border-2 border-[var(--ink)] bg-white shadow-[3px_3px_0_0_var(--ink)]">
      <AccordionItem
        title="Product description"
        subtitle="Manufacture, care and fit"
        defaultOpen
      >
        {body}
      </AccordionItem>
      <AccordionItem
        title="Shipping info"
        subtitle="We offer free shipping across India."
      >
        {SHIPPING}
      </AccordionItem>
      <AccordionItem
        title="7 days returns & exchange"
        subtitle="Know about return & exchange policy"
      >
        {RETURNS}
      </AccordionItem>
    </section>
  );
}
