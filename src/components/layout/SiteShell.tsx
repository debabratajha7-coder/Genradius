"use client";

import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PromoTicker } from "@/components/layout/PromoTicker";
import type { ReactNode } from "react";

export function SiteShell({
  children,
  promoTexts,
}: {
  children: ReactNode;
  promoTexts: string[];
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <PromoTicker texts={promoTexts} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </CartProvider>
    </AuthProvider>
  );
}
