import "server-only";
import { ApiError, extractMessage } from "../api-error";
import type { Category, Paginated, Product, ProductFilters, Review } from "../types";

export const API_URL = process.env.API_URL ?? "http://localhost:3100";

interface ApiFetchOptions extends RequestInit {
  token?: string;
  /** Segundos de revalidación (ISR). Por defecto no se cachea. */
  revalidate?: number;
  tags?: string[];
}

/** Fetch del lado del servidor hacia la API. */
export async function apiFetch<T>(path: string, { token, revalidate, tags, headers, ...init }: ApiFetchOptions = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    ...(revalidate !== undefined ? { next: { revalidate, tags } } : { cache: "no-store" as const }),
  });
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, extractMessage(body));
  return body as T;
}

export const toQueryString = (params: object) => {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") qs.set(key, String(value));
  }
  const str = qs.toString();
  return str ? `?${str}` : "";
};

// ─── Catálogo (público, cacheado 60 s) ───

export const getProducts = (filters: ProductFilters = {}) =>
  apiFetch<Paginated<Product>>(`/products${toQueryString(filters)}`, { revalidate: 60, tags: ["products"] });

export const getProduct = (slug: string) =>
  apiFetch<Product>(`/products/${encodeURIComponent(slug)}`, { revalidate: 60, tags: ["products"] });

export const getRelatedProducts = (slug: string) =>
  apiFetch<Product[]>(`/products/${encodeURIComponent(slug)}/related`, { revalidate: 300, tags: ["products"] });

export const getCategories = () => apiFetch<Category[]>("/categories", { revalidate: 300, tags: ["categories"] });

export const getReviews = (productId: number) =>
  apiFetch<Paginated<Review>>(`/products/${productId}/reviews?limit=20`, { revalidate: 30, tags: [`reviews-${productId}`] });
