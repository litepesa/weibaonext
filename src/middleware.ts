import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Add your middleware logic here
  // For now, this will just pass through all requests
  return NextResponse.next()
}

export const config = {
  // Specify which paths this middleware should run on
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}