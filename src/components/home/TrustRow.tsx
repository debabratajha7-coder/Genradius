export function TrustRow() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-[var(--accent-soft)] px-6 py-10 text-center md:text-left">
          <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-[var(--earth)] uppercase sm:text-3xl">
            Risk Free Shopping
          </h3>
          <p className="mt-2 text-sm font-semibold text-[var(--moss)]">
            100% refund guarantee if you don&apos;t love the product
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-8 text-center">
          {[
            { icon: "₹", label: "Cash on Delivery" },
            { icon: "🚚", label: "Free shipping above ₹799" },
            { icon: "↺", label: "Easy returns" },
          ].map((item) => (
            <div key={item.label} className="px-1">
              <p className="text-2xl font-bold">{item.icon}</p>
              <p className="mt-2 text-[10px] font-bold tracking-wide text-[var(--muted)] uppercase sm:text-xs">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
