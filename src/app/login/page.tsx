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
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRole } from "@/components/role-provider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [step, setStep] = useState<"identifier" | "otp" | "register">("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"guest" | "vendor">("guest");
  const [detectedType, setDetectedType] = useState<"email" | "mobile" | "unknown">("unknown");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setIsLoggedIn, setRole, setHasVendorAccess } = useRole();
  const router = useRouter();

  const isEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const isMobile = (val: string) => {
    const stripped = val.replace(/[\s\-\+\(\)]/g, "");
    return /^\d{7,15}$/.test(stripped);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      if (isEmail(identifier)) {
        setDetectedType("email");
        setStep("otp");
      } else if (isMobile(identifier)) {
        setDetectedType("mobile");
        setStep("otp");
      } else {
        setError("Please enter a valid email address or mobile number.");
      }
    }, 800);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError("Please enter a valid verification code.");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      
      const cleanIdentifier = identifier.trim();
      const isVendor = 
        cleanIdentifier === "vendor@example.com" || 
        cleanIdentifier.replace(/[\s\-\+\(\)]/g, "").includes("9999999999");
        
      const isGuest = 
        cleanIdentifier === "aqib@example.com" || 
        cleanIdentifier.replace(/[\s\-\+\(\)]/g, "").includes("9876543210");

      if (isVendor) {
        setHasVendorAccess(true);
        setRole("vendor");
        setIsLoggedIn(true);
        router.push("/vendor/dashboard");
      } else if (isGuest) {
        setRole("guest");
        setIsLoggedIn(true);
        router.push("/");
      } else {
        setStep("register");
      }
    }, 1000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (selectedRole === "vendor") {
        setHasVendorAccess(true);
      }
      setRole(selectedRole);
      setIsLoggedIn(true);
      router.push("/");
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRole("guest");
      setIsLoggedIn(true);
      router.push("/");
    }, 1200);
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
              {step === "otp" ? "Verify Code" : step === "register" ? "Complete Profile" : "Login or Register"}
            </h2>
            <p className="text-zinc-500 font-medium text-sm">
              {step === "otp" 
                ? `Enter the 6-digit secure code sent to you` 
                : step === "register"
                ? "Let us know your name to personalize your dashboard"
                : "Enter your email or mobile number. If you are new, we will register you instantly."}
            </p>
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
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input 
                      required 
                      type="text" 
                      placeholder="name@example.com or +91..." 
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (error) setError("");
                      }}
                      className="h-14 pl-12 rounded-2xl border-zinc-200 bg-zinc-50 focus:bg-white transition-all text-sm font-semibold"
                    />
                  </div>
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
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
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
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Enter 6-digit OTP</label>
                    <Input 
                      required 
                      autoFocus
                      maxLength={6}
                      placeholder="0 0 0 0 0 0" 
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        if (error) setError("");
                      }}
                      className="h-16 text-center text-3xl font-black tracking-[1em] rounded-2xl border-zinc-200 bg-zinc-50 focus:bg-white transition-all pl-4" 
                    />
                  </div>
                  {error && <p className="text-xs font-bold text-rose-500 px-1">{error}</p>}
                  <div className="flex justify-center">
                    <button type="button" className="text-xs font-bold text-zinc-400 hover:text-primary flex items-center gap-2 transition-colors">
                      <RefreshCcw className="w-3.5 h-3.5" />
                      Resend Code in 0:45
                    </button>
                  </div>
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
                      className="h-14 pl-12 rounded-2xl border-zinc-200 bg-zinc-50 focus:bg-white transition-all text-sm font-semibold"
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
                  <input required type="checkbox" className="mt-1 w-3.5 h-3.5 rounded border-zinc-300 text-primary focus:ring-primary" />
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                    By registering, you agree to Triptay's{" "}
                    <Link href="/terms" className="text-primary font-bold hover:underline">Terms</Link> &{" "}
                    <Link href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
                  </p>
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
