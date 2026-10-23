"use client";

import { Heart, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useToggleWishlist } from "@/hooks/use-wishlist";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MAX_PER_ITEM, useCart } from "@/store/cart";
import { Button } from "../ui/button";
import { QuantityStepper } from "../ui/misc";

export function WishlistButton({ product, className }: { product: Product; className?: string }) {
  const { isSaved, toggle } = useToggleWishlist(product);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggle();
      }}
      aria-pressed={isSaved}
      aria-label={isSaved ? `Quitar ${product.name} de la wishlist` : `Guardar ${product.name} en la wishlist`}
      className={cn(
        "grid size-10 cursor-pointer place-items-center rounded-full bg-ivory/90 shadow-soft backdrop-blur transition hover:scale-105",
        className,
      )}
    >
      <Heart className={cn("size-4.5 transition", isSaved ? "fill-wine text-wine" : "text-ink")} />
    </button>
  );
}

/** Botón rápido de la card: agrega 1 unidad. */
export function QuickAddButton({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  if (product.stock === 0) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        add(product);
      }}
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-ink/90 py-3 text-xs font-semibold tracking-wider text-ivory uppercase backdrop-blur transition hover:bg-ink"
    >
      <Plus className="size-3.5" /> Agregar al carrito
    </button>
  );
}

/** Selector de cantidad + agregar al carrito de la página de producto. */
export function AddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { add, items } = useCart();
  const inCart = items.find((i) => i.productId === product.id)?.quantity ?? 0;
  const max = Math.max(0, Math.min(product.stock, MAX_PER_ITEM) - inCart);

  if (product.stock === 0) {
    return (
      <Button size="lg" disabled className="w-full">
        Sin stock
      </Button>
    );
  }

  return (
    <div className="flex gap-3">
      <QuantityStepper value={Math.min(quantity, Math.max(1, max))} max={Math.max(1, max)} onChange={setQuantity} />
      <Button
        size="lg"
        className="flex-1"
        disabled={max === 0}
        onClick={() => {
          add(product, quantity);
          setQuantity(1);
          toast.success(`${product.name} agregado al carrito`);
        }}
      >
        <ShoppingBag className="size-4" />
        {max === 0 ? "Máximo en el carrito" : "Agregar al carrito"}
      </Button>
    </div>
  );
}
