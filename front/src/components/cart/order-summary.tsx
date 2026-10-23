import { formatPrice, FREE_SHIPPING_FROM, INSTALLMENTS } from "@/lib/utils";

/** Resumen de importes. La API recalcula el total real al crear la orden. */
export function OrderSummary({ subtotal, children }: { subtotal: number; children?: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-[var(--radius-card)] bg-cream/70 p-6">
      <h2 className="font-display text-2xl">Resumen</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-soft">Subtotal</dt>
          <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-soft">Envío</dt>
          <dd className="tabular-nums">{subtotal >= FREE_SHIPPING_FROM ? <span className="font-semibold text-success">Gratis</span> : "A coordinar"}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-line pt-4">
          <dt className="font-semibold">Total</dt>
          <dd className="text-2xl font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <p className="text-right text-xs text-stone">
          o {INSTALLMENTS} cuotas sin interés de {formatPrice(subtotal / INSTALLMENTS)}
        </p>
      </dl>
      {children}
    </div>
  );
}
