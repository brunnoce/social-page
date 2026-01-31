import { cookies } from "next/headers"
import { verifyJwt } from "@/lib/jwt"
import { users } from "@/lib/mock-db"

const AUTH_COOKIE = "auth-token"

export async function getAuthUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE)?.value

  if (!token) return null

  try {
    const payload = verifyJwt(token)
    const user = users.find(u => u.id === payload.userId)
    return user ?? null
  } catch {
    return null
  }
}
