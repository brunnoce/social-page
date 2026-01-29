type User = {
  id: string
  username: string
  bio: string | null
  email: string
  passwordHash: string
}

export const users: User[] = []
