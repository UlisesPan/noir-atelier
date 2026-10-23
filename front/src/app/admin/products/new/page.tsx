import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "@/lib/server/api";

export const metadata: Metadata = { title: "Nuevo producto" };

export default async function NewProductPage() {
  return (
    <>
      <AdminPageHeader title="Nuevo producto" description="Cargá una nueva fragancia al catálogo." />
      <ProductForm categories={await getCategories()} />
    </>
  );
}
