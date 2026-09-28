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
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [index]);

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
    <section className="container mx-auto px-4 py-8 md:py-16 bg-white overflow-hidden">
      {/* Title & Nav */}
      <div className="flex items-center justify-between mb-6 md:mb-10">
        <h2 className="text-2xl md:text-4xl font-black text-zinc-900 tracking-tight">
          What our customers say
        </h2>
        <div className="hidden md:flex gap-2">
          <button 
            onClick={() => setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
            className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-all active:scale-95"
          >
            <ArrowLeft className="h-5 w-5 text-zinc-600" />
          </button>
          <button 
            onClick={() => setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
            className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-900/20"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative bg-zinc-50/80 rounded-[2rem] p-5 md:p-8 border border-zinc-100 shadow-sm md:shadow-none">
        <AnimatePresence mode="wait">
          <motion.div 
            key={current._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center"
          >
            {/* Text Content */}
            <div className="flex flex-col gap-4 md:gap-6 order-2 lg:order-1 lg:col-span-7">
              <Quote className="h-8 w-8 md:h-10 md:w-10 text-zinc-300" />
              <div>
                <p className={cn("text-[15px] md:text-xl font-medium text-zinc-800 leading-relaxed transition-all duration-300", !isExpanded && "line-clamp-4 md:line-clamp-5")}>
                  "{current.text}"
                </p>
                {current.text.length > 150 && (
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors focus:outline-none"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>
              <div className="mt-2">
                <h3 className="text-base md:text-xl font-bold text-zinc-900">{current.name}</h3>
                <p className="text-[11px] md:text-sm font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{current.role}</p>
              </div>
              
              {/* Thumbnails (App-like scrollable row on mobile) */}
              <div className="flex overflow-x-auto no-scrollbar gap-2 md:gap-3 mt-4 pb-2 md:pb-0 snap-x">
                {testimonials.map((t, i) => (
                  <div 
                    key={t._id}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-full overflow-hidden cursor-pointer border-2 transition-all p-0.5 snap-center",
                      index === i ? "border-zinc-900 scale-105 shadow-md" : "border-transparent opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
                    )}
                  >
                    {t.image ? (
                      <img src={t.image} alt={t.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="w-full h-full bg-zinc-200 rounded-full flex items-center justify-center">
                        <Star className="h-3 w-3 md:h-4 md:w-4 text-zinc-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Image Content */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end items-center lg:col-span-5 mb-2 md:mb-0">
              {current.image ? (
                <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden w-full flex items-end justify-center pt-4 px-4 md:pt-8 md:px-8 pb-0">
                  <img src={current.image} alt={current.name} className="max-h-[160px] md:max-h-[320px] w-full object-contain object-bottom" />
                </div>
              ) : (
                <div className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] rounded-full bg-zinc-100 flex items-center justify-center shadow-inner">
                  <Star className="h-10 w-10 md:h-16 md:w-16 text-zinc-300" />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
