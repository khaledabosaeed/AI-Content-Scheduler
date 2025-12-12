import { checkAuth } from "@/shared/libs/auth/auth-middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/chat"];
const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/"];

export function middleware(request: NextRequest) {
  const { pathname,  } = request.nextUrl;

  // Ignore assets & API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }


  // -----------------------------------------
  // 2️⃣ check authentication
  // -----------------------------------------
  const { isAuthenticated } = checkAuth(request);

  // Protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth routes (login/register)
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
