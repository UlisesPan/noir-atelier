"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { refreshCatalog } from "@/app/actions";
import { api, errorMessage } from "@/lib/client";
import type { OrderStatus } from "@/lib/types";
import { ORDER_STATUS } from "@/lib/utils";
import { OrderStatusBadge } from "../orders/order-parts";

/** Mismas transiciones que valida la API: solo se ofrecen los pasos posibles. */
const NEXT: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export function OrderStatusSelect({ orderId, status }: { orderId: number; status: OrderStatus }) {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (next: OrderStatus) => api.patch(`/admin/orders/${orderId}/status`, { status: next }),
    onSuccess: async (_d, next) => {
      toast.success(`Pedido #${orderId}: ${ORDER_STATUS[next].label.toLowerCase()}`);
      // Cancelar devuelve stock: el catálogo cambia.
      if (next === "cancelled") await refreshCatalog(["products"]);
      router.refresh();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const options = NEXT[status];
  return (
    <div className="space-y-2">
      <OrderStatusBadge status={status} />
      {options.length > 0 && (
        <select
          aria-label={`Cambiar estado del pedido ${orderId}`}
          disabled={mutation.isPending}
          value=""
          onChange={(e) => {
            const next = e.target.value as OrderStatus;
            if (next === "cancelled" && !confirm("¿Cancelar el pedido? Se devolverá el stock.")) return;
            mutation.mutate(next);
          }}
          className="block h-8 cursor-pointer rounded-lg border border-line bg-white/70 px-2 text-xs outline-none focus:border-gold disabled:opacity-50"
        >
          <option value="" disabled>
            Mover a…
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {ORDER_STATUS[o].label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
