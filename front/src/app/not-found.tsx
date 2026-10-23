import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/misc";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Link href="/" aria-label="Inicio">
        <Logo />
      </Link>
      <p className="mt-16 font-display text-[8rem] leading-none text-gold/40">404</p>
      <h1 className="mt-2 text-4xl">Esta fragancia se evaporó</h1>
      <p className="mt-3 max-w-sm text-muted">La página que buscás no existe o fue movida.</p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/">Volver al inicio</ButtonLink>
        <ButtonLink href="/shop" variant="outline">
          Ir a la tienda
        </ButtonLink>
      </div>
    </div>
  );
}
