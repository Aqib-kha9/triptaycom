/**
 * ─────────────────────────────────────────────────────────────
 * Triptay — Single Session Authority
 * ─────────────────────────────────────────────────────────────
 *
 * The ONLY module allowed to read or write the browser session token.
 *
 * Why two stores?
 *   • localStorage  → attached as `Authorization: Bearer <token>` on every
 *                     API call (the backend accepts bearer OR cookie).
 *   • `token` cookie → read by the Next.js `proxy.ts` middleware to gate
 *                     private routes. It CANNOT be the backend's httpOnly
 *                     cookie because the API lives on a different origin
 *                     (localhost:5000) in dev, so the proxy never sees it.
 *
 * The cookie must stay non-httpOnly precisely so this module can mirror the
 * bearer token into it. Both stores are always written and cleared together.
 */

export const SESSION_COOKIE_NAME = "token";

/**
 * Non-secret identity cache. Stores the last known role so the UI can paint
 * instantly on load instead of blocking on a /auth/me round-trip. It is
 * revalidated in the background and cleared together with the session token.
 */
const USER_CACHE_KEY = "triptay_user";

/** 30 days — kept in sync with the backend cookie maxAge. */
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/** Read the current session token, or null when signed out. */
export function getSessionToken(): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(SESSION_COOKIE_NAME);
  } catch {
    // localStorage can throw in private-mode / blocked-cookie contexts.
    return null;
  }
}

/**
 * Persist a token to BOTH stores. Call this from every auth entry point
 * (login, OTP verify, register, google-login) — never write stores directly.
 */
export function setSession(token: string): void {
  if (!isBrowser() || !token) return;
  try {
    window.localStorage.setItem(SESSION_COOKIE_NAME, token);
  } catch {
    // Non-fatal: the cookie below still authenticates the proxy gate.
  }
  document.cookie = `${SESSION_COOKIE_NAME}=${token}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
}

/** Remove the token from BOTH stores (and the cached identity). Safe to call repeatedly. */
export function clearSession(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(SESSION_COOKIE_NAME);
    window.localStorage.removeItem(USER_CACHE_KEY);
  } catch {
    // ignore
  }
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

/** True when a token is present in the browser session store. */
export function hasSession(): boolean {
  return Boolean(getSessionToken());
}

// ─── Cached Identity (non-secret) ───────────────────────────
// Purely a UX cache to avoid a blocking splash on every load. It is NEVER
// trusted for authorization — the backend is always the source of truth.

export interface CachedUser {
  role: "guest" | "vendor";
  hasVendorAccess: boolean;
}

/** Persist the last known identity for instant optimistic hydration. */
export function setCachedUser(user: CachedUser): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

/** Read the cached identity, or null when absent/corrupt. */
export function getCachedUser(): CachedUser | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(USER_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CachedUser>;
    if (parsed && (parsed.role === "guest" || parsed.role === "vendor")) {
      return {
        role: parsed.role,
        hasVendorAccess: Boolean(parsed.hasVendorAccess),
      };
    }
    return null;
  } catch {
    return null;
  }
}

/** Drop the cached identity. Called alongside every session clear. */
export function clearCachedUser(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(USER_CACHE_KEY);
  } catch {
    // ignore
  }
}
