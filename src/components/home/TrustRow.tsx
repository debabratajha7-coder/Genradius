export function TrustRow() {
  return (
    <section className="mx-auto max-w-[1400px] px-3 py-6 sm:px-6 sm:py-10">
      <div className="grid gap-2.5 sm:gap-4 lg:grid-cols-2">
        <div className="rounded-md border-2 border-[var(--ink)] bg-[var(--accent-soft)] px-4 py-5 text-center shadow-[3px_3px_0_0_var(--ink)] sm:rounded-2xl sm:px-6 sm:py-10 sm:text-left sm:shadow-none sm:border-0">
          <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-[var(--earth)] uppercase sm:text-3xl">
            Risk Free Shopping
          </h3>
          <p className="mt-1.5 text-xs font-semibold text-[var(--moss)] sm:mt-2 sm:text-sm">
            100% refund if you don&apos;t love it
          </p>
        </div>
        <div className="grid grid-cols-3 gap-1.5 rounded-md border-2 border-[var(--ink)] bg-[var(--surface)] px-2 py-4 text-center shadow-[3px_3px_0_0_var(--ink)] sm:gap-2 sm:rounded-2xl sm:border sm:border-[var(--border)] sm:px-4 sm:py-8 sm:shadow-none">
          {[
            { icon: "₹", label: "COD" },
            { icon: "🚚", label: "Free shipping" },
            { icon: "↺", label: "Easy returns" },
          ].map((item) => (
            <div key={item.label} className="px-0.5">
              <p className="text-lg font-bold sm:text-2xl">{item.icon}</p>
              <p className="mt-1 text-[9px] font-bold tracking-wide text-[var(--muted)] uppercase sm:mt-2 sm:text-xs">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
