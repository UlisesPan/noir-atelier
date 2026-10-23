import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Gender, OrderStatus } from "./types";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export const formatPrice = (value: number) => currency.format(value);

export const formatDate = (value: string | Date, opts: Intl.DateTimeFormatOptions = { dateStyle: "long" }) =>
  new Intl.DateTimeFormat("es-AR", opts).format(new Date(value));

/** Cuotas sin interés mostradas en el catálogo. */
export const INSTALLMENTS = 3;
export const FREE_SHIPPING_FROM = 150_000;

export const discountPercent = (price: number, compareAt: number | null) =>
  compareAt && compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0;

export const GENDER_LABEL: Record<Gender, string> = {
  masculine: "Masculino",
  feminine: "Femenino",
  unisex: "Unisex",
};

export const ORDER_STATUS: Record<OrderStatus, { label: string; tone: "neutral" | "gold" | "success" | "danger" | "info" }> = {
  pending: { label: "Pendiente de pago", tone: "gold" },
  paid: { label: "Pagado", tone: "success" },
  shipped: { label: "Enviado", tone: "info" },
  delivered: { label: "Entregado", tone: "neutral" },
  cancelled: { label: "Cancelado", tone: "danger" },
};

/** Las imágenes de producto pueden ser rutas locales (SVG) o URLs remotas permitidas. */
const OPTIMIZABLE_HOSTS = ["images.unsplash.com", "res.cloudinary.com"];
export const isOptimizableImage = (src: string) => {
  if (src.startsWith("/")) return true;
  try {
    return OPTIMIZABLE_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
};
