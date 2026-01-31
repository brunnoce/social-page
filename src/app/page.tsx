import PostFeed from "@/components/post-feed"
import { PublicPost } from "@/lib/types/post"

export default async function HomePage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"

  const res = await fetch(`${baseUrl}/api/posts`, {
    cache: "no-store",
  })

  const data = (await res.json()) as
    | { ok: true; data: { posts: PublicPost[] } }
    | { ok: false; error: string }

  const posts = data.ok ? data.data.posts : []

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-indigo-200 to-indigo-300 px-4 py-10">
      <div className="mx-auto max-w-xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">
            Inicio
          </h1>
          <p className="text-sm text-gray-500">
            Últimos posts de la comunidad
          </p>
        </div>

        <PostFeed posts={posts} />
      </div>
    </main>
  )
}
