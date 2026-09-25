import type { ReactNode } from "react";

/**
 * Infinite CSS marquee. Children are duplicated so the loop is seamless.
 * Pauses on hover; disabled under prefers-reduced-motion.
 */
export function Marquee({
  children,
  speed = 28,
  className = "",
  flat = false,
  reverse = false,
}: {
  children: ReactNode;
  /** seconds per loop */
  speed?: number;
  className?: string;
  flat?: boolean;
  reverse?: boolean;
}) {
  return (
    <div
      className={`marquee ${flat ? "marquee--flat" : ""} ${className}`.trim()}
      style={{ ["--marquee-speed" as string]: `${speed}s` }}
      aria-hidden
    >
      <div
        className="marquee__track"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
      </div>
    </div>
  );
}
