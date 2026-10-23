import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getCurrentUser } from "@/lib/server/session";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin Noir Atelier" }, robots: { index: false } };

/** Verificación real de rol en el servidor (el proxy solo hace un chequeo optimista). */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/");

  return (
    <div className="flex min-h-dvh flex-col bg-cream/40 lg:flex-row">
      <AdminSidebar userName={user.name} />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-10">{children}</main>
    </div>
  );
}
