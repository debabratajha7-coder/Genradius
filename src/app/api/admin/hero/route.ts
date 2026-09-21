import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin-auth";
import {
  createHeroSlide,
  getAllHeroSlidesAdmin,
} from "@/lib/hero";

export async function GET() {
  const denied = await requireAdminApi("hero");
  if (denied) return denied;

  try {
    const slides = await getAllHeroSlidesAdmin();
    return NextResponse.json({ slides });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load slides";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const denied = await requireAdminApi("hero");
  if (denied) return denied;

  try {
    const body = (await req.json()) as {
      image?: string;
      eyebrow?: string;
      title?: string;
      highlight?: string;
      href?: string;
      ctaLabel?: string;
      order?: number;
    };

    if (!body.image?.trim()) {
      return NextResponse.json(
        { error: "Upload or paste a background image first" },
        { status: 400 },
      );
    }
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const slide = await createHeroSlide({
      image: body.image.trim(),
      eyebrow: body.eyebrow,
      title: body.title.trim(),
      highlight: body.highlight,
      href: body.href,
      ctaLabel: body.ctaLabel,
      order: body.order,
    });

    revalidatePath("/");
    return NextResponse.json({ slide });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create slide";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
