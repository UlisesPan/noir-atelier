"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: "left" | "right";
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Panel lateral basado en <dialog> nativo: trae gratis focus trap, cierre con Escape,
 * inert del resto de la página y anuncio correcto para lectores de pantalla.
 */
export function Sheet({ open, onClose, title, side = "right", children, footer, className }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={cn(
        "fixed inset-y-0 m-0 h-dvh max-h-dvh w-full max-w-md bg-ivory p-0 text-ink shadow-lift outline-none",
        "backdrop:bg-ink/40 backdrop:backdrop-blur-[2px] backdrop:transition-opacity backdrop:duration-300",
        "transition-[translate,display,overlay] transition-discrete duration-300 ease-out",
        side === "right" ? "right-0 left-auto translate-x-full open:translate-x-0" : "left-0 -translate-x-full open:translate-x-0",
        "starting:open:translate-x-full starting:open:backdrop:opacity-0",
        side === "left" && "starting:open:-translate-x-full",
        className,
      )}
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-2xl">{title}</h2>
          <button
            onClick={onClose}
            className="-mr-2 cursor-pointer rounded-full p-2 text-ink-soft transition hover:bg-ink/5"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && <footer className="border-t border-line bg-cream/60 px-6 py-5">{footer}</footer>}
      </div>
    </dialog>
  );
}
