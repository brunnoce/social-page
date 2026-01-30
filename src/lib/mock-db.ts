type User = {
  id: string
  username: string
  bio: string | null
  email: string
  passwordHash: string
}

type Post = {
  id: string
  body: string
  createdAt: Date
  userId: string
}

export const users: User[] = []
export const posts: Post[] = []