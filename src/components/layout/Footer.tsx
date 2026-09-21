"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

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
    <footer className="mt-auto border-t border-[var(--ink)]/20 bg-[var(--earth)] text-[var(--silver)] pb-[calc(var(--app-tabbar-h)+env(safe-area-inset-bottom)+0.75rem)] lg:pb-6">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-md">
            <p className="text-[10px] font-extrabold tracking-[0.2em] text-[var(--sand)] uppercase">
              Stay in the radius
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-extrabold tracking-wide text-[var(--sand)] uppercase sm:text-2xl lg:text-4xl">
              Join the circle
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[var(--silver)]/75 sm:text-sm">
              Drops, restocks, and member codes — no spam.
            </p>
          </div>

          <div className="w-full max-w-md">
            <form
              onSubmit={onSubscribe}
              className="flex overflow-hidden rounded-md border-2 border-[var(--ink)] bg-[var(--background)] shadow-[3px_3px_0_0_var(--ink)]"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                disabled={busy}
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-[var(--ink)] outline-none sm:px-4"
              />
              <button
                type="submit"
                disabled={busy}
                className="shrink-0 border-l-2 border-[var(--ink)] bg-[var(--sand)] px-4 py-3 text-[10px] font-extrabold tracking-widest text-[var(--ink)] uppercase sm:px-5 sm:text-xs"
              >
                {busy ? "…" : "Join"}
              </button>
            </form>
            {message && (
              <p className="mt-2 text-xs font-semibold text-[var(--sand)]">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-2 text-xs font-semibold text-red-300">{error}</p>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 border-t border-[var(--sand)]/25 pt-8 lg:mt-10 lg:grid-cols-4 lg:gap-8">
          <div>
            <h3 className="mb-3 text-[10px] font-extrabold tracking-[0.16em] text-[var(--sand)] uppercase">
              Shop
            </h3>
            <ul className="space-y-2 text-xs font-semibold uppercase sm:text-sm">
              <li>
                <Link href="/shop">All products</Link>
              </li>
              <li>
                <Link href="/shop/oversized-tees">Oversized Tees</Link>
              </li>
              <li>
                <Link href="/shop/cargos">Cargos</Link>
              </li>
              <li>
                <Link href="/shop/sale">Sale</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-[10px] font-extrabold tracking-[0.16em] text-[var(--sand)] uppercase">
              Account
            </h3>
            <ul className="space-y-2 text-xs font-semibold uppercase sm:text-sm">
              <li>
                <Link href="/login">Log in</Link>
              </li>
              <li>
                <Link href="/account">My account</Link>
              </li>
              <li>
                <Link href="/account#orders">Orders</Link>
              </li>
              <li>
                <Link href="/account#help">Help</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-[10px] font-extrabold tracking-[0.16em] text-[var(--sand)] uppercase">
              Company
            </h3>
            <ul className="space-y-2 text-xs font-semibold uppercase sm:text-sm">
              <li>
                <Link href="/#about">About</Link>
              </li>
              <li>
                <Link href="/#blogs">Blog</Link>
              </li>
              <li>
                <a href="mailto:hello@genradius.com">Contact</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-[10px] font-extrabold tracking-[0.16em] text-[var(--sand)] uppercase">
              Social
            </h3>
            <ul className="space-y-2 text-xs font-semibold uppercase sm:text-sm">
              <li>Instagram</li>
              <li>YouTube</li>
              <li>WhatsApp</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-[var(--sand)]/25 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-[family-name:var(--font-logo)] text-sm tracking-wide text-[var(--sand)] uppercase">
            Genradius
          </p>
          <p className="text-[10px] text-[var(--silver)]/65">
            © {new Date().getFullYear()} Genradius. Own your radius.
          </p>
        </div>
      </div>
    </footer>
  );
}
