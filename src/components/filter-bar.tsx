"use client";

import { useState } from "react";
import { 
  SlidersHorizontal, 
  Wifi, 
  Wind, 
  Coffee, 
  Car, 
  Tv, 
  Waves,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All Stays", icon: <SlidersHorizontal className="w-4 h-4" /> },
  { id: "villas", label: "Villas", icon: <Wind className="w-4 h-4" /> },
  { id: "apartments", label: "Apartments", icon: <Tv className="w-4 h-4" /> },
  { id: "farms", label: "Farm Stays", icon: <Coffee className="w-4 h-4" /> },
  { id: "cottages", label: "Cottages", icon: <Wind className="w-4 h-4" /> },
  { id: "luxury", label: "Luxury", icon: <Waves className="w-4 h-4" /> },
];

export function FilterBar() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-xl border-b border-zinc-100 py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Categories: Modern Pill Design */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap border-2 font-bold text-sm group",
                activeCategory === cat.id 
                  ? "bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-200" 
                  : "bg-white border-zinc-100 text-zinc-500 hover:border-zinc-200 hover:text-zinc-900 hover:shadow-lg hover:shadow-zinc-100"
              )}
            >
              <div className={cn(
                "transition-transform duration-300 group-hover:scale-110",
                activeCategory === cat.id ? "text-primary" : "text-zinc-400"
              )}>
                {cat.icon}
              </div>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Action Buttons: Unified Style */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-zinc-100 font-bold text-sm text-zinc-600 hover:bg-zinc-50 hover:border-zinc-200 transition-all flex-1 md:flex-none justify-center">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
          
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-zinc-100 font-bold text-sm text-zinc-600 hover:bg-zinc-50 hover:border-zinc-200 transition-all flex-1 md:flex-none justify-center">
            <span>Featured</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
