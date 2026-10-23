import type { Metadata } from "next";
import { Suspense } from "react";
import { SimulatedGateway } from "@/components/checkout/simulated-gateway";

export const metadata: Metadata = { title: "Pago simulado", robots: { index: false } };

export default function SimulatePage() {
  return (
    <Suspense>
      <SimulatedGateway />
    </Suspense>
  );
}
