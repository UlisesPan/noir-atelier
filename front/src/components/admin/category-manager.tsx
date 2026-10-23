"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { refreshCatalog } from "@/app/actions";
import { api, errorMessage } from "@/lib/client";
import type { Category } from "@/lib/types";
import { Button } from "../ui/button";
import { Field, Input } from "../ui/form";
import { Panel } from "./page-header";

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const done = async (message: string) => {
    toast.success(message);
    await refreshCatalog(["categories", "products"]);
    router.refresh();
  };

  const create = useMutation({
    mutationFn: () => api.post("/categories", { name: name.trim(), description: description.trim() }),
    onSuccess: () => {
      setName("");
      setDescription("");
      return done("Categoría creada");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),
    onSuccess: () => done("Categoría eliminada"),
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
      <Panel>
        <ul className="divide-y divide-line">
          {categories.map((c) => (
            <li key={c.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <div className="flex-1">
                <p className="font-display text-xl">{c.name}</p>
                <p className="text-xs text-stone">
                  /{c.slug} · {c.productCount ?? 0} productos activos
                </p>
                {c.description && <p className="mt-1 text-sm text-ink-soft">{c.description}</p>}
              </div>
              <button
                onClick={() => confirm(`¿Eliminar "${c.name}"?`) && remove.mutate(c.id)}
                disabled={remove.isPending}
                className="cursor-pointer rounded-full p-2 text-stone transition hover:bg-danger/10 hover:text-danger disabled:opacity-50"
                aria-label={`Eliminar ${c.name}`}
                title="Solo se pueden eliminar categorías sin productos"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Nueva categoría">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim().length < 2) return toast.error("El nombre debe tener al menos 2 caracteres");
            create.mutate();
          }}
        >
          <Field label="Nombre" htmlFor="cat-name">
            <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
          </Field>
          <Field label="Descripción" htmlFor="cat-desc">
            <Input id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <Button type="submit" className="w-full" loading={create.isPending}>
            Crear categoría
          </Button>
        </form>
      </Panel>
    </div>
  );
}
