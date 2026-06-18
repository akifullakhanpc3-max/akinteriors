import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicAdminPaths = ['/admin/login', '/admin/setup', '/admin/register'];

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (publicAdminPaths.includes(path)) return NextResponse.next();

  const token = request.cookies.get('authjs.session-token')?.value
    || request.cookies.get('__Secure-authjs.session-token')?.value;

  if (!token) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
