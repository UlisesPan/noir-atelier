"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/client";
import type { User } from "@/lib/types";

export const SESSION_KEY = ["session"] as const;

export function useSession() {
  const { data, isPending } = useQuery({
    queryKey: SESSION_KEY,
    queryFn: async () => (await authApi.session()).user,
    staleTime: 5 * 60_000,
  });
  return { user: data ?? null, isLoading: isPending, isAdmin: data?.role === "admin" };
}

/** Guarda el usuario en caché tras login/registro sin pedir la sesión otra vez. */
export function useSetSession() {
  const queryClient = useQueryClient();
  return (user: User | null) => {
    queryClient.setQueryData(SESSION_KEY, user);
    // Wishlist, órdenes, etc. dependen del usuario: se invalidan para refetchear.
    queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] !== SESSION_KEY[0] });
  };
}

export function useLogout() {
  const setSession = useSetSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setSession(null);
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== SESSION_KEY[0] });
      toast.success("Cerraste sesión");
      router.push("/");
      router.refresh();
    },
  });
}
