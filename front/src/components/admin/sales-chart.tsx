"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AdminStats } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";

const CHART = "#a8792b"; // --color-chart
const compact = new Intl.NumberFormat("es-AR", { notation: "compact", maximumFractionDigits: 1 });

/** Ingresos diarios de los últimos 30 días: una serie, sin leyenda (el título la nombra). */
export function SalesChart({ data }: { data: AdminStats["salesByDay"] }) {
  return (
    <div>
      <div className="h-72" role="img" aria-label="Gráfico de ingresos diarios de los últimos 30 días">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART} stopOpacity={0.22} />
                <stop offset="100%" stopColor={CHART} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e4dbcf" strokeDasharray="0" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#8a8178" }}
              tickFormatter={(d: string) => formatDate(`${d}T12:00:00`, { day: "numeric", month: "short" })}
              minTickGap={32}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tick={{ fontSize: 11, fill: "#8a8178" }}
              tickFormatter={(v: number) => (v ? `$${compact.format(v)}` : "0")}
            />
            <Tooltip
              cursor={{ stroke: "#141211", strokeOpacity: 0.25, strokeWidth: 1 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const point = payload[0].payload as AdminStats["salesByDay"][number];
                return (
                  <div className="rounded-xl border border-line bg-ivory px-3 py-2 text-xs shadow-lift">
                    <p className="text-stone">{formatDate(`${point.date}T12:00:00`, { weekday: "short", day: "numeric", month: "long" })}</p>
                    <p className="mt-1 text-sm font-semibold text-ink tabular-nums">{formatPrice(point.revenue)}</p>
                    <p className="text-ink-soft">{point.orders} {point.orders === 1 ? "pedido" : "pedidos"}</p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={CHART}
              strokeWidth={2}
              fill="url(#revenueFill)"
              activeDot={{ r: 5, stroke: "#faf7f2", strokeWidth: 2, fill: CHART }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <details className="mt-4 text-xs text-stone">
        <summary className="cursor-pointer font-semibold">Ver datos en tabla</summary>
        <table className="mt-3 w-full text-left">
          <thead>
            <tr className="border-b border-line text-ink-soft">
              <th className="py-1.5 font-semibold">Fecha</th>
              <th className="py-1.5 text-right font-semibold">Pedidos</th>
              <th className="py-1.5 text-right font-semibold">Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {data.filter((d) => d.orders > 0).map((d) => (
              <tr key={d.date} className="border-b border-line/60">
                <td className="py-1.5">{formatDate(`${d.date}T12:00:00`, { dateStyle: "medium" })}</td>
                <td className="py-1.5 text-right tabular-nums">{d.orders}</td>
                <td className="py-1.5 text-right tabular-nums">{formatPrice(d.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
