import type { ApiResponse } from "@/lib/api"

export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    credentials: "include", // para cookies
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  })

  const data = await res.json()

  return data
}
