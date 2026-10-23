"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { refreshCatalog } from "@/app/actions";
import { api, errorMessage } from "@/lib/client";
import type { Category, Product } from "@/lib/types";
import { GENDER_LABEL } from "@/lib/utils";
import { Button, ButtonLink } from "../ui/button";
import { Field, Input, Select, Textarea } from "../ui/form";
import { ProductImage } from "../ui/misc";
import { Panel } from "./page-header";

const notesField = z.string().max(200);
const schema = z
  .object({
    name: z.string().trim().min(2, "Mínimo 2 caracteres").max(120),
    description: z.string().trim().min(10, "Mínimo 10 caracteres").max(2000),
    price: z.coerce.number<number>().positive("Debe ser mayor a 0"),
    compareAtPrice: z.union([z.literal(""), z.coerce.number<number>().positive()]).optional(),
    stock: z.coerce.number<number>().int("Debe ser entero").min(0, "No puede ser negativo"),
    volumeMl: z.coerce.number<number>().int().positive(),
    gender: z.enum(["masculine", "feminine", "unisex"]),
    categoryId: z.coerce.number<number>().int().positive("Elegí una categoría"),
    image: z.string().trim().regex(/^(https:\/\/\S+|\/[\w\-./]+)$/, "URL https o ruta que empiece con /"),
    featured: z.boolean(),
    active: z.boolean(),
    top: notesField,
    heart: notesField,
    base: notesField,
  })
  .refine((d) => !d.compareAtPrice || d.compareAtPrice > d.price, {
    message: "Debe ser mayor al precio actual",
    path: ["compareAtPrice"],
  });

type FormValues = z.input<typeof schema>;

const splitNotes = (s: string) => s.split(",").map((n) => n.trim()).filter(Boolean);

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? "",
      compareAtPrice: product?.compareAtPrice ?? "",
      stock: product?.stock ?? 0,
      volumeMl: product?.volumeMl ?? 100,
      gender: product?.gender ?? "unisex",
      categoryId: product?.categoryId ?? "",
      image: product?.image ?? "",
      featured: product?.featured ?? false,
      active: product?.active ?? true,
      top: product?.notes.top.join(", ") ?? "",
      heart: product?.notes.heart.join(", ") ?? "",
      base: product?.notes.base.join(", ") ?? "",
    } as FormValues,
  });

  const image = useWatch({ control, name: "image" });

  const onSubmit = handleSubmit(async ({ top, heart, base, compareAtPrice, ...data }) => {
    const payload = {
      ...data,
      compareAtPrice: compareAtPrice === "" || compareAtPrice === undefined ? null : compareAtPrice,
      notes: { top: splitNotes(top), heart: splitNotes(heart), base: splitNotes(base) },
    };
    try {
      if (product) await api.patch(`/products/${product.id}`, payload);
      else await api.post("/products", payload);
      await refreshCatalog(["products", "categories"]);
      toast.success(product ? "Producto actualizado" : "Producto creado");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  });

  const err = (key: keyof FormValues) => errors[key]?.message as string | undefined;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 xl:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        <Panel title="Información">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nombre" htmlFor="name" error={err("name")} className="sm:col-span-2">
              <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
            </Field>
            <Field label="Descripción" htmlFor="description" error={err("description")} className="sm:col-span-2">
              <Textarea id="description" rows={4} aria-invalid={!!errors.description} {...register("description")} />
            </Field>
            <Field label="Categoría" htmlFor="categoryId" error={err("categoryId")}>
              <Select id="categoryId" aria-invalid={!!errors.categoryId} {...register("categoryId")}>
                <option value="">Elegí una categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Género" htmlFor="gender">
              <Select id="gender" {...register("gender")}>
                {Object.entries(GENDER_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </Panel>

        <Panel title="Pirámide olfativa">
          <p className="-mt-3 mb-5 text-xs text-stone">Separá las notas con comas.</p>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Salida" htmlFor="top">
              <Input id="top" placeholder="Bergamota, Limón" {...register("top")} />
            </Field>
            <Field label="Corazón" htmlFor="heart">
              <Input id="heart" placeholder="Jazmín, Iris" {...register("heart")} />
            </Field>
            <Field label="Fondo" htmlFor="base">
              <Input id="base" placeholder="Vainilla, Ámbar" {...register("base")} />
            </Field>
          </div>
        </Panel>

        <Panel title="Precio e inventario">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Precio (ARS)" htmlFor="price" error={err("price")}>
              <Input id="price" type="number" min={0} step="0.01" inputMode="decimal" aria-invalid={!!errors.price} {...register("price")} />
            </Field>
            <Field label="Precio anterior" htmlFor="compareAtPrice" error={err("compareAtPrice")} hint="Opcional, para mostrar descuento">
              <Input id="compareAtPrice" type="number" min={0} step="0.01" aria-invalid={!!errors.compareAtPrice} {...register("compareAtPrice")} />
            </Field>
            <Field label="Stock" htmlFor="stock" error={err("stock")}>
              <Input id="stock" type="number" min={0} step={1} aria-invalid={!!errors.stock} {...register("stock")} />
            </Field>
            <Field label="Volumen (ml)" htmlFor="volumeMl" error={err("volumeMl")}>
              <Input id="volumeMl" type="number" min={1} step={1} {...register("volumeMl")} />
            </Field>
          </div>
        </Panel>
      </div>

      <div className="space-y-6">
        <Panel title="Imagen">
          <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-2xl bg-cream">
            {image && /^(https:\/\/|\/)/.test(image) ? (
              <ProductImage src={image} alt="Vista previa" sizes="320px" />
            ) : (
              <p className="grid h-full place-items-center px-6 text-center text-xs text-stone">La vista previa aparece al cargar una URL</p>
            )}
          </div>
          <Field label="URL de la imagen" htmlFor="image" error={err("image")} hint="Ej: /products/rosa-velada.svg o https://images.unsplash.com/…">
            <Input id="image" aria-invalid={!!errors.image} {...register("image")} />
          </Field>
        </Panel>

        <Panel title="Visibilidad">
          <div className="space-y-3 text-sm">
            <label className="flex cursor-pointer items-center gap-3">
              <input type="checkbox" className="size-4 accent-ink" {...register("active")} />
              Visible en la tienda
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input type="checkbox" className="size-4 accent-ink" {...register("featured")} />
              Destacado en la home
            </label>
          </div>
        </Panel>

        <div className="flex gap-3">
          <ButtonLink href="/admin/products" variant="outline" className="flex-1">
            Cancelar
          </ButtonLink>
          <Button type="submit" loading={isSubmitting} className="flex-1">
            {product ? "Guardar" : "Crear producto"}
          </Button>
        </div>
      </div>
    </form>
  );
}
