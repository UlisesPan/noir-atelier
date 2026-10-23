"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useSetSession } from "@/hooks/use-session";
import { authApi, errorMessage } from "@/lib/client";
import { loginSchema, registerSchema } from "@/lib/schemas";
import { Button } from "../ui/button";
import { Field, Input } from "../ui/form";

/** Solo permite volver a rutas internas (evita open redirects tipo ?next=https://malicioso.com). */
const safeNext = (next: string | null) => (next && next.startsWith("/") && !next.startsWith("//") ? next : "/");

function PasswordInput({ id, invalid, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input id={id} type={visible ? "text" : "password"} aria-invalid={invalid} className="pr-12" {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-full p-1.5 text-stone hover:text-ink"
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

function useAuthSuccess() {
  const router = useRouter();
  const params = useSearchParams();
  const setSession = useSetSession();
  return (user: Parameters<typeof setSession>[0], message: string) => {
    setSession(user);
    toast.success(message);
    router.replace(safeNext(params.get("next")));
    router.refresh();
  };
}

export function LoginForm() {
  const onSuccess = useAuthSuccess();
  const params = useSearchParams();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { user } = await authApi.login(data);
      onSuccess(user, `¡Hola de nuevo, ${user.name.split(" ")[0]}!`);
    } catch (error) {
      setError("root", { message: errorMessage(error) });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {errors.root && (
        <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {errors.root.message}
        </p>
      )}
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
      </Field>
      <Field label="Contraseña" htmlFor="password" error={errors.password?.message}>
        <PasswordInput id="password" autoComplete="current-password" invalid={!!errors.password} {...register("password")} />
      </Field>
      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        Ingresar
      </Button>
      <p className="text-center text-sm text-muted">
        ¿Primera vez en Noir Atelier?{" "}
        <Link href={`/register${params.size ? `?${params}` : ""}`} className="font-semibold text-ink underline underline-offset-4">
          Creá tu cuenta
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const onSuccess = useAuthSuccess();
  const params = useSearchParams();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema), mode: "onBlur" });

  const onSubmit = handleSubmit(async ({ confirmPassword, ...data }) => {
    try {
      const { user } = await authApi.register(data);
      onSuccess(user, `¡Bienvenido/a, ${user.name.split(" ")[0]}!`);
    } catch (error) {
      setError("root", { message: errorMessage(error) });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {errors.root && (
        <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {errors.root.message}
        </p>
      )}
      <Field label="Nombre y apellido" htmlFor="name" error={errors.name?.message}>
        <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
      </Field>
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Teléfono" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" type="tel" autoComplete="tel" placeholder="+54 11 5555-5555" aria-invalid={!!errors.phone} {...register("phone")} />
        </Field>
        <Field label="Dirección de envío" htmlFor="address" error={errors.address?.message}>
          <Input id="address" autoComplete="street-address" aria-invalid={!!errors.address} {...register("address")} />
        </Field>
      </div>
      <Field label="Contraseña" htmlFor="password" error={errors.password?.message} hint="Mínimo 8 caracteres, con mayúscula, minúscula y número.">
        <PasswordInput id="password" autoComplete="new-password" invalid={!!errors.password} {...register("password")} />
      </Field>
      <Field label="Repetí la contraseña" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
        <PasswordInput id="confirmPassword" autoComplete="new-password" invalid={!!errors.confirmPassword} {...register("confirmPassword")} />
      </Field>
      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        Crear cuenta
      </Button>
      <p className="text-center text-sm text-muted">
        ¿Ya tenés cuenta?{" "}
        <Link href={`/login${params.size ? `?${params}` : ""}`} className="font-semibold text-ink underline underline-offset-4">
          Ingresá
        </Link>
      </p>
    </form>
  );
}
