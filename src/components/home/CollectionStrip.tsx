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
    <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
      <h2 className="section-title mb-8">Circle Assemble!</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
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
      <div className="mt-8 flex justify-center">
        <Link href="/shop" className="btn-accent px-10 py-3.5 text-sm">
          See all drops
        </Link>
      </div>
    </section>
  );
}
