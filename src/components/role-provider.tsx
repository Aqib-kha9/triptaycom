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
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("guest");
  const [isVendorMode, setIsVendorMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to false (public)

  // Sync isVendorMode with role if needed
  useEffect(() => {
    if (role === "vendor") {
      setIsVendorMode(true);
    } else {
      setIsVendorMode(false);
    }
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, setRole, isVendorMode, setIsVendorMode, isLoggedIn, setIsLoggedIn }}>
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
