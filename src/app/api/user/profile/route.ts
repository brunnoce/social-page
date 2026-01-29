import { NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/api"
import { updateProfileSchema } from "@/lib/validations/profile"
import { getAuthUser } from "@/lib/auth"
import { users } from "@/lib/mock-db"

export async function PATCH(req: Request) {
  // 1. Auth
  const user = await getAuthUser()

  if (!user) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, error: "No autenticado" },
      { status: 401 }
    )
  }

  // 2. Body + validación
  const body = await req.json()
  const result = updateProfileSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, error: "Datos inválidos" },
      { status: 400 }
    )
  }

  const { username, bio } = result.data

  // 3. Username único
  const usernameTaken = users.some(
    (u) => u.username === username && u.id !== user.id
  )

  if (usernameTaken) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, error: "El username ya está en uso" },
      { status: 409 }
    )
  }

  // 4. Update
  user.username = username
  user.bio = bio

  // 5. Respuesta limpia
  return NextResponse.json<ApiResponse<{
    user: {
      id: string
      username: string
      email: string
      bio: string | null
    }
  }>>({
    ok: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio ?? null,
      },
    },
  })
}
