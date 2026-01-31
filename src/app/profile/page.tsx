"use client"

import { useAuth } from "@/lib/auth/use-auth"
import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/http"
import { useRouter } from "next/navigation"
import { PublicPost } from "@/lib/types/post"

export default function ProfilePage() {
  const { user, loading, refresh } = useAuth()
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    username: "",
    bio: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [posts, setPosts] = useState<PublicPost[]>([])
  const [postsLoading, setPostsLoading] = useState(true)

  // TODOS LOS HOOKS AL PRINCIPIO
  useEffect(() => {
    if (user) {
      setForm({
        username: user.username,
        bio: user.bio ?? "",
      })
    }
  }, [user])

  useEffect(() => {
    if (!user) return
  
    const fetchPosts = async () => {
      setPostsLoading(true)
  
      const res = await apiFetch<{ profile: { posts: PublicPost[] } }>(
        `/api/users/${user.username}` //username del usuario logueado
      )
  
      if (res.ok) {
        setPosts(res.data.profile.posts)
      }
  
      setPostsLoading(false)
    }
  
    fetchPosts()
  }, [user])

  // RETURNS CONDICIONALES AL FINAL
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando perfil...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No autenticado</p>
      </div>
    )
  }

  const handleSave = async () => {
    setError(null)
    setSaving(true)

    const res = await apiFetch<{ user: any }>("/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify({
        username: form.username,
        bio: form.bio || null,
      }),
    })

    if (!res.ok) {
      setError(res.error ?? "Error al guardar cambios")
      setSaving(false)
      return
    }
    await refresh()
    setIsEditing(false)
    setSaving(false)
  }

  const handleLogout = async () => {
    await apiFetch("/api/auth/logout", {
      method: "POST",
    })
    await refresh()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-indigo-200 to-indigo-300 px-4 py-10">
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg space-y-6">


        <div className="flex items-start justify-between gap-4">
          {!isEditing ? (
            <h1 className="text-3xl font-bold text-gray-900">
              @{user.username}
            </h1>
          ) : (
            <input
              type="text"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-lg font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}

          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Editar
                </button>

                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-sm font-medium text-gray-500">Bio</h2>

          {!isEditing ? (
            <p className="text-gray-700">
              {user.bio || (
                <span className="italic text-gray-400">Sin bio</span>
              )}
            </p>
          ) : (
            <textarea
              value={form.bio}
              onChange={(e) =>
                setForm({ ...form, bio: e.target.value })
              }
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none resize-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Contá algo sobre vos..."
            />
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="border-t pt-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Posts</h2>

          {postsLoading ? (
            <p className="text-sm text-gray-500">Cargando posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-sm text-gray-500">
              Este usuario todavía no publicó nada
            </p>
          ) : (
            posts.map(post => (
              <div
                key={post.id}
                className="rounded-lg border p-4 text-sm text-gray-800"
              >
                <p>{post.body}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}