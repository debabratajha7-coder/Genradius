import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin-auth";
import { deleteHeroSlide, updateHeroSlide } from "@/lib/hero";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { id } = await ctx.params;
    const body = (await req.json()) as Partial<{
      image: string;
      eyebrow: string;
      title: string;
      highlight: string;
      href: string;
      ctaLabel: string;
      active: boolean;
      order: number;
    }>;

    const slide = await updateHeroSlide(id, body);
    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    revalidatePath("/");
    return NextResponse.json({ slide });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update slide";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const { id } = await ctx.params;
    const ok = await deleteHeroSlide(id);
    if (!ok) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to delete slide";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
