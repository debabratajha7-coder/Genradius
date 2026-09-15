"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ImageUploader } from "./ImageUploader";

type Cat = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  order: number;
};

export function CategoriesManager({ initial }: { initial: Cat[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState("0");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const field =
    "w-full rounded-md border-2 border-[var(--ink)] bg-white px-3 py-2 text-sm shadow-[2px_2px_0_0_var(--ink)]";

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug,
        order: Number(order) || 0,
        image: images[0] || "",
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed");
      return;
    }
    setName("");
    setSlug("");
    setOrder("0");
    setImages([]);
    router.refresh();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete category?")) return;
    await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={onCreate}
        className="space-y-4 rounded-md border-2 border-[var(--ink)] bg-white p-5 shadow-[4px_4px_0_0_var(--ink)]"
      >
        <h2 className="text-sm font-extrabold uppercase">Add category</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <input
            required
            className={field}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className={field}
            placeholder="Slug (optional)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <input
            className={field}
            placeholder="Order"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          />
        </div>
        <ImageUploader images={images} onChange={setImages} cropAspect={1} />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" className="btn-accent px-6 py-3 text-sm">
          Save category
        </button>
      </form>

      <ul className="space-y-2">
        {initial.map((c) => (
          <li
            key={c._id}
            className="flex items-center justify-between rounded-md border-2 border-[var(--ink)] bg-white px-4 py-3 shadow-[2px_2px_0_0_var(--ink)]"
          >
            <span className="font-semibold">
              {c.name}{" "}
              <span className="text-xs text-[var(--moss)]">/{c.slug}</span>
            </span>
            <button
              type="button"
              onClick={() => onDelete(c._id)}
              className="text-xs font-extrabold text-red-700 uppercase underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
