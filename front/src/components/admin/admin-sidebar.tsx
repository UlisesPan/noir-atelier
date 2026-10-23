"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, FolderTree, LayoutDashboard, LogOut, Package, ShoppingCart } from "lucide-react";
import { useLogout } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { Logo } from "../ui/misc";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/products", label: "Productos", icon: Package },
  { href: "/admin/categories", label: "Categorías", icon: FolderTree },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const logout = useLogout();
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <aside className="bg-ink text-ivory/70 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col">
      <div className="flex items-center justify-between px-6 py-5 lg:block lg:py-8">
        <Link href="/admin" className="flex items-center gap-3">
          <Logo light className="scale-90" />
          <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[0.6rem] font-semibold tracking-wider text-gold-light uppercase">Admin</span>
        </Link>
      </div>
      <nav aria-label="Administración" className="no-scrollbar flex gap-1 overflow-x-auto px-4 pb-4 lg:flex-1 lg:flex-col lg:pb-0">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition",
              isActive(href) ? "bg-ivory/10 text-ivory" : "hover:bg-ivory/5 hover:text-ivory",
            )}
          >
            <Icon className="size-4" /> {label}
          </Link>
        ))}
      </nav>
      <div className="hidden border-t border-ivory/10 p-4 text-sm lg:block">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 transition hover:bg-ivory/5 hover:text-ivory">
          <ExternalLink className="size-4" /> Ver tienda
        </Link>
        <button
          onClick={() => logout.mutate()}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 transition hover:bg-ivory/5 hover:text-ivory"
        >
          <LogOut className="size-4" /> Cerrar sesión
        </button>
        <p className="mt-3 truncate px-4 text-xs text-ivory/40">Sesión: {userName}</p>
      </div>
    </aside>
  );
}
