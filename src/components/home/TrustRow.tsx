import { formatINR } from "@/lib/format";

const ICONS = {
  cod: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M7 12h.01M17 12h.01" />
    </svg>
  ),
  ship: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17.5" cy="18" r="1.8" />
    </svg>
  ),
  swap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 9h13l-3-3M20 15H7l3 3" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  ),
};

export function TrustRow({
  freeShippingThreshold = 1000,
  codEnabled = true,
}: {
  freeShippingThreshold?: number;
  codEnabled?: boolean;
}) {
  const items = [
    {
      icon: ICONS.ship,
      title:
        freeShippingThreshold > 0
          ? `Free shipping over ${formatINR(freeShippingThreshold)}`
          : "Free shipping",
      body: "Pan-India delivery with live tracking the moment it leaves us.",
    },
    codEnabled
      ? {
          icon: ICONS.cod,
          title: "Cash on delivery",
          body: "Pay at your door. OTP-verified so nobody games your order.",
        }
      : {
          icon: ICONS.lock,
          title: "Secure prepaid",
          body: "UPI, cards and wallets via PhonePe — encrypted end to end.",
        },
    {
      icon: ICONS.swap,
      title: "7-day exchange",
      body: "Wrong size? Swap it. No interrogation, no drama.",
    },
    {
      icon: ICONS.lock,
      title: "Cancel before dispatch",
      body: "Changed your mind? Cancel from your order page until it ships.",
    },
  ];

  return (
    <section className="mx-auto max-w-[1400px] px-3 py-8 sm:px-6 sm:py-14">
      <div className="relative overflow-hidden rounded-[22px] bg-[var(--ink)] text-white sm:rounded-[28px]">
        <div className="bg-grid-dark absolute inset-0 opacity-70" aria-hidden />
        <div className="orb orb--pop -top-24 -left-20 h-72 w-72 opacity-70" aria-hidden />
        <div className="orb orb--sage -right-24 -bottom-24 h-80 w-80 opacity-60 [animation-delay:-8s]" aria-hidden />

        <div className="relative grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="group relative flex flex-col gap-4 px-5 py-6 sm:px-7 sm:py-9"
            >
              {i > 0 ? (
                <span
                  className="absolute top-6 bottom-6 left-0 hidden w-px bg-white/10 lg:block"
                  aria-hidden
                />
              ) : null}
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[var(--pop)] transition duration-500 group-hover:bg-[var(--pop)] group-hover:text-[var(--pop-ink)] [&>svg]:h-5 [&>svg]:w-5">
                {item.icon}
              </span>
              <div>
                <p className="font-[family-name:var(--font-heavy)] text-xl leading-none tracking-wide uppercase sm:text-2xl">
                  {item.title}
                </p>
                <p className="mt-2 max-w-[26ch] text-xs leading-relaxed text-white/65 sm:text-[13px]">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
