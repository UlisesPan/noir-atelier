import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentResult } from "@/components/checkout/payment-result";

export const metadata: Metadata = { title: "Resultado del pago", robots: { index: false } };

export default function ResultPage() {
  return (
    <Suspense>
      <PaymentResult />
    </Suspense>
  );
}
