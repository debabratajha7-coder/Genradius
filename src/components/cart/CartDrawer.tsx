"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCart } from "./CartProvider";
import { formatINR } from "@/lib/format";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, count } =
    useCart();
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            aria-hidden
          />

          {/* Mobile: bottom sheet */}
          <motion.aside
            className="fixed inset-x-0 bottom-0 z-[80] flex max-h-[88dvh] flex-col rounded-t-[28px] bg-[var(--background)] text-[var(--foreground)] shadow-[0_-12px_40px_rgba(23,22,15,0.25)] lg:hidden"
            initial={reduce ? false : { y: "105%" }}
            animate={{ y: 0 }}
            exit={{ y: "105%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            aria-label="Shopping bag"
          >
            <div className="flex justify-center pt-2 pb-1">
              <span className="h-1 w-10 rounded-full bg-[var(--ink)]/15" />
            </div>
            <div className="flex items-center justify-between border-b border-[var(--ink)]/8 px-5 py-3">
              <h2 className="font-[family-name:var(--font-heavy)] text-2xl leading-none tracking-tight uppercase">
                Your bag
                {count > 0 ? (
                  <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--pop)] px-2 font-[family-name:var(--font-body)] text-xs font-black text-[var(--pop-ink)]">
                    {count}
                  </span>
                ) : null}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="icon-chip h-9 w-9 text-base"
                aria-label="Close bag"
              >
                ×
              </button>
            </div>
            <CartBody
              items={items}
              closeCart={closeCart}
              removeItem={removeItem}
              updateQty={updateQty}
              subtotal={subtotal}
              sheet
            />
          </motion.aside>

          {/* Desktop: side drawer */}
          <motion.aside
            className="fixed top-3 right-3 bottom-3 z-[80] hidden w-full max-w-md flex-col overflow-hidden rounded-[28px] bg-[var(--background)] text-[var(--foreground)] shadow-[0_30px_80px_rgba(23,22,15,0.35)] lg:flex"
            initial={reduce ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-[var(--ink)]/8 px-6 py-5">
              <h2 className="font-[family-name:var(--font-heavy)] text-3xl leading-none tracking-tight uppercase">
                Your bag
                {count > 0 ? (
                  <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--pop)] px-2 align-middle font-[family-name:var(--font-body)] text-xs font-black text-[var(--pop-ink)]">
                    {count}
                  </span>
                ) : null}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="icon-chip h-10 w-10 text-lg"
                aria-label="Close bag"
              >
                ×
              </button>
            </div>
            <CartBody
              items={items}
              closeCart={closeCart}
              removeItem={removeItem}
              updateQty={updateQty}
              subtotal={subtotal}
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function CartBody({
  items,
  closeCart,
  removeItem,
  updateQty,
  subtotal,
  sheet,
}: {
  items: ReturnType<typeof useCart>["items"];
  closeCart: () => void;
  removeItem: (productId: string, size: string) => void;
  updateQty: (productId: string, size: string, qty: number) => void;
  subtotal: number;
  sheet?: boolean;
}) {
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-12 text-center">
        <span className="icon-chip h-14 w-14 text-2xl">◌</span>
        <p className="mt-2 font-[family-name:var(--font-heavy)] text-3xl leading-none tracking-tight uppercase sm:text-4xl">
          Your bag is <em className="not-italic text-outline">empty</em>
        </p>
        <p className="max-w-[24ch] text-sm text-[var(--muted)]">
          Nothing in the circle yet. Start with a bestseller.
        </p>
        <Link
          href="/shop"
          onClick={closeCart}
          className="btn-accent mt-4 px-8 py-3 text-sm"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className="scrollbar-none flex-1 space-y-4 overflow-y-auto px-5 py-4 sm:px-6">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.size}`}
            className="flex gap-4 border-b border-[var(--ink)]/8 pb-4 last:border-b-0"
          >
            <div className="relative h-28 w-22 shrink-0 overflow-hidden rounded-2xl bg-[var(--surface)]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/product/${item.slug}`}
                onClick={closeCart}
                className="line-clamp-2 text-sm font-semibold hover:underline"
              >
                {item.title}
              </Link>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Size <span className="font-bold text-[var(--ink)]">{item.size}</span>
              </p>
              <p className="mt-1 text-sm font-bold tabular-nums">
                {formatINR(item.price)}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-9 items-center rounded-full border border-[var(--ink)]/12 bg-white/70 px-1">
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-sm transition hover:bg-[var(--ink)] hover:text-white"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      updateQty(item.productId, item.size, item.qty - 1)
                    }
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-sm font-bold tabular-nums">{item.qty}</span>
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-sm transition hover:bg-[var(--ink)] hover:text-white"
                    aria-label="Increase quantity"
                    onClick={() =>
                      updateQty(item.productId, item.size, item.qty + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="text-[10px] font-bold tracking-[0.16em] text-[var(--muted)] uppercase underline-offset-4 transition hover:text-[var(--ink)] hover:underline"
                  onClick={() => removeItem(item.productId, item.size)}
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div
        className={`border-t border-[var(--ink)]/8 bg-white/60 px-5 py-4 sm:px-6 sm:py-5 ${
          sheet
            ? "pb-[max(1rem,calc(env(safe-area-inset-bottom)+0.5rem))]"
            : ""
        }`}
      >
        <div className="mb-1 flex items-end justify-between">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--muted)] uppercase">
            Subtotal
          </span>
          <span className="font-[family-name:var(--font-heavy)] text-3xl leading-none tracking-tight tabular-nums">
            {formatINR(subtotal)}
          </span>
        </div>
        <p className="mb-4 text-xs text-[var(--muted)]">
          Shipping and COD fee are calculated at checkout. UPI, cards and COD accepted.
        </p>
        <Link
          href="/checkout"
          onClick={(event) => {
            event.preventDefault();
            closeCart();
            router.push("/checkout");
          }}
          className="btn-accent h-13 w-full text-sm"
        >
          Checkout
          <span className="btn-arrow" aria-hidden>
            →
          </span>
        </Link>
      </div>
    </>
  );
}
