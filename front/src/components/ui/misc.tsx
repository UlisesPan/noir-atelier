import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { cn, discountPercent, formatPrice, isOptimizableImage } from "@/lib/utils";

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex flex-col items-center leading-none", light ? "text-ivory" : "text-ink", className)}>
      <span className="font-display text-[1.65rem] font-semibold tracking-[0.18em]">NOIR</span>
      <span className="mt-0.5 text-[0.55rem] font-semibold tracking-[0.55em] opacity-70">ATELIER</span>
    </span>
  );
}

export function Price({
  value,
  compareAt,
  className,
  size = "md",
}: {
  value: number;
  compareAt?: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const off = discountPercent(value, compareAt ?? null);
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2", className)}>
      <span className={cn("font-semibold tabular-nums", { sm: "text-sm", md: "text-base", lg: "text-3xl" }[size])}>
        {formatPrice(value)}
      </span>
      {off > 0 && (
        <>
          <span className={cn("text-stone line-through tabular-nums", size === "lg" ? "text-base" : "text-xs")}>
            {formatPrice(compareAt!)}
          </span>
          <span className="text-xs font-semibold text-wine">-{off}%</span>
        </>
      )}
    </span>
  );
}

/** Imagen de producto: optimiza SVG locales y hosts conocidos; el resto se sirve tal cual. */
export function ProductImage({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.endsWith(".svg") || !isOptimizableImage(src)}
      className={cn("object-cover", className)}
    />
  );
}

export function QuantityStepper({
  value,
  max,
  onChange,
  size = "md",
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
  size?: "sm" | "md";
}) {
  const btn = cn(
    "grid cursor-pointer place-items-center text-ink-soft transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-30",
    size === "sm" ? "size-8" : "size-11",
  );
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white/60">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Restar uno">
        <Minus className="size-3.5" />
      </button>
      <span className={cn("text-center font-semibold tabular-nums", size === "sm" ? "w-6 text-sm" : "w-8")} aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Sumar uno">
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-16 text-center", className)}>
      <div className="mb-5 grid size-16 place-items-center rounded-full bg-cream text-gold-dark">{icon}</div>
      <h3 className="font-display text-2xl">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
