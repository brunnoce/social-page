import { PublicPost } from "@/lib/types/post"
import PostCard from "./post-card"

type Props = {
  posts: PublicPost[]
}

export default function PostFeed({ posts }: Props) {
  if (posts.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 shadow-lg">
        No hay posts todavía
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
