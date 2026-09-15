export function FeaturedOn() {
  const logos = ["YourStory", "Startup Reporter", "Street Press", "Campus Daily"];

  return (
    <section className="mx-auto max-w-[1400px] px-3 py-6 sm:px-6 sm:py-12">
      <h2 className="section-title mb-4 sm:mb-8">Genradius Featured On</h2>
      <div className="flex gap-6 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap sm:items-center sm:justify-center sm:gap-14">
        {logos.map((name) => (
          <span
            key={name}
            className="shrink-0 text-[11px] font-extrabold tracking-[0.16em] text-black/25 uppercase sm:text-base sm:tracking-[0.2em]"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
