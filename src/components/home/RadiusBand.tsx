import Image from "next/image";
import Link from "next/link";
import type { HomeMediaLean } from "@/lib/home-media-defaults";
import { DEFAULT_HOME_MEDIA } from "@/lib/home-media-defaults";
import { Marquee } from "@/components/ui/Marquee";

const STATS = [
  { value: "EST. 2026", label: "Born in the circle" },
  { value: "16+", label: "Drops and counting" },
  { value: "48h", label: "Average dispatch" },
];

export function RadiusBand({
  media = DEFAULT_HOME_MEDIA,
}: {
  media?: HomeMediaLean;
}) {
  const collage = [
    {
      src: media.aboutCollage[0],
      className: "left-0 top-[2%] w-[58%] -rotate-[7deg]",
    },
    {
      src: media.aboutCollage[1],
      className: "right-0 top-[28%] w-[60%] rotate-[5deg]",
    },
    {
      src: media.aboutCollage[2],
      className: "left-[16%] bottom-[3%] w-[62%] rotate-[2deg]",
    },
  ];

  return (
    <section id="about" className="relative overflow-hidden bg-[var(--ink-deep)] text-white">
      <div className="bg-grid-dark absolute inset-0 opacity-60" aria-hidden />
      <div className="orb orb--pop top-[-10%] left-[-8%] h-[38rem] w-[38rem] opacity-40" aria-hidden />
      <div className="orb orb--sand right-[-12%] bottom-[-10%] h-[34rem] w-[34rem] opacity-40 [animation-delay:-9s]" aria-hidden />

      {/* Giant word marquee */}
      <div className="relative border-b border-white/10 py-3 sm:py-4">
        <Marquee speed={46} flat>
          {["Own your radius", "Widen the circle", "Zero blending in"].map(
            (t, i) => (
              <span
                key={t}
                className={`px-6 font-[family-name:var(--font-heavy)] text-[13vw] leading-none tracking-wide uppercase sm:text-[7vw] ${
                  i % 2 ? "text-outline-light" : "text-white/90"
                }`}
              >
                {t}
              </span>
            ),
          )}
        </Marquee>
      </div>

      <div className="relative mx-auto grid max-w-[1400px] gap-10 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-14 lg:py-28">
        {/* Copy */}
        <div className="lg:col-span-6">
          <p className="eyebrow text-[var(--pop)]">The Radius</p>
          <h2 className="mt-4 font-[family-name:var(--font-heavy)] text-[clamp(2.6rem,9vw,4rem)] leading-[0.9] uppercase sm:text-[clamp(3.5rem,6vw,6rem)]">
            We are
            <br />
            <span className="text-[var(--pop)]">explicit,</span>
            <br />
            <span className="text-outline-light">never loud.</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
            Genradius is for the ones who widen the circle — oversized graphics,
            heavyweight basics and cargos that move with you. Original fits,
            honest pricing, drops that don&apos;t wait for permission.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/shop" className="btn-accent px-7 py-3.5 text-xs">
              Shop the drop
              <span className="btn-arrow" aria-hidden>
                →
              </span>
            </Link>
            <Link
              href="/shop?collection=premium"
              className="btn-light px-6 py-3.5 text-xs"
            >
              Premium edit
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:mt-14 sm:gap-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="font-[family-name:var(--font-heavy)] text-2xl leading-none tracking-wide text-white sm:text-4xl">
                  {s.value}
                </dt>
                <dd className="mt-1.5 text-[10px] font-bold tracking-[0.16em] text-white/55 uppercase sm:text-[11px]">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Media */}
        <div className="grid gap-4 lg:col-span-6 lg:grid-cols-5 lg:gap-5">
          <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-black lg:col-span-3">
            <div className="relative aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[540px]">
              {media.aboutVideoUrl ? (
                <video
                  src={media.aboutVideoUrl}
                  poster={media.aboutVideoPoster}
                  className="absolute inset-0 h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                />
              ) : (
                <Image
                  src={media.aboutVideoPoster || media.aboutPhoneBanner}
                  alt="Genradius crew"
                  fill
                  className="object-cover"
                  sizes="(max-width:1023px) 100vw, 40vw"
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(23,22,15,0.7)] to-transparent" />
              <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-extrabold tracking-[0.2em] uppercase backdrop-blur-md">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--pop)]" />
                On set
              </span>
              <p className="absolute right-4 bottom-4 left-4 font-[family-name:var(--font-heavy)] text-2xl leading-none uppercase sm:text-3xl">
                Made for the
                <br />
                <span className="text-[var(--pop)]">outer ring.</span>
              </p>
            </div>
          </div>

          <div className="relative hidden min-h-[320px] lg:col-span-2 lg:block">
            {collage.map((img) => (
              <div
                key={img.src + img.className}
                className={`absolute ${img.className} aspect-[3/4] overflow-hidden rounded-[16px] border border-white/15 shadow-[0_30px_60px_rgba(0,0,0,0.45)] transition duration-700 hover:rotate-0 hover:scale-[1.04]`}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
