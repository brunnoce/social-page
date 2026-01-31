import { cookies } from "next/headers"
import { verifyJwt } from "@/lib/jwt"
import { users } from "@/lib/mock-db"

const AUTH_COOKIE = "auth-token"

function getTokenFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie")
  if (!cookieHeader) return null
  const match = cookieHeader.match(new RegExp(`${AUTH_COOKIE}=([^;]+)`))
  return match ? match[1].trim() : null
}

export async function getAuthUser(request?: Request) {
  const token = request
    ? getTokenFromRequest(request)
    : (await cookies()).get(AUTH_COOKIE)?.value ?? null

  if (!token) return null

  try {
    const payload = verifyJwt(token)
    const user = users.find((u) => u.id === payload.userId)
    return user ?? null
  } catch {
    return null
  }
}
