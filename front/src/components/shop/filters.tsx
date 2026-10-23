"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Category, ProductSort } from "@/lib/types";
import { cn, formatPrice, GENDER_LABEL } from "@/lib/utils";
import { Button } from "../ui/button";
import { Select } from "../ui/form";
import { Sheet } from "../ui/sheet";

export const PRICE_RANGES = [
  { id: "0-100000", label: `Hasta ${formatPrice(100_000)}` },
  { id: "100000-150000", label: `${formatPrice(100_000)} – ${formatPrice(150_000)}` },
  { id: "150000-200000", label: `${formatPrice(150_000)} – ${formatPrice(200_000)}` },
  { id: "200000-", label: `Más de ${formatPrice(200_000)}` },
];

const SORTS: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Destacados" },
  { value: "newest", label: "Novedades" },
  { value: "rating", label: "Mejor valorados" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
];

/** Hook que actualiza la URL (fuente de verdad de los filtros) sin perder el resto de parámetros. */
function useFilterParams() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    next.delete("page"); // cualquier cambio de filtro vuelve a la página 1
    startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
  };

  return { params, update, isPending, clear: () => startTransition(() => router.push(pathname, { scroll: false })) };
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-line py-6 first:border-t-0 first:pt-0">
      <legend className="mb-4 text-[0.7rem] font-semibold tracking-[0.22em] text-ink uppercase">{title}</legend>
      {children}
    </fieldset>
  );
}

function Option({
  checked,
  onChange,
  label,
  count,
  type = "radio",
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
  type?: "radio" | "checkbox";
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-ink-soft transition hover:text-ink">
      <input
        type={type}
        checked={checked}
        onChange={onChange}
        className={cn(
          "grid size-4 cursor-pointer appearance-none place-content-center border border-ink/30 transition checked:border-ink checked:bg-ink",
          type === "radio" ? "rounded-full" : "rounded",
          "before:size-1.5 before:rounded-full before:bg-ivory before:opacity-0 checked:before:opacity-100",
        )}
      />
      <span className={cn("flex-1", checked && "font-semibold text-ink")}>{label}</span>
      {count !== undefined && <span className="text-xs text-stone tabular-nums">{count}</span>}
    </label>
  );
}

function FilterPanel({ categories }: { categories: Category[] }) {
  const { params, update } = useFilterParams();
  const category = params.get("category");
  const gender = params.get("gender");
  const price = `${params.get("minPrice") ?? ""}-${params.get("maxPrice") ?? ""}`;
  const toggle = (key: string, value: string, current: string | null) => update({ [key]: current === value ? null : value });

  return (
    <div>
      <FilterGroup title="Familia olfativa">
        <Option checked={!category} onChange={() => update({ category: null })} label="Todas" />
        {categories.map((c) => (
          <Option
            key={c.slug}
            checked={category === c.slug}
            onChange={() => toggle("category", c.slug, category)}
            label={c.name}
            count={c.productCount}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Para">
        <div className="flex flex-wrap gap-2">
          {Object.entries(GENDER_LABEL).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => toggle("gender", value, gender)}
              aria-pressed={gender === value}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition",
                gender === value ? "border-ink bg-ink text-ivory" : "border-line text-ink-soft hover:border-ink/40",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Precio">
        {PRICE_RANGES.map((r) => (
          <Option
            key={r.id}
            checked={price === r.id}
            onChange={() => {
              if (price === r.id) return update({ minPrice: null, maxPrice: null });
              const [min, max] = r.id.split("-");
              update({ minPrice: min === "0" ? null : min, maxPrice: max || null });
            }}
            label={r.label}
            type="checkbox"
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Disponibilidad">
        <Option
          type="checkbox"
          checked={params.get("inStock") === "true"}
          onChange={() => update({ inStock: params.get("inStock") === "true" ? null : "true" })}
          label="Solo con stock"
        />
        <Option
          type="checkbox"
          checked={params.get("featured") === "true"}
          onChange={() => update({ featured: params.get("featured") === "true" ? null : "true" })}
          label="Destacados"
        />
      </FilterGroup>
    </div>
  );
}

export function ShopSidebar({ categories }: { categories: Category[] }) {
  return (
    <aside className="hidden lg:block" aria-label="Filtros">
      <div className="sticky top-28">
        <FilterPanel categories={categories} />
      </div>
    </aside>
  );
}

export function ShopToolbar({ categories, total }: { categories: Category[]; total: number }) {
  const { params, update, clear, isPending } = useFilterParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeCount = ["category", "gender", "minPrice", "maxPrice", "inStock", "featured", "q"].filter((k) => params.has(k)).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <form
          className="relative min-w-56 flex-1"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            update({ q: new FormData(e.currentTarget).get("q")?.toString().trim() || null });
          }}
        >
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-stone" />
          <input
            key={params.get("q") ?? ""}
            name="q"
            defaultValue={params.get("q") ?? ""}
            placeholder="Buscar fragancia o nota…"
            aria-label="Buscar"
            className="h-11 w-full rounded-full border border-line bg-white/60 pr-4 pl-11 text-sm outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15"
          />
        </form>
        <Button variant="outline" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal className="size-4" /> Filtros {activeCount > 0 && `(${activeCount})`}
        </Button>
        <label className="flex items-center gap-2 text-sm">
          <span className="hidden text-stone sm:inline">Ordenar</span>
          <Select
            value={params.get("sort") ?? "featured"}
            onChange={(e) => update({ sort: e.target.value === "featured" ? null : e.target.value })}
            className="h-11 w-auto rounded-full"
            aria-label="Ordenar productos"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className={cn("text-stone transition", isPending && "animate-shimmer")} aria-live="polite">
          {isPending ? "Buscando…" : `${total} ${total === 1 ? "fragancia" : "fragancias"}`}
        </span>
        {params.get("q") && <Chip label={`“${params.get("q")}”`} onRemove={() => update({ q: null })} />}
        {params.get("category") && (
          <Chip
            label={categories.find((c) => c.slug === params.get("category"))?.name ?? params.get("category")!}
            onRemove={() => update({ category: null })}
          />
        )}
        {params.get("gender") && (
          <Chip label={GENDER_LABEL[params.get("gender") as keyof typeof GENDER_LABEL]} onRemove={() => update({ gender: null })} />
        )}
        {(params.get("minPrice") || params.get("maxPrice")) && (
          <Chip label="Precio" onRemove={() => update({ minPrice: null, maxPrice: null })} />
        )}
        {params.get("inStock") && <Chip label="Con stock" onRemove={() => update({ inStock: null })} />}
        {params.get("featured") && <Chip label="Destacados" onRemove={() => update({ featured: null })} />}
        {activeCount > 1 && (
          <button onClick={clear} className="cursor-pointer text-xs font-semibold underline underline-offset-4">
            Limpiar todo
          </button>
        )}
      </div>

      <Sheet open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filtros" side="left" footer={
        <Button className="w-full" onClick={() => setFiltersOpen(false)}>Ver {total} resultados</Button>
      }>
        <div className="p-6">
          <FilterPanel categories={categories} />
        </div>
      </Sheet>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-cream py-1 pr-1 pl-3 text-xs font-medium">
      {label}
      <button onClick={onRemove} className="cursor-pointer rounded-full p-1 transition hover:bg-sand" aria-label={`Quitar filtro ${label}`}>
        <X className="size-3" />
      </button>
    </span>
  );
}
