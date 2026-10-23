import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { Pagination } from "@/components/shop/pagination";
import { apiFetch, toQueryString } from "@/lib/server/api";
import { getToken } from "@/lib/server/session";
import type { Order, OrderStatus, Paginated } from "@/lib/types";
import { cn, formatDate, formatPrice, ORDER_STATUS } from "@/lib/utils";

export const metadata: Metadata = { title: "Pedidos" };

const FILTERS: (OrderStatus | undefined)[] = [undefined, "pending", "paid", "shipped", "delivered", "cancelled"];

export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  const sp = (await searchParams) as Record<string, string | undefined>;
  const status = FILTERS.includes(sp.status as OrderStatus) ? (sp.status as OrderStatus) : undefined;
  const page = Number(sp.page) || 1;
  const orders = await apiFetch<Paginated<Order>>(`/admin/orders${toQueryString({ status, page, limit: 15 })}`, {
    token: await getToken(),
  });

  return (
    <>
      <AdminPageHeader title="Pedidos" description="Seguimiento y cambio de estado de los pedidos." />

      <nav aria-label="Filtrar por estado" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {FILTERS.map((s) => (
          <Link
            key={s ?? "all"}
            href={s ? `/admin/orders?status=${s}` : "/admin/orders"}
            aria-current={status === s ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition",
              status === s ? "border-ink bg-ink text-ivory" : "border-line bg-ivory text-ink-soft hover:border-ink/30",
            )}
          >
            {s ? ORDER_STATUS[s].label : "Todos"}
          </Link>
        ))}
      </nav>

      <div className="mt-6 overflow-x-auto rounded-[var(--radius-card)] border border-line bg-ivory shadow-soft">
        <table className="w-full min-w-[52rem] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs tracking-wide text-stone">
              <th className="px-5 py-3 font-semibold">Pedido</th>
              <th className="px-5 py-3 font-semibold">Cliente</th>
              <th className="px-5 py-3 font-semibold">Productos</th>
              <th className="px-5 py-3 text-right font-semibold">Total</th>
              <th className="px-5 py-3 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.data.map((o) => (
              <tr key={o.id} className="border-b border-line/60 align-top last:border-0 hover:bg-cream/40">
                <td className="px-5 py-4">
                  <p className="font-semibold">#{o.id}</p>
                  <p className="text-xs text-stone">{formatDate(o.createdAt, { dateStyle: "medium", timeStyle: "short" })}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium">{o.user?.name}</p>
                  <p className="text-xs text-stone">{o.user?.email}</p>
                  <p className="mt-1 max-w-56 truncate text-xs text-stone" title={o.shippingAddress}>{o.shippingAddress}</p>
                </td>
                <td className="px-5 py-4 text-ink-soft">
                  {o.items.map((i) => (
                    <p key={i.id} className="text-xs">
                      {i.quantity} × {i.productName}
                    </p>
                  ))}
                </td>
                <td className="px-5 py-4 text-right font-semibold tabular-nums">{formatPrice(o.total)}</td>
                <td className="px-5 py-4">
                  <OrderStatusSelect orderId={o.id} status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.data.length === 0 && <p className="p-8 text-center text-sm text-stone">No hay pedidos con este estado.</p>}
      </div>
      <Pagination page={page} totalPages={orders.meta.totalPages} searchParams={{ status }} basePath="/admin/orders" />
    </>
  );
}
