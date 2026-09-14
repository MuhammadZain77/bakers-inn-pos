import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin-only route guard
    const isAdminRoute = path.startsWith("/dashboard/branches") || path.startsWith("/branches")
    
    if (isAdminRoute && token?.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/pos", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/pos/:path*",
    "/inventory/:path*",
    "/branches/:path*",
    "/products/:path*",
  ],
}