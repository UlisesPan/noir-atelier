import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ProductActiveToggle } from "@/components/admin/product-active-toggle";
import { AdminSearch } from "@/components/admin/admin-search";
import { Pagination } from "@/components/shop/pagination";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ProductImage } from "@/components/ui/misc";
import { apiFetch, toQueryString } from "@/lib/server/api";
import { getToken } from "@/lib/server/session";
import type { Paginated, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Productos" };

export default async function AdminProductsPage({ searchParams }: PageProps<"/admin/products">) {
  const sp = (await searchParams) as Record<string, string | undefined>;
  const page = Number(sp.page) || 1;
  const products = await apiFetch<Paginated<Product>>(
    `/admin/products${toQueryString({ q: sp.q, page, limit: 15, sort: "newest", includeInactive: true })}`,
    { token: await getToken() },
  );

  return (
    <>
      <AdminPageHeader
        title="Productos"
        description={`${products.meta.total} productos en el catálogo`}
        actions={
          <ButtonLink href="/admin/products/new">
            <Plus className="size-4" /> Nuevo producto
          </ButtonLink>
        }
      />
      <AdminSearch placeholder="Buscar por nombre o nota…" />

      <div className="mt-6 overflow-x-auto rounded-[var(--radius-card)] border border-line bg-ivory shadow-soft">
        <table className="w-full min-w-[46rem] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs tracking-wide text-stone">
              <th className="px-5 py-3 font-semibold">Producto</th>
              <th className="px-5 py-3 font-semibold">Categoría</th>
              <th className="px-5 py-3 text-right font-semibold">Precio</th>
              <th className="px-5 py-3 text-right font-semibold">Stock</th>
              <th className="px-5 py-3 font-semibold">Visible</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.data.map((p) => (
              <tr key={p.id} className="border-b border-line/60 last:border-0 hover:bg-cream/40">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative aspect-[4/5] w-10 shrink-0 overflow-hidden rounded-lg bg-cream">
                      <ProductImage src={p.image} alt="" sizes="40px" />
                    </div>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-stone">
                        {p.volumeMl} ml {p.featured && <Badge tone="gold" className="ml-1 px-1.5 py-0">Destacado</Badge>}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-ink-soft">{p.category?.name}</td>
                <td className="px-5 py-3 text-right tabular-nums">{formatPrice(p.price)}</td>
                <td className={`px-5 py-3 text-right font-semibold tabular-nums ${p.stock === 0 ? "text-danger" : p.stock <= 5 ? "text-gold-dark" : ""}`}>
                  {p.stock}
                </td>
                <td className="px-5 py-3">
                  <ProductActiveToggle product={p} />
                </td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/admin/products/${p.id}`} className="text-sm font-semibold underline-offset-4 hover:underline">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.data.length === 0 && <p className="p-8 text-center text-sm text-stone">No hay productos que coincidan.</p>}
      </div>
      <Pagination page={page} totalPages={products.meta.totalPages} searchParams={{ q: sp.q }} basePath="/admin/products" />
    </>
  );
}
