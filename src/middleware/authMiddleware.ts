import { NextRequest, NextResponse } from 'next/server';
import { JWT } from 'next-auth/jwt';

const publicRoutes = ["/login", "/register", "/api/auth", "/peta", "/api-docs"];

export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route));
}

export function handleAuth(request: NextRequest, token: JWT | null): NextResponse | undefined {
  const { pathname } = request.nextUrl;

  if (!token && !isPublicRoute(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}