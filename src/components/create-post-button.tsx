"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth/use-auth"
import { apiFetch } from "@/lib/http"
import { useRouter } from "next/navigation"

export default function CreatePostButton() {
  const { user } = useAuth()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpen = () => {
    if (!user) {
      router.push("/login")
      return
    }
    setOpen(true)
  }

  const handleSubmit = async () => {
    if (!body.trim()) {
      setError("El post no puede estar vacío")
      return
    }

    setLoading(true)
    setError(null)

    const res = await apiFetch<{ post: any }>("/api/posts", {
      method: "POST",
      body: JSON.stringify({ body }),
    })

    if (!res.ok) {
      setError(res.error ?? "Error al crear el post")
      setLoading(false)
      return
    }

    // éxito
    setBody("")
    setOpen(false)
    setLoading(false)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white text-2xl shadow-lg transition hover:bg-indigo-700"
        aria-label="Crear post"
      >
        +
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Crear post
            </h2>

            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="¿Qué estás pensando?"
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                disabled={loading}
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Publicando..." : "Publicar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
