"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth/use-auth"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleProfileClick = () => {
    if (!user) {
      router.push("/login")
    } else {
      router.push("/profile")
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-indigo-200 bg-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-bold text-gray-900"
        >
          NextSocial
        </Link>

        {!loading && (
          <button
            onClick={handleProfileClick}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            {user ? `@${user.username}` : "Ingresar"}
          </button>
        )}
      </div>
    </header>
  )
}
