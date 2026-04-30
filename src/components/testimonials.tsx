"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Jim Corner",
    role: "CEO, Victonary Co.",
    text: "I would like to say a big Thank you for your immense effort and support. In addition, I have feeling that our further events are going to be Great as well, good luck to the team.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    color: "bg-indigo-50/30",
    hex: "#f9f8ff"
  },
  {
    id: 2,
    name: "Sarah Miller",
    role: "Marketing Director",
    text: "The experience has been absolutely transformative for our team. The attention to detail and curated stays are unmatched in the industry.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    color: "bg-rose-50/30",
    hex: "#fffafa"
  },
  {
    id: 3,
    name: "Alex Rivera",
    role: "Travel Enthusiast",
    text: "Found my perfect mountain retreat through Triptay. The verification process gives me so much peace of mind while booking.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    color: "bg-amber-50/30",
    hex: "#fffdf5"
  },
  {
    id: 4,
    name: "Ananya Iyer",
    role: "Digital Nomad",
    text: "Work-from-anywhere became a reality with Triptay's high-speed WiFi homestays. The local hosts treated me like family.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    color: "bg-emerald-50/30",
    hex: "#f7fdfa"
  },
  {
    id: 5,
    name: "Vikram Malhotra",
    role: "Photographer",
    text: "As a photographer, I look for aesthetics. The properties listed here are gems—visually stunning and culturally rich.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
    color: "bg-blue-50/30",
    hex: "#f8fbff"
  },
  {
    id: 6,
    name: "Meera Reddy",
    role: "Adventure Blogger",
    text: "The activity bundles are a game changer! Did paragliding in Bir and the coordination was absolutely flawless.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400",
    color: "bg-orange-50/30",
    hex: "#fffaf5"
  }
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const current = TESTIMONIALS[index];

  return (
    <section className="container mx-auto px-4 py-16 bg-white overflow-hidden">
      {/* Title & Nav */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
          What they say
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1))}
            className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center hover:bg-zinc-50 transition-all active:scale-90"
          >
            <ArrowLeft className="h-4 w-4 text-zinc-400" />
          </button>
          <button 
            onClick={() => setIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1))}
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
              key={current.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={cn("p-4 rounded-[2.5rem] h-full transition-colors duration-700", current.color)}
            >
              <div className="aspect-[1.3/1] rounded-[2rem] overflow-hidden shadow-lg">
                <img src={current.image} alt={current.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-center py-6">
                <h3 className="text-lg font-black text-zinc-900">{current.name}</h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">{current.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dynamic Content Card (Right) */}
        <motion.div 
          animate={{ backgroundColor: current.hex }}
          className="lg:col-span-7 rounded-[2.5rem] p-10 flex flex-col justify-between transition-colors duration-700 relative border border-zinc-50 "
        >
          {/* Connection Tail */}
          <motion.div 
            animate={{ borderRightColor: current.hex }}
            className="hidden lg:block absolute top-[20%] -left-6 w-0 h-0 border-y-[20px] border-y-transparent border-right-[30px] transition-colors duration-700"
          />

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div 
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-xl"
              >
                <Quote className="h-10 w-10 text-primary/10 mb-4" />
                <p className="text-xl md:text-2xl font-medium text-zinc-700 leading-tight italic font-serif">
                  "{current.text}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Area */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <div className="px-4 py-0.5 bg-white border border-zinc-100 rounded-full text-primary font-black text-[9px] tracking-widest uppercase shadow-sm">
              {index + 1} / {TESTIMONIALS.length}
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {TESTIMONIALS.map((t, i) => (
                <div 
                  key={t.id}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all p-1 bg-white",
                    index === i ? "border-primary opacity-100 grayscale-0 shadow-sm scale-110" : "border-transparent opacity-30 grayscale hover:opacity-100 hover:grayscale-0"
                  )}
                >
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
