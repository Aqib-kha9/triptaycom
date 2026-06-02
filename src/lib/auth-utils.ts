/**
 * Shared auth utility — ensures localStorage and cookie stay in sync.
 * Every file that calls localStorage.removeItem("token") should call clearAuthData()
 * so the Next.js proxy.ts middleware also stops seeing the user as authenticated.
 */

export function clearAuthData(): void {
  localStorage.removeItem("token");
  // Clear the non-httpOnly cookie so proxy.ts middleware stops allowing private routes
  // (the backend's httpOnly cookie on localhost:5000 is cross-origin and unreachable from localhost:3000)
  document.cookie = "token=; path=/; max-age=0";
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}