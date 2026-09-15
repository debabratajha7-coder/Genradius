import Link from "next/link";

export function BrandLogo({
  href = "/",
  size = "lg",
  className = "",
}: {
  href?: string | null;
  size?: "lg" | "xl";
  className?: string;
}) {
  const classes = `brand-logo brand-logo-${size} ${className}`.trim();

  if (href === null) {
    return (
      <span className={classes} data-text="Genradius" aria-label="Genradius">
        Genradius
      </span>
    );
  }

  return (
    <Link href={href} className={classes} data-text="Genradius" aria-label="Genradius">
      Genradius
    </Link>
  );
}
