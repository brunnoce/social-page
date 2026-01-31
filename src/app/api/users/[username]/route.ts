  import { NextResponse } from "next/server"
  import { getAuthUser } from "@/lib/auth"
  import { users, posts } from "@/lib/mock-db"
  import { ApiResponse } from "@/lib/api"
  import { PublicProfile } from "@/lib/types/profile"
  import { PublicPost } from "@/lib/types/post"

  type Params = {
    params: Promise<{
      username: string
    }>
  }  

  export async function GET(
    req: Request,
    { params }: Params
  ) {
    const { username } = await params
  
    // Auth
    const authUser = await getAuthUser()
  
    if (!authUser) {
      return NextResponse.json<ApiResponse<null>>(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      )
    }
  
    // User
    const user = users.find(u => u.username === username)
  
    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { ok: false, error: "Usuario no encontrado" },
        { status: 404 }
      )
    }
  
    // Posts del user
    const userPosts = posts
      .filter(p => p.userId === user.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  
    const publicPosts: PublicPost[] = userPosts.map(post => ({
      id: post.id,
      body: post.body,
      createdAt: post.createdAt,
      author: {
        id: user.id,
        username: user.username,
      },
    }))
  
    const profile: PublicProfile = {
      id: user.id,
      username: user.username,
      bio: user.bio,
      posts: publicPosts,
    }
  
    return NextResponse.json<ApiResponse<{ profile: PublicProfile }>>({
      ok: true,
      data: { profile },
    })
  }  
