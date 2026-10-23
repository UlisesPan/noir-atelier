import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, Package } from "lucide-react";
import { OrderStatusBadge } from "@/components/orders/order-parts";
import { Pagination } from "@/components/shop/pagination";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, ProductImage } from "@/components/ui/misc";
import { apiFetch } from "@/lib/server/api";
import { getToken } from "@/lib/server/session";
import type { Order, Paginated } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Mis pedidos" };

export default async function OrdersPage({ searchParams }: PageProps<"/account/orders">) {
  const token = await getToken();
  if (!token) redirect("/login?next=/account/orders");
  const page = Number((await searchParams).page) || 1;
  const orders = await apiFetch<Paginated<Order>>(`/orders?page=${page}&limit=8`, { token });

  if (orders.meta.total === 0) {
    return (
      <EmptyState
        icon={<Package className="size-6" />}
        title="Todavía no hiciste pedidos"
        description="Cuando compres, vas a poder seguir el estado de tus pedidos desde acá."
        action={<ButtonLink href="/shop">Ir a la tienda</ButtonLink>}
        className="rounded-[var(--radius-card)] border border-dashed border-line"
      />
    );
  }

  return (
    <div>
      <ul className="space-y-4">
        {orders.data.map((order) => (
          <li key={order.id}>
            <Link
              href={`/account/orders/${order.id}`}
              className="group flex flex-col gap-4 rounded-[var(--radius-card)] border border-line p-5 transition hover:border-ink/25 hover:shadow-soft sm:flex-row sm:items-center"
            >
              <div className="flex -space-x-3">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="relative aspect-[4/5] w-12 overflow-hidden rounded-lg border-2 border-ivory bg-cream">
                    <ProductImage src={item.productImage} alt="" sizes="48px" />
                  </div>
                ))}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">Pedido #{order.id}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="mt-1 text-sm text-stone">
                  {formatDate(order.createdAt)} · {order.items.reduce((n, i) => n + i.quantity, 0)} productos
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold tabular-nums">{formatPrice(order.total)}</span>
                <ChevronRight className="size-4 text-stone transition group-hover:translate-x-1" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Pagination page={page} totalPages={orders.meta.totalPages} searchParams={{}} basePath="/account/orders" />
    </div>
  );
}
