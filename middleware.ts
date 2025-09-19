import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/landing']
  const isPublicRoute = publicRoutes.includes(pathname) || pathname === '/'

  // For now, let the client-side authentication handle the redirects
  // since we're using localStorage for token storage
  // The middleware will only handle basic route protection
  
  // If trying to access protected routes, let the client handle auth
  if (!isPublicRoute && pathname !== '/') {
    // Let the client-side authentication handle this
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
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