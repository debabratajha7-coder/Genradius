import Image from "next/image";
import Link from "next/link";

export function RadiusBand() {
  return (
    <section id="about" className="relative overflow-hidden">
      <div
        className="px-4 py-16 sm:px-6 sm:py-20"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, #88986b 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, #443f20 0%, transparent 45%), #535539",
        }}
      >
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="mb-4 inline-block -rotate-3 bg-[var(--sand)] px-3 py-1 text-xs font-extrabold tracking-widest text-[var(--ink)] uppercase">
              Welcome to
            </span>
            <h2 className="font-[family-name:var(--font-logo)] text-5xl tracking-wide text-[var(--silver)] uppercase sm:text-6xl md:text-7xl">
              The Radius
            </h2>
            <div className="mt-8 space-y-4">
              <div className="max-w-xs rounded-2xl bg-[var(--background)] px-5 py-4 shadow-[6px_6px_0_#be9c7d]">
                <p className="text-2xl font-extrabold text-[var(--olive)]">
                  EST. 2026
                </p>
                <p className="text-sm font-bold tracking-wide uppercase">
                  Of owning your lane
                </p>
              </div>
              <div className="max-w-xs rounded-2xl bg-[var(--background)] px-5 py-4 shadow-[6px_6px_0_#be9c7d]">
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
                <Image
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80"
                  alt="Genradius crew"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-xl font-bold">
                    ▶
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--sand)] px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-baseline justify-between gap-2">
          <p className="text-lg font-bold text-[var(--background)] sm:text-xl">We are</p>
          <div className="text-right">
            <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-wide text-[var(--ink)] uppercase sm:text-4xl">
              explicit
            </p>
            <p className="text-sm font-medium text-[var(--earth)]">But never assertive</p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--ink)] px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-2">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-4xl tracking-wide text-white uppercase">
              About Us
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/90">
              Genradius is for the ones who widen the circle — oversized
              graphics, premium basics, and cargos that move with you. Loud
              energy, original fits, zero blending in.
            </p>
        <Link
            href="/shop"
            className="mt-6 inline-block border-2 border-[var(--ink)] bg-[var(--sand)] px-6 py-3 text-xs font-extrabold tracking-widest uppercase text-[var(--ink)] shadow-[4px_4px_0_0_var(--ink)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_var(--ink)]"
          >
              Shop the drop
            </Link>
          </div>
          <div className="relative mx-auto h-72 w-full max-w-lg">
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
                className: "absolute bottom-0 left-1/4 w-40 rotate-[3deg] sm:w-48",
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
    </section>
  );
}
