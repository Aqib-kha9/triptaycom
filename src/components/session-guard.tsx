"use client";

/**
 * ─────────────────────────────────────────────────────────────
 * Triptay — Session Guard
 * ─────────────────────────────────────────────────────────────
 *
 * Mounted once in the root layout. The central API client never navigates
 * itself: when an authenticated request is rejected with 401 it clears the
 * stale session and dispatches `AUTH_REQUIRED_EVENT`. This component turns
 * that signal into an in-app (SPA) `router.push` to /login.
 *
 * Why not redirect inside the API client with `window.location`?
 *  - A full-document redirect tears down the running app. The next Back press
 *    then becomes a cold reload of a page the browser is free to discard
 *    instead of instantly restoring — the exact chain that left the homepage
 *    stuck on its loading skeletons.
 *  - `router.push` keeps the app and its providers alive, so Back retraces the
 *    real history (homepage ⇄ login) and instantly restores the previous page.
 *
 * Duplicate signals (several parallel requests can each 401 in the same tick)
 * are coalesced so the user never gets pushed twice.
 */

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AUTH_REQUIRED_EVENT } from "@/lib/api-client";

export function SessionGuard(): null {
  const router = useRouter();
  const lastTarget = useRef<string | null>(null);

  useEffect(() => {
    const onAuthRequired = (event: Event) => {
      const detail = (event as CustomEvent<{ redirect?: string }>).detail;
      const target = detail?.redirect || "/login";

      if (lastTarget.current === target) return;
      lastTarget.current = target;

      // Release the latch shortly after so a later, genuine expiry can still
      // navigate — but a burst of 401s in the same tick only pushes once.
      window.setTimeout(() => {
        if (lastTarget.current === target) lastTarget.current = null;
      }, 1000);

      router.push(target);
    };

    window.addEventListener(AUTH_REQUIRED_EVENT, onAuthRequired);
    return () => window.removeEventListener(AUTH_REQUIRED_EVENT, onAuthRequired);
  }, [router]);

  return null;
}
