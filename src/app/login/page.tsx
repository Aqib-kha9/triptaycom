"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  ArrowRight,
  ChevronLeft,
  Smartphone,
  ShieldCheck,
  RefreshCcw,
  Pencil,
  Loader2,
  User,
  CheckCircle2,
  Store
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRole } from "@/components/role-provider";
import { useRouter } from "next/navigation";

const OTPInput = ({ otp, setOtp, error, setError }: { otp: string, setOtp: (val: string) => void, error: string, setError: (val: string) => void }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/[^0-9]/g, "");

    if (!val) {
      const newOtp = otp.split("");
      newOtp[index] = "";
      setOtp(newOtp.join(""));
      return;
    }

    if (val.length > 1) {
      // Check if user just typed an extra digit without selecting
      if (val.length === 2 && otp[index] && val.startsWith(otp[index])) {
        const newOtp = otp.split("");
        newOtp[index] = val[1];
        setOtp(newOtp.join(""));
        if (error) setError("");
        if (index < 5) inputRefs.current[index + 1]?.focus();
        return;
      }

      // Treat as full paste / autofill
      const pastedData = val.slice(0, 6);
      setOtp(pastedData);
      if (error) setError("");
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
      return;
    }

    // Single character entered
    const newOtp = otp.split("");
    newOtp[index] = val;
    setOtp(newOtp.join(""));
    if (error) setError("");

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = otp.split("");
        newOtp[index] = "";
        setOtp(newOtp.join(""));
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (paste) {
      setOtp(paste);
      if (error) setError("");
      inputRefs.current[Math.min(paste.length - 1, 5)]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-1 sm:gap-2 w-full">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          autoFocus={index === 0}
          value={otp[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={cn(
            "w-[45px] h-[55px] sm:w-[50px] sm:h-[60px] md:w-[60px] md:h-[70px] text-center text-xl md:text-3xl font-black rounded-xl border-2 transition-all outline-none",
            error ? "border-rose-300 focus:border-rose-500 bg-rose-50" : "border-zinc-200 bg-zinc-50 focus:bg-white focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
          )}
        />
      ))}
    </div>
  );
};

export default function LoginPage() {
  const [step, setStep] = useState<"identifier" | "otp" | "register">("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [receivedOtp, setReceivedOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"guest" | "vendor">("guest");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [detectedType, setDetectedType] = useState<"email" | "mobile" | "unknown">("unknown");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { setIsLoggedIn, setRole, setHasVendorAccess } = useRole();
  const router = useRouter();

  // ──────────── Countdown timer ────────────
  const stopCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const startCountdown = useCallback(() => {
    stopCountdown();
    setCountdown(45);
    setCanResend(false);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          stopCountdown();
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopCountdown]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCountdown();
  }, [stopCountdown]);

  const handleResendOtp = async () => {
    if (!canResend || resendLoading) return;
    const cleanId = identifier.trim();
    if (!cleanId) return;

    setResendLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: cleanId }),
      });
      const data = await res.json();

      if (res.ok) {
        setReceivedOtp(data.devCode || "");
        setOtp("");
        startCountdown();
      } else {
        setError(data.message || "Failed to resend code.");
      }
    } catch {
      setError("Could not connect to the authentication server.");
    } finally {
      setResendLoading(false);
    }
  };

  const isEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const isMobile = (val: string) => {
    const stripped = val.replace(/[\s\-\+\(\)]/g, "");
    return /^\d{10}$/.test(stripped);
  };

  const isMobileTooLong = (val: string) => {
    const stripped = val.replace(/[\s\-\+\(\)]/g, "");
    return /^\d{11,}$/.test(stripped);
  };

  const getIdentifierStatus = () => {
    const val = identifier.trim();
    if (!val) return "empty";
    if (isEmail(val)) return "valid-email";
    if (isMobileTooLong(val)) return "mobile-too-long";
    if (isMobile(val)) return "valid-mobile";

    if (val.includes("@")) return "invalid-email";

    const stripped = val.replace(/[\s\-\+\(\)]/g, "");
    if (/^\d+$/.test(stripped) || val.startsWith("+")) {
      return "invalid-mobile";
    }

    return "invalid";
  };

  const getComputedEmail = (val: string) => {
    const trimmed = val.trim();
    if (isEmail(trimmed)) {
      return trimmed.toLowerCase();
    }
    if (isMobile(trimmed)) {
      const cleanMobile = trimmed.replace(/[\s\-\+\(\)]/g, "");
      return `${cleanMobile}@triptay.com`;
    }
    return "";
  };

  // ─── Routing helper: determines where to send the user after auth ───
  const routeAfterAuth = (user: any) => {
    const resolvedRole: string = (user.role || "guest").toLowerCase();
    const isVendorOrDual = resolvedRole === "vendor" || resolvedRole === "dual mode";

    if (isVendorOrDual) {
      // Always show vendor navbar/UI; KYC gating is handled by vendor/layout.tsx
      setRole("vendor");
      setHasVendorAccess(user.kycStatus === "Approved");

      // KYC must be Approved for vendor dashboard access
      if (user.kycStatus === "Approved") {
        router.push("/vendor/dashboard");
      } else {
        // Pending / Rejected / Not Submitted → force onboarding
        router.push("/vendor/onboarding");
      }
    } else {
      // Guest / Admin → go to traveler dashboard
      setHasVendorAccess(false);
      setRole("guest");
      router.push("/dashboard");
    }
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim();
    if (!cleanId) return;

    if (isMobileTooLong(cleanId)) {
      setError("Mobile number must be exactly 10 digits. Please check and try again.");
      return;
    }

    const isMailId = isEmail(cleanId);
    const isMobId = isMobile(cleanId);

    if (!isMailId && !isMobId) {
      setError("Please enter a valid email address or mobile number.");
      return;
    }

    setLoading(true);
    setError("");
    setReceivedOtp("");

    const isSystemAdmin = cleanId.toLowerCase() === "admin@triptay.com";
    setIsAdmin(isSystemAdmin);

    if (isSystemAdmin) {
      setLoading(false);
      setStep("otp");
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ identifier: cleanId })
      });

      const data = await res.json();

      if (res.ok) {
        setReceivedOtp(data.devCode || "");
        setDetectedType(isMailId ? "email" : "mobile");
        setStep("otp");
        startCountdown();
      } else {
        setError(data.message || "Failed to generate verification code.");
      }
    } catch (err) {
      console.error(err);
      setError("Could not connect to the authentication server.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim();

    if (isAdmin) {
      if (!password) {
        setError("Please enter the admin password.");
        return;
      }
    } else {
      if (otp.length < 6) {
        setError("Please enter the 6-digit verification code.");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      if (isAdmin) {
        // Admin verification
        const res = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: cleanId, password })
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          // Also set a non-httpOnly cookie so the Next.js proxy can read it
          document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
          setIsLoggedIn(true);
          setRole("guest");
          setHasVendorAccess(false);
          router.push("/dashboard");
        } else {
          setError(data.message || "Invalid Admin password.");
        }
      } else {
        // Normal user verification
        const res = await fetch(`${apiUrl}/auth/verify-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ identifier: cleanId, code: otp })
        });

        const data = await res.json();

        if (res.ok) {
          if (data.action === "register") {
            // New user → go to registration (Complete Profile) step
            setStep("register");
          } else {
            // Existing user → save token and route based on role + kycStatus
            localStorage.setItem("token", data.token);
            // Also set a non-httpOnly cookie so the Next.js proxy can read it
            // (backend's httpOnly cookie is on localhost:5000 — unreachable from localhost:3000 proxy)
            document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
            setIsLoggedIn(true);
            routeAfterAuth(data.data.user);
          }
        } else {
          setError(data.message || "Incorrect verification code.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed during verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setLoading(true);
    setError("");

    try {
      const cleanId = identifier.trim();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const res = await fetch(`${apiUrl}/auth/register-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: fullName,
          identifier: cleanId,
          role: selectedRole
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        // Also set a non-httpOnly cookie so the Next.js proxy can read it
        document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
        setIsLoggedIn(true);

        // New vendor → kycStatus will be "Pending", so they go to onboarding
        // New guest → kycStatus will be "Not Submitted", so they go to dashboard
        routeAfterAuth(data.data.user);
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Registration server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: "google_explorer@triptay.com",
          name: "Google Explorer"
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        // Also set a non-httpOnly cookie so the Next.js proxy can read it
        document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
        setIsLoggedIn(true);
        setRole("guest");
        setHasVendorAccess(false);
        router.push("/dashboard");
      } else {
        setError(data.message || "Google authentication failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Google Auth connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Column: Visual/Marketing */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200"
            alt="Travel"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-lg p-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white mb-8 shadow-2xl shadow-primary/40">
              <span className="text-3xl font-black italic">T</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-tight mb-6">
              Welcome back to <span className="text-primary">Triptay.</span>
            </h1>
            <p className="text-xl text-zinc-300 font-medium leading-relaxed mb-8">
              "The world is a book and those who do not travel read only one page."
            </p>
            <div className="flex items-center gap-4 text-sm font-bold text-zinc-400">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <span>Join 50k+ explorers</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-24 justify-center relative">
        <Link href="/" className="absolute top-8 left-8 lg:left-24 text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-2 font-bold text-sm">
          <ChevronLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="max-w-md mx-auto w-full space-y-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
              {step === "otp" ? (isAdmin ? "Enter Admin Password" : "Verify Code") : step === "register" ? "Complete Profile" : "Login or Register"}
            </h2>
            <p className="text-zinc-500 font-medium text-sm">
              {step === "otp"
                ? (isAdmin ? "Verify your identity as Superadmin" : `Enter the 6-digit secure code sent to you`)
                : step === "register"
                  ? "Let us know your name to personalize your dashboard"
                  : "Enter your email or mobile number. If you are new, we will register you instantly."}
            </p>
            {step === "otp" && receivedOtp && (
              <div className="mt-4 p-3.5 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500">Test Verification Code:</span>
                <span className="text-sm font-black tracking-wider text-primary bg-white border border-primary/25 px-2.5 py-1 rounded-xl shadow-sm select-all">{receivedOtp}</span>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {step === "identifier" && (
              <motion.form
                key="identifier"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                onSubmit={handleContinue}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Email or Mobile Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 transition-all duration-300">
                      {getIdentifierStatus() === "valid-mobile" || getIdentifierStatus() === "invalid-mobile" || getIdentifierStatus() === "mobile-too-long" ? (
                        <Smartphone className="w-4 h-4 text-primary transition-all scale-100 animate-in fade-in duration-200" />
                      ) : (
                        <Mail className="w-4 h-4 transition-all scale-100 animate-in fade-in duration-200" />
                      )}
                    </div>
                    <Input
                      required
                      type="text"
                      placeholder="name@example.com or +91..."
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (error) setError("");
                      }}
                      className={cn(
                        "h-14 pl-12 pr-12 rounded-2xl bg-white transition-all text-sm font-semibold border duration-300 outline-none w-full",
                        getIdentifierStatus() === "valid-email" || getIdentifierStatus() === "valid-mobile"
                          ? "border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                          : getIdentifierStatus() === "invalid-email" || getIdentifierStatus() === "invalid-mobile" || getIdentifierStatus() === "mobile-too-long"
                            ? "border-rose-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                            : "border-zinc-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                      )}
                    />

                    {/* Status Indicators on the right side */}
                    {(getIdentifierStatus() === "valid-email" || getIdentifierStatus() === "valid-mobile") && (
                      <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 animate-in fade-in zoom-in-75 duration-300" />
                    )}
                    {(getIdentifierStatus() === "invalid-email" || getIdentifierStatus() === "invalid-mobile") && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-extrabold uppercase tracking-wider text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md animate-in fade-in slide-in-from-right-2 duration-300 select-none">
                        Invalid Format
                      </span>
                    )}
                    {getIdentifierStatus() === "mobile-too-long" && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md animate-in fade-in slide-in-from-right-2 duration-300 select-none">
                        Too Long
                      </span>
                    )}
                  </div>
                  {getIdentifierStatus() === "mobile-too-long" && (
                    <p className="text-xs font-bold text-amber-600 px-1">
                      Mobile number must be exactly 10 digits. You entered {identifier.replace(/[\s\-\+\(\)]/g, "").length} digits.
                    </p>
                  )}
                  {error && <p className="text-xs font-bold text-rose-500 px-1">{error}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-2xl text-md font-bold shadow-lg shadow-primary/20 gap-2 group flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-zinc-150"></div>
                  <span className="flex-shrink mx-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">or</span>
                  <div className="flex-grow border-t border-zinc-150"></div>
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full h-14 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 font-bold text-sm text-zinc-700 transition-all flex items-center justify-center active:scale-95 shadow-sm gap-2"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  {loading ? "Connecting..." : "Continue with Google"}
                </button>
              </motion.form>
            )}

            {step === "otp" && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                onSubmit={handleOtpVerify}
                className="space-y-6"
              >
                {/* Back / Identifier View */}
                <div className="flex items-center justify-between p-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Destination</span>
                    <span className="text-sm font-semibold text-zinc-700">{identifier}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("identifier");
                      setError("");
                    }}
                    className="p-2 text-zinc-400 hover:text-primary transition-colors bg-white rounded-xl border border-zinc-150 shadow-sm"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {isAdmin ? (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Enter Admin Password</label>
                      <Input
                        required
                        autoFocus
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (error) setError("");
                        }}
                        className="h-14 px-4 rounded-2xl border border-zinc-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold outline-none"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Enter 6-digit OTP</label>
                      <OTPInput otp={otp} setOtp={setOtp} error={error} setError={setError} />
                    </div>
                  )}
                  {/* Dev OTP banner — shows the OTP code during development (no SMS gateway) */}
                  {!isAdmin && receivedOtp && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Dev OTP</span>
                      <code className="text-lg font-black text-amber-800 tracking-[0.3em] ml-auto">{receivedOtp}</code>
                    </div>
                  )}
                  {error && <p className="text-xs font-bold text-rose-500 px-1">{error}</p>}
                  {!isAdmin && (
                    <div className="flex justify-center">
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={resendLoading}
                          className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-2 transition-colors"
                        >
                          {resendLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <RefreshCcw className="w-3.5 h-3.5" />
                          )}
                          {resendLoading ? "Resending..." : "Resend Code"}
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-zinc-400 flex items-center gap-2">
                          <RefreshCcw className="w-3.5 h-3.5" />
                          Resend Code in 0:{countdown.toString().padStart(2, "0")}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-2xl text-md font-bold shadow-lg shadow-primary/20 gap-2 group flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Verify & Continue
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.form>
            )}

            {step === "register" && (
              <motion.form
                key="register"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                onSubmit={handleRegisterSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                      required
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-14 pl-12 rounded-2xl border border-zinc-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* Optional Role Selection Card */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Select Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole("guest")}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all cursor-pointer",
                        selectedRole === "guest"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-zinc-150 bg-white hover:bg-zinc-50 text-zinc-500"
                      )}
                    >
                      <User className="w-5 h-5" />
                      <div>
                        <p className="text-xs font-bold">Traveler</p>
                        <p className="text-[9px] opacity-75">Book stays</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole("vendor")}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all cursor-pointer",
                        selectedRole === "vendor"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-zinc-150 bg-white hover:bg-zinc-50 text-zinc-500"
                      )}
                    >
                      <Store className="w-5 h-5" />
                      <div>
                        <p className="text-xs font-bold">Host / Vendor</p>
                        <p className="text-[9px] opacity-75">List properties</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-1">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-3.5 h-3.5 rounded border-zinc-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                    By registering, you agree to Triptay's{" "}
                    <Link href="/terms" className="text-primary font-bold hover:underline">Terms</Link> &{" "}
                    <Link href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !agreedToTerms}
                  className="w-full h-14 rounded-2xl text-md font-bold shadow-lg shadow-primary/20 gap-2 group flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create Account & Explore
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
