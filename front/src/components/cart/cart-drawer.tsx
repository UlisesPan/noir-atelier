"use client";

import Link from "next/link";
import { ShoppingBag, Trash2, Truck } from "lucide-react";
import { useHydrated } from "@/hooks/use-hydrated";
import { cartSubtotal, useCart } from "@/store/cart";
import { formatPrice, FREE_SHIPPING_FROM } from "@/lib/utils";
import { ButtonLink } from "../ui/button";
import { EmptyState, ProductImage, QuantityStepper } from "../ui/misc";
import { Sheet } from "../ui/sheet";

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const missing = FREE_SHIPPING_FROM - subtotal;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100);
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-2 text-xs text-ink-soft">
        <Truck className="size-4 text-gold-dark" />
        {missing > 0 ? (
          <span>
            Te faltan <strong className="text-ink">{formatPrice(missing)}</strong> para el envío gratis
          </span>
        ) : (
          <span className="font-semibold text-success">¡Tenés envío gratis!</span>
        )}
      </p>
      <div className="h-1 overflow-hidden rounded-full bg-sand" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-gold transition-[width] duration-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export function CartLines({ compact }: { compact?: boolean }) {
  const { items, setQuantity, remove, close } = useCart();
  return (
    <ul className="divide-y divide-line">
      {items.map((item) => (
        <li key={item.productId} className="flex gap-4 py-5">
          <Link
            href={`/shop/${item.slug}`}
            onClick={close}
            className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-xl bg-cream"
          >
            <ProductImage src={item.image} alt={item.name} sizes="80px" />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-3">
              <Link href={`/shop/${item.slug}`} onClick={close} className="font-display text-lg leading-tight hover:underline">
                {item.name}
              </Link>
              <button
                onClick={() => remove(item.productId)}
                className="-mr-1 cursor-pointer rounded-full p-1.5 text-stone transition hover:bg-ink/5 hover:text-danger"
                aria-label={`Quitar ${item.name}`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <p className="text-xs text-stone">{formatPrice(item.price)} c/u</p>
            <div className="mt-auto flex items-center justify-between pt-3">
              <QuantityStepper
                size={compact ? "sm" : "md"}
                value={item.quantity}
                max={Math.min(item.stock, 10)}
                onChange={(q) => setQuantity(item.productId, q)}
              />
              <span className="font-semibold tabular-nums">{formatPrice(item.price * item.quantity)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CartDrawer() {
  const { items, isOpen, close } = useCart();
  const hydrated = useHydrated();
  const subtotal = cartSubtotal(items);
  const empty = !hydrated || items.length === 0;

  return (
    <Sheet
      open={isOpen}
      onClose={close}
      title="Tu carrito"
      footer={
        !empty && (
          <div className="space-y-4">
            <FreeShippingMeter subtotal={subtotal} />
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-ink-soft">Subtotal</span>
              <span className="text-xl font-semibold tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ButtonLink href="/cart" variant="outline" onClick={close}>
                Ver carrito
              </ButtonLink>
              <ButtonLink href="/checkout" onClick={close}>
                Finalizar compra
              </ButtonLink>
            </div>
          </div>
        )
      }
    >
      {empty ? (
        <EmptyState
          icon={<ShoppingBag className="size-6" />}
          title="Tu carrito está vacío"
          description="Descubrí nuestras fragancias y encontrá la que va con vos."
          action={
            <ButtonLink href="/shop" onClick={close}>
              Explorar la tienda
            </ButtonLink>
          }
        />
      ) : (
        <div className="px-6">
          <CartLines compact />
        </div>
      )}
    </Sheet>
  );
}
