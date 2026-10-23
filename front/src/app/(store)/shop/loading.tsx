import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="container-page py-12 lg:py-16" aria-busy="true" aria-label="Cargando productos">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-4 h-14 w-80 max-w-full" />
      <div className="mt-12 grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-14">
        <div className="hidden space-y-3 lg:block">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
        <div className="space-y-8">
          <Skeleton className="h-11 w-full rounded-full" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/5] w-full rounded-[var(--radius-card)]" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
