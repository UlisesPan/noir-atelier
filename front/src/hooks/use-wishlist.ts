"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/client";
import type { Product } from "@/lib/types";
import { useSession } from "./use-session";

const WISHLIST_KEY = ["wishlist"] as const;

export function useWishlist() {
  const { user } = useSession();
  return useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: () => api.get<Product[]>("/wishlist"),
    enabled: !!user,
  });
}

/** Alterna un producto en la wishlist con actualización optimista. */
export function useToggleWishlist(product: Product) {
  const { user } = useSession();
  const { data } = useWishlist();
  const queryClient = useQueryClient();
  const router = useRouter();
  const isSaved = !!data?.some((p) => p.id === product.id);

  const mutation = useMutation({
    mutationFn: (save: boolean) => (save ? api.put(`/wishlist/${product.id}`) : api.delete(`/wishlist/${product.id}`)),
    onMutate: async (save) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_KEY });
      const previous = queryClient.getQueryData<Product[]>(WISHLIST_KEY);
      queryClient.setQueryData<Product[]>(WISHLIST_KEY, (old = []) =>
        save ? [product, ...old] : old.filter((p) => p.id !== product.id),
      );
      return { previous };
    },
    onError: (error, _save, ctx) => {
      queryClient.setQueryData(WISHLIST_KEY, ctx?.previous);
      toast.error(errorMessage(error));
    },
    onSuccess: (_data, save) => toast.success(save ? "Guardado en tu wishlist" : "Quitado de tu wishlist"),
  });

  const toggle = () => {
    if (!user) {
      toast("Iniciá sesión para guardar favoritos", {
        action: { label: "Ingresar", onClick: () => router.push(`/login?next=${encodeURIComponent(location.pathname)}`) },
      });
      return;
    }
    mutation.mutate(!isSaved);
  };

  return { isSaved, toggle, isPending: mutation.isPending };
}
