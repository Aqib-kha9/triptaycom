import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// All private routes that require authentication
// These paths and all sub-paths will be protected
const PRIVATE_PATHS = [
  "/dashboard",
  "/bookings",
  "/profile",
  "/wallet",
  "/wishlist",
  "/messages",
  "/notifications",
  "/reviews",
  "/checkout",
  "/vendor",
];

function isPrivatePath(pathname: string): boolean {
  return PRIVATE_PATHS.some((p) => pathname.startsWith(p));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip non-private paths (public pages)
  if (!isPrivatePath(pathname)) {
    return NextResponse.next();
  }

  // Check for the httpOnly token cookie set by the backend
  const token = request.cookies.get("token")?.value;

  if (!token) {
    // No auth token — redirect to login, preserving the intended destination
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists — allow the request to proceed
  // KYC checks for vendor routes are handled by vendor/layout.tsx
  return NextResponse.next();
}

export const config = {
  // Match all paths except static assets, Next.js internals, and API routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons|.*\\.svg$).*)"],
};