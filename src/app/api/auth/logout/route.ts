import { NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/api"

export async function POST() {
  const res = NextResponse.json<ApiResponse<null>>({
    ok: true,
    data: null,
  })

  res.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  return res
}
