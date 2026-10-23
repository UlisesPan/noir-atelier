import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { getCategories, getProducts } from "@/lib/server/api";
import { INSTALLMENTS } from "@/lib/utils";

const FAMILY_IMAGE: Record<string, string> = {
  amaderadas: "/products/cedro-de-patagonia.svg",
  citricas: "/products/bergamota-del-sur.svg",
  orientales: "/products/ambar-dorado.svg",
  florales: "/products/rosa-velada.svg",
  acuaticas: "/products/brisa-atlantica.svg",
};

const PYRAMID = [
  { level: "Salida", time: "0 – 15 min", text: "La primera impresión: notas volátiles y luminosas, como cítricos y especias frescas.", notes: "Pimienta negra · Cardamomo" },
  { level: "Corazón", time: "15 min – 4 h", text: "El carácter del perfume. Emergen las flores, las maderas nobles y los acordes principales.", notes: "Cuero · Iris" },
  { level: "Fondo", time: "4 h en adelante", text: "La estela que queda en la piel: resinas, maderas profundas y almizcles que perduran.", notes: "Oud · Vetiver ahumado" },
];

export default async function HomePage() {
  const [featured, newest, categories] = await Promise.all([
    getProducts({ featured: true, limit: 4 }),
    getProducts({ sort: "rating", limit: 8 }),
    getCategories(),
  ]);

  return (
    <>
      {/* ───── Hero ───── */}
      <section className="relative overflow-hidden bg-ink text-ivory">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(60%_80%_at_75%_40%,rgb(176_141_87/0.28),transparent_70%),radial-gradient(40%_50%_at_10%_90%,rgb(122_46_58/0.25),transparent_70%)]"
        />
        <div className="container-page relative grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div className="animate-fade-up space-y-8">
            <p className="eyebrow text-gold-light">Colección Otoño · Invierno 2026</p>
            <h1 className="text-[clamp(3rem,7vw,6rem)] leading-[0.95] font-medium">
              El arte de <br />
              dejar <em className="font-normal text-gold-light">huella.</em>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-ivory/70">
              Fragancias de autor concebidas en pequeños lotes. Cada frasco cuenta una historia en tres actos: salida,
              corazón y fondo.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/shop" variant="gold" size="lg">
                Explorar colección <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/shop/obsidiana-nocturna" variant="outline" size="lg" className="border-ivory/25 text-ivory hover:border-ivory/60 hover:bg-ivory/5">
                Conocé nuestra firma
              </ButtonLink>
            </div>
            <dl className="grid max-w-md grid-cols-3 gap-6 border-t border-ivory/10 pt-8">
              {[
                [String(newest.meta.total), "fragancias de autor"],
                [String(categories.length), "familias olfativas"],
                [String(INSTALLMENTS), "cuotas sin interés"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="font-display text-3xl text-ivory">{value}</dd>
                  <dd className="mt-1 text-xs text-ivory/55">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-xl animate-fade-up [animation-delay:150ms]">
            <div className="relative aspect-[6/5] overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_50%_35%,#efe5d6,#c9b9a4)] shadow-2xl shadow-black/40">
              <Image src="/products/hero.svg" alt="Tres fragancias de la colección Noir Atelier" fill priority unoptimized className="object-contain p-6" />
            </div>
            <Link
              href="/shop/obsidiana-nocturna"
              className="absolute -bottom-5 left-6 flex items-center gap-3 rounded-2xl bg-ivory/95 px-4 py-3 text-ink shadow-lift backdrop-blur transition hover:-translate-y-0.5 sm:left-auto sm:-right-4"
            >
              <span className="grid size-10 place-items-center rounded-full bg-ink text-gold-light">✦</span>
              <span>
                <span className="block text-[0.65rem] font-semibold tracking-[0.2em] text-stone uppercase">La firma</span>
                <span className="font-display text-lg leading-none">Obsidiana Nocturna</span>
              </span>
              <ArrowUpRight className="size-4 text-stone" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───── Familias ───── */}
      <section className="container-page py-20 lg:py-28">
        <SectionHeading eyebrow="Familias olfativas" title="Encontrá tu familia" href="/shop" cta="Ver toda la tienda" />
        <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="group relative aspect-[3/4] w-[62%] shrink-0 snap-start overflow-hidden rounded-[var(--radius-card)] sm:w-auto"
            >
              <Image
                src={FAMILY_IMAGE[c.slug] ?? "/products/hero.svg"}
                alt=""
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
                <h3 className="font-display text-2xl">{c.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-ivory/75">{c.description}</p>
                <p className="mt-3 flex items-center gap-1 text-[0.65rem] font-semibold tracking-[0.2em] uppercase">
                  {c.productCount} fragancias <ArrowRight className="size-3 transition group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ───── Destacados ───── */}
      <section className="bg-cream/60 py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Los favoritos" title="Elegidos por nuestra comunidad" href="/shop?featured=true" cta="Ver destacados" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {featured.data.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ───── Pirámide olfativa ───── */}
      <section className="container-page grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream">
          <Image src="/products/obsidiana-nocturna.svg" alt="Obsidiana Nocturna" fill unoptimized className="object-cover" />
        </div>
        <div>
          <p className="eyebrow">Cómo leer un perfume</p>
          <h2 className="mt-4 text-5xl leading-tight">La pirámide olfativa</h2>
          <p className="mt-5 max-w-lg text-muted">
            Un perfume no huele igual en el minuto uno que a las seis horas. Cada ficha de producto te muestra sus tres
            capas para que elijas con criterio.
          </p>
          <ol className="mt-10 space-y-0">
            {PYRAMID.map((step, i) => (
              <li key={step.level} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-6 last:border-b">
                <span className="font-display text-3xl text-gold">0{i + 1}</span>
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-2xl">{step.level}</h3>
                    <span className="text-xs tracking-wider text-stone uppercase">{step.time}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{step.text}</p>
                  <p className="mt-2 text-xs font-semibold text-gold-dark">En Obsidiana Nocturna: {step.notes}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───── Mejor valorados ───── */}
      <section className="border-t border-line py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Mejor valorados" title="Lo que más se repite" href="/shop?sort=rating" cta="Ver ranking" />
        </div>
        <div className="no-scrollbar container-page flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
          {newest.data.map((p) => (
            <ProductCard key={p.id} product={p} className="w-[70%] shrink-0 snap-start sm:w-[40%] lg:w-[23%]" />
          ))}
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="container-page pb-20 lg:pb-28">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-16 text-center text-ivory sm:px-16">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_0%,rgb(176_141_87/0.35),transparent)]" />
          <div className="relative mx-auto max-w-2xl space-y-6">
            <p className="eyebrow text-gold-light">Regalos con firma</p>
            <h2 className="text-4xl sm:text-5xl">Un perfume es el regalo que se recuerda</h2>
            <p className="text-ivory/70">
              Todos los pedidos viajan en nuestro estuche negro con lazo dorado y una muestra para descubrir otra fragancia.
            </p>
            <ButtonLink href="/shop" variant="gold" size="lg">
              Elegir un regalo
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ eyebrow, title, href, cta }: { eyebrow: string; title: string; href: string; cta: string }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 text-4xl sm:text-5xl">{title}</h2>
      </div>
      <Link href={href} className="group flex items-center gap-1.5 text-sm font-semibold">
        {cta} <ArrowRight className="size-4 transition group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
