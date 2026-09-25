import Link from "next/link";

/**
 * Genradius wordmark — geometric ring mark (the "radius") with an orbiting
 * point, paired with a heavy Unbounded wordmark. GEN solid · RADIUS outlined.
 */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={`brand-logo__mark ${className}`.trim()}
      aria-hidden
    >
      <circle
        cx="20"
        cy="20"
        r="16"
        stroke="currentColor"
        strokeWidth="2.6"
      />
      <circle cx="20" cy="20" r="4.2" fill="currentColor" />
      <line
        x1="20"
        y1="20"
        x2="34"
        y2="20"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <g className="orbit">
        <circle cx="36" cy="20" r="3.4" fill="var(--pop)" />
      </g>
    </svg>
  );
}

export function BrandLogo({
  href = "/",
  size = "lg",
  className = "",
  tone = "dark",
}: {
  href?: string | null;
  size?: "lg" | "xl";
  className?: string;
  tone?: "dark" | "light";
}) {
  const classes = `brand-logo brand-logo-${size} ${
    tone === "light" ? "brand-logo--light" : ""
  } ${className}`.trim();

  const mark = (
    <>
      <BrandMark />
      <span className="brand-logo__text">
        Gen<em>radius</em>
      </span>
    </>
  );

  if (href === null) {
    return (
      <span className={classes} aria-label="Genradius">
        {mark}
      </span>
    );
  }

  return (
    <Link href={href} className={classes} aria-label="Genradius home">
      {mark}
    </Link>
  );
}
