import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ order?: string; order_id?: string }> };

/** Legacy PhonePe return URL — forwards to /checkout/success. */
export default async function CheckoutReturnPage({ searchParams }: Props) {
  const sp = await searchParams;
  const id = sp.order_id || sp.order || "";
  redirect(
    id
      ? `/checkout/success?order_id=${encodeURIComponent(id)}`
      : "/checkout/success",
  );
}
