"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSetSession } from "@/hooks/use-session";
import { api, errorMessage } from "@/lib/client";
import type { User } from "@/lib/types";
import { profileSchema } from "@/lib/schemas";
import { Button } from "../ui/button";
import { Field, Input } from "../ui/form";

export function ProfileForm({ user }: { user: User }) {
  const setSession = useSetSession();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, phone: user.phone, address: user.address },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const updated = await api.patch<User>("/users/me", data);
      setSession(updated);
      reset({ name: updated.name, phone: updated.phone, address: updated.address });
      toast.success("Guardamos tus datos");
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2" noValidate>
      <Field label="Nombre y apellido" htmlFor="name" error={errors.name?.message}>
        <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
      </Field>
      <Field label="Email" htmlFor="email" hint="El email no se puede modificar.">
        <Input id="email" value={user.email} disabled readOnly />
      </Field>
      <Field label="Teléfono" htmlFor="phone" error={errors.phone?.message}>
        <Input id="phone" type="tel" aria-invalid={!!errors.phone} {...register("phone")} />
      </Field>
      <Field label="Dirección de envío" htmlFor="address" error={errors.address?.message}>
        <Input id="address" aria-invalid={!!errors.address} {...register("address")} />
      </Field>
      <div className="sm:col-span-2">
        <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
