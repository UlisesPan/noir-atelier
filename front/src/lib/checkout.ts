import { api } from "./client";
import type { Order } from "./types";

export type PaymentMode = "mercadopago" | "simulated";

/** Inicia el pago de una orden pendiente y redirige al checkout (Mercado Pago o simulado). */
export async function startPayment(orderId: number) {
  const { url } = await api.post<{ mode: PaymentMode; url: string }>(`/payments/checkout/${orderId}`);
  // Solo redirigimos a destinos esperados: nuestro propio sitio o Mercado Pago.
  const target = new URL(url, window.location.origin);
  const allowed = target.origin === window.location.origin || /(^|\.)mercadopago\.com(\.ar)?$/.test(target.hostname);
  if (!allowed) throw new Error("Destino de pago inválido");
  window.location.assign(target.toString());
}

export const cancelOrder = (orderId: number) => api.post<Order>(`/orders/${orderId}/cancel`);
