import type { Metadata, Viewport } from "next";
import { Outfit, Syne, Unbounded } from "next/font/google";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const body = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});

const logo = Unbounded({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-logo",
});

export const metadata: Metadata = {
  title: {
    default: "Genradius — Own Your Radius",
    template: "%s | Genradius",
  },
  description:
    "Men's streetwear that refuses to blend in. Oversized tees, polos, cargos — Genradius.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Genradius",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f5f0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${logo.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
