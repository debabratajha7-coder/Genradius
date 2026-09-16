import Image from "next/image";
import Link from "next/link";
import type { HomeMediaLean } from "@/lib/home-media-defaults";
import { DEFAULT_HOME_MEDIA } from "@/lib/home-media-defaults";

export function RadiusBand({
  media = DEFAULT_HOME_MEDIA,
}: {
  media?: HomeMediaLean;
}) {
  const collage = [
    {
      src: media.aboutCollage[0],
      className: "absolute top-0 left-4 w-44 rotate-[-8deg]",
    },
    {
      src: media.aboutCollage[1],
      className: "absolute top-4 right-2 w-44 rotate-[6deg]",
    },
    {
      src: media.aboutCollage[2],
      className: "absolute bottom-0 left-1/4 w-48 rotate-[3deg]",
    },
  ];

  return (
    <section id="about" className="relative overflow-hidden">
      {/* Phone: single inset promo banner */}
      <div className="px-3 py-4 lg:hidden">
        <Link
          href="/shop"
          className="relative block overflow-hidden rounded-2xl"
        >
          <div className="relative aspect-[16/9] min-h-[140px]">
            <Image
              src={media.aboutPhoneBanner}
              alt="The Radius"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--moss)]/90 via-[var(--earth)]/70 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <p className="font-[family-name:var(--font-logo)] text-lg tracking-wide text-[var(--silver)] uppercase">
                The Radius
              </p>
              <p className="mt-1 max-w-[220px] text-[11px] leading-snug text-white/85">
                Streetwear for people who widen the circle.
              </p>
              <span className="btn-accent mt-3 w-fit rounded-md px-4 py-2 text-[10px]">
                Shop the drop
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Desktop: full brand story */}
      <div className="hidden lg:block">
        <div
          className="px-6 py-20"
          style={{
            background:
              "radial-gradient(ellipse at 20% 30%, #88986b 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, #443f20 0%, transparent 45%), #535539",
          }}
        >
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-2 items-center gap-12">
              <div>
                <span className="mb-4 inline-block -rotate-2 border border-[var(--ink)] bg-[var(--sand)] px-3 py-1 text-xs font-extrabold tracking-widest text-[var(--ink)] uppercase shadow-[2px_2px_0_0_var(--ink)]">
                  Welcome to
                </span>
                <h2 className="font-[family-name:var(--font-logo)] text-7xl leading-none tracking-wide text-[var(--silver)] uppercase">
                  The Radius
                </h2>

                <div className="mt-8 flex flex-col gap-4">
                  <div className="rounded-2xl border-2 border-[var(--ink)] bg-[var(--background)] px-5 py-4 shadow-[6px_6px_0_#be9c7d]">
                    <p className="text-2xl font-extrabold text-[var(--olive)]">
                      EST. 2026
                    </p>
                    <p className="text-sm font-bold tracking-wide uppercase">
                      Of owning your lane
                    </p>
                  </div>
                  <div className="rounded-2xl border-2 border-[var(--ink)] bg-[var(--background)] px-5 py-4 shadow-[6px_6px_0_#be9c7d]">
                    <p className="text-2xl font-extrabold text-[var(--olive)]">
                      16+ DROPS
                    </p>
                    <p className="text-sm font-bold tracking-wide uppercase">
                      Ready to flex
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-md">
                <div className="rotate-3 overflow-hidden rounded-2xl border-4 border-white bg-black shadow-2xl">
                  <div className="flex gap-1.5 bg-white px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="relative aspect-[4/5]">
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
                      <>
                        <Image
                          src={media.aboutVideoPoster}
                          alt="Genradius crew"
                          fill
                          className="object-cover"
                          sizes="400px"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--sand)] text-xl font-bold shadow-[2px_2px_0_0_var(--ink)]">
                            ▶
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--sand)] px-6 py-5">
          <div className="mx-auto flex max-w-[1400px] items-baseline justify-between gap-3">
            <p className="text-xl font-bold text-[var(--background)]">We are</p>
            <div className="text-right">
              <p className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-wide text-[var(--ink)] uppercase">
                explicit
              </p>
              <p className="text-sm font-medium text-[var(--earth)]">
                But never assertive
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--ink)] px-6 py-14">
          <div className="mx-auto grid max-w-[1400px] grid-cols-2 items-center gap-10">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-4xl tracking-wide text-white uppercase">
                About Us
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85">
                Genradius is for the ones who widen the circle — oversized
                graphics, premium basics, and cargos that move with you. Loud
                energy, original fits, zero blending in.
              </p>
              <Link
                href="/shop"
                className="btn-accent mt-6 inline-flex px-6 py-3 text-xs"
              >
                Shop the drop
              </Link>
            </div>

            <div className="relative mx-auto h-72 w-full max-w-lg">
              {collage.map((img) => (
                <div
                  key={img.src + img.className}
                  className={`relative ${img.className} aspect-[3/4] overflow-hidden rounded-xl border-2 border-white shadow-lg`}
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
      </div>
    </section>
  );
}
