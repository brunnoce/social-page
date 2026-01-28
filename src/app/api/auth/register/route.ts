// app/api/auth/register/route.ts
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { registerSchema } from "@/lib/validations/auth"
import { users } from "@/lib/mock-db"
import { signJwt } from "@/lib/jwt"
import type { ApiResponse } from "@/lib/api"

export async function POST(req: Request) {
  const body = await req.json()

  // 1. Validación
  const result = registerSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, error: "Datos inválidos" },
      { status: 400 }
    )
  }

  const { username, email, password } = result.data

  // 2. Email duplicado
  const exists = users.some((u) => u.email === email)
  if (exists) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, error: "El email ya está registrado" },
      { status: 409 }
    )
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // 4. Crear usuario (mock)
  const user = {
    id: crypto.randomUUID(),
    username,
    email,
    passwordHash: hashedPassword,
  }

  users.push(user)

  // 5. JWT
  const token = signJwt({
    userId: user.id,
    email: user.email
  })

  // 6. Respuesta + cookie
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
