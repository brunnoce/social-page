import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = req.cookies.get("auth-token")?.value
  const isLoggedIn = Boolean(token)

  if (pathname.startsWith("/api")) { 
    return NextResponse.next()
  }

  // 1. Proteger /profile/*
  if (pathname.startsWith("/profile")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 2. Redirigir login/register si ya está logeado
  if (pathname === "/login" || pathname === "/register") {
    if (isLoggedIn) {
      const homeUrl = new URL("/", req.url)
      return NextResponse.redirect(homeUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/login",
    "/register",
  ],
}
