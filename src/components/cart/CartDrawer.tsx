"use client";

import Image from "next/image";
import Link from "next/link";
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
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            aria-hidden
          />

          {/* Mobile: bottom sheet */}
          <motion.aside
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col rounded-t-2xl border-2 border-b-0 border-[var(--ink)] bg-white text-[var(--foreground)] shadow-[0_-12px_40px_rgba(42,41,30,0.18)] lg:hidden"
            initial={reduce ? false : { y: "105%" }}
            animate={{ y: 0 }}
            exit={{ y: "105%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            aria-label="Shopping bag"
          >
            <div className="flex justify-center pt-2 pb-1">
              <span className="h-1 w-10 rounded-full bg-[var(--ink)]/25" />
            </div>
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
              <h2 className="font-[family-name:var(--font-display)] text-xl tracking-wide uppercase">
                Bag {count > 0 ? `(${count})` : ""}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="text-xs font-bold tracking-widest uppercase text-[var(--muted)]"
              >
                Close
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
            className="fixed top-0 right-0 z-50 hidden h-full w-full max-w-md flex-col bg-white text-[var(--foreground)] shadow-2xl lg:flex"
            initial={reduce ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide uppercase">
                My Bag {count > 0 ? `(${count})` : ""}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="text-sm font-bold tracking-widest uppercase text-[var(--muted)] hover:text-black"
              >
                Close
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
  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-12 text-center">
        <p className="font-[family-name:var(--font-display)] text-2xl tracking-wide uppercase sm:text-3xl">
          Looks like your cart is on a diet
        </p>
        <p className="text-sm text-[var(--muted)]">
          Waiting for some Genradius threads to bulk it up.
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
      <ul className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.size}`}
            className="flex gap-3 border-b border-[var(--border)] pb-4"
          >
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-[var(--surface)]">
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
                className="line-clamp-2 text-sm font-medium hover:underline"
              >
                {item.title}
              </Link>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Size {item.size}
              </p>
              <p className="mt-1 text-sm font-bold">{formatINR(item.price)}</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center rounded-md border border-[var(--border)]">
                  <button
                    type="button"
                    className="px-2 py-1 text-sm"
                    onClick={() =>
                      updateQty(item.productId, item.size, item.qty - 1)
                    }
                  >
                    −
                  </button>
                  <span className="px-2 text-sm">{item.qty}</span>
                  <button
                    type="button"
                    className="px-2 py-1 text-sm"
                    onClick={() =>
                      updateQty(item.productId, item.size, item.qty + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold tracking-wider text-[var(--muted)] uppercase hover:text-black"
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
        className={`border-t border-[var(--border)] px-5 py-4 ${
          sheet
            ? "pb-[max(1rem,calc(env(safe-area-inset-bottom)+0.5rem))]"
            : ""
        }`}
      >
        <div className="mb-3 flex justify-between text-sm">
          <span className="text-[var(--muted)]">Subtotal</span>
          <span className="font-bold">{formatINR(subtotal)}</span>
        </div>
        <p className="mb-3 text-xs text-[var(--muted)]">
          Shipping & taxes calculated at checkout. (Checkout coming soon.)
        </p>
        <button type="button" className="btn-accent w-full py-3.5 text-sm">
          Checkout / {formatINR(subtotal)}
        </button>
      </div>
    </>
  );
}
