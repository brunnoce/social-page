import { NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/api"
import { verifyJwt } from "@/lib/jwt"
import { users } from "@/lib/mock-db"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, error: "No autenticado" },
      { status: 401 }
    )
  }

  try {
    const payload = verifyJwt(token)

    const user = users.find((u) => u.id === payload.userId)

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { ok: false, error: "Usuario no encontrado" },
        { status: 401 }
      )
    }

    return NextResponse.json<ApiResponse<{ user: any }>>({
      ok: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          bio: user.bio
        },
      },
    })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, error: "Token inválido" },
      { status: 401 }
    )
  }
}
