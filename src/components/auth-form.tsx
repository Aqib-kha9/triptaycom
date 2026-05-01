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
