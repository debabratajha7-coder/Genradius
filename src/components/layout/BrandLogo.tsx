"use client";

import Link from "next/link";
import { Signature } from "@/components/ui/signature";

export function BrandLogo({
  href = "/",
  size = "lg",
  className = "",
}: {
  href?: string | null;
  size?: "lg" | "xl";
  className?: string;
}) {
  const fontSize = size === "xl" ? 28 : 18;
  const classes = `brand-logo brand-logo-${size} ${className}`.trim();

  const mark = (
    <Signature
      text="GenRadius"
      color="var(--ink)"
      fontSize={fontSize}
      duration={1.2}
      delay={0.05}
      compact
      className="block h-full w-auto"
      fontUrl="/LastoriaBoldRegular.otf"
    />
  );

  if (href === null) {
    return (
      <span className={classes} aria-label="Genradius">
        {mark}
      </span>
    );
  }

  return (
    <Link href={href} className={classes} aria-label="Genradius">
      {mark}
    </Link>
  );
}
