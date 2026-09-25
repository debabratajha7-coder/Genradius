"use client";

const ITEMS = [
  {
    label: "Cash on delivery",
    hint: "OTP-verified",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),
  },
  {
    label: "Fast dispatch",
    hint: "24–48 hours",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </svg>
    ),
  },
  {
    label: "7-day exchange",
    hint: "No questions",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 9h13l-3-3M20 15H7l3 3" />
      </svg>
    ),
  },
];

export function ProductTrustStrip() {
  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      {ITEMS.map((item) => (
        <div
          key={item.label}
          className="panel flex flex-col items-start gap-2 p-3 sm:p-4"
        >
          <span className="icon-chip h-8 w-8 [&>svg]:h-4 [&>svg]:w-4">
            {item.icon}
          </span>
          <p className="text-[11px] leading-tight font-bold">{item.label}</p>
          <p className="-mt-1 text-[10px] text-[var(--muted)]">{item.hint}</p>
        </div>
      ))}
    </div>
  );
}
