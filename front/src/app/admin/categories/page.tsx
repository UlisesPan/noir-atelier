import type { Metadata } from "next";
import { CategoryManager } from "@/components/admin/category-manager";
import { AdminPageHeader } from "@/components/admin/page-header";
import { apiFetch } from "@/lib/server/api";
import type { Category } from "@/lib/types";

export const metadata: Metadata = { title: "Categorías" };

export default async function AdminCategoriesPage() {
  // Sin caché: el admin necesita ver los cambios al instante.
  const categories = await apiFetch<Category[]>("/categories");
  return (
    <>
      <AdminPageHeader title="Categorías" description="Familias olfativas que organizan el catálogo." />
      <CategoryManager categories={categories} />
    </>
  );
}
