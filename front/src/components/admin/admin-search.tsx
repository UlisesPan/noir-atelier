"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export function AdminSearch({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  return (
    <form
      role="search"
      className="relative max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q")?.toString().trim();
        const next = new URLSearchParams(params.toString());
        next.delete("page");
        if (q) next.set("q", q);
        else next.delete("q");
        router.push(`${pathname}?${next}`);
      }}
    >
      <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-stone" />
      <input
        name="q"
        defaultValue={params.get("q") ?? ""}
        placeholder={placeholder}
        aria-label="Buscar"
        className="h-11 w-full rounded-full border border-line bg-ivory pr-4 pl-11 text-sm outline-none focus:border-gold focus:ring-4 focus:ring-gold/15"
      />
    </form>
  );
}
