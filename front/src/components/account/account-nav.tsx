"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LogOut, Package, User } from "lucide-react";
import { useLogout } from "@/hooks/use-session";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/account", label: "Perfil", icon: User },
  { href: "/account/orders", label: "Pedidos", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
];

export function AccountNav() {
  const pathname = usePathname();
  const logout = useLogout();
  const isActive = (href: string) => (href === "/account" ? pathname === href : pathname.startsWith(href));

  return (
    <nav aria-label="Mi cuenta" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
      {LINKS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={isActive(href) ? "page" : undefined}
          className={cn(
            "flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition lg:rounded-xl",
            isActive(href) ? "bg-ink text-ivory" : "text-ink-soft hover:bg-cream hover:text-ink",
          )}
        >
          <Icon className="size-4" /> {label}
        </Link>
      ))}
      <button
        onClick={() => logout.mutate()}
        className="flex shrink-0 cursor-pointer items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-cream hover:text-ink lg:mt-4 lg:rounded-xl lg:border-t lg:border-line"
      >
        <LogOut className="size-4" /> Cerrar sesión
      </button>
    </nav>
  );
}
