export type PublicPost = {
  id: string
  body: string
  createdAt: Date
  author: {
    id: string
    username: string
  }
}