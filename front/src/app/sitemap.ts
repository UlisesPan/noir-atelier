import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/server/api";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try {
    const [products, categories] = await Promise.all([getProducts({ limit: 100 }), getCategories()]);
    return [
      { url: base, changeFrequency: "weekly", priority: 1 },
      { url: `${base}/shop`, changeFrequency: "daily", priority: 0.9 },
      ...categories.map((c) => ({ url: `${base}/shop?category=${c.slug}`, priority: 0.7 })),
      ...products.data.map((p) => ({ url: `${base}/shop/${p.slug}`, lastModified: p.createdAt, priority: 0.8 })),
    ];
  } catch {
    // Si la API no está disponible al generar el sitemap, devolvemos lo estático.
    return [{ url: base }, { url: `${base}/shop` }];
  }
}
