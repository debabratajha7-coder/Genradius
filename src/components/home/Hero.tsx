import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative isolate min-h-[78vh] w-full overflow-hidden sm:min-h-[85vh]">
      <Image
        src="https://images.unsplash.com/photo-1552374196-1ab2a1de6e09?w=1800&q=80"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/25" />
      <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pb-16 sm:min-h-[85vh] sm:px-6 sm:pb-20">
        <p className="font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-wide uppercase sm:text-7xl md:text-8xl">
          Genradius
        </p>
        <h1 className="mt-4 max-w-xl text-lg text-white/85 sm:text-xl">
          Own your radius. Street fits that refuse to blend in.
        </h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="bg-[var(--accent)] px-7 py-3.5 text-xs font-bold tracking-[0.2em] text-black uppercase transition hover:brightness-110"
          >
            Shop the drop
          </Link>
          <Link
            href="/shop?collection=radius-range"
            className="border border-white/40 px-7 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition hover:bg-white hover:text-black"
          >
            Radius Range
          </Link>
        </div>
      </div>
    </section>
  );
}
