import { cookies } from "next/headers"
import { verifyJwt } from "@/lib/jwt"
import { users } from "@/lib/mock-db"

export async function getAuthUser() {
  const token = (await cookies()).get("auth-token")?.value
  if (!token) return null

  try {
    const payload = verifyJwt(token)
    const user = users.find((u) => u.id === payload.userId)
    return user ?? null
  } catch {
    return null
  }
}
