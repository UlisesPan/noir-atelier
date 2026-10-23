import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/auth-forms";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Ingresar" };

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Mi cuenta"
      title="Bienvenido/a de nuevo"
      description="Ingresá para seguir tus pedidos, guardar favoritos y comprar más rápido."
      image="/products/jazmin-de-medianoche.svg"
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
