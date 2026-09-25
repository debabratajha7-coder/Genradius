import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Editorial section heading — index · heavy title · optional subtitle · link.
 * Title may contain <em> to outline a word: title={<>Our <em>bestsellers</em></>}
 * `actions` renders to the right of the link (e.g. carousel arrows).
 */
export function SectionHeading({
  index,
  title,
  subtitle,
  href,
  linkLabel = "View all",
  align = "left",
  actions,
  className = "",
}: {
  index?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  actions?: ReactNode;
  className?: string;
}) {
  const hasSide = Boolean(href || actions);
  return (
    <div
      className={`section-heading ${
        align === "center" ? "section-heading--center" : ""
      } ${!hasSide ? "section-heading--solo" : ""} ${className}`.trim()}
    >
      <div className="min-w-0">
        {index ? <span className="section-index">{index}</span> : null}
        <h2 className="section-title">{title}</h2>
        {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
      </div>
      {hasSide ? (
        <div className="flex shrink-0 items-center gap-4 lg:gap-5">
          {href ? (
            <Link href={href} className="section-link">
              {linkLabel}
              <span className="btn-arrow" aria-hidden>
                →
              </span>
            </Link>
          ) : null}
          {actions}
        </div>
      ) : null}
    </div>
  );
}
