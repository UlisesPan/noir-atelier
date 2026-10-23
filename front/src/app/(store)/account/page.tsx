import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/account/profile-form";
import { apiFetch } from "@/lib/server/api";
import { getCurrentUser, getToken } from "@/lib/server/session";
import type { Order, Paginated } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Mi cuenta" };

export default async function AccountPage() {
  const [user, token] = await Promise.all([getCurrentUser(), getToken()]);
  if (!user || !token) redirect("/login?next=/account");

  const orders = await apiFetch<Paginated<Order>>("/orders?limit=100", { token });
  const paid = orders.data.filter((o) => !["pending", "cancelled"].includes(o.status));
  const stats = [
    { label: "Pedidos realizados", value: String(paid.length) },
    { label: "Total invertido", value: formatPrice(paid.reduce((s, o) => s + o.total, 0)) },
    { label: "Miembro desde", value: formatDate(user.createdAt, { month: "long", year: "numeric" }) },
  ];

  return (
    <div className="space-y-10">
      <dl className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[var(--radius-card)] bg-cream/70 p-5">
            <dt className="text-xs text-stone">{s.label}</dt>
            <dd className="mt-2 font-display text-3xl capitalize">{s.value}</dd>
          </div>
        ))}
      </dl>
      <section className="rounded-[var(--radius-card)] border border-line p-6 sm:p-8">
        <h2 className="text-3xl">Datos personales</h2>
        <p className="mt-1 mb-8 text-sm text-muted">Usamos estos datos para tus envíos y facturación.</p>
        <ProfileForm user={user} />
      </section>
    </div>
  );
}
