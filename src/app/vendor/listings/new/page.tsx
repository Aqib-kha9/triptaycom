"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronRight, 
  ChevronLeft, 
  Home, 
  DollarSign, 
  Coffee, 
  Image as ImageIcon, 
  MapPin,
  Wifi,
  Wind,
  Car,
  Tv,
  Waves,
  Utensils,
  Check
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, name: "Basics", icon: <Home className="w-4 h-4" /> },
  { id: 2, name: "Pricing", icon: <DollarSign className="w-4 h-4" /> },
  { id: 3, name: "Amenities", icon: <Wifi className="w-4 h-4" /> },
  { id: 4, name: "Food", icon: <Coffee className="w-4 h-4" /> },
  { id: 5, name: "Media", icon: <ImageIcon className="w-4 h-4" /> },
];

export default function AddHomestayPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    price: "",
    weekendPrice: "",
    amenities: [] as string[],
  });

  const next = () => setStep(s => Math.min(s + 1, 5));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-10 overflow-x-auto pb-4 sm:pb-0 gap-4">
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
                {s.id !== 5 && <div className="w-4 sm:w-8 h-px bg-zinc-100" />}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-10 space-y-8">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-8"
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-zinc-900">Property Basics</h2>
                      <p className="text-xs text-zinc-500 font-medium italic">Tell us about your homestay.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Property Name</label>
                        <Input placeholder="e.g. Mountain Whisper Villa" className="h-11 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Description</label>
                        <textarea className="w-full h-32 rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="What makes your place special?" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <Input placeholder="City, State" className="h-11 pl-11 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-zinc-900">Set Your Pricing</h2>
                      <p className="text-xs text-zinc-500 font-medium italic">Base rates and weekend premiums.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Base Price /Night</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">₹</span>
                          <Input type="number" placeholder="4500" className="h-11 pl-9 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Weekend Price /Night</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">₹</span>
                          <Input type="number" placeholder="5500" className="h-11 pl-9 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-zinc-900">Amenities</h2>
                      <p className="text-xs text-zinc-500 font-medium italic">What facilities do you provide?</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { name: "WiFi", icon: <Wifi className="w-4 h-4" /> },
                        { name: "Air Conditioning", icon: <Wind className="w-4 h-4" /> },
                        { name: "Parking", icon: <Car className="w-4 h-4" /> },
                        { name: "TV", icon: <Tv className="w-4 h-4" /> },
                        { name: "Pool", icon: <Waves className="w-4 h-4" /> },
                        { name: "Kitchen", icon: <Utensils className="w-4 h-4" /> },
                      ].map((item) => (
                        <button key={item.name} className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-zinc-100 bg-zinc-50 hover:bg-white hover:border-primary group transition-all">
                          <div className="text-zinc-400 group-hover:text-primary">{item.icon}</div>
                          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tight">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-zinc-900">Food Options</h2>
                      <p className="text-xs text-zinc-500 font-medium italic">Dining services for guests.</p>
                    </div>
                    <div className="space-y-4">
                      {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                        <div key={meal} className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                          <span className="text-xs font-bold text-zinc-900">{meal} Included</span>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Extra Price:</span>
                            <div className="relative w-24">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400">₹</span>
                              <Input placeholder="0" className="h-8 pl-6 rounded-lg border-zinc-100 bg-white text-[10px]" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-zinc-900">Media Gallery</h2>
                      <p className="text-xs text-zinc-500 font-medium italic">Photos and videos of your property.</p>
                    </div>
                    <div className="border-2 border-dashed border-zinc-100 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 bg-zinc-50 hover:bg-zinc-100/50 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-zinc-300 group-hover:text-primary shadow-sm"><ImageIcon className="w-6 h-6" /></div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-zinc-900">Click to upload or drag and drop</p>
                        <p className="text-[10px] text-zinc-400 font-medium">Up to 10 images, max 5MB each</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={prev} 
                disabled={step === 1}
                className="h-11 px-6 rounded-xl text-xs font-bold gap-2 text-zinc-400"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <Button 
                onClick={next}
                className="h-11 px-8 rounded-xl text-xs font-bold gap-2"
              >
                {step === 5 ? "Publish Stay" : "Next Step"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
