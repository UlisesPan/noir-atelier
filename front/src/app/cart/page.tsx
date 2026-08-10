"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import fallbackImage from "@/app/helpers/fallbackImage";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/services/order";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, getIdItems } = useCart();
  const total = cartItems.reduce((sum, product) => sum + product.price, 0);
  const { dataUser } = useAuth();

  const handleCheckout = async () => {
    if (!dataUser?.token) {
      alert("Debes iniciar sesión para continuar con la compra.");
      return;
    }
    await createOrder( getIdItems(), dataUser.token)
    clearCart();
  };

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] py-8">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[color:var(--accent)]">Carrito</p>
            <h1 className="text-3xl font-semibold">Resumen de tu compra</h1>
            <p className="mt-2 text-sm text-[color:var(--text)]/75">
              {cartItems.length
                ? `Tienes ${cartItems.length} producto${cartItems.length > 1 ? "s" : ""} en tu carrito.`
                : "Aún no agregaste productos al carrito."}
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-white px-5 py-3 text-sm font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              Vaciar carrito
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-[28px] border border-[color:var(--border)] bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-[color:var(--foreground)]">Tu carrito está vacío</p>
            <p className="mt-2 text-sm text-[color:var(--text)]/70">
              Agrega productos desde la tienda y vuelve aquí para revisar tu orden.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.8fr_0.9fr]">
            <div className="space-y-5">
              {cartItems.map((product) => (
                <article
                  key={product.id}
                  className="grid gap-4 rounded-[28px] border border-[color:var(--border)] bg-white p-5 shadow-sm transition hover:shadow-md sm:grid-cols-[140px_minmax(0,1fr)]"
                >
                  <div className="h-36 w-full overflow-hidden rounded-[24px] bg-[color:var(--background)]">
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
                        <h2 className="text-xl font-semibold text-[color:var(--foreground)]">{product.name}</h2>
                        <p className="mt-1 text-sm text-[color:var(--text)]">{product.description}</p>
                      </div>
                      <span className="text-lg font-semibold text-[color:var(--accent)]">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p
                        className="text-sm font-medium  text-green-600 "
                      >
                        
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="w-full rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] sm:w-auto"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="rounded-[28px] border-border-[color:var(--border)] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground)">Total del pedido</h2>
              <div className="mt-5 space-y-4 text-sm text-text">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">${total.toFixed(2)}</span>
                </div>
                <div className="rounded-3xl bg-background p-4">
                  <p className="text-sm text-[color:var(--text)]/80">
                    El total se actualiza automáticamente al eliminar productos.
                  </p>
                </div>
              </div>

              <button
                type="button"  
                className="mt-6 w-full rounded-full bg-[color:var(--primary)] py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--accent)]"
                disabled={cartItems.length === 0}
                onClick={handleCheckout}
              >
                Continuar compra
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
