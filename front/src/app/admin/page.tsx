import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowUpRight } from "lucide-react";
import { AdminPageHeader, Panel } from "@/components/admin/page-header";
import { SalesChart } from "@/components/admin/sales-chart";
import { ProductImage } from "@/components/ui/misc";
import { apiFetch } from "@/lib/server/api";
import { getToken } from "@/lib/server/session";
import type { AdminStats } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const stats = await apiFetch<AdminStats>("/admin/stats", { token: await getToken() });
  const last30 = stats.salesByDay.reduce((s, d) => s + d.revenue, 0);
  const maxUnits = Math.max(1, ...stats.topProducts.map((p) => p.units));

  const kpis = [
    { label: "Ingresos totales", value: formatPrice(stats.revenue), hint: `${formatPrice(last30)} en los últimos 30 días` },
    { label: "Pedidos pagados", value: stats.paidOrders, hint: `${stats.pendingOrders} pendientes de pago`, href: "/admin/orders" },
    { label: "Ticket promedio", value: formatPrice(stats.avgTicket), hint: "Sobre pedidos pagados" },
    { label: "Clientes", value: stats.customers, hint: `${stats.products} productos activos` },
  ];

  return (
    <>
      <AdminPageHeader title="Dashboard" description="Resumen del rendimiento de la tienda." />

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-[var(--radius-card)] border border-line bg-ivory p-5 shadow-soft">
            <dt className="text-xs font-semibold tracking-wide text-stone">{k.label}</dt>
            <dd className="mt-3 font-display text-4xl tabular-nums">{k.value}</dd>
            <dd className="mt-1 text-xs text-muted">
              {k.href ? (
                <Link href={k.href} className="inline-flex items-center gap-1 hover:text-ink">
                  {k.hint} <ArrowUpRight className="size-3" />
                </Link>
              ) : (
                k.hint
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_22rem]">
        <Panel title="Ingresos diarios · últimos 30 días">
          <SalesChart data={stats.salesByDay} />
        </Panel>

        <Panel title="Más vendidos (unidades)">
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-stone">Todavía no hay ventas.</p>
          ) : (
            <ol className="space-y-4">
              {stats.topProducts.map((p) => (
                <li key={`${p.id}-${p.name}`}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate">{p.name}</span>
                    <span className="shrink-0 font-semibold tabular-nums">{p.units}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sand/60">
                    <div className="h-full rounded-full bg-chart" style={{ width: `${(p.units / maxUnits) * 100}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-stone tabular-nums">{formatPrice(p.revenue)}</p>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>

      <Panel className="mt-6" title={`Stock bajo (${stats.lowStock})`}>
        {stats.lowStockProducts.length === 0 ? (
          <p className="text-sm text-stone">Todo el catálogo tiene stock suficiente.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.lowStockProducts.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/admin/products/${p.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-line p-3 transition hover:border-ink/25"
                >
                  <div className="relative aspect-[4/5] w-10 shrink-0 overflow-hidden rounded-lg bg-cream">
                    <ProductImage src={p.image} alt="" sizes="40px" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className={`flex items-center gap-1 text-xs font-semibold ${p.stock === 0 ? "text-danger" : "text-gold-dark"}`}>
                      <AlertTriangle className="size-3" /> {p.stock === 0 ? "Sin stock" : `${p.stock} unidades`}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
