import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { ProductGrid } from "@/components/product/product-card";
import { ShopSidebar, ShopToolbar } from "@/components/shop/filters";
import { Pagination } from "@/components/shop/pagination";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import { getCategories, getProducts } from "@/lib/server/api";
import type { Gender, ProductSort } from "@/lib/types";

type SearchParams = Record<string, string | undefined>;

export async function generateMetadata({ searchParams }: PageProps<"/shop">): Promise<Metadata> {
  const { category, q } = (await searchParams) as SearchParams;
  if (q) return { title: `Resultados para “${q}”` };
  if (category) {
    const categories = await getCategories();
    const found = categories.find((c) => c.slug === category);
    if (found) return { title: `Fragancias ${found.name.toLowerCase()}`, description: found.description };
  }
  return { title: "Tienda", description: "Todas las fragancias de autor de Noir Atelier." };
}

const num = (v?: string) => (v && !Number.isNaN(Number(v)) ? Number(v) : undefined);

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const sp = (await searchParams) as SearchParams;
  const page = num(sp.page) ?? 1;

  const [products, categories] = await Promise.all([
    getProducts({
      q: sp.q,
      category: sp.category,
      gender: sp.gender as Gender | undefined,
      minPrice: num(sp.minPrice),
      maxPrice: num(sp.maxPrice),
      inStock: sp.inStock === "true" || undefined,
      featured: sp.featured === "true" || undefined,
      sort: (sp.sort as ProductSort) ?? "featured",
      page,
      limit: 12,
    }),
    getCategories(),
  ]);

  const currentCategory = categories.find((c) => c.slug === sp.category);

  return (
    <div className="container-page py-12 lg:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow">{currentCategory ? "Familia olfativa" : "La colección"}</p>
        <h1 className="mt-3 text-5xl sm:text-6xl">{currentCategory?.name ?? "Todas las fragancias"}</h1>
        <p className="mt-4 text-muted">
          {currentCategory?.description ?? "Explorá la colección completa y filtrá por familia, precio o disponibilidad."}
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-14">
        <Suspense>
          <ShopSidebar categories={categories} />
        </Suspense>
        <div className="space-y-8">
          <Suspense>
            <ShopToolbar categories={categories} total={products.meta.total} />
          </Suspense>
          {products.data.length > 0 ? (
            <>
              <ProductGrid products={products.data} className="xl:grid-cols-3" />
              <Pagination page={page} totalPages={products.meta.totalPages} searchParams={sp} basePath="/shop" />
            </>
          ) : (
            <EmptyState
              icon={<SearchX className="size-6" />}
              title="No encontramos fragancias"
              description="Probá con otra búsqueda o quitá algunos filtros."
              action={<ButtonLink href="/shop" variant="outline">Ver todo el catálogo</ButtonLink>}
              className="rounded-[var(--radius-card)] border border-dashed border-line"
            />
          )}
        </div>
      </div>
    </div>
  );
}
