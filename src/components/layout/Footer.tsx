"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { SITE } from "@/lib/site";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/shop" },
      { label: "Oversized tees", href: "/shop/oversized-tees" },
      { label: "Cargos", href: "/shop/cargos" },
      { label: "Premium edit", href: "/shop?collection=premium" },
      { label: "Sale", href: "/shop/sale" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "My account", href: "/account" },
      { label: "Orders", href: "/account#orders" },
      { label: "Track order", href: "/track-order" },
      { label: "Addresses", href: "/account/addresses" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Journal", href: "/#blogs" },
      { label: "Help", href: "/account#help" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not join");
      setEmail("");
      setMessage("You're in the circle — drops land here first.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join");
    } finally {
      setBusy(false);
    }
  };

  return (
    <footer className="relative mt-auto overflow-hidden bg-[var(--ink-deep)] text-white pb-[calc(var(--app-tabbar-h)+env(safe-area-inset-bottom)+0.75rem)] lg:pb-0">
      <div className="bg-grid-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="orb orb--pop -top-32 right-[10%] h-[26rem] w-[26rem] opacity-30" aria-hidden />

      <div className="relative mx-auto max-w-[1400px] px-4 pt-12 sm:px-6 lg:pt-20">
        {/* Newsletter */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-[var(--pop)]">Stay in the radius</p>
            <h2 className="mt-4 font-[family-name:var(--font-heavy)] text-[clamp(2.4rem,9vw,3.6rem)] leading-[0.9] uppercase sm:text-[clamp(3rem,5.5vw,5.2rem)]">
              Join the <span className="text-outline-light">circle.</span>
              <br />
              Drops land <span className="text-[var(--pop)]">here first.</span>
            </h2>
          </div>

          <div className="lg:col-span-5">
            <form
              onSubmit={onSubscribe}
              className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1.5 backdrop-blur transition focus-within:border-[var(--pop)]/60"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={busy}
                className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/40"
              />
              <button
                type="submit"
                disabled={busy}
                className="btn-accent shrink-0 px-5 py-2.5 text-[10px] sm:px-6 sm:text-[11px]"
              >
                {busy ? "…" : "Join"}
                <span className="btn-arrow" aria-hidden>
                  →
                </span>
              </button>
            </form>
            <p className="mt-2.5 px-2 text-[11px] text-white/45">
              Restocks, member codes and early access. No spam, unsubscribe any
              time.
            </p>
            {message && (
              <p className="mt-2 px-2 text-xs font-semibold text-[var(--pop)]">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-2 px-2 text-xs font-semibold text-red-300">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/10 pt-10 sm:grid-cols-4 lg:mt-16 lg:gap-8">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="eyebrow eyebrow--bare mb-4 text-white/45">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="group inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-[var(--pop)]"
                    >
                      <span className="h-px w-0 bg-[var(--pop)] transition-all duration-300 group-hover:w-3" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="eyebrow eyebrow--bare mb-4 text-white/45">Talk to us</h3>
            <ul className="space-y-2.5 text-sm font-semibold text-white/80">
              <li>
                <a href={`tel:${SITE.phone}`} className="hover:text-[var(--pop)]">
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="break-all hover:text-[var(--pop)]"
                >
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${SITE.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-light mt-2 px-4 py-2.5 text-[10px]"
                >
                  WhatsApp us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant wordmark */}
        <div className="mt-14 border-t border-white/10 pt-8 lg:mt-20">
          <p
            aria-hidden
            className="font-[family-name:var(--font-logo)] text-[13.5vw] leading-[0.85] font-extrabold tracking-[-0.03em] uppercase text-white/[0.07] select-none lg:text-[12vw]"
          >
            Genradius
          </p>
        </div>

        <div className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
          <BrandLogo tone="light" />
          <p className="text-[11px] text-white/45">
            © {new Date().getFullYear()} Genradius · Own your radius · Made in
            India
          </p>
        </div>
      </div>
    </footer>
  );
}
