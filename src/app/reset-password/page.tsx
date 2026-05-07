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
  EyeOff
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      router.push("/login");
    }, 3000);
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
                      placeholder="••••••••" 
                      className="h-16 pl-12 rounded-2xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all" 
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 gap-3 group">
                  Update Password
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
