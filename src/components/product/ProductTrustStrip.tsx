"use client";

export function ProductTrustStrip() {
  return (
    <div className="mt-8 grid grid-cols-3 gap-2 rounded-md border-2 border-[var(--ink)] bg-[var(--surface)] px-2 py-4 text-center shadow-[3px_3px_0_0_var(--ink)] sm:gap-4 sm:px-4">
      {[
        { icon: "₹", label: "Cash on delivery" },
        { icon: "🚚", label: "Free shipping" },
        { icon: "↺", label: "Easy returns" },
      ].map((item) => (
        <div key={item.label} className="px-1">
          <p className="text-lg font-bold sm:text-2xl">{item.icon}</p>
          <p className="mt-1 text-[9px] font-bold tracking-wide text-[var(--muted)] uppercase sm:text-xs">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
