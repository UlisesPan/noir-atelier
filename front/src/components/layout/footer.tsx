import Link from "next/link";
import { CreditCard, Gift, RotateCcw, Truck } from "lucide-react";
import { formatPrice, FREE_SHIPPING_FROM, INSTALLMENTS } from "@/lib/utils";
import { Logo } from "../ui/misc";

const PERKS = [
  { icon: Truck, title: "Envío gratis", text: `En compras desde ${formatPrice(FREE_SHIPPING_FROM)}` },
  { icon: CreditCard, title: `${INSTALLMENTS} cuotas sin interés`, text: "Pagá seguro con Mercado Pago" },
  { icon: Gift, title: "Muestra de regalo", text: "Probá una fragancia nueva en cada pedido" },
  { icon: RotateCcw, title: "Cambios sin costo", text: "Tenés 30 días para cambiar tu perfume" },
];

const COLUMNS = [
  {
    title: "Tienda",
    links: [
      { href: "/shop", label: "Todas las fragancias" },
      { href: "/shop?sort=newest", label: "Novedades" },
      { href: "/shop?sort=rating", label: "Mejor valoradas" },
      { href: "/shop?featured=true", label: "Destacadas" },
    ],
  },
  {
    title: "Familias",
    links: [
      { href: "/shop?category=amaderadas", label: "Amaderadas" },
      { href: "/shop?category=citricas", label: "Cítricas" },
      { href: "/shop?category=orientales", label: "Orientales" },
      { href: "/shop?category=florales", label: "Florales" },
      { href: "/shop?category=acuaticas", label: "Acuáticas" },
    ],
  },
  {
    title: "Mi cuenta",
    links: [
      { href: "/account", label: "Perfil" },
      { href: "/account/orders", label: "Mis pedidos" },
      { href: "/account/wishlist", label: "Wishlist" },
      { href: "/cart", label: "Carrito" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto">
      <section className="border-y border-line bg-cream/60">
        <div className="container-page grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-4">
          {PERKS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-gold-dark" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-0.5 text-xs text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-ivory/70">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="space-y-5">
            <Logo light className="items-start" />
            <p className="max-w-xs text-sm leading-relaxed">
              Perfumería de autor. Fragancias concebidas en pequeños lotes para quienes entienden el perfume como una firma
              personal.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="mb-4 font-sans text-[0.7rem] font-semibold tracking-[0.25em] text-gold-light uppercase">
                {col.title}
              </h3>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition hover:text-ivory">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-ivory/10">
          <div className="container-page flex flex-col gap-2 py-6 text-xs text-ivory/50 sm:flex-row sm:justify-between">
            <p>© {new Date().getFullYear()} Noir Atelier. Proyecto de portfolio — marca ficticia.</p>
            <p>Hecho con Next.js, NestJS y PostgreSQL.</p>
          </div>
        </div>
      </section>
    </footer>
  );
}
