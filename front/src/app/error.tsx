"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">Algo salió mal</p>
      <h1 className="mt-3 text-4xl">No pudimos cargar esta página</h1>
      <p className="mt-3 max-w-md text-muted">
        Puede ser un problema momentáneo de conexión con el servidor. Probá de nuevo en unos segundos.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Reintentar</Button>
        <ButtonLink href="/" variant="outline">
          Volver al inicio
        </ButtonLink>
      </div>
    </div>
  );
}
