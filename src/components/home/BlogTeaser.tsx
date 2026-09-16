import Image from "next/image";
import Link from "next/link";

const BLOGS = [
  {
    date: "15 Sep, 2026",
    title: "How to style oversized tees without looking lost in them",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&q=80",
  },
  {
    date: "12 Sep, 2026",
    title: "Cargo pants pairings that actually slap on campus",
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&q=80",
  },
  {
    date: "08 Sep, 2026",
    title: "Own your radius: building a streetwear rotation that lasts",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&q=80",
  },
];

export function BlogTeaser() {
  return (
    <section id="blogs" className="mx-auto max-w-[1400px] px-3 py-7 sm:px-6 sm:py-10">
      <div className="section-heading section-heading--solo">
        <h2 className="section-title">Explore More Blogs</h2>
      </div>

      {/* Phone: horizontal snap cards */}
      <div className="snap-x-mandatory flex gap-3 overflow-x-auto pb-2 scrollbar-none lg:hidden">
        {BLOGS.map((b) => (
          <article
            key={b.title}
            className="snap-start w-[min(78vw,280px)] shrink-0 overflow-hidden rounded-md border-2 border-[var(--ink)] bg-white shadow-[2px_2px_0_0_var(--ink)]"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={b.image}
                alt=""
                fill
                className="object-cover"
                sizes="280px"
              />
            </div>
            <div className="p-3">
              <p className="text-[10px] text-[var(--muted)]">{b.date}</p>
              <h3 className="mt-1 line-clamp-2 text-xs font-bold leading-snug">
                {b.title}
              </h3>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 hidden gap-5 sm:grid-cols-3 lg:grid">
        {BLOGS.map((b) => (
          <article
            key={b.title}
            className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-card)]"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={b.image}
                alt=""
                fill
                className="object-cover"
                sizes="33vw"
              />
            </div>
            <div className="p-4">
              <p className="text-xs text-[var(--muted)]">{b.date}</p>
              <h3 className="mt-2 text-sm font-bold leading-snug">{b.title}</h3>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 flex justify-center sm:mt-8">
        <Link
          href="/#blogs"
          className="btn-accent w-full max-w-xs px-8 py-3 text-center text-xs sm:w-auto sm:px-10 sm:py-3.5 sm:text-sm"
        >
          Explore more blogs
        </Link>
      </div>
    </section>
  );
}
