import { Suspense } from "react";
import { CheckoutSuccess } from "@/components/checkout/CheckoutSuccess";

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm">
          Loading…
        </div>
      }
    >
      <CheckoutSuccess />
    </Suspense>
  );
}
