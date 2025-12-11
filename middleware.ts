import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Import cookie keys for consistency (note: can't import COOKIE_OPTIONS in middleware as it's edge runtime)
const ACCESS_TOKEN_KEY = 'access_token';

const publicAuthPath = '/auth/google';
const publicPaths = ['/', '/gigs-page', '/events-page', '/talent', '/community', '/clubs-page', '/support', '/privacy-policy', '/terms-and-conditions'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Allow access to auth paths
  if (path === publicAuthPath || path.startsWith(`${publicAuthPath}/`)) {
    return NextResponse.next();
  }
  
  // Allow access to public pages
  if (publicPaths.some(publicPath => path === publicPath || path.startsWith(`${publicPath}/`))) {
    return NextResponse.next();
  }
  
  const accessToken = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
  
  if (!accessToken) {
    const loginUrl = new URL(publicAuthPath, request.url);
    loginUrl.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|logo.svg|.*\\..*).*)',
  ],
};