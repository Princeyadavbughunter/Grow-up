import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicAuthPath = '/auth/google';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  if (path === publicAuthPath || path.startsWith(`${publicAuthPath}/`)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token')?.value;
  
  if (!accessToken) {
    const loginUrl = new URL(publicAuthPath, request.url);
    loginUrl.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
