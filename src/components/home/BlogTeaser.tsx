import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";

const BLOGS = [
  {
    date: "15 Sep 2026",
    tag: "Styling",
    title: "How to style oversized tees without looking lost in them",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80",
  },
  {
    date: "12 Sep 2026",
    tag: "Fit guide",
    title: "Cargo pairings that actually work on campus",
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=80",
  },
  {
    date: "08 Sep 2026",
    tag: "Culture",
    title: "Own your radius: building a rotation that lasts",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80",
  },
];

export function BlogTeaser() {
  return (
    <section
      id="blogs"
      className="mx-auto max-w-[1400px] px-3 py-8 sm:px-6 sm:py-16"
    >
      <SectionHeading
        index="06 — Journal"
        title={
          <>
            Read the <em>radius</em>
          </>
        }
        subtitle="Fit notes, styling drops and the culture behind the cuts."
        href="/#blogs"
        linkLabel="All stories"
      />

      <div
        className="-mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 scrollbar-none lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0"
        style={{ scrollbarWidth: "none" }}
      >
        {BLOGS.map((b) => (
          <article
            key={b.title}
            className="group w-[min(78vw,300px)] shrink-0 snap-start lg:w-auto"
          >
            <Link href="/#blogs" className="block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-[var(--surface)] sm:rounded-[22px]">
                <Image
                  src={b.image}
                  alt=""
                  fill
                  className="object-cover transition duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  sizes="(max-width:1023px) 80vw, 33vw"
                />
                <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-extrabold tracking-[0.18em] text-[var(--ink)] uppercase backdrop-blur">
                  {b.tag}
                </span>
              </div>
              <div className="px-1 pt-3.5">
                <p className="text-[10px] font-bold tracking-[0.16em] text-[var(--muted)] uppercase">
                  {b.date}
                </p>
                <h3 className="mt-1.5 line-clamp-2 font-[family-name:var(--font-display)] text-[15px] font-bold leading-snug tracking-tight text-[var(--ink)] sm:text-lg">
                  {b.title}
                </h3>
                <span className="section-link mt-3 text-[10px]">
                  Read
                  <span className="btn-arrow" aria-hidden>
                    →
                  </span>
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
