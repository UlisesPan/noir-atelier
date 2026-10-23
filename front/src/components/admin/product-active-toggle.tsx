"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { refreshCatalog } from "@/app/actions";
import { api, errorMessage } from "@/lib/client";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductActiveToggle({ product }: { product: Product }) {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (active: boolean) => api.patch(`/products/${product.id}`, { active }),
    onSuccess: async (_d, active) => {
      toast.success(active ? `${product.name} visible en la tienda` : `${product.name} oculto de la tienda`);
      await refreshCatalog(["products", "categories"]);
      router.refresh();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <button
      role="switch"
      aria-checked={product.active}
      aria-label={`Visible en la tienda: ${product.name}`}
      disabled={mutation.isPending}
      onClick={() => mutation.mutate(!product.active)}
      className={cn(
        "relative h-6 w-11 cursor-pointer rounded-full transition disabled:opacity-50",
        product.active ? "bg-success" : "bg-stone/40",
      )}
    >
      <span className={cn("absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition", product.active && "translate-x-5")} />
    </button>
  );
}
