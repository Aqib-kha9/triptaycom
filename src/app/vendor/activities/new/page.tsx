"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronRight, 
  ChevronLeft, 
  Compass, 
  DollarSign, 
  Clock, 
  Image as ImageIcon, 
  MapPin,
  Check,
  Zap,
  Shield
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, name: "Basics", icon: <Compass className="w-4 h-4" /> },
  { id: 2, name: "Duration", icon: <Clock className="w-4 h-4" /> },
  { id: 3, name: "Pricing", icon: <DollarSign className="w-4 h-4" /> },
  { id: 4, name: "Media", icon: <ImageIcon className="w-4 h-4" /> },
];

export default function AddActivityPage() {
  const [step, setStep] = useState(1);

  const next = () => setStep(s => Math.min(s + 1, 4));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-10 gap-4">
            {STEPS.map((s) => (
              <div key={s.id} className="flex items-center gap-3 shrink-0">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-all border",
                  step >= s.id ? "bg-primary border-primary text-white" : "bg-white border-zinc-100 text-zinc-400"
                )}>
                  {step > s.id ? <Check className="w-4 h-4" /> : s.icon}
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest hidden md:block",
                  step >= s.id ? "text-zinc-900" : "text-zinc-400"
                )}>
                  {s.name}
                </span>
                {s.id !== 4 && <div className="w-8 h-px bg-zinc-100" />}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-10 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-zinc-900">Activity Basics</h2>
                      <p className="text-xs text-zinc-500 font-medium italic">Name and describe your experience.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Activity Name</label>
                        <Input placeholder="e.g. Ganga River Rafting" className="h-11 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Description</label>
                        <textarea className="w-full h-32 rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-xs font-medium focus:outline-none" placeholder="Describe the thrill..." />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-zinc-900">Duration & Capacity</h2>
                      <p className="text-xs text-zinc-500 font-medium italic">Timings and group limits.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Activity Duration</label>
                        <Input placeholder="e.g. 4 Hours" className="h-11 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Max Group Size</label>
                        <Input type="number" placeholder="10" className="h-11 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-zinc-900">Pricing</h2>
                      <p className="text-xs text-zinc-500 font-medium italic">Price per person.</p>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Price Per Person</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">₹</span>
                          <Input type="number" placeholder="1200" className="h-11 pl-9 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm"><Zap className="w-5 h-5" /></div>
                        <div>
                          <p className="text-xs font-bold text-zinc-900">Instant Booking</p>
                          <p className="text-[10px] text-zinc-400 font-medium">Guests can book without waiting for approval.</p>
                        </div>
                        <div className="ml-auto w-10 h-5 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" /></div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-zinc-900">Experience Media</h2>
                      <p className="text-xs text-zinc-500 font-medium italic">Action shots and highlights.</p>
                    </div>
                    <div className="border-2 border-dashed border-zinc-100 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 bg-zinc-50 hover:bg-zinc-100/50 transition-all cursor-pointer group">
                      <ImageIcon className="w-8 h-8 text-zinc-300 group-hover:text-primary transition-colors" />
                      <div className="text-center">
                        <p className="text-xs font-bold text-zinc-900">Upload Action Photos</p>
                        <p className="text-[10px] text-zinc-400 font-medium">Show the true essence of the activity.</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
              <Button variant="ghost" onClick={prev} disabled={step === 1} className="h-10 px-5 rounded-xl text-xs font-bold text-zinc-400">Back</Button>
              <Button onClick={next} className="h-10 px-8 rounded-xl text-xs font-bold">{step === 4 ? "Publish Activity" : "Next"}</Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
