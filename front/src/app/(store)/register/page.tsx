import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/auth-forms";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Unite a Noir Atelier"
      title="Creá tu cuenta"
      description="Guardá tus fragancias favoritas, seguí tus pedidos y dejá tus reseñas."
      image="/products/especias-de-marrakech.svg"
    >
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
