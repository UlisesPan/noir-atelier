"use server";

import { updateTag } from "next/cache";

const ALLOWED = /^(products|categories|reviews-\d+)$/;

/**
 * Expira la caché del catálogo después de una mutación (reseña, edición en admin)
 * para que la próxima navegación muestre datos frescos. Solo acepta tags conocidos.
 */
export async function refreshCatalog(tags: string[]) {
  for (const tag of tags) if (ALLOWED.test(tag)) updateTag(tag);
}
