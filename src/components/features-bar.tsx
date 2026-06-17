"use client";

import { ShieldCheck, Zap, Headphones, RotateCcw } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Best Prices", desc: "Guaranteed" },
  { icon: Zap, title: "Secure Booking", desc: "No hidden charges" },
  { icon: Headphones, title: "24x7 Support", desc: "We are here" },
  { icon: RotateCcw, title: "Easy Cancellation", desc: "Flexible policy" },
];

export function FeaturesBar() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 border-t border-border/50">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4 group bg-zinc-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none">
            <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <f.icon className="h-4 w-4 sm:h-6 sm:w-6 text-primary group-hover:text-white transition-colors" />
            </div>
            <div>
              <h5 className="font-black text-[11px] sm:text-sm uppercase tracking-widest text-zinc-900 leading-tight mb-0.5 sm:mb-1">{f.title}</h5>
              <p className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
