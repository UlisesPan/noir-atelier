import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Estrellas de solo lectura con soporte de medias estrellas. */
export function Stars({ value, size = 14, className }: { value: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${value.toFixed(1)} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i + 1));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star className="absolute inset-0 text-sand" fill="currentColor" strokeWidth={0} style={{ width: size, height: size }} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="text-gold" fill="currentColor" strokeWidth={0} style={{ width: size, height: size }} />
            </span>
          </span>
        );
      })}
    </span>
  );
}
