import { AdminGate } from "@/components/admin/AdminGate";
import { HeroManager } from "@/components/admin/HeroManager";
import { getAllHeroSlidesAdmin } from "@/lib/hero";
import { DEFAULT_HERO_SLIDES } from "@/lib/hero-defaults";

export default async function AdminHeroPage() {
  let slides = DEFAULT_HERO_SLIDES.map((s, i) => ({
    ...s,
    _id: `default-${i}`,
  }));

  try {
    slides = await getAllHeroSlidesAdmin();
  } catch {
    // keep defaults
  }

  return (
    <AdminGate>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
        Hero slides
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--moss)]">
        Control the top homepage carousel (&quot;Own your radius&quot; panel).
        Drag &amp; drop photos — they upload to Cloudinary and update the live
        site.
      </p>
      <div className="mt-6">
        <HeroManager initial={slides} />
      </div>
    </AdminGate>
  );
}
