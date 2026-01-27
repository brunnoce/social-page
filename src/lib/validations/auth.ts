import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Email inválido"),

  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export type LoginData = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(6, "El username debe tener al menos 6 caracteres")
      .max(20, "El username es muy largo")
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        "Solo letras, números, puntos (.), guiones (-) y _"
      )
      .refine(
        (v) => /[a-zA-Z0-9]/.test(v),
        "El username debe contener al menos una letra o número"
      )
      .refine(
        (v) => !/^[._-]|[._-]$/.test(v),
        "No puede empezar ni terminar con símbolos"
      )
      .refine(
        (v) => !/([._-])\1/.test(v),
        "No se permiten símbolos repetidos"
      ),

    email: z
      .string()
      .email("Email inválido"),

    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),

    confirmPassword: z
      .string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  })

export type RegisterData = z.infer<typeof registerSchema>
