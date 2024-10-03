import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { handleCORS } from './corsMiddleware';
import { handleAuth } from './authMiddleware';

export async function middleware(request: NextRequest) {
  const corsResponse = handleCORS(request);
  if (corsResponse) return corsResponse;

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const authResponse = handleAuth(request, token);
  if (authResponse) return authResponse;

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/:path*"
  ],
};