"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useRole } from "@/components/role-provider";

const GUEST_RESTRICTED_PATHS = [
  "/",
  "/explore",
  "/stays",
  "/activities",
  "/destinations",
  "/dashboard",
  "/bookings",
  "/wishlist",
  "/reviews"
];

export function RoleGuard(): null {
  const router = useRouter();
  const pathname = usePathname();
  const { isVendorMode } = useRole();

  useEffect(() => {
    if (isVendorMode) {
      // The root path "/" needs an exact match check to avoid matching everything when using startsWith
      const isGuestPath = GUEST_RESTRICTED_PATHS.some(
        (p) => p === "/" ? pathname === "/" : (pathname === p || pathname.startsWith(`${p}/`))
      );

      if (isGuestPath) {
        router.replace("/vendor/dashboard");
      }
    }
  }, [isVendorMode, pathname, router]);

  return null;
}
