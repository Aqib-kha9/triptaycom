"use client";

import { useRole } from "@/components/role-provider";
import { NavbarPublic } from "./navigation/navbar-public";
import { NavbarUser } from "./navigation/navbar-user";
import { NavbarVendor } from "./navigation/navbar-vendor";
import { useEffect, useState } from "react";

export function Navbar() {
  const { isLoggedIn, role } = useRole();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <NavbarPublic />; // Default to public while loading
  }

  if (!isLoggedIn) {
    return <NavbarPublic />;
  }

  if (role === "vendor") {
    return <NavbarVendor />;
  }

  return <NavbarUser />;
}
