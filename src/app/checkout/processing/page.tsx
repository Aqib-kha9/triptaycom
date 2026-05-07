"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  RefreshCcw,
  CheckCircle2,
  Building2
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 1, text: "Verifying your details...", icon: <ShieldCheck className="w-5 h-5" /> },
  { id: 2, text: "Securing connection to bank...", icon: <Lock className="w-5 h-5" /> },
  { id: 3, text: "Processing payment via Razorpay...", icon: <CreditCard className="w-5 h-5" /> },
  { id: 4, text: "Finalizing your reservation...", icon: <RefreshCcw className="w-5 h-5" /> },
];

export default function PaymentProcessingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (currentStep < STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(() => {
        router.push("/checkout/success");
      }, 1000);
      return () => clearTimeout(finalTimer);
    }
  }, [currentStep, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-sm w-full space-y-12">
        
        {/* Animated Loader */}
        <div className="relative w-32 h-32 mx-auto">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-zinc-100 border-t-primary rounded-full"
          />
          <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
            >
              <CreditCard className="w-8 h-8 text-primary" />
            </motion.div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Processing Payment</h1>
          <p className="text-zinc-500 font-medium leading-relaxed">
            Please do not refresh the page or click back. We are securing your booking.
          </p>
        </div>

        {/* Step-by-Step Progress */}
        <div className="space-y-4 text-left bg-zinc-50/50 p-8 rounded-[32px] border border-zinc-100 shadow-inner">
          {STEPS.map((step, index) => (
            <div 
              key={step.id} 
              className={cn(
                "flex items-center gap-4 transition-all duration-500",
                index === currentStep ? "text-zinc-900 opacity-100 translate-x-2" : 
                index < currentStep ? "text-emerald-500 opacity-60" : "text-zinc-300 opacity-40"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                index === currentStep ? "bg-primary text-white shadow-lg shadow-primary/20" : 
                index < currentStep ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100 text-zinc-400"
              )}>
                {index < currentStep ? <CheckCircle2 className="w-4 h-4" /> : step.icon}
              </div>
              <span className="text-sm font-bold">{step.text}</span>
            </div>
          ))}
        </div>

        {/* Security Badges */}
        <div className="pt-8 flex items-center justify-center gap-8 opacity-40">
          <div className="flex items-center gap-2 grayscale">
            <Building2 className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">PCI-DSS Secure</span>
          </div>
          <div className="flex items-center gap-2 grayscale">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Razorpay</span>
          </div>
        </div>

      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
