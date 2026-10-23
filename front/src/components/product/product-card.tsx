import Link from "next/link";
import type { Product } from "@/lib/types";
import { cn, discountPercent } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Price, ProductImage } from "../ui/misc";
import { Stars } from "../ui/stars";
import { QuickAddButton, WishlistButton } from "./product-actions";

export function ProductCard({ product, priority, className }: { product: Product; priority?: boolean; className?: string }) {
  const off = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock === 0;

  return (
    <article className={cn("group relative", className)}>
      <Link href={`/shop/${product.slug}`} className="block" aria-label={product.name}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-cream">
          <ProductImage
            src={product.image}
            alt={product.name}
            priority={priority}
            className={cn("transition-transform duration-700 ease-out group-hover:scale-[1.04]", soldOut && "opacity-60 grayscale-[40%]")}
          />
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {soldOut && <Badge tone="dark">Agotado</Badge>}
            {!soldOut && off > 0 && <Badge className="bg-wine text-ivory">-{off}%</Badge>}
            {!soldOut && product.stock <= 5 && <Badge tone="gold" className="bg-ivory/90">Últimas unidades</Badge>}
          </div>
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100 max-lg:hidden">
            <QuickAddButton product={product} />
          </div>
        </div>
      </Link>
      <WishlistButton product={product} className="absolute top-3 right-3" />

      <div className="mt-4 space-y-1 px-0.5">
        <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-stone uppercase">
          {product.category?.name ?? "Eau de parfum"} · {product.volumeMl} ml
        </p>
        <h3 className="font-display text-xl leading-snug">
          <Link href={`/shop/${product.slug}`} className="hover:underline hover:decoration-gold hover:underline-offset-4">
            {product.name}
          </Link>
        </h3>
        {product.ratingCount > 0 && (
          <p className="flex items-center gap-1.5 text-xs text-stone">
            <Stars value={product.ratingAvg} size={12} /> ({product.ratingCount})
          </p>
        )}
        <Price value={product.price} compareAt={product.compareAtPrice} className="pt-1" />
      </div>
    </article>
  );
}

export function ProductGrid({ products, className }: { products: Product[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4", className)}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  );
}
