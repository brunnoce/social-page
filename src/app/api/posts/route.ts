import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import type { ApiResponse } from "@/lib/api"
import { createPostSchema } from "@/lib/validations/posts"
import { posts, users } from "@/lib/mock-db"
import type { PublicPost } from "@/lib/types/post"

/**
 * Crear post (requiere auth)
 */
export async function POST(req: Request) {
  // 1. Auth
  const user = await getAuthUser()

  if (!user) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, error: "No autenticado" },
      { status: 401 }
    )
  }

  // 2. Body + validación
  const body = await req.json()
  const parsed = createPostSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, error: "Datos inválidos" },
      { status: 400 }
    )
  }

  // 3. Crear post
  const newPost = {
    id: crypto.randomUUID(),
    body: parsed.data.body,
    createdAt: new Date(),
    userId: user.id,
  }

  posts.push(newPost)

  // 4. Adaptar a contrato público
  const publicPost: PublicPost = {
    id: newPost.id,
    body: newPost.body,
    createdAt: newPost.createdAt,
    author: {
      id: user.id,
      username: user.username,
    },
  }

  // 5. Respuesta
  return NextResponse.json<ApiResponse<{ post: PublicPost }>>({
    ok: true,
    data: { post: publicPost },
  })
}

/**
 * Obtener posts (público)
 */
export async function GET() {
  const sorted = [...posts].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )

  const publicPosts: PublicPost[] = sorted.map(post => {
    const author = users.find(u => u.id === post.userId)!

    return {
      id: post.id,
      body: post.body,
      createdAt: post.createdAt,
      author: {
        id: author.id,
        username: author.username,
      },
    }
  })

  return NextResponse.json<ApiResponse<{ posts: PublicPost[] }>>({
    ok: true,
    data: { posts: publicPosts },
  })
}
