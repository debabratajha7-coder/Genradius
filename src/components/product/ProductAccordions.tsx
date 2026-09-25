"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SHIPPING =
  "We ship pan-India. Orders dispatch within 24–48 hours; most metros land in 3–6 days. Free shipping over the threshold shown at checkout — otherwise a flat fee applies.";
const RETURNS =
  "7-day returns & exchange. Item must be unused with tags on. Wrong size? Swap it. Not feeling it? Full refund on prepaid orders.";

function AccordionItem({
  index,
  title,
  subtitle,
  children,
  defaultOpen = false,
}: {
  index: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--ink)]/10 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="w-6 shrink-0 text-[10px] font-bold tracking-[0.2em] text-[var(--olive)] tabular-nums">
          {index}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-[family-name:var(--font-heavy)] text-lg leading-none tracking-tight uppercase sm:text-xl">
            {title}
          </span>
          {subtitle ? (
            <span className="mt-1 block text-xs text-[var(--muted)]">
              {subtitle}
            </span>
          ) : null}
        </span>
        <span
          className={`icon-chip h-8 w-8 text-sm transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] ${
            open ? "rotate-45 bg-[var(--ink)] text-white" : ""
          }`}
          aria-hidden
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pl-[3.75rem] text-sm leading-relaxed text-[var(--moss)] whitespace-pre-wrap sm:px-6 sm:pl-16">
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
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
    <section className="panel mt-10 overflow-hidden">
      <AccordionItem
        index="01"
        title="Description"
        subtitle="Make, care and fit"
        defaultOpen
      >
        {body}
      </AccordionItem>
      <AccordionItem index="02" title="Shipping" subtitle="Dispatch and delivery">
        {SHIPPING}
      </AccordionItem>
      <AccordionItem
        index="03"
        title="Returns & exchange"
        subtitle="7 days, no drama"
      >
        {RETURNS}
      </AccordionItem>
    </section>
  );
}
