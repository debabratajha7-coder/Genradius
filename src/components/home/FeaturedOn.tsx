import { Marquee } from "@/components/ui/Marquee";

export function FeaturedOn() {
  const logos = [
    "YourStory",
    "Startup Reporter",
    "Street Press",
    "Campus Daily",
    "Fit Check India",
    "Drop Weekly",
  ];

  return (
    <section className="mx-auto max-w-[1400px] px-3 py-8 sm:px-6 sm:py-14">
      <p className="eyebrow eyebrow--bare mb-5 justify-center text-center w-full">
        As seen in
      </p>
      <Marquee speed={40}>
        {logos.map((name) => (
          <span
            key={name}
            className="px-8 font-[family-name:var(--font-heavy)] text-2xl tracking-wide text-[var(--ink)]/20 uppercase transition hover:text-[var(--ink)]/60 sm:px-12 sm:text-4xl"
          >
            {name}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
