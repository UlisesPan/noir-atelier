"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { errorMessage } from "@/lib/client";
import { cancelOrder, startPayment } from "@/lib/checkout";
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

  return (
    <div className="flex gap-2">
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
