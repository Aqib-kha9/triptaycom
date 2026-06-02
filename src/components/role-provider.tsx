"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { clearAuthData } from "@/lib/auth-utils";

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

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("guest");
  const [isVendorMode, setIsVendorMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasVendorAccess, setHasVendorAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync isVendorMode with role if needed
  useEffect(() => {
    if (role === "vendor") {
      setIsVendorMode(true);
      setHasVendorAccess(true);
    } else {
      setIsVendorMode(false);
    }
  }, [role]);

  // Auth restore check on mount
  useEffect(() => {
    const restoreAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/auth/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const payload = await res.json();
          if (payload.status === "success" && payload.data?.user) {
            const user = payload.data.user;
            setIsLoggedIn(true);

            // Map backend roles (Guest, Vendor, Dual Mode, Admin) to frontend roles (guest, vendor)
            const resolvedRole = user.role.toLowerCase();
            if (resolvedRole === "vendor" || resolvedRole === "dual mode") {
              // Always set vendor role so Navbar / shared pages show vendor UI
              // KYC gating for vendor-specific pages is handled by vendor/layout.tsx
              setRole("vendor");
              setHasVendorAccess(user.kycStatus === "Approved");
            } else {
              setRole("guest");
              setHasVendorAccess(false);
            }
          } else {
            clearAuthData();
          }
        } else {
          clearAuthData();
        }
      } catch (err) {
        console.error("Session restoration error:", err);
      } finally {
        setLoading(false);
      }
    };

    restoreAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 flex-col gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 animate-bounce">
          <span className="text-3xl font-black italic">T</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-500 font-semibold text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          Restoring your session...
        </div>
      </div>
    );
  }

  const logout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const token = localStorage.getItem("token");
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
      setIsLoggedIn(false);
      setRole("guest");
      setHasVendorAccess(false);
      window.location.href = "/login";
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
