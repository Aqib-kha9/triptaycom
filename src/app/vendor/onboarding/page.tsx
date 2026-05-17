"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Building2, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Building,
  Hash,
  UserCheck,
  MapPin,
  Clock
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Identity", icon: <Building2 className="w-4 h-4" /> },
  { id: 2, title: "KYC", icon: <UserCheck className="w-4 h-4" /> },
  { id: 3, title: "Payout", icon: <CreditCard className="w-4 h-4" /> },
  { id: 4, title: "Review", icon: <CheckCircle2 className="w-4 h-4" /> },
];

export default function VendorOnboardingPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nextStep = () => setStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          
          {/* Header */}
          <div className="text-center mb-10 space-y-2">
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Vendor Onboarding</h1>
            <p className="text-xs text-zinc-500 font-medium italic">Complete your profile to start hosting.</p>
          </div>

          {/* Stepper */}
          <div className="relative mb-12 px-4">
            <div className="relative z-10 flex justify-between items-center max-w-sm mx-auto">
              {STEPS.map((s) => (
                <div key={s.id} className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all border",
                    step === s.id ? "bg-primary border-primary text-white scale-110" : 
                    step > s.id ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-zinc-100 text-zinc-400"
                  )}>
                    {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.icon}
                  </div>
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-widest",
                    step >= s.id ? "text-zinc-900" : "text-zinc-400"
                  )}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
            <div className="p-6 sm:p-10">
              <AnimatePresence mode="wait">
                
                {isSubmitted ? (
                  <motion.div 
                    key="submitted" 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="text-center space-y-6 py-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-lg shadow-amber-100/50">
                      <Clock className="w-8 h-8 animate-pulse" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-xl font-bold text-zinc-900">Application Under Review</h2>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed max-w-md mx-auto">
                        Thank you for your application! Your profile and business documents (PAN Card, GST registration, Bank Payout settings) have been successfully submitted and are currently in the queue for Admin review.
                      </p>
                    </div>

                    <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 text-left max-w-md mx-auto space-y-3.5">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                        <div>
                          <p className="text-xs font-bold text-zinc-700">Verification in Progress</p>
                          <p className="text-[10px] text-zinc-400 font-medium">Admin is checking business PAN/GST information.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                        <div>
                          <p className="text-xs font-bold text-zinc-700">Timeline: 24 - 48 Hours</p>
                          <p className="text-[10px] text-zinc-400 font-medium">Approval usually takes between 1 to 2 business days.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                        <div>
                          <p className="text-xs font-bold text-zinc-700">Notification Alert</p>
                          <p className="text-[10px] text-zinc-400 font-medium">You will get an instant email once your dashboard is approved.</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
                      <Link href="/">
                        <Button className="rounded-xl h-11 px-8 text-xs font-bold gap-2">
                          Return to Home
                        </Button>
                      </Link>
                      <Link href="/dashboard">
                        <Button variant="outline" className="rounded-xl h-11 px-8 text-xs font-bold border-zinc-200 hover:bg-zinc-50 text-zinc-600">
                          View Guest Dashboard
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {step === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                        <div className="space-y-1">
                          <h2 className="text-lg font-bold text-zinc-900">Business Details</h2>
                          <p className="text-xs text-zinc-500 font-medium italic">Official registration info.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Business Name</label>
                            <Input placeholder="Himalayan Retreats" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">GST Number</label>
                            <Input placeholder="22AAAAA0000A1Z5" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">PAN Card Upload</label>
                            <div className="border-2 border-dashed border-zinc-100 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-zinc-50/50 hover:bg-zinc-100/50 transition-colors cursor-pointer group">
                              <Upload className="w-6 h-6 text-zinc-300 group-hover:text-primary transition-colors" />
                              <p className="text-[10px] font-bold text-zinc-900">Click to upload PAN</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                        <div className="space-y-1">
                          <h2 className="text-lg font-bold text-zinc-900">KYC Verification</h2>
                          <p className="text-xs text-zinc-500 font-medium italic">Verify your identity.</p>
                        </div>
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50 flex items-center justify-between group cursor-pointer hover:border-primary/20">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm"><FileText className="w-5 h-5" /></div>
                              <div>
                                <h4 className="font-bold text-zinc-900 text-xs">Aadhar Card</h4>
                                <p className="text-[9px] text-zinc-400 font-medium">Front & Back images</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-zinc-400"><Upload className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                        <div className="space-y-1">
                          <h2 className="text-lg font-bold text-zinc-900">Payout Settings</h2>
                          <p className="text-xs text-zinc-500 font-medium italic">Where should we send your money?</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Account Number</label>
                            <Input placeholder="0000 0000 0000 0000" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">IFSC Code</label>
                            <Input placeholder="HDFC0001234" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs uppercase" />
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 text-amber-900 text-[10px] font-medium leading-relaxed italic">
                          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                          Please ensure bank details are correct to avoid payment delays.
                        </div>
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 py-6">
                        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20"><ShieldCheck className="w-8 h-8" /></div>
                        <div className="space-y-2">
                          <h2 className="text-xl font-bold text-zinc-900">Ready to Launch?</h2>
                          <p className="text-xs text-zinc-500 font-medium italic max-w-xs mx-auto">Your documents are ready for review. This typically takes 24 hours.</p>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

              </AnimatePresence>

              {!isSubmitted && (
                <div className="mt-12 pt-6 border-t border-zinc-50 flex items-center justify-between">
                  <Button onClick={prevStep} variant="ghost" disabled={step === 1 || isSubmitting} className="rounded-xl h-10 px-6 text-xs font-bold text-zinc-400 gap-1.5"><ChevronLeft className="w-3.5 h-3.5" /> Back</Button>
                  <Button onClick={step < 4 ? nextStep : handleSubmit} className={cn("rounded-xl h-10 px-8 text-xs font-bold gap-1.5", step === 4 && "bg-emerald-600 hover:bg-emerald-700")} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : step === 4 ? "Submit Profile" : "Continue"}
                    {!isSubmitting && <ChevronRight className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-8">Having trouble? <Link href="/support" className="text-primary hover:underline">Support</Link></p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
