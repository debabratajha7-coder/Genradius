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
    <section id="blogs" className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <h2 className="section-title mb-8">Explore More Blogs</h2>
      <div className="grid gap-5 sm:grid-cols-3">
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
                sizes="(max-width:768px) 100vw, 33vw"
              />
            </div>
            <div className="p-4">
              <p className="text-xs text-[var(--muted)]">{b.date}</p>
              <h3 className="mt-2 text-sm font-bold leading-snug">{b.title}</h3>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Link href="/#blogs" className="btn-accent px-10 py-3.5 text-sm">
          Explore more blogs
        </Link>
      </div>
    </section>
  );
}
