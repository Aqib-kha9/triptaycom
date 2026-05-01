"use client";

import { Search, CalendarCheck, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const STEPS = [
  {
    id: 1,
    icon: Search,
    title: "Find your getaway",
    desc: "Browse our curated collection of verified homestays and unique activities."
  },
  {
    id: 2,
    icon: CalendarCheck,
    title: "Instant Booking",
    desc: "Select your dates, pay securely, and get instant confirmation for your stay."
  },
  {
    id: 3,
    icon: MapPin,
    title: "Enjoy the Journey",
    desc: "Arrive at your destination and experience the local charm of India."
  }
];

export function HowItWorks() {
  return (
    <section className="container mx-auto px-4 py-24  rounded-[3rem] my-16 border border-zinc-100">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-4">The Journey</span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900">
          How Triptay works
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 relative">
        {/* Connection Line (Desktop) */}
        <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-zinc-200" />
        
        {STEPS.map((step, index) => (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center group relative z-10"
          >
            <div className="w-24 h-24 rounded-full bg-white border border-zinc-100 flex items-center justify-center mb-8 shadow-sm group-hover:border-primary transition-all group-hover:scale-110">
              <step.icon className="h-10 w-10 text-primary" />
              {/* Step Number Badge */}
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[12px] font-bold">
                {step.id}
              </div>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-4">{step.title}</h3>
            <p className="text-zinc-500 font-medium leading-relaxed max-w-xs">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
