"use client";

import { useNavigationTracker } from "@/lib/navigation";

/**
 * Invisible, globally mounted component that records the user's in-app
 * navigation sequence so back buttons can retrace it. Renders nothing.
 *
 * Mounted once in the root layout.
 */
export function NavigationTracker(): null {
    useNavigationTracker();
    return null;
}
