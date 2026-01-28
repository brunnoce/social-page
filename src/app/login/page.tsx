"use client"

import { useState } from "react"
import { LoginData, loginSchema } from "@/lib/validations/auth"
import Link from "next/link"
import { apiFetch } from "@/lib/http"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/use-auth"

export default function LoginPage() {
  const [form, setForm] = useState<LoginData>({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] =
    useState<"idle" | "loading" | "error" | "success">("idle")

  const router = useRouter()
  const { refresh } = useAuth()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setStatus("loading")

    const result = loginSchema.safeParse(form)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        fieldErrors[field] = issue.message
      })

      setErrors(fieldErrors)
      return
    }

    setStatus("loading")

    const res = await apiFetch<null>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      setStatus("error")
      setErrors({ general: res.error ?? "Error inesperado" })
      return
    }

    await refresh()
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white via-indigo-200 to-indigo-300 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg space-y-6"
      >
        <div className="space-y-1 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido 👋</h1>
          <p className="text-sm text-gray-500">
            Ingresá a tu cuenta para continuar
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition
              focus:ring-2 focus:ring-indigo-500
              ${errors.email ? "border-red-500" : "border-gray-300"}
            `}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition
              focus:ring-2 focus:ring-indigo-500
              ${errors.password ? "border-red-500" : "border-gray-300"}
            `}
          />
          {errors.password && (
            <p className="text-xs text-red-500">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition
            hover:bg-indigo-700
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Ingresando..." : "Ingresar"}
        </button>

        {errors.general && (
          <p className="text-sm text-red-600 text-center">
            {errors.general}
          </p>
        )}

        <p className="text-center text-sm text-gray-500">
          ¿No tenés cuenta?{" "}
          <Link
            href="/register"
            className="font-medium text-indigo-600 hover:underline"
          >
            Registrarse
          </Link>
        </p>
      </form>
    </div>
  )
}
