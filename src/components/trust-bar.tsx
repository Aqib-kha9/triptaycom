"use client";

import { motion } from "framer-motion";

export function TrustBar() {
  return (
    <div className="w-full bg-white border-y border-zinc-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Brand Philosophy */}
          <div className="flex flex-col items-center md:items-start max-w-xs">
            <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-2">Our Promise</span>
            <p className="text-zinc-900 font-bold text-sm leading-tight text-center md:text-left">
              India's Most Trusted & Verified Homestay Network.
            </p>
          </div>

          {/* Social Proof Stats */}
          <div className="flex items-center gap-8 md:gap-16">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-zinc-900 leading-none mb-1 tracking-tight ">12k+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Travelers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-zinc-900 leading-none mb-1 tracking-tight ">500+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Properties</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-zinc-900 leading-none mb-1 tracking-tight ">4.9/5</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Avg Rating</span>
            </div>
          </div>

          {/* Featured In / Authority */}
          <div className="flex items-center gap-8 opacity-20 grayscale">
            <span className="text-xl  font-bold  tracking-tighter">FORBES</span>
            <span className="text-xl  font-bold  tracking-tighter">VOGUE</span>
            <span className="text-xl  font-bold  tracking-tighter">TRAVEL+</span>
          </div>

        </div>
      </div>
    </div>
  );
}
