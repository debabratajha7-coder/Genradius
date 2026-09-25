import { Marquee } from "@/components/ui/Marquee";
import { formatINR } from "@/lib/format";

/**
 * Dark USP strip under the hero. Copy is driven by live checkout settings
 * so it never contradicts the cart.
 */
export function UspMarquee({
  freeShippingThreshold,
  codEnabled,
  tone = "dark",
}: {
  freeShippingThreshold: number;
  codEnabled: boolean;
  tone?: "dark" | "pop";
}) {
  const items = [
    freeShippingThreshold > 0
      ? `Free shipping over ${formatINR(freeShippingThreshold)}`
      : "Free shipping on every order",
    codEnabled ? "Cash on delivery available" : "Secure prepaid checkout",
    "7-day easy exchange",
    "Ships across India",
    "Own your radius",
    "Drops every month",
  ];

  const dark = tone === "dark";

  return (
    <div
      className={`overflow-hidden border-y ${
        dark
          ? "border-white/10 bg-[var(--ink-deep)] text-white"
          : "border-[var(--pop-ink)]/20 bg-[var(--pop)] text-[var(--pop-ink)]"
      }`}
    >
      <Marquee speed={38} flat>
        {items.map((t) => (
          <span
            key={t}
            className="flex items-center gap-5 px-5 py-3 font-[family-name:var(--font-display)] text-[10px] font-extrabold tracking-[0.24em] uppercase sm:py-3.5 sm:text-[11px]"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                dark ? "bg-[var(--pop)]" : "bg-[var(--pop-ink)]"
              }`}
            />
            {t}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
