"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearAuthData } from "@/lib/auth-utils";
import {
  getSessionToken,
  getCachedUser,
  setCachedUser,
  clearCachedUser,
  type CachedUser,
} from "@/lib/session";

type Role = "guest" | "vendor";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isVendorMode: boolean;
  setIsVendorMode: (val: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  hasVendorAccess: boolean;
  setHasVendorAccess: (val: boolean) => void;
  logout: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

/**
 * Map a backend user object onto the frontend role + vendor-access flags.
 * Backend roles are "Guest" | "Vendor" | "Dual Mode" | "Admin".
 */
function resolveUserFlags(user: { role?: string; kycStatus?: string }): CachedUser {
  const resolvedRole = (user.role || "").toLowerCase();
  const isVendor = resolvedRole === "vendor" || resolvedRole === "dual mode";
  return {
    role: isVendor ? "vendor" : "guest",
    hasVendorAccess: isVendor ? user.kycStatus === "Approved" : false,
  };
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>("guest");
  const [isVendorMode, setIsVendorMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasVendorAccess, setHasVendorAccess] = useState(false);

  // Sync isVendorMode with role if needed
  useEffect(() => {
    if (role === "vendor") {
      setIsVendorMode(true);
      setHasVendorAccess(true);
    } else {
      setIsVendorMode(false);
    }
  }, [role]);

  // Restore auth state.
  //
  // This is intentionally NON-BLOCKING: the last known identity is hydrated
  // from a local cache so the app renders instantly, then the token is
  // revalidated against the backend in the background. A blocking
  // "restoring session" splash here would freeze EVERY page behind a network
  // round-trip — and stall for the full timeout whenever the API is cold —
  // which is an anti-pattern that would frustrate real users. Route access is
  // already enforced server-side by proxy.ts, so the client never needs to
  // gate rendering on this call.
  useEffect(() => {
    let isMounted = true;
    const token = getSessionToken();

    if (!token) {
      clearCachedUser();
      setIsLoggedIn(false);
      setRole("guest");
      setHasVendorAccess(false);
      return;
    }

    // 1. Optimistic paint from the cached identity (instant, no network).
    const cached = getCachedUser();
    if (cached) {
      setIsLoggedIn(true);
      setRole(cached.role);
      setHasVendorAccess(cached.hasVendorAccess);
    } else {
      // A token exists but the identity was never cached — assume signed in
      // rather than flashing a signed-out UI before validation completes.
      setIsLoggedIn(true);
    }

    // 2. Background revalidation. Never blocks rendering.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const validate = async () => {
      try {
        const res = await fetch(`${apiUrl}/auth/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        // An explicit auth rejection means the token is genuinely invalid.
        if (res.status === 401 || res.status === 403) {
          if (!isMounted) return;
          clearAuthData();
          clearCachedUser();
          setIsLoggedIn(false);
          setRole("guest");
          setHasVendorAccess(false);
          return;
        }

        if (res.ok) {
          const payload = await res.json();
          if (payload.status === "success" && payload.data?.user) {
            if (!isMounted) return;
            const flags = resolveUserFlags(payload.data.user);
            setIsLoggedIn(true);
            setRole(flags.role);
            setHasVendorAccess(flags.hasVendorAccess);
            setCachedUser(flags);
          } else {
            // Malformed success payload — treat as unauthenticated.
            if (!isMounted) return;
            clearAuthData();
            clearCachedUser();
            setIsLoggedIn(false);
            setRole("guest");
            setHasVendorAccess(false);
          }
        }
        // Any other status (e.g. 5xx) is transient: keep the optimistic state
        // and the stored session rather than silently logging the user out.
      } catch {
        // Network failure or our abort timeout — NOT an invalid session.
        // Keep the optimistic state and the stored session.
      } finally {
        clearTimeout(timeoutId);
      }
    };

    validate();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const logout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const token = getSessionToken();
      await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      clearAuthData();
      clearCachedUser();
      setIsLoggedIn(false);
      setRole("guest");
      setHasVendorAccess(false);
      // Use SPA navigation, not window.location. A full-document redirect tears
      // the running app down, so the following Back press becomes a cold reload
      // instead of an instant back-forward-cache restore — which is exactly the
      // chain that left pages frozen on their loading skeletons.
      router.replace("/login");
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole, isVendorMode, setIsVendorMode, isLoggedIn, setIsLoggedIn, hasVendorAccess, setHasVendorAccess, logout }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
