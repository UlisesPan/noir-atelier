import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, MapPin, Receipt } from "lucide-react";
import { PendingOrderActions } from "@/components/account/pending-order-actions";
import { OrderItemsList, OrderStatusBadge, OrderTimeline } from "@/components/orders/order-parts";
import { ApiError } from "@/lib/api-error";
import { apiFetch } from "@/lib/server/api";
import { getToken } from "@/lib/server/session";
import type { Order } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/account/orders/[id]">): Promise<Metadata> {
  return { title: `Pedido #${(await params).id}` };
}

export default async function OrderDetailPage({ params }: PageProps<"/account/orders/[id]">) {
  const { id } = await params;
  const token = await getToken();
  if (!token) redirect(`/login?next=/account/orders/${id}`);
  if (!/^\d+$/.test(id)) notFound();

  let order: Order;
  try {
    order = await apiFetch<Order>(`/orders/${id}`, { token });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <div className="space-y-6">
      <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink">
        <ArrowLeft className="size-4" /> Mis pedidos
      </Link>

      <div className="rounded-[var(--radius-card)] border border-line p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-4xl">Pedido #{order.id}</h2>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="mt-1 text-sm text-stone">Realizado el {formatDate(order.createdAt, { dateStyle: "long", timeStyle: "short" })}</p>
          </div>
          {order.status === "pending" && <PendingOrderActions orderId={order.id} />}
        </div>

        <div className="mt-8">
          <OrderTimeline status={order.status} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_18rem]">
          <OrderItemsList order={order} />
          <div className="space-y-4 text-sm">
            <div className="rounded-2xl bg-cream/70 p-5">
              <p className="flex items-center gap-2 font-semibold">
                <MapPin className="size-4 text-gold-dark" /> Envío
              </p>
              <p className="mt-2 text-ink-soft">{order.shippingAddress}</p>
            </div>
            <div className="rounded-2xl bg-cream/70 p-5">
              <p className="flex items-center gap-2 font-semibold">
                <Receipt className="size-4 text-gold-dark" /> Pago
              </p>
              <dl className="mt-2 space-y-1 text-ink-soft">
                <div className="flex justify-between">
                  <dt>Total</dt>
                  <dd className="font-semibold text-ink tabular-nums">{formatPrice(order.total)}</dd>
                </div>
                {order.paidAt && (
                  <div className="flex justify-between">
                    <dt>Pagado</dt>
                    <dd>{formatDate(order.paidAt, { dateStyle: "short" })}</dd>
                  </div>
                )}
                {order.paymentId && (
                  <div className="flex justify-between gap-2">
                    <dt>Operación</dt>
                    <dd className="truncate font-mono text-xs">{order.paymentId}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
