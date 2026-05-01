"use client";

import { AuthForm } from "@/components/auth-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
      
      <div className="relative z-10 w-full flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2 mb-12">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <span className="text-2xl font-bold">T</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-primary">Triptay</span>
        </Link>
        
        <AuthForm type="register" />
        
        <p className="mt-12 text-zinc-400 text-xs text-center max-w-xs">
          Already a member? <Link href="/auth/login" className="text-primary font-bold">Sign in</Link> instead.
        </p>
      </div>
    </div>
  );
}
