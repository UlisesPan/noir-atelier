import Link from "next/link";
import type { Order, OrderStatus } from "@/lib/types";
import { formatPrice, ORDER_STATUS } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { ProductImage } from "../ui/misc";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, tone } = ORDER_STATUS[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function OrderItemsList({ order }: { order: Order }) {
  return (
    <ul className="divide-y divide-line">
      {order.items.map((item) => (
        <li key={item.id} className="flex items-center gap-4 py-4">
          <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden rounded-lg bg-cream">
            <ProductImage src={item.productImage} alt={item.productName} sizes="56px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg leading-tight">{item.productName}</p>
            <p className="text-xs text-stone">
              {item.quantity} × {formatPrice(item.unitPrice)}
            </p>
          </div>
          <span className="font-semibold tabular-nums">{formatPrice(item.unitPrice * item.quantity)}</span>
        </li>
      ))}
    </ul>
  );
}

const STEPS: OrderStatus[] = ["pending", "paid", "shipped", "delivered"];

/** Línea de tiempo del pedido. */
export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") return null;
  const current = STEPS.indexOf(status);
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Estado del pedido">
      {STEPS.map((step, i) => (
        <li key={step} className="space-y-2" aria-current={i === current ? "step" : undefined}>
          <div className={`h-1 rounded-full ${i <= current ? "bg-gold" : "bg-sand"}`} />
          <p className={`text-[0.68rem] font-semibold tracking-wide uppercase ${i <= current ? "text-ink" : "text-stone"}`}>
            {ORDER_STATUS[step].label.replace(" de pago", "")}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function OrderLink({ id }: { id: number }) {
  return (
    <Link href={`/account/orders/${id}`} className="font-semibold underline underline-offset-4">
      Pedido #{id}
    </Link>
  );
}
