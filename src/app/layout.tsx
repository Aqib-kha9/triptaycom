import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Triptay | Premium Digital Experience",
  description: "Next-generation web application built with Next.js, Tailwind CSS, and shadcn/ui.",
};

import { RoleProvider } from "@/components/role-provider";
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { NavigationTracker } from "@/components/navigation/navigation-tracker";
import { SessionGuard } from "@/components/session-guard";
import { WishlistProvider } from "@/context/WishlistContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-24 md:pb-0">
        <RoleProvider>
          <WishlistProvider>
            <NavigationTracker />
            <SessionGuard />
            {children}
            <MobileBottomNav />
          </WishlistProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
