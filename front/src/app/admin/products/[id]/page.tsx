import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { ApiError } from "@/lib/api-error";
import { apiFetch, getCategories } from "@/lib/server/api";
import { getToken } from "@/lib/server/session";
import type { Product } from "@/lib/types";

export const metadata: Metadata = { title: "Editar producto" };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  let product: Product;
  try {
    product = await apiFetch<Product>(`/admin/products/${id}`, { token: await getToken() });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <>
      <AdminPageHeader
        title={product.name}
        description="Editá la información, precio y stock del producto."
        actions={
          product.active && (
            <Link href={`/shop/${product.slug}`} target="_blank" className="inline-flex items-center gap-1.5 text-sm font-semibold">
              Ver en la tienda <ExternalLink className="size-4" />
            </Link>
          )
        }
      />
      <ProductForm product={product} categories={await getCategories()} />
    </>
  );
}
