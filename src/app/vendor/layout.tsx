"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, ShieldAlert, Clock, CheckCircle2, RefreshCw, WifiOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { clearAuthData, getToken } from "@/lib/auth-utils";

type KycGate = "loading" | "approved" | "pending" | "rejected" | "not_submitted" | "error";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [kycGate, setKycGate] = useState<KycGate>("loading");

  // /vendor/onboarding is the only vendor page that doesn't require KYC approval
  const isOnboardingPage = pathname === "/vendor/onboarding";

  useEffect(() => {
    // No KYC check needed on the onboarding page itself — it handles its own logic
    if (isOnboardingPage) {
      setKycGate("approved"); // bypass KYC check, let page handle itself
      return;
    }

    let cancelled = false;

    const checkKyc = async () => {
      const token = getToken();
      if (!token) {
        clearAuthData();
        router.push("/login");
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 401 / 403 — genuinely expired/invalid token → wipe and redirect
        if (res.status === 401 || res.status === 403) {
          clearAuthData();
          router.push("/login");
          return;
        }

        // 429 (rate-limited), 5xx (server error), or any other non-200 → show retry UI, DON'T redirect
        if (!res.ok) {
          if (!cancelled) setKycGate("error");
          return;
        }

        const payload = await res.json();
        const user = payload.data?.user;

        if (!user) {
          clearAuthData();
          router.push("/login");
          return;
        }

        const resolvedRole: string = (user.role || "").toLowerCase();
        const isVendor = resolvedRole === "vendor" || resolvedRole === "dual mode";

        if (!isVendor) {
          router.replace("/dashboard");
          return;
        }

        // Route based on KYC status
        const status: string = user.kycStatus || "Not Submitted";

        if (status === "Approved") {
          if (!cancelled) setKycGate("approved");
        } else if (status === "Pending") {
          if (!cancelled) setKycGate("pending");
        } else if (status === "Rejected") {
          if (!cancelled) setKycGate("rejected");
        } else {
          if (!cancelled) setKycGate("not_submitted");
        }
      } catch (err) {
        console.error("Vendor KYC check error:", err);
        if (!cancelled) setKycGate("error"); // network error → retry UI, not redirect
      }
    };

    checkKyc();
    return () => { cancelled = true; };
  }, [pathname, isOnboardingPage, router]);

  // ── Loading ──────────────────────────────────────────
  if (kycGate === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcfcfc] flex-col gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-bold text-zinc-500">Verifying vendor access...</p>
      </div>
    );
  }

  // ── Transient error (network / rate-limit / server) ───
  if (kycGate === "error") {
    const handleRetry = () => {
      setKycGate("loading");
      // Force a re-render which triggers the effect again
      router.refresh();
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcfcfc] flex-col gap-6 px-4">
        <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-lg shadow-amber-100/50">
          <WifiOff className="w-10 h-10" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-zinc-900">Connection Issue</h2>
          <p className="text-sm text-zinc-500 max-w-md leading-relaxed">
            Unable to reach the server right now. This could be due to a temporary
            network issue or server overload. Your session is still active — just try again.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleRetry}
            className="rounded-xl h-11 px-8 text-xs font-bold gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Now
          </Button>
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="rounded-xl h-11 px-8 text-xs font-bold border-zinc-200 hover:bg-zinc-50 text-zinc-600"
            >
              Go to Guest Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ── KYC Pending (submitted, awaiting review) ─────────
  if (kycGate === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcfcfc] flex-col gap-6 px-4">
        <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-lg shadow-amber-100/50">
          <Clock className="w-10 h-10 animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-zinc-900">Application Under Review</h2>
          <p className="text-sm text-zinc-500 max-w-md leading-relaxed">
            Your KYC documents have been submitted and are currently being reviewed by the admin team.
            This typically takes 24–48 hours. You will be notified once approved.
          </p>
        </div>
        <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 max-w-sm w-full space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-700">Documents Submitted</p>
              <p className="text-[10px] text-zinc-400 font-medium">Your PAN, GST, bank details and ID documents have been received.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
            <div>
              <p className="text-xs font-bold text-zinc-700">Verification in Progress</p>
              <p className="text-[10px] text-zinc-400 font-medium">Admin is reviewing your PAN, GST and identity documents.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
            <div>
              <p className="text-xs font-bold text-zinc-700">Notification Alert</p>
              <p className="text-[10px] text-zinc-400 font-medium">You will get notified once your KYC is approved. Only then can you access your vendor dashboard.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard">
            <Button className="rounded-xl h-11 px-8 text-xs font-bold gap-2">
              Go to Guest Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="rounded-xl h-11 px-8 text-xs font-bold border-zinc-200 hover:bg-zinc-50 text-zinc-600">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ── KYC Rejected or Not Submitted ────────────────────
  if (kycGate === "rejected" || kycGate === "not_submitted") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcfcfc] flex-col gap-4 px-4">
        <ShieldAlert className="w-12 h-12 text-amber-500" />
        <h2 className="text-lg font-bold text-zinc-900 text-center">
          {kycGate === "rejected" ? "KYC Rejected" : "KYC Required"}
        </h2>
        <p className="text-sm text-zinc-500 max-w-sm text-center">
          {kycGate === "rejected"
            ? "Your KYC application was rejected. Please re-submit with correct information."
            : "Please complete your vendor onboarding to access vendor features."}
        </p>
        <Link href="/vendor/onboarding">
          <Button className="rounded-xl h-11 px-6 text-xs font-bold gap-2">
            Go to Onboarding
          </Button>
        </Link>
      </div>
    );
  }

  // KYC is approved — render children
  return <>{children}</>;
}