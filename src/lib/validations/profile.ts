import { z } from "zod"

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(6, "El username debe tener al menos 6 caracteres")
    .max(20, "El username es muy largo")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Solo letras, números, puntos (.), guiones (-) y _"
    )
    .refine((v) => /[a-zA-Z0-9]/.test(v), {
      message: "Debe contener al menos una letra o número",
    }),

  bio: z
    .string()
    .min(1, "La bio no puede estar vacía")
    .max(300, "Máximo 300 caracteres")
    .nullable(),
})

export type UpdateProfileData = z.infer<
  typeof updateProfileSchema
>
