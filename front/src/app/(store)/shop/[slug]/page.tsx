import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, CreditCard, Gift, RotateCcw, Truck } from "lucide-react";
import { AddToCart, WishlistButton } from "@/components/product/product-actions";
import { ProductCard } from "@/components/product/product-card";
import { ReviewsSection } from "@/components/product/reviews";
import { Badge } from "@/components/ui/badge";
import { Price, ProductImage } from "@/components/ui/misc";
import { Stars } from "@/components/ui/stars";
import { ApiError } from "@/lib/api-error";
import { getProduct, getRelatedProducts, getReviews } from "@/lib/server/api";
import { formatPrice, FREE_SHIPPING_FROM, GENDER_LABEL, INSTALLMENTS } from "@/lib/utils";

const loadProduct = async (slug: string) => {
  try {
    return await getProduct(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
};

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const product = await loadProduct((await params).slug);
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: `${product.name} · Noir Atelier`, description: product.description },
  };
}

const PYRAMID: { key: "top" | "heart" | "base"; label: string }[] = [
  { key: "top", label: "Salida" },
  { key: "heart", label: "Corazón" },
  { key: "base", label: "Fondo" },
];

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  const [related, reviews] = await Promise.all([getRelatedProducts(slug), getReviews(product.id)]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: { "@type": "Brand", name: "Noir Atelier" },
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(product.ratingCount > 0 && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: product.ratingAvg, reviewCount: product.ratingCount },
    }),
  };

  return (
    <div className="container-page py-8 lg:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <nav aria-label="Migas de pan" className="mb-8 flex items-center gap-1.5 text-xs text-stone">
        <Link href="/" className="hover:text-ink">Inicio</Link>
        <ChevronRight className="size-3" />
        <Link href="/shop" className="hover:text-ink">Tienda</Link>
        {product.category && (
          <>
            <ChevronRight className="size-3" />
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-ink">{product.category.name}</Link>
          </>
        )}
        <ChevronRight className="size-3" />
        <span className="text-ink" aria-current="page">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream">
            <ProductImage src={product.image} alt={product.name} priority sizes="(min-width: 1024px) 50vw, 100vw" />
            <WishlistButton product={product} className="absolute top-5 right-5 size-12" />
          </div>
        </div>

        <div className="animate-fade-up">
          <div className="flex flex-wrap items-center gap-2">
            {product.category && <Badge tone="gold">{product.category.name}</Badge>}
            <Badge>{GENDER_LABEL[product.gender]}</Badge>
            {product.featured && <Badge tone="dark">Destacado</Badge>}
          </div>
          <h1 className="mt-5 text-5xl leading-[1.05] sm:text-6xl">{product.name}</h1>
          <p className="mt-2 text-sm text-stone">Eau de parfum · {product.volumeMl} ml</p>

          {product.ratingCount > 0 && (
            <a href="#reviews" className="mt-4 inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
              <Stars value={product.ratingAvg} />
              <span className="underline-offset-4 hover:underline">
                {product.ratingAvg.toFixed(1)} · {product.ratingCount} {product.ratingCount === 1 ? "reseña" : "reseñas"}
              </span>
            </a>
          )}

          <div className="mt-8 border-y border-line py-6">
            <Price value={product.price} compareAt={product.compareAtPrice} size="lg" />
            <p className="mt-2 text-sm text-ink-soft">
              {INSTALLMENTS} cuotas sin interés de <strong>{formatPrice(product.price / INSTALLMENTS)}</strong>
            </p>
          </div>

          <p className="mt-6 leading-relaxed text-ink-soft">{product.description}</p>

          <div className="mt-8">
            <p className="text-[0.7rem] font-semibold tracking-[0.22em] uppercase">Pirámide olfativa</p>
            <dl className="mt-4 grid grid-cols-3 gap-3">
              {PYRAMID.map(({ key, label }, i) => (
                <div key={key} className="rounded-2xl bg-cream/80 p-4">
                  <dt className="flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-[0.18em] text-gold-dark uppercase">
                    <span className="font-display text-base">0{i + 1}</span> {label}
                  </dt>
                  <dd className="mt-2 text-sm leading-snug">{product.notes[key].join(", ") || "—"}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-8 space-y-3">
            <AddToCart product={product} />
            <p className="text-xs text-stone">
              {product.stock === 0
                ? "Sin stock por el momento."
                : product.stock <= 5
                  ? `¡Últimas ${product.stock} unidades!`
                  : "En stock · despacho en 24 h hábiles"}
            </p>
          </div>

          <ul className="mt-8 grid gap-3 rounded-[var(--radius-card)] border border-line p-5 text-sm sm:grid-cols-2">
            {[
              { icon: Truck, text: `Envío gratis desde ${formatPrice(FREE_SHIPPING_FROM)}` },
              { icon: CreditCard, text: "Pago seguro con Mercado Pago" },
              { icon: Gift, text: "Estuche de regalo incluido" },
              { icon: RotateCcw, text: "30 días para cambios" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 text-ink-soft">
                <Icon className="size-4 shrink-0 text-gold-dark" strokeWidth={1.5} /> {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-20">
        <ReviewsSection product={product} initial={reviews} />
      </div>

      {related.length > 0 && (
        <section className="border-t border-line py-20" aria-labelledby="related-title">
          <p className="eyebrow">También te puede gustar</p>
          <h2 id="related-title" className="mt-3 mb-10 text-4xl">Fragancias afines</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
