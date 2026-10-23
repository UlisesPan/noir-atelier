"use client";

import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/client";
import { cancelOrder, startPayment } from "@/lib/checkout";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { OrderItemsList, OrderTimeline } from "../orders/order-parts";
import { Button, ButtonLink } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

/**
 * Página de retorno del pago. Con Mercado Pago llega `payment_id`: le pedimos a la API que
 * lo verifique contra Mercado Pago (no confiamos en el `status` de la URL).
 */
export function PaymentResult() {
  const params = useSearchParams();
  const orderId = Number(params.get("order") ?? params.get("external_reference"));
  const paymentId = params.get("payment_id");
  const queryClient = useQueryClient();

  const { data: order, isPending } = useQuery({
    queryKey: ["order-result", orderId, paymentId],
    queryFn: async () => {
      if (paymentId && paymentId !== "null") {
        await api.post(`/payments/confirm/${paymentId}`).catch(() => null);
      }
      // Respaldo: consulta por número de pedido (no depende del payment_id ni del webhook).
      return api.post<Order>(`/payments/sync/${orderId}`).catch(() => api.get<Order>(`/orders/${orderId}`));
    },
    enabled: orderId > 0,
  });

  const retry = useMutation({ mutationFn: () => startPayment(orderId), onError: (e) => toast.error(errorMessage(e)) });
  const cancel = useMutation({
    mutationFn: () => cancelOrder(orderId),
    onSuccess: (updated) => {
      queryClient.setQueryData(["order-result", orderId, paymentId], updated);
      toast.success("Cancelamos el pedido y liberamos el stock");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  if (isPending || !order) {
    return (
      <div className="container-page flex justify-center py-20">
        <div className="w-full max-w-xl space-y-4">
          <Skeleton className="mx-auto size-16 rounded-full" />
          <Skeleton className="mx-auto h-10 w-72" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  const paid = ["paid", "shipped", "delivered"].includes(order.status);
  const rejected = params.get("status") === "rejected" || params.get("collection_status") === "rejected";
  const view = paid
    ? { icon: <CheckCircle2 className="size-8" />, tone: "bg-success/10 text-success", title: "¡Gracias por tu compra!", text: "Recibimos tu pago. Te avisaremos cuando tu pedido esté en camino." }
    : order.status === "cancelled"
      ? { icon: <XCircle className="size-8" />, tone: "bg-ink/5 text-ink-soft", title: "Pedido cancelado", text: "El stock reservado volvió a estar disponible." }
      : rejected
        ? { icon: <XCircle className="size-8" />, tone: "bg-danger/10 text-danger", title: "El pago no se completó", text: "Tu pedido sigue reservado. Podés intentar pagar de nuevo o cancelarlo." }
        : { icon: <Clock className="size-8" />, tone: "bg-gold/15 text-gold-dark", title: "Pago en proceso", text: "Estamos esperando la confirmación del pago. Puede demorar unos minutos." };

  return (
    <div className="container-page flex justify-center py-12 lg:py-20">
      <div className="w-full max-w-xl animate-fade-up text-center">
        <div className={`mx-auto grid size-16 place-items-center rounded-full ${view.tone}`}>{view.icon}</div>
        <h1 className="mt-6 text-5xl">{view.title}</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">{view.text}</p>

        <div className="mt-10 rounded-[2rem] border border-line bg-white/60 p-6 text-left sm:p-8">
          <div className="mb-6 flex items-baseline justify-between">
            <p className="text-xs tracking-wider text-stone uppercase">Pedido #{order.id}</p>
            <p className="text-xl font-semibold tabular-nums">{formatPrice(order.total)}</p>
          </div>
          <OrderTimeline status={order.status} />
          <div className="mt-4">
            <OrderItemsList order={order} />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {order.status === "pending" ? (
            <>
              <Button variant="outline" onClick={() => cancel.mutate()} loading={cancel.isPending}>
                Cancelar pedido
              </Button>
              <Button onClick={() => retry.mutate()} loading={retry.isPending}>
                Reintentar pago
              </Button>
            </>
          ) : (
            <>
              <ButtonLink href={`/account/orders/${order.id}`} variant="outline">
                Ver detalle
              </ButtonLink>
              <ButtonLink href="/shop">Seguir comprando</ButtonLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
