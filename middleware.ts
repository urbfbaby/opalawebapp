import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const stagingPassword = process.env.STAGING_PASSWORD;
  
  // If no staging password is set in env, pass through immediately
  if (!stagingPassword) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Allow static files, api routes, and staging login page
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname === "/staging-login" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Check auth cookie
  const authCookie = request.cookies.get("opala_staging_auth")?.value;
  if (authCookie === stagingPassword) {
    return NextResponse.next();
  }

  // Redirect to staging login
  const loginUrl = new URL("/staging-login", request.url);
  loginUrl.searchParams.set("returnTo", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
