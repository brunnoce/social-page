"use client"

import { useEffect, useState } from "react"
import { AuthContext, AuthUser } from "./auth-context"
import { apiFetch } from "@/lib/http"

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    setLoading(true)

    const res = await apiFetch<{ user: AuthUser }>(
      "/api/auth/me"
    )

    if (res.ok) {
      setUser(res.data.user)
    } else {
      setUser(null)
    }

    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth: !!user,
        loading,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
