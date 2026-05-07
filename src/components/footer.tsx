"use client";

import { useRole } from "@/components/role-provider";
import { FooterPublic } from "./navigation/footer-public";
import { FooterPrivate } from "./navigation/footer-private";

export function Footer() {
  const { isLoggedIn } = useRole();

  if (!isLoggedIn) {
    return <FooterPublic />;
  }

  return <FooterPrivate />;
}
