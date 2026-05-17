"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-zinc-400 text-sm font-bold tracking-wider uppercase animate-pulse">
        Loading secure portal...
      </div>
    </div>
  );
}
