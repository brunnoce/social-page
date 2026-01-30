import { PublicPost } from "./post"

export type PublicProfile = {
  id: string
  username: string
  bio: string | null
  posts: PublicPost[]
}