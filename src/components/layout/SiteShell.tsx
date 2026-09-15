"use client";

import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PromoTicker } from "@/components/layout/PromoTicker";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { MobileOfferBar } from "@/components/layout/MobileOfferBar";
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
        <div className="app-shell flex min-h-dvh flex-col">
          <PromoTicker texts={promoTexts} />
          <Header />
          <main className="app-main flex-1 pb-2 lg:pb-0">{children}</main>
          <Footer />
          <MobileOfferBar texts={promoTexts} />
          <MobileTabBar />
          <CartDrawer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
