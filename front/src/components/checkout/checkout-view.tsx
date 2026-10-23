"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CreditCard, FlaskConical, Lock, MapPin, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useHydrated } from "@/hooks/use-hydrated";
import { useSession } from "@/hooks/use-session";
import { startPayment, type PaymentMode } from "@/lib/checkout";
import { api, errorMessage } from "@/lib/client";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { cartSubtotal, useCart } from "@/store/cart";
import { OrderSummary } from "../cart/order-summary";
import { Button, ButtonLink } from "../ui/button";
import { Field, Input } from "../ui/form";
import { EmptyState, ProductImage } from "../ui/misc";
import { Skeleton } from "../ui/skeleton";

export function CheckoutView() {
  const { user, isLoading } = useSession();
  const { items, clear } = useCart();
  const hydrated = useHydrated();
  const [address, setAddress] = useState<string | null>(null);
  const shippingAddress = address ?? user?.address ?? "";

  const { data: mode } = useQuery({
    queryKey: ["payment-mode"],
    queryFn: async () => (await api.get<{ mode: PaymentMode }>("/payments/mode")).mode,
    staleTime: Infinity,
  });

  const checkout = useMutation({
    mutationFn: async () => {
      const order = await api.post<Order>("/orders", {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: shippingAddress.trim(),
      });
      // La orden ya reservó el stock: el carrito se vacía y el pago puede reintentarse desde "Mis pedidos".
      clear();
      await startPayment(order.id);
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  if (!hydrated || isLoading) {
    return (
      <div className="container-page py-16">
        <Skeleton className="h-14 w-72" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_24rem]">
          <Skeleton className="h-96" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  if (items.length === 0 && !checkout.isPending && !checkout.isSuccess) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<ShoppingBag className="size-6" />}
          title="No hay nada para pagar"
          description="Tu carrito está vacío. Si ya creaste un pedido, podés pagarlo desde Mis pedidos."
          action={
            <div className="flex gap-3">
              <ButtonLink href="/shop">Ir a la tienda</ButtonLink>
              <ButtonLink href="/account/orders" variant="outline">Mis pedidos</ButtonLink>
            </div>
          }
        />
      </div>
    );
  }

  const subtotal = cartSubtotal(items);
  const addressValid = shippingAddress.trim().length >= 5;

  return (
    <div className="container-page py-12 lg:py-16">
      <p className="eyebrow">Checkout</p>
      <h1 className="mt-3 text-5xl">Finalizar compra</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-16">
        <div className="space-y-10">
          <Step number={1} title="Datos de envío" icon={<MapPin className="size-4" />}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nombre" htmlFor="name">
                <Input id="name" value={user?.name ?? ""} disabled />
              </Field>
              <Field label="Email" htmlFor="email">
                <Input id="email" value={user?.email ?? ""} disabled />
              </Field>
              <Field
                label="Dirección de entrega"
                htmlFor="address"
                className="sm:col-span-2"
                error={!addressValid ? "Ingresá una dirección válida" : undefined}
                hint="Usamos la dirección de tu perfil. Podés cambiarla solo para este pedido."
              >
                <Input id="address" value={shippingAddress} onChange={(e) => setAddress(e.target.value)} aria-invalid={!addressValid} />
              </Field>
            </div>
          </Step>

          <Step number={2} title="Revisá tu pedido" icon={<ShoppingBag className="size-4" />}>
            <ul className="divide-y divide-line rounded-[var(--radius-card)] border border-line">
              {items.map((i) => (
                <li key={i.productId} className="flex items-center gap-4 p-4">
                  <div className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden rounded-lg bg-cream">
                    <ProductImage src={i.image} alt={i.name} sizes="56px" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-lg leading-tight">{i.name}</p>
                    <p className="text-xs text-stone">Cantidad: {i.quantity}</p>
                  </div>
                  <span className="font-semibold tabular-nums">{formatPrice(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <Link href="/cart" className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">
              Modificar carrito
            </Link>
          </Step>

          <Step number={3} title="Pago" icon={<CreditCard className="size-4" />}>
            {mode === "simulated" ? (
              <div className="flex gap-4 rounded-[var(--radius-card)] border border-gold/40 bg-gold/5 p-5">
                <FlaskConical className="size-5 shrink-0 text-gold-dark" />
                <div className="text-sm">
                  <p className="font-semibold">Modo demo</p>
                  <p className="mt-1 text-muted">
                    Esta tienda es un proyecto de portfolio: vas a pasar por una pasarela simulada donde podés aprobar o rechazar
                    el pago. No se realiza ningún cobro.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 rounded-[var(--radius-card)] border border-line p-5">
                <CreditCard className="size-5 shrink-0 text-sky-700" />
                <div className="text-sm">
                  <p className="font-semibold">Mercado Pago (entorno de prueba)</p>
                  <p className="mt-1 text-muted">
                    Te redirigimos a Mercado Pago para pagar con tarjeta, dinero en cuenta o efectivo. Usá las tarjetas de
                    prueba de Mercado Pago: no se realiza ningún cobro real.
                  </p>
                </div>
              </div>
            )}
          </Step>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary subtotal={subtotal}>
            <Button
              size="lg"
              className="w-full"
              loading={checkout.isPending || checkout.isSuccess}
              disabled={!addressValid}
              onClick={() => checkout.mutate()}
            >
              <Lock className="size-4" /> Pagar {formatPrice(subtotal)}
            </Button>
            <p className="text-center text-xs text-stone">
              Al confirmar, reservamos el stock de tu pedido mientras completás el pago.
            </p>
          </OrderSummary>
        </aside>
      </div>
    </div>
  );
}

function Step({ number, title, icon, children }: { number: number; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`step-${number}`}>
      <h2 id={`step-${number}`} className="mb-5 flex items-center gap-3 font-sans text-sm font-semibold tracking-wide">
        <span className="grid size-8 place-items-center rounded-full bg-ink text-xs text-ivory">{number}</span>
        {title}
        <span className="text-stone">{icon}</span>
      </h2>
      {children}
    </section>
  );
}
