import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

export const MAX_PER_ITEM = 10;

export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  add: (product: Product, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

const clampQty = (qty: number, stock: number) => Math.max(1, Math.min(qty, stock, MAX_PER_ITEM));

/**
 * Carrito persistido en localStorage: funciona sin sesión (checkout como invitado hasta pagar).
 * Precio y stock son solo referencia visual: la API recalcula todo al crear la orden.
 */
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          const items = existing
            ? state.items.map((i) =>
                i.productId === product.id ? { ...i, quantity: clampQty(i.quantity + quantity, product.stock) } : i,
              )
            : [
                ...state.items,
                {
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  image: product.image,
                  price: product.price,
                  stock: product.stock,
                  quantity: clampQty(quantity, product.stock),
                },
              ];
          return { items, isOpen: true };
        }),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId ? { ...i, quantity: clampQty(quantity, i.stock) } : i)),
        })),
      remove: (productId) => set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "noir-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.quantity, 0);
export const cartSubtotal = (items: CartItem[]) => items.reduce((sum, i) => sum + i.price * i.quantity, 0);
