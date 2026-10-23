"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { ProductCard } from "../product/product-card";
import { ButtonLink } from "../ui/button";
import { EmptyState } from "../ui/misc";
import { Skeleton } from "../ui/skeleton";

export function WishlistView() {
  const { data, isPending } = useWishlist();

  if (isPending) {
    return (
      <div className="grid grid-cols-2 gap-6 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="aspect-[4/5] w-full rounded-[var(--radius-card)]" />
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        icon={<Heart className="size-6" />}
        title="Tu wishlist está vacía"
        description="Tocá el corazón en cualquier fragancia para guardarla y volver a ella cuando quieras."
        action={<ButtonLink href="/shop">Descubrir fragancias</ButtonLink>}
        className="rounded-[var(--radius-card)] border border-dashed border-line"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 xl:grid-cols-3">
      {data.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
