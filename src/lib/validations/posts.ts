import { z } from "zod"

export const createPostSchema = z.object({
  body: z
    .string()
    .min(1, "Mínimo un caracter")
    .max(500, "Máximo 500 caracteres"),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
