"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import fallbackImage from "@/app/helpers/fallbackImage";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/services/order";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, getIdItems } = useCart();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [totalSummary, setTotalSummary] = useState({ quantity: 0, total: 0 });
  const total = cartItems.reduce((sum, product) => sum + product.price, 0);
  const { dataUser } = useAuth();

  const handleCheckout = async () => {
    if (!dataUser?.token) {
      alert("Debes iniciar sesión para continuar con la compra.");
      return;
    }

    setCheckoutLoading(true);
    const purchasedQuantity = cartItems.length;
    const purchasedTotal = total;

    try {
      const orderData = await createOrder(getIdItems(), dataUser.token);
      setOrderNumber(orderData?.id );
      setTotalSummary({ quantity: purchasedQuantity, total: purchasedTotal });
      clearCart();
      setShowConfirmation(true);
    } catch {
      alert("No se pudo completar la compra. Intentá de nuevo más tarde.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-accent">Carrito</p>
            <h1 className="text-3xl font-semibold">Resumen de tu compra</h1>
            <p className="mt-2 text-sm text-text/75">
              {cartItems.length
                ? `Tienes ${cartItems.length} producto${cartItems.length > 1 ? "s" : ""} en tu carrito.`
                : "Aún no agregaste productos al carrito."}
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center justify-center rounded-full border border-border bg-white px-5 py-3 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
            >
              Vaciar carrito
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-[28px] border border-border bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-foreground">Tu carrito está vacío</p>
            <p className="mt-2 text-sm text-text/70">
              Agrega productos desde la tienda y vuelve aquí para revisar tu orden.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.8fr_0.9fr]">
            <div className="space-y-5">
              {cartItems.map((product) => (
                <article
                  key={product.id}
                  className="grid gap-4 rounded-[28px] border border-border bg-white p-5 shadow-sm transition hover:shadow-md sm:grid-cols-[140px_minmax(0,1fr)]"
                >
                  <div className="h-36 w-full overflow-hidden rounded-3xl bg-background">
                    <Image
                      src={product.image || fallbackImage}
                      alt={product.name}
                      width={280}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="grid gap-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">{product.name}</h2>
                        <p className="mt-1 text-sm text-text">{product.description}</p>
                      </div>
                      <span className="text-lg font-semibold text-accent">${product.price}</span>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="w-full rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent sm:w-auto"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="rounded-[28px] border border-border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground">Total del pedido</h2>
              <div className="mt-5 space-y-4 text-sm text-text">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">${total.toFixed(2)}</span>
                </div>
                <div className="rounded-3xl bg-background p-4">
                  <p className="text-sm text-text/80">El total se actualiza automáticamente al eliminar productos.</p>
                </div>
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-semibold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                disabled={cartItems.length === 0 || checkoutLoading}
                onClick={handleCheckout}
              >
                {checkoutLoading ? "Procesando compra..." : "Continuar compra"}
              </button>
            </aside>
          </div>
        )}
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-4xl bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Compra confirmada</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950">¡Listo! Tu pedido está en camino.</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Recibiste la confirmación y tu orden ya está registrada en el sistema.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-emerald-50 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-700">Estado</p>
                <p className="mt-3 text-lg font-semibold text-emerald-900">Confirmada</p>
                {orderNumber && <p className="mt-2 text-sm text-slate-600">N° de orden: #{orderNumber}</p>}
              </div>
              <div className="rounded-[28px] bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Tu resumen</p>
                <p className="mt-3 text-lg font-semibold text-slate-950">{totalSummary.quantity} productos</p>
                <p className="mt-2 text-sm text-slate-600">Total pagado: ${totalSummary.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
