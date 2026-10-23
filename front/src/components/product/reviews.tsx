"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, MessageSquareQuote, Star } from "lucide-react";
import { toast } from "sonner";
import { refreshCatalog } from "@/app/actions";
import { useSession } from "@/hooks/use-session";
import { api, errorMessage } from "@/lib/client";
import type { Paginated, Product, Review } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "../ui/button";
import { Textarea } from "../ui/form";
import { EmptyState } from "../ui/misc";
import { Stars } from "../ui/stars";

const RATING_LABELS = ["", "No me gustó", "Regular", "Está bien", "Me encantó", "Es mi favorito"];

export function ReviewsSection({ product, initial }: { product: Product; initial: Paginated<Review> }) {
  const { data } = useQuery({
    queryKey: ["reviews", product.id],
    queryFn: () => api.get<Paginated<Review>>(`/products/${product.id}/reviews?limit=20`),
    initialData: initial,
    staleTime: 30_000,
  });
  const reviews = data.data;
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section id="reviews" className="scroll-mt-28 border-t border-line py-20" aria-labelledby="reviews-title">
      <div className="grid gap-12 lg:grid-cols-[22rem_1fr] lg:gap-20">
        <div className="space-y-8">
          <div>
            <p className="eyebrow">Reseñas</p>
            <h2 id="reviews-title" className="mt-3 text-4xl">
              Lo que dicen quienes lo usan
            </h2>
          </div>
          {reviews.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-end gap-3">
                <span className="font-display text-6xl leading-none">{avg.toFixed(1)}</span>
                <div className="pb-1">
                  <Stars value={avg} size={16} />
                  <p className="mt-1 text-xs text-stone">
                    {data.meta.total} {data.meta.total === 1 ? "reseña" : "reseñas"}
                  </p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {distribution.map(({ star, count }) => (
                  <li key={star} className="flex items-center gap-3 text-xs text-stone">
                    <span className="w-3 tabular-nums">{star}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand">
                      <div className="h-full rounded-full bg-gold" style={{ width: `${(count / reviews.length) * 100}%` }} />
                    </div>
                    <span className="w-4 text-right tabular-nums">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ReviewForm product={product} existing={reviews} />
        </div>

        <div>
          {reviews.length === 0 ? (
            <EmptyState
              icon={<MessageSquareQuote className="size-6" />}
              title="Todavía no hay reseñas"
              description="¿Ya lo probaste? Contale a la comunidad qué te pareció."
              className="rounded-[var(--radius-card)] border border-dashed border-line"
            />
          ) : (
            <ul className="divide-y divide-line">
              {reviews.map((r) => (
                <li key={r.id} className="py-6 first:pt-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-full bg-cream font-display text-lg">{r.author.charAt(0)}</span>
                      <div>
                        <p className="text-sm font-semibold">{r.author}</p>
                        <Stars value={r.rating} size={12} />
                      </div>
                    </div>
                    <time className="text-xs text-stone" dateTime={r.createdAt}>
                      {formatDate(r.createdAt, { dateStyle: "medium" })}
                    </time>
                  </div>
                  {r.comment && <p className="mt-3 text-sm leading-relaxed text-ink-soft">{r.comment}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function ReviewForm({ product, existing }: { product: Product; existing: Review[] }) {
  const { user } = useSession();
  const mine = user ? existing.find((r) => r.userId === user.id) : undefined;
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: eligibility } = useQuery({
    queryKey: ["review-eligibility", product.id],
    queryFn: () => api.get<{ verifiedPurchase: boolean }>(`/products/${product.id}/reviews/eligibility`),
    enabled: !!user,
  });

  const save = useMutation({
    mutationFn: () => api.put(`/products/${product.id}/reviews`, { rating, comment: comment.trim() }),
    onSuccess: async () => {
      toast.success(mine ? "Actualizamos tu reseña" : "¡Gracias por tu reseña!");
      setEditing(false);
      await queryClient.invalidateQueries({ queryKey: ["reviews", product.id] });
      await refreshCatalog(["products", `reviews-${product.id}`]);
      router.refresh();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  if (!user) {
    return (
      <div className="rounded-[var(--radius-card)] bg-cream/70 p-6 text-sm">
        <p className="font-semibold">¿Lo probaste?</p>
        <p className="mt-1 text-muted">Iniciá sesión para dejar tu reseña.</p>
        <Link href={`/login?next=/shop/${product.slug}%23reviews`} className="mt-4 inline-block font-semibold underline underline-offset-4">
          Ingresar
        </Link>
      </div>
    );
  }

  if (mine && !editing) {
    return (
      <div className="rounded-[var(--radius-card)] bg-cream/70 p-6 text-sm">
        <p className="font-semibold">Ya dejaste tu reseña</p>
        <Stars value={mine.rating} className="mt-2" />
        <button
          onClick={() => {
            setRating(mine.rating);
            setComment(mine.comment);
            setEditing(true);
          }}
          className="mt-4 block cursor-pointer font-semibold underline underline-offset-4"
        >
          Editar mi reseña
        </button>
      </div>
    );
  }

  const shown = hover || rating;
  return (
    <form
      className="space-y-4 rounded-[var(--radius-card)] bg-cream/70 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!rating) return toast.error("Elegí una puntuación");
        save.mutate();
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{mine ? "Editar reseña" : "Escribí tu reseña"}</p>
        {eligibility?.verifiedPurchase && (
          <span className="flex items-center gap-1 text-xs font-semibold text-success">
            <BadgeCheck className="size-4" /> Compra verificada
          </span>
        )}
      </div>
      <div>
        <div className="flex gap-1" role="radiogroup" aria-label="Puntuación" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={n === 1 ? "1 estrella" : `${n} estrellas`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              className="cursor-pointer p-0.5 transition hover:scale-110"
            >
              <Star className={cn("size-7", n <= shown ? "fill-gold text-gold" : "fill-transparent text-stone/40")} strokeWidth={1.5} />
            </button>
          ))}
        </div>
        <p className="mt-1 h-4 text-xs text-stone">{RATING_LABELS[shown]}</p>
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={1000}
        placeholder="¿Cómo evoluciona en tu piel? ¿Cuánto dura? ¿Para qué ocasión lo usás?"
        aria-label="Comentario"
      />
      <Button type="submit" loading={save.isPending} className="w-full">
        Publicar reseña
      </Button>
    </form>
  );
}
