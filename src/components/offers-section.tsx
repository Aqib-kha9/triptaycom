"use client";

import { motion } from "framer-motion";
import { Tag, ChevronRight } from "lucide-react";

const OFFERS = [
  {
    id: 1,
    title: "Domestic Stays",
    discount: "Flat 25% OFF",
    desc: "Valid on all villa bookings",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400",
    bg: "bg-blue-50/50"
  },
  {
    id: 2,
    title: "Activity Bundles",
    discount: "Save ₹2,000",
    desc: "On 2+ adventure activities",
    image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&q=80&w=400",
    bg: "bg-orange-50/50"
  },
  {
    id: 3,
    title: "Early Bird Deal",
    discount: "15% Extra OFF",
    desc: "30 days in advance",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400",
    bg: "bg-emerald-50/50"
  }
];

export function OffersSection() {
  return (
    <section className="container mx-auto px-4 py-8 sm:py-16">
      <div className="flex items-center justify-between mb-4 sm:mb-8">
        <h2 className="text-lg sm:text-2xl font-black text-zinc-900 uppercase tracking-widest leading-tight">
          Special Offers
        </h2>
        <button className="flex items-center gap-0.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors shrink-0">
          View all <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </div>

      {/* Responsive Layout: Horizontal Scroll on Mobile, Grid on Desktop */}
      <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 pb-2 sm:pb-0">
        {OFFERS.map((offer) => (
          <div 
            key={offer.id}
            className="w-[85vw] sm:w-auto min-w-[280px] max-w-[340px] sm:max-w-none sm:min-w-0 shrink-0 snap-center flex flex-col justify-between border border-zinc-100 rounded-[2rem] bg-zinc-50 transition-all cursor-pointer p-2 group hover:border-zinc-200"
          >
            <div className="w-full h-36 rounded-[1.5rem] overflow-hidden relative">
              <img 
                src={offer.image} 
                alt={offer.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                 <Tag className="w-3 h-3 text-primary" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-primary">Limited</span>
              </div>
            </div>
            <div className="p-4 pt-5 pb-3 flex items-end justify-between">
               <div className="space-y-1">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{offer.title}</h3>
                  <p className="text-xl font-black text-zinc-900 leading-tight italic">{offer.discount}</p>
                  <p className="text-[10px] text-zinc-500 font-medium">{offer.desc}</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-105 shadow-sm">
                  <ChevronRight className="w-4 h-4" />
               </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
