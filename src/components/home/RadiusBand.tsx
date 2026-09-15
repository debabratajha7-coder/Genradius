import Image from "next/image";
import Link from "next/link";

export function RadiusBand() {
  return (
    <section id="about" className="relative overflow-hidden">
      {/* Intro band */}
      <div
        className="px-4 py-8 sm:px-6 sm:py-14 lg:py-20"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, #88986b 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, #443f20 0%, transparent 45%), #535539",
        }}
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <span className="mb-3 inline-block -rotate-2 border border-[var(--ink)] bg-[var(--sand)] px-2.5 py-1 text-[10px] font-extrabold tracking-widest text-[var(--ink)] uppercase shadow-[2px_2px_0_0_var(--ink)] sm:mb-4 sm:text-xs">
                Welcome to
              </span>
              <h2 className="font-[family-name:var(--font-logo)] text-3xl leading-none tracking-wide text-[var(--silver)] uppercase sm:text-5xl lg:text-7xl">
                The Radius
              </h2>
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-[var(--silver)]/80 sm:mt-4 sm:text-sm lg:hidden">
                Streetwear for people who widen the circle — not blend into it.
              </p>

              {/* Stats: row on phone, stack on desktop */}
              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-8 sm:max-w-md sm:gap-4 lg:flex lg:max-w-none lg:flex-col lg:gap-4">
                <div className="rounded-md border-2 border-[var(--ink)] bg-[var(--background)] px-3 py-3 shadow-[3px_3px_0_0_#be9c7d] sm:rounded-2xl sm:px-5 sm:py-4 sm:shadow-[6px_6px_0_#be9c7d]">
                  <p className="text-lg font-extrabold text-[var(--olive)] sm:text-2xl">
                    EST. 2026
                  </p>
                  <p className="text-[10px] font-bold tracking-wide uppercase sm:text-sm">
                    Of owning your lane
                  </p>
                </div>
                <div className="rounded-md border-2 border-[var(--ink)] bg-[var(--background)] px-3 py-3 shadow-[3px_3px_0_0_#be9c7d] sm:rounded-2xl sm:px-5 sm:py-4 sm:shadow-[6px_6px_0_#be9c7d]">
                  <p className="text-lg font-extrabold text-[var(--olive)] sm:text-2xl">
                    16+ DROPS
                  </p>
                  <p className="text-[10px] font-bold tracking-wide uppercase sm:text-sm">
                    Ready to flex
                  </p>
                </div>
              </div>
            </div>

            {/* Media — compact on phone */}
            <div className="relative mx-auto mt-6 w-full max-w-[220px] sm:mt-10 sm:max-w-sm lg:mt-0 lg:max-w-md">
              <div className="overflow-hidden rounded-xl border-2 border-white bg-black shadow-[6px_6px_0_0_rgba(0,0,0,0.25)] sm:rotate-3 sm:rounded-2xl sm:border-4 sm:shadow-2xl">
                <div className="hidden gap-1.5 bg-white px-3 py-2 sm:flex">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>
                <div className="relative aspect-[4/5]">
                  <Image
                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80"
                    alt="Genradius crew"
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 220px, 400px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--sand)] text-sm font-bold shadow-[2px_2px_0_0_var(--ink)] sm:h-14 sm:w-14 sm:text-xl">
                      ▶
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strip */}
      <div className="bg-[var(--sand)] px-4 py-3.5 sm:px-6 sm:py-5">
        <div className="mx-auto flex max-w-[1400px] items-baseline justify-between gap-3">
          <p className="text-sm font-bold text-[var(--background)] sm:text-xl">
            We are
          </p>
          <div className="text-right">
            <p className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-wide text-[var(--ink)] uppercase sm:text-4xl">
              explicit
            </p>
            <p className="text-[10px] font-medium text-[var(--earth)] sm:text-sm">
              But never assertive
            </p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-[var(--ink)] px-4 py-8 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[1400px] lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white uppercase sm:text-4xl">
              About Us
            </h3>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-white/85 sm:mt-4 sm:text-sm">
              Genradius is for the ones who widen the circle — oversized
              graphics, premium basics, and cargos that move with you. Loud
              energy, original fits, zero blending in.
            </p>
            <Link
              href="/shop"
              className="btn-accent mt-5 inline-flex px-5 py-3 text-xs sm:mt-6 sm:px-6"
            >
              Shop the drop
            </Link>
          </div>

          {/* Phone: single clean image strip; desktop: collage */}
          <div className="mt-6 lg:mt-0">
            <div className="relative h-40 overflow-hidden rounded-md border-2 border-white/80 sm:hidden">
              <Image
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80"
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>

            <div className="relative mx-auto hidden h-72 w-full max-w-lg sm:block">
              {[
                {
                  src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
                  className: "absolute top-0 left-4 w-36 rotate-[-8deg] sm:w-44",
                },
                {
                  src: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80",
                  className: "absolute top-4 right-2 w-36 rotate-[6deg] sm:w-44",
                },
                {
                  src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80",
                  className:
                    "absolute bottom-0 left-1/4 w-40 rotate-[3deg] sm:w-48",
                },
              ].map((img) => (
                <div
                  key={img.src}
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
