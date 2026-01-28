import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { loginSchema } from "@/lib/validations/auth"
import { users } from "@/lib/mock-db"
import type { ApiResponse } from "@/lib/api"
import { signJwt } from "@/lib/jwt"

export async function POST(req: Request) {
  const body = await req.json()

  // 1. Validación
  const result = loginSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, error: "Datos inválidos" },
      { status: 400 }
    )
  }

  const { email, password } = result.data

  // 2. Buscar usuario
  const user = users.find((u) => u.email === email)

  if (!user) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, error: "Credenciales inválidas" },
      { status: 401 }
    )
  }

  // 3. Comparar password
  const isValid = await bcrypt.compare(password, user.passwordHash)

  if (!isValid) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, error: "Credenciales inválidas" },
      { status: 401 }
    )
  }

  // 4. Crear JWT
  const token = signJwt({
    userId: user.id,
    email: user.email,
  })

  // 5. Setear cookie httpOnly
  const res = NextResponse.json<ApiResponse<{ user: any }>>({
    ok: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    },
  })

  res.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  })

  return res
}
