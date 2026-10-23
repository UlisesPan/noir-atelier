import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Paginación con links reales (SEO friendly y funciona sin JS). */
export function Pagination({
  page,
  totalPages,
  searchParams,
  basePath,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const qs = new URLSearchParams(
      Object.entries({ ...searchParams, page: p > 1 ? String(p) : undefined }).filter(([, v]) => v) as [string, string][],
    );
    return `${basePath}${qs.size ? `?${qs}` : ""}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  const arrow = "grid size-10 place-items-center rounded-full border border-line transition hover:border-ink/40";

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-2 pt-16">
      {page > 1 ? (
        <Link href={href(page - 1)} className={arrow} aria-label="Página anterior">
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className={cn(arrow, "opacity-30")} aria-hidden>
          <ChevronLeft className="size-4" />
        </span>
      )}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && p - pages[i - 1] > 1 && <span className="text-stone">…</span>}
          <Link
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "grid size-10 place-items-center rounded-full text-sm font-semibold transition",
              p === page ? "bg-ink text-ivory" : "hover:bg-ink/5",
            )}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < totalPages ? (
        <Link href={href(page + 1)} className={arrow} aria-label="Página siguiente">
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={cn(arrow, "opacity-30")} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
