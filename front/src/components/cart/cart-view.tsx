"use client";

import { ArrowRight, Lock, ShoppingBag } from "lucide-react";
import { CartLines, FreeShippingMeter } from "@/components/cart/cart-drawer";
import { OrderSummary } from "@/components/cart/order-summary";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import { Skeleton } from "@/components/ui/skeleton";
import { useHydrated } from "@/hooks/use-hydrated";
import { cartCount, cartSubtotal, useCart } from "@/store/cart";

export function CartView() {
  const items = useCart((s) => s.items);
  const hydrated = useHydrated();
  const subtotal = cartSubtotal(items);

  if (!hydrated) {
    return (
      <div className="container-page py-16">
        <Skeleton className="h-14 w-72" />
        <Skeleton className="mt-10 h-64 w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<ShoppingBag className="size-6" />}
          title="Tu carrito está vacío"
          description="Todavía no agregaste fragancias. Te ayudamos a encontrar la tuya."
          action={<ButtonLink href="/shop">Explorar la tienda</ButtonLink>}
        />
      </div>
    );
  }

  return (
    <div className="container-page py-12 lg:py-16">
      <p className="eyebrow">Carrito</p>
      <h1 className="mt-3 text-5xl">
        Tu selección <span className="text-stone">({cartCount(items)})</span>
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-16">
        <div>
          <FreeShippingMeter subtotal={subtotal} />
          <div className="mt-4 border-t border-line">
            <CartLines />
          </div>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary subtotal={subtotal}>
            <ButtonLink href="/checkout" size="lg" className="w-full">
              Finalizar compra <ArrowRight className="size-4" />
            </ButtonLink>
            <p className="flex items-center justify-center gap-1.5 text-xs text-stone">
              <Lock className="size-3" /> Pago seguro con Mercado Pago
            </p>
          </OrderSummary>
        </aside>
      </div>
    </div>
  );
}
