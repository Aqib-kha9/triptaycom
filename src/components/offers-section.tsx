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
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-tight">Special Offers</h2>
        <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
          View all <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Responsive Grid: No Overflow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {OFFERS.map((offer) => (
          <div 
            key={offer.id}
            className="w-full flex items-center border border-zinc-100 rounded-[2rem] bg-white transition-all cursor-pointer p-4 group hover:border-primary/20"
          >
            {/* Content Side */}
            <div className="flex-1 pl-2 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Tag className="h-3 w-3 text-primary" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Limited</span>
              </div>
              <h3 className="text-[12px] font-bold text-zinc-400 mb-0.5">{offer.title}</h3>
              <p className="text-[18px] font-bold text-zinc-900 leading-tight mb-1">{offer.discount}</p>
              <p className="text-[11px] text-zinc-400 font-medium line-clamp-1">{offer.desc}</p>
            </div>

            {/* Styled Image Container */}
            <div className={`w-24 h-24 rounded-[1.8rem] ${offer.bg} flex items-center justify-center relative overflow-hidden shrink-0 transition-transform duration-500 group-hover:scale-105`}>
              <div className="w-[82%] h-[82%] rounded-[1.4rem] overflow-hidden">
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
