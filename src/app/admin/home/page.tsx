import { AdminGate } from "@/components/admin/AdminGate";
import { HomeMediaManager } from "@/components/admin/HomeMediaManager";
import { getHomeMediaAdmin } from "@/lib/home-media";
import { DEFAULT_HOME_MEDIA } from "@/lib/home-media-defaults";

export default async function AdminHomeMediaPage() {
  let media = DEFAULT_HOME_MEDIA;
  try {
    media = await getHomeMediaAdmin();
  } catch {
    /* defaults */
  }

  return (
    <AdminGate>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
        Homepage media
      </h1>
      <p className="mt-2 text-sm text-[var(--moss)]">
        About section visuals and Circle Assemble collection tiles.
      </p>
      <div className="mt-6">
        <HomeMediaManager initial={media} />
      </div>
    </AdminGate>
  );
}
