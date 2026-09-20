"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * History-aware back navigation.
 *
 * Problem this solves: every "back" affordance in the app used to be a
 * hardcoded `<Link href="/some-parent">`. If a user walked
 * `home → /stays → /stays/42 → /checkout/listing/42` and pressed back, they
 * were teleported to a fixed parent route instead of retracing the path they
 * actually took.
 *
 * There is no reliable browser API to ask "how many in-app entries do I have?"
 * (`window.history.length` also counts other origins/sites). So we maintain our
 * own ordered stack of visited in-app entries in `sessionStorage`, together
 * with the index of the current position.
 *
 * - Forward navigation (pathname change, no popstate) pushes a new entry.
 * - Browser back/forward (popstate) moves the index inside the stack.
 * - Refresh / re-render of the same entry is a no-op.
 *
 * `goBack()` then walks the index back one step, and only when there is no
 * in-app history (direct deep link, new tab, bookmark) does it fall back to a
 * sensible parent route.
 */

/** sessionStorage keys for the visited-entry stack + current index. */
const STACK_KEY = "__triptay_nav_stack";
const INDEX_KEY = "__triptay_nav_index";

/** Cap so a long session can never grow storage unbounded. */
const MAX_STACK = 100;

/** The router object returned by `useRouter()`. */
export type AppRouter = ReturnType<typeof useRouter>;

/**
 * Entry we just arrived at through a popstate (browser back/forward). The next
 * route-change sync should not be treated as a forward push.
 */
let poppedEntry: string | null = null;

/** Identity of a history entry: path + query, read live from the location. */
function currentEntry(): string {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}`;
}

function readStack(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(STACK_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is string => typeof entry === "string");
  } catch {
    // sessionStorage can throw when disabled / in private mode.
    return [];
  }
}

function writeStack(stack: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STACK_KEY, JSON.stringify(stack.slice(-MAX_STACK)));
  } catch {
    // Ignore — we degrade to "no in-app history" and use the fallback.
  }
}

function readIndex(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.sessionStorage.getItem(INDEX_KEY);
    const parsed = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

function writeIndex(index: number): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(INDEX_KEY, String(Math.max(0, index)));
  } catch {
    // Ignore.
  }
}

/**
 * Record the current URL as a forward navigation.
 * Idempotent: revisiting the tracked current entry (refresh, back/forward,
 * re-render) does not push a duplicate.
 */
export function rememberNavigation(): void {
  if (typeof window === "undefined") return;

  const entry = currentEntry();
  const stack = readStack();
  const index = readIndex();

  if (poppedEntry !== null) {
    if (poppedEntry === entry) {
      // Consumed by the pop handler already — nothing to push.
      poppedEntry = null;
      return;
    }
    // Stale marker (pop did not change the route) — drop it and continue.
    poppedEntry = null;
  }

  if (stack[index] === entry) return;

  if (stack.length === 0) {
    // First entry of this tab: remember it, but there is nothing behind it.
    writeStack([entry]);
    writeIndex(0);
    return;
  }

  // Forward navigation: discard any forward-history tail, then push.
  const nextStack = [...stack.slice(0, index + 1), entry];
  writeStack(nextStack);
  writeIndex(nextStack.length - 1);
}

/** Handle browser back/forward: move the index inside the tracked stack. */
function handlePopState(): void {
  const entry = currentEntry();
  const stack = readStack();
  const index = readIndex();

  // Prefer the nearest previous occurrence (this was a back move).
  let found = -1;
  for (let i = Math.min(index, stack.length - 1) - 1; i >= 0; i--) {
    if (stack[i] === entry) {
      found = i;
      break;
    }
  }
  // Otherwise this was a forward move — find it ahead of the current index.
  if (found < 0) found = stack.lastIndexOf(entry);

  if (found >= 0) {
    writeIndex(found);
  } else {
    // Untracked entry (bf-cache page, entry from another tab, …): treat it as
    // a fresh position with nothing behind it.
    writeStack([entry]);
    writeIndex(0);
  }

  poppedEntry = entry;
}

/**
 * Build a same-origin `/login?redirect=<current path>` href for a signed-out
 * gated action.
 *
 * The caller is expected to navigate with the SPA router so the app loads once
 * and the browser Back button retraces the real history (home -> login), rather
 * than performing a hard full-document redirect that replaces the SPA session
 * and hardens the page against instant Back restores.
 */
export function buildLoginHref(): string {
  if (typeof window === "undefined") return "/login";
  const target = `${window.location.pathname}${window.location.search}`;
  if (target === "/login" || target.startsWith("/login/") || target.startsWith("/login?")) {
    return "/login";
  }
  return `/login?redirect=${encodeURIComponent(target)}`;
}

/**
 * Read and validate the post-login return target from a `?redirect=` value.
 * Only same-origin absolute paths are accepted, so a crafted link can never
 * bounce the user off-site after authenticating.
 */
export function readLoginRedirect(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

/** Number of in-app forward navigations behind the current page. */
export function getInternalNavDepth(): number {
  return readIndex();
}

/** True when there is at least one in-app page to go back to. */
export function hasInternalHistory(): boolean {
  return readIndex() > 0;
}

/**
 * Go back to the previous page in the user's own navigation sequence.
 * Falls back to `fallback` when the user landed directly (deep link, new tab,
 * bookmark, refresh on a deep page) so back never dead-ends.
 */
export function goBack(router: AppRouter, fallback = "/"): void {
  if (typeof window === "undefined") {
    router.push(fallback);
    return;
  }

  const index = readIndex();
  const stack = readStack();

  if (index > 0 && stack.length > 1 && window.history.length > 1) {
    // Do NOT move the index here. `router.back()` fires a popstate and
    // `handlePopState()` recomputes the position from the entry the browser
    // actually lands on. Pre-decrementing here advanced the index twice for
    // every press, so repeated back presses desynced from real history and
    // could bounce the user between two pages (or fall through to `fallback`).
    router.back();
    return;
  }

  router.push(fallback);
}

/**
 * Hook form of `goBack` — returns a stable click handler bound to `fallback`.
 */
export function useBackNavigation(fallback = "/"): () => void {
  const router = useRouter();
  return useCallback(() => goBack(router, fallback), [router, fallback]);
}

/**
 * Keeps the internal stack in sync with both link navigation and browser
 * back/forward. Mount this once, globally.
 */
export function useNavigationTracker(): void {
  const pathname = usePathname();

  useEffect(() => {
    const onPopState = () => handlePopState();
    // A back/forward restore from the browser's back-forward cache (bfcache)
    // can revive a page without React remounting it, without firing a normal
    // `popstate`, and — critically — with its previous render frozen. Re-sync
    // the tracked position and let pages that register a restore listener
    // recover their transient loading state.
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      const entry = currentEntry();
      const stack = readStack();
      const index = readIndex();
      if (stack[index] !== entry) {
        const found = stack.lastIndexOf(entry);
        if (found >= 0) writeIndex(found);
      }
      window.dispatchEvent(new Event("triptay:pageshow"));
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  useEffect(() => {
    rememberNavigation();
  }, [pathname]);
}
