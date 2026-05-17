"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("guest");
  const [isVendorMode, setIsVendorMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to false (public)
  const [hasVendorAccess, setHasVendorAccess] = useState(false);

  // Sync isVendorMode with role if needed
  useEffect(() => {
    if (role === "vendor") {
      setIsVendorMode(true);
      setHasVendorAccess(true); // If they are actively vendor, they definitely have access
    } else {
      setIsVendorMode(false);
    }
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, setRole, isVendorMode, setIsVendorMode, isLoggedIn, setIsLoggedIn, hasVendorAccess, setHasVendorAccess }}>
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
