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
    <div className="container mx-auto px-4 py-12 border-t border-border/50">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-4 group">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <f.icon className="h-6 w-6" />
            </div>
            <div>
              <h5 className="font-bold text-sm">{f.title}</h5>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
