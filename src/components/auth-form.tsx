"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Phone, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface AuthFormProps {
  type: "login" | "register";
}

export function AuthForm({ type }: AuthFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStep(2);
      setIsLoading(false);
    }, 1500);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      window.location.href = "/";
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = "/";
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-2xl shadow-zinc-200/50">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">
                {type === "login" ? "Welcome back" : "Create account"}
              </h1>
              <p className="text-zinc-500 mb-8">
                {type === "login" 
                  ? "Enter your details to access your account." 
                  : "Join Triptay to start booking your dream stays."}
              </p>

              <form onSubmit={handleSendOTP} className="space-y-6">
                {type === "register" && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">Full Name</label>
                    <Input 
                      placeholder="John Doe" 
                      className="h-14 rounded-2xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-lg"
                      required
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">Phone or Email</label>
                  <div className="relative">
                    <Input 
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="98765 43210 or name@example.com" 
                      className="h-14 rounded-2xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-lg pl-12"
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                      {identifier.includes("@") ? <Mail className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                <Button 
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 transition-all group"
                >
                  {isLoading ? "Sending..." : "Continue"}
                  {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
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
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 font-bold text-sm text-zinc-700 transition-all flex items-center justify-center active:scale-95 shadow-sm gap-2"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  {isLoading ? "Connecting..." : "Continue with Google"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">Verify OTP</h1>
              <p className="text-zinc-500 mb-8">
                We've sent a 6-digit code to <span className="text-zinc-900 font-bold">{identifier}</span>.
              </p>

              <form onSubmit={handleVerifyOTP} className="space-y-8">
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-full aspect-square text-center text-2xl font-bold rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <Button 
                    disabled={isLoading}
                    className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 transition-all"
                  >
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                  </Button>
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-center text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors"
                  >
                    Change details
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 pt-8 border-t border-zinc-50 text-center">
          <p className="text-zinc-400 text-sm">
            {type === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <Link 
              href={type === "login" ? "/auth/register" : "/auth/login"}
              className="text-primary font-bold hover:underline"
            >
              {type === "login" ? "Create one" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
