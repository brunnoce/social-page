import { PublicPost } from "@/lib/types/post"

type Props = {
  post: PublicPost
}

export default function PostCard({ post }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition hover:shadow-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
          {post.author.username[0].toUpperCase()}
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            @{post.author.username}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm text-gray-800">
        {post.body}
      </p>
    </div>
  )
}
