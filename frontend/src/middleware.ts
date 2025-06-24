import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth storage from cookies
  const authStorage = request.cookies.get('auth-storage')?.value;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login'];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Parse auth storage to check if user is authenticated
  let isAuthenticated = false;
  if (authStorage && authStorage.trim() !== '') {
    try {
      const authData = JSON.parse(decodeURIComponent(authStorage));
      isAuthenticated = authData?.state?.isAuthenticated === true;
      console.log('Middleware: Auth data parsed:', { 
        isAuthenticated, 
        pathname,
        hasUser: !!authData?.state?.user,
        hasToken: !!authData?.state?.accessToken
      });
    } catch (error) {
      console.error('Middleware: Error parsing auth storage:', error);
      console.log('Middleware: Raw auth storage value:', authStorage);
      // If parsing fails, treat as not authenticated
      isAuthenticated = false;
    }
  } else {
    console.log('Middleware: No auth storage found for path:', pathname);
  }

  // If not authenticated and trying to access protected route, redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    console.log('Middleware: Redirecting to login from:', pathname);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated and trying to access login, redirect to dashboard
  if (isAuthenticated && isPublicRoute) {
    console.log('Middleware: Redirecting to dashboard from:', pathname);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
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
}; 