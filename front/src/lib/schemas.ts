import { z } from "zod";

/** Las mismas reglas que valida la API (los DTOs de NestJS): el front da feedback inmediato. */
export const loginSchema = z.object({
  email: z.email("Ingresá un email válido"),
  password: z.string().min(1, "Ingresá tu contraseña"),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Ingresá tu nombre").max(80),
  phone: z.string().regex(/^\+?[\d\s-]{8,20}$/, "Ingresá un teléfono válido (ej: +54 11 5555-5555)"),
  address: z.string().trim().min(5, "Ingresá tu dirección completa").max(160),
});

export const registerSchema = profileSchema
  .extend({
    email: z.email("Ingresá un email válido"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .max(72)
      .regex(/[a-z]/, "Incluí una minúscula")
      .regex(/[A-Z]/, "Incluí una mayúscula")
      .regex(/\d/, "Incluí un número"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, { message: "Las contraseñas no coinciden", path: ["confirmPassword"] });
