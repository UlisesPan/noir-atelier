"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/client";
import { cancelOrder, startPayment } from "@/lib/checkout";
import type { Order } from "@/lib/types";
import { Button } from "../ui/button";

export function PendingOrderActions({ orderId }: { orderId: number }) {
  const router = useRouter();
  const pay = useMutation({ mutationFn: () => startPayment(orderId), onError: (e) => toast.error(errorMessage(e)) });
  const cancel = useMutation({
    mutationFn: () => cancelOrder(orderId),
    onSuccess: () => {
      toast.success("Pedido cancelado");
      router.refresh();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  // Si el pago ya se acreditó en Mercado Pago pero el aviso no llegó (ej: en local no hay webhook),
  // la API lo reconcilia consultando por número de pedido.
  const verify = useMutation<Order, Error, boolean>({
    mutationFn: () => api.post<Order>(`/payments/sync/${orderId}`),
    onSuccess: (order, silent) => {
      if (order.status === "pending") {
        if (!silent) toast.info("Todavía no vemos el pago acreditado. Si acabás de pagar, probá de nuevo en unos segundos.");
        return;
      }
      toast.success("¡Confirmamos tu pago!");
      router.refresh();
    },
    onError: (e, silent) => !silent && toast.error(errorMessage(e)),
  });

  const checked = useRef(false);
  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    verify.mutate(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="ghost" size="sm" loading={verify.isPending} onClick={() => verify.mutate(false)}>
        Ya pagué, verificar
      </Button>
      <Button
        variant="outline"
        size="sm"
        loading={cancel.isPending}
        onClick={() => confirm("¿Cancelar este pedido? Se liberará el stock reservado.") && cancel.mutate()}
      >
        Cancelar
      </Button>
      <Button size="sm" loading={pay.isPending} onClick={() => pay.mutate()}>
        Pagar ahora
      </Button>
    </div>
  );
}
