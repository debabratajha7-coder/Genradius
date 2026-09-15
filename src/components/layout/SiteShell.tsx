"use client";

import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PromoTicker } from "@/components/layout/PromoTicker";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
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
          <main className="app-main flex-1 pb-[calc(var(--app-tabbar-h)+env(safe-area-inset-bottom)+0.5rem)] md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileTabBar />
          <CartDrawer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
