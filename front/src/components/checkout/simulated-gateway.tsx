"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, FlaskConical, ShieldCheck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/client";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { OrderItemsList } from "../orders/order-parts";
import { Button } from "../ui/button";
import { Logo } from "../ui/misc";
import { Skeleton } from "../ui/skeleton";

/** Pasarela de pago de demostración: se usa cuando la API no tiene token de Mercado Pago. */
export function SimulatedGateway() {
  const orderId = Number(useSearchParams().get("order"));
  const router = useRouter();

  const { data: order, isPending, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => api.get<Order>(`/orders/${orderId}`),
    enabled: orderId > 0,
  });

  const approve = useMutation({
    mutationFn: () => api.post<Order>(`/payments/simulate/${orderId}`),
    onSuccess: () => router.replace(`/checkout/result?order=${orderId}&status=approved`),
    onError: (e) => toast.error(errorMessage(e)),
  });

  if (!orderId || error) {
    return <p className="container-page py-20 text-center text-muted">No encontramos el pedido a pagar.</p>;
  }

  return (
    <div className="container-page flex justify-center py-12 lg:py-20">
      <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-line bg-white shadow-lift">
        <div className="flex items-center justify-between bg-ink px-8 py-5 text-ivory">
          <Logo light className="scale-90" />
          <span className="flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-[0.65rem] font-semibold tracking-wider text-gold-light uppercase">
            <FlaskConical className="size-3" /> Pasarela demo
          </span>
        </div>

        <div className="space-y-6 p-8">
          {isPending || !order ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : order.status !== "pending" ? (
            <div className="text-center">
              <p className="text-muted">Este pedido ya no está pendiente de pago.</p>
              <Button className="mt-4" onClick={() => router.replace(`/account/orders/${order.id}`)}>
                Ver pedido
              </Button>
            </div>
          ) : (
            <>
              <div>
                <p className="text-xs tracking-wider text-stone uppercase">Pedido #{order.id}</p>
                <p className="mt-1 text-4xl font-semibold tabular-nums">{formatPrice(order.total)}</p>
              </div>
              <OrderItemsList order={order} />
              <div className="rounded-2xl bg-cream/70 p-4 text-sm text-ink-soft">
                Esta pantalla reemplaza a Mercado Pago en modo demo. Elegí el resultado del pago para probar ambos flujos.
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  variant="outline"
                  onClick={() => router.replace(`/checkout/result?order=${order.id}&status=rejected`)}
                  disabled={approve.isPending}
                >
                  <XCircle className="size-4" /> Rechazar pago
                </Button>
                <Button onClick={() => approve.mutate()} loading={approve.isPending}>
                  <CheckCircle2 className="size-4" /> Aprobar pago
                </Button>
              </div>
              <p className="flex items-center justify-center gap-1.5 text-xs text-stone">
                <ShieldCheck className="size-3.5" /> No se realiza ningún cobro real
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
