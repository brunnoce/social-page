import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { ApiResponse } from "@/lib/api"
import { createPostSchema } from "@/lib/validations/posts"
import { posts, users } from "@/lib/mock-db"
import { PublicPost } from "@/lib/types/post"

export async function POST(req: Request) {
  // Auth
  const user = await getAuthUser()

  if (!user) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, error: "No autenticado" },
      { status: 401 }
    )
  }

  // Body + validación
  const body = await req.json()
  const parsed = createPostSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, error: "Datos inválidos" },
      { status: 400 }
    )
  }

  // Crear post
  const newPost = {
    id: crypto.randomUUID(),
    body: parsed.data.body,
    createdAt: new Date(),
    userId: user.id,
  }

  posts.push(newPost)

  // Adaptar a PublicPost (contrato)
  const publicPost: PublicPost = {
    id: newPost.id,
    body: newPost.body,
    createdAt: newPost.createdAt,
    author: {
      id: user.id,
      username: user.username,
    },
  }

  return NextResponse.json<ApiResponse<{ post: PublicPost }>>({
    ok: true,
    data: { post: publicPost },
  })
}

export async function GET() {
  // ordenar por fecha (más nuevos primero)
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
