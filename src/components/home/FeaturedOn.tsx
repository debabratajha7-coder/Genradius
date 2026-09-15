export function FeaturedOn() {
  const logos = ["YourStory", "Startup Reporter", "Street Press", "Campus Daily"];

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
      <h2 className="section-title mb-8">Genradius Featured On</h2>
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
        {logos.map((name) => (
          <span
            key={name}
            className="text-sm font-extrabold tracking-[0.2em] text-black/25 uppercase sm:text-base"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
