/**
 * Shared auth utility — thin compatibility layer over the single session authority.
 *
 * All token reads/writes MUST go through @/lib/session so that localStorage (used
 * for the Authorization bearer header) and the non-httpOnly `token` cookie (read by
 * proxy.ts for route gating) never drift out of sync.
 */

import { clearSession, getSessionToken } from "./session";

export function clearAuthData(): void {
  clearSession();
}

export function getToken(): string | null {
  return getSessionToken();
}
