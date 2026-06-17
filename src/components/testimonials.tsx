"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const COLOR_PALETTE = [
  { color: "bg-indigo-50/30", hex: "#f9f8ff" },
  { color: "bg-rose-50/30", hex: "#fffafa" },
  { color: "bg-amber-50/30", hex: "#fffdf5" },
  { color: "bg-emerald-50/30", hex: "#f7fdfa" },
  { color: "bg-blue-50/30", hex: "#f8fbff" },
  { color: "bg-orange-50/30", hex: "#fffaf5" },
];

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function fetchTestimonials() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/testimonials`);
        const json = await res.json().catch(() => null);
        if (cancelled) return;
        if (json?.status === "success" && Array.isArray(json.data?.testimonials)) {
          setTestimonials(json.data.testimonials);
          setIndex(0);
        } else {
          setTestimonials([]);
        }
      } catch {
        if (!cancelled) setError("Failed to load testimonials.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchTestimonials();
    return () => { cancelled = true; };
  }, []);

  // ---- Loading State ----
  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16 bg-white overflow-hidden">
        <div className="flex items-center justify-between mb-6 sm:mb-10">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-zinc-900 uppercase tracking-widest leading-tight">
            What they say
          </h2>
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center" />
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[450px]">
          <div className="lg:col-span-5">
            <div className="p-4 rounded-[2.5rem] bg-zinc-50/30 h-full">
              <div className="aspect-[1.3/1] rounded-[2rem] overflow-hidden bg-zinc-100 animate-pulse" />
              <div className="text-center py-6 space-y-2">
                <div className="h-5 w-28 bg-zinc-100 rounded mx-auto animate-pulse" />
                <div className="h-3 w-20 bg-zinc-50 rounded mx-auto animate-pulse" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 rounded-[2.5rem] p-10 flex flex-col justify-between bg-zinc-50/20 border border-zinc-50">
            <div className="flex items-center justify-center flex-1">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ---- Error State ----
  if (error) {
    return (
      <section className="container mx-auto px-4 py-16 bg-white overflow-hidden">
        <div className="flex items-center justify-between mb-6 sm:mb-10">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-zinc-900 uppercase tracking-widest leading-tight">
            What they say
          </h2>
        </div>
        <div className="text-center py-16">
          <p className="text-zinc-400 text-sm font-medium">{error}</p>
        </div>
      </section>
    );
  }

  // ---- Empty State ----
  if (testimonials.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16 bg-white overflow-hidden">
        <div className="flex items-center justify-between mb-6 sm:mb-10">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-zinc-900 uppercase tracking-widest leading-tight">
            What they say
          </h2>
        </div>
        <div className="text-center py-16">
          <Star className="h-10 w-10 text-zinc-200 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm font-medium">No testimonials yet.</p>
        </div>
      </section>
    );
  }

  const current = testimonials[index];
  const palette = COLOR_PALETTE[index % COLOR_PALETTE.length];

  return (
    <section className="container mx-auto px-4 py-16 bg-white overflow-hidden">
      {/* Title & Nav */}
      <div className="flex items-center justify-between mb-6 sm:mb-10">
        <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-zinc-900 uppercase tracking-widest leading-tight">
          What they say
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
            className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center hover:bg-zinc-50 transition-all active:scale-90"
          >
            <ArrowLeft className="h-4 w-4 text-zinc-400" />
          </button>
          <button 
            onClick={() => setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-all active:scale-90"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[450px]">
        
        {/* Main Image Card (Left) */}
        <div className="lg:col-span-5 relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={current._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={cn("p-4 rounded-[2.5rem] h-full transition-colors duration-700", palette.color)}
            >
              <div className="aspect-[1.3/1] rounded-[2rem] overflow-hidden shadow-lg">
                {current.image ? (
                  <img src={current.image} alt={current.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                    <Star className="h-10 w-10 text-zinc-300" />
                  </div>
                )}
              </div>
              <div className="text-center py-6">
                <h3 className="text-lg font-bold text-zinc-900">{current.name}</h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">{current.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dynamic Content Card (Right) */}
        <motion.div 
          animate={{ backgroundColor: palette.hex }}
          className="lg:col-span-7 rounded-[2.5rem] p-10 flex flex-col justify-between transition-colors duration-700 relative border border-zinc-50"
        >
          {/* Connection Tail */}
          <motion.div 
            animate={{ borderRightColor: palette.hex }}
            className="hidden lg:block absolute top-[20%] -left-6 w-0 h-0 border-y-[20px] border-y-transparent border-right-[30px] transition-colors duration-700"
          />

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div 
                key={current._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-xl"
              >
                <Quote className="h-10 w-10 text-primary/10 mb-4" />
                <p className="text-xl md:text-2xl font-medium text-zinc-700 leading-tight">
                  "{current.text}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Area */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <div className="px-4 py-0.5 bg-white border border-zinc-100 rounded-full text-primary font-bold text-[9px] tracking-widest uppercase shadow-sm">
              {index + 1} / {testimonials.length}
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {testimonials.map((t, i) => (
                <div 
                  key={t._id}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all p-1 bg-white",
                    index === i ? "border-primary opacity-100 grayscale-0 shadow-sm scale-110" : "border-transparent opacity-30 grayscale hover:opacity-100 hover:grayscale-0"
                  )}
                >
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-full bg-zinc-100 rounded-lg flex items-center justify-center">
                      <Star className="h-4 w-4 text-zinc-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
