"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Lock,
  ArrowRight,
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi, ApiError } from "@/lib/api-client";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({ token, password });
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fcfcfc] items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[40px] p-10 md:p-14 border border-zinc-100 shadow-2xl shadow-zinc-200/50 text-center space-y-10"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-8">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Reset Password</h1>
                <p className="text-zinc-500 font-medium leading-relaxed">
                  Enter your new password below. Make sure it's strong and unique.
                </p>
              </div>

              <form className="space-y-6 text-left" onSubmit={handleReset}>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-16 pl-12 pr-12 rounded-2xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                      required
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-16 pl-12 rounded-2xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm font-medium text-red-500 bg-red-50 rounded-2xl px-4 py-3">{error}</p>
                )}

                {!token && (
                  <p className="text-sm font-medium text-amber-600 bg-amber-50 rounded-2xl px-4 py-3">
                    No reset token found. Please use the link from your email.
                  </p>
                )}

                <Button type="submit" disabled={loading || !token} className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 gap-3 group">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
                  {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mx-auto mb-8">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Password Updated!</h1>
                <p className="text-zinc-500 font-medium leading-relaxed">
                  Your password has been changed successfully. You will be redirected to the login page in a few seconds.
                </p>
              </div>

              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-zinc-100 border-t-primary animate-spin" />
              </div>

              <Link href="/login" className="block">
                <Button className="w-full h-16 rounded-2xl text-lg font-bold">Login Now</Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-400" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
