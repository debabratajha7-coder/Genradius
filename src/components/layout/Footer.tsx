"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export function Footer() {
  const [email, setEmail] = useState("");

  const onSubscribe = (e: FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="mt-auto bg-[var(--earth)] text-[var(--silver)]">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-6 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-wide text-[var(--sand)] uppercase sm:text-4xl md:text-5xl">
            Join the Genradius Circle
          </h2>
          <form
            onSubmit={onSubscribe}
            className="flex w-full max-w-md overflow-hidden rounded-md border-2 border-[var(--ink)] bg-[var(--background)] shadow-[4px_4px_0_0_var(--ink)]"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-[var(--ink)] outline-none"
            />
            <button
              type="submit"
              className="border-l-2 border-[var(--ink)] bg-[var(--sand)] px-5 py-3 text-xs font-extrabold tracking-widest text-[var(--ink)] uppercase hover:bg-[var(--sage)]"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="mt-10 grid grid-cols-2 border-y border-[var(--sand)]/30 md:grid-cols-4">
          {["Instagram", "YouTube", "X", "WhatsApp"].map((s) => (
            <div
              key={s}
              className="border-[var(--sand)]/30 px-4 py-4 text-center text-sm font-extrabold tracking-widest uppercase not-last:border-r max-md:odd:border-r max-md:[&:nth-child(-n+2)]:border-b"
            >
              {s}
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="mb-3 text-sm font-extrabold tracking-widest uppercase">
              Categories
            </h3>
            <ul className="space-y-2 text-sm font-semibold uppercase">
              <li>
                <Link href="/shop/oversized-tees">Oversized Tees</Link>
              </li>
              <li>
                <Link href="/shop?collection=radius-range">New Arrivals</Link>
              </li>
              <li>
                <Link href="/shop">Best Sellers</Link>
              </li>
              <li>
                <Link href="/shop/cargos">Cargos</Link>
              </li>
              <li>
                <Link href="/shop/polos">Polos</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-extrabold tracking-widest uppercase">
              Company
            </h3>
            <ul className="space-y-2 text-sm font-semibold uppercase">
              <li>
                <Link href="/#about">About Us</Link>
              </li>
              <li>
                <Link href="/#blogs">Blog</Link>
              </li>
              <li>
                <Link href="/shop">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/shop">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-extrabold tracking-widest uppercase">
              Customers
            </h3>
            <ul className="space-y-2 text-sm font-semibold uppercase">
              <li>
                <Link href="/shop">Contact Us</Link>
              </li>
              <li>
                <Link href="/shop">FAQs</Link>
              </li>
              <li>
                <Link href="/shop">Shipping Policy</Link>
              </li>
              <li>
                <Link href="/shop">Refund Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <p
          className="mt-10 overflow-hidden text-center font-[family-name:var(--font-logo)] text-[clamp(2.5rem,12vw,7rem)] leading-none tracking-wide text-[var(--sand)] uppercase select-none"
          aria-hidden
        >
          Own Your Radius
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-[var(--sand)]/25 pt-4 text-xs font-semibold text-[var(--silver)]">
          <span>Copyright © Genradius {new Date().getFullYear()}</span>
          <button
            type="button"
            onClick={scrollTop}
            className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-[var(--ink)] bg-[var(--sand)] text-[var(--ink)] shadow-[3px_3px_0_0_var(--ink)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--ink)]"
            aria-label="Back to top"
          >
            ˄
          </button>
        </div>
      </div>
    </footer>
  );
}
