import { Marquee } from "@/components/ui/Marquee";

export function PromoTicker({ texts }: { texts: string[] }) {
  const list = texts.filter(Boolean);
  if (!list.length) return null;

  return (
    <div className="relative z-40 bg-[var(--ticker)] text-white">
      <Marquee speed={32} flat className="h-8 md:h-9">
        {list.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="flex items-center gap-6 px-6 text-[10px] font-bold tracking-[0.2em] uppercase sm:text-[11px]"
          >
            {t}
            <span className="text-[var(--pop)]" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
