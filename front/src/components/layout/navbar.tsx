"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Heart, LayoutDashboard, LogOut, Menu, Package, Search, ShoppingBag, User } from "lucide-react";
import { useHydrated } from "@/hooks/use-hydrated";
import { useLogout, useSession } from "@/hooks/use-session";
import { cartCount, useCart } from "@/store/cart";
import { cn, formatPrice, FREE_SHIPPING_FROM, INSTALLMENTS } from "@/lib/utils";
import { Logo } from "../ui/misc";
import { Sheet } from "../ui/sheet";

const NAV = [
  { href: "/shop", label: "Tienda" },
  { href: "/shop?category=amaderadas", label: "Amaderadas" },
  { href: "/shop?category=florales", label: "Florales" },
  { href: "/shop?category=orientales", label: "Orientales" },
  { href: "/shop?sort=newest", label: "Novedades" },
];

const ANNOUNCEMENTS = [
  `Envío gratis en compras desde ${formatPrice(FREE_SHIPPING_FROM)}`,
  `${INSTALLMENTS} cuotas sin interés con todas las tarjetas`,
  "Muestra de regalo en cada pedido",
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="overflow-hidden bg-ink py-2 text-[0.7rem] font-medium tracking-[0.2em] text-ivory/80 uppercase">
        <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS, ...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((text, i) => (
            <span key={i} aria-hidden={i >= ANNOUNCEMENTS.length}>
              {text} <span className="ml-16 text-gold">✦</span>
            </span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line/70 bg-ivory/85 backdrop-blur-xl">
        <div className="container-page grid h-18 grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              className="-ml-2 cursor-pointer rounded-full p-2 transition hover:bg-ink/5 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="size-5" />
            </button>
            <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
              {NAV.slice(0, 4).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-[0.8rem] font-medium tracking-wide text-ink-soft transition hover:text-ink",
                    "after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform hover:after:scale-x-100",
                    pathname === item.href && "text-ink after:scale-x-100",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href="/" aria-label="Noir Atelier, inicio">
            <Logo />
          </Link>

          <div className="flex items-center justify-end gap-0.5">
            <IconButton label="Buscar" onClick={() => setSearchOpen((v) => !v)}>
              <Search className="size-[1.15rem]" />
            </IconButton>
            <UserMenu />
            <CartButton />
          </div>
        </div>
        {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
      </header>

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} title="Menú" side="left">
        <nav className="flex flex-col p-4" aria-label="Menú mobile">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3.5 font-display text-2xl transition hover:bg-cream"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Sheet>
    </>
  );
}

function IconButton({
  label,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      aria-label={label}
      className={cn("relative grid size-10 cursor-pointer place-items-center rounded-full transition hover:bg-ink/5", className)}
      {...props}
    >
      {children}
    </button>
  );
}

function SearchBar({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  return (
    <div className="border-t border-line/70 bg-ivory">
      <form
        className="container-page flex items-center gap-3 py-3"
        onSubmit={(e) => {
          e.preventDefault();
          const q = new FormData(e.currentTarget).get("q")?.toString().trim();
          router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
          onClose();
        }}
      >
        <Search className="size-4 text-stone" aria-hidden />
        <input
          name="q"
          autoFocus
          placeholder="Buscá por nombre, nota o familia olfativa… (ej: vainilla)"
          className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-stone"
          aria-label="Buscar productos"
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        />
        <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[0.65rem] text-stone sm:inline">Enter</kbd>
      </form>
    </div>
  );
}

function CartButton() {
  const items = useCart((s) => s.items);
  const open = useCart((s) => s.open);
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(items) : 0;
  return (
    <IconButton label={`Carrito, ${count} productos`} onClick={open}>
      <ShoppingBag className="size-[1.15rem]" />
      {count > 0 && (
        <span className="absolute top-0.5 right-0.5 grid size-4.5 place-items-center rounded-full bg-gold text-[0.6rem] font-bold text-ink">
          {count}
        </span>
      )}
    </IconButton>
  );
}

function UserMenu() {
  const { user, isAdmin } = useSession();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(pathname)}`}
        aria-label="Ingresar"
        className="grid size-10 place-items-center rounded-full transition hover:bg-ink/5"
      >
        <User className="size-[1.15rem]" />
      </Link>
    );
  }

  const links = [
    { href: "/account", label: "Mi cuenta", icon: User },
    { href: "/account/orders", label: "Mis pedidos", icon: Package },
    { href: "/account/wishlist", label: "Wishlist", icon: Heart },
    ...(isAdmin ? [{ href: "/admin", label: "Panel admin", icon: LayoutDashboard }] : []),
  ];

  return (
    <div ref={ref} className="relative">
      <IconButton label="Menú de usuario" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((v) => !v)}>
        <span className="grid size-7 place-items-center rounded-full bg-ink text-[0.7rem] font-bold text-ivory uppercase">
          {user.name.charAt(0)}
        </span>
      </IconButton>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 origin-top-right animate-fade-up rounded-2xl border border-line bg-ivory p-2 shadow-lift"
        >
          <div className="border-b border-line px-3 pt-2 pb-3">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-stone">{user.email}</p>
          </div>
          <div className="py-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-soft transition hover:bg-cream hover:text-ink"
              >
                <Icon className="size-4" /> {label}
              </Link>
            ))}
          </div>
          <button
            role="menuitem"
            onClick={() => logout.mutate()}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg border-t border-line px-3 py-2.5 text-sm text-ink-soft transition hover:bg-cream hover:text-ink"
          >
            <LogOut className="size-4" /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
