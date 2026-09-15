import Link from "next/link";

const DROPS = [
  {
    name: "Orbit",
    href: "/shop?collection=orbit",
    bg: "from-[#be9c7d] to-[#878c64]",
    label: "ORBIT",
  },
  {
    name: "Premium",
    href: "/shop?collection=premium",
    bg: "from-[#535539] to-[#2a291e]",
    label: "PREMIUM",
  },
  {
    name: "Sale",
    href: "/shop/sale",
    bg: "from-[#88986b] to-[#443f20]",
    label: "SALE",
  },
  {
    name: "Cargos",
    href: "/shop/cargos",
    bg: "from-[#cbcfd0] to-[#535539]",
    label: "CARGOS",
  },
];

export function CollectionStrip() {
  return (
    <section className="mx-auto max-w-[1400px] px-3 py-7 sm:px-6 sm:py-12">
      <h2 className="section-title mb-4 sm:mb-8">Circle Assemble!</h2>

      {/* Phone: compact 2×2 */}
      <div className="grid grid-cols-2 gap-2.5 lg:hidden">
        {DROPS.map((d) => (
          <Link
            key={d.name}
            href={d.href}
            className="group relative overflow-hidden rounded-md border-2 border-[var(--ink)] shadow-[2px_2px_0_0_var(--ink)]"
          >
            <div
              className={`flex aspect-[5/4] items-end bg-gradient-to-br ${d.bg} p-2.5`}
            >
              <span className="rounded-sm bg-white/95 px-2 py-1 text-[10px] font-extrabold tracking-wide uppercase">
                {d.label}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-5 flex justify-center lg:hidden">
        <Link
          href="/shop"
          className="btn-accent w-full max-w-xs px-6 py-3 text-center text-xs"
        >
          See all drops
        </Link>
      </div>

      {/* Desktop */}
      <div className="hidden grid-cols-4 gap-5 lg:grid">
        {DROPS.map((d) => (
          <Link
            key={d.name}
            href={d.href}
            className="shadow-[4px_4px_0_#2a291e] group relative overflow-hidden rounded-2xl"
          >
            <div
              className={`flex aspect-[3/4] items-end bg-gradient-to-br ${d.bg} p-4 transition group-hover:brightness-110`}
            >
              <span className="rounded-lg bg-white px-3 py-2 text-sm font-extrabold tracking-wide uppercase">
                {d.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8 hidden justify-center lg:flex">
        <Link href="/shop" className="btn-accent px-10 py-3.5 text-sm">
          See all drops
        </Link>
      </div>
    </section>
  );
}
