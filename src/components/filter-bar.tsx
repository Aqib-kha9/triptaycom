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
        
        {/* Categories: Minimalist Tab Design */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-0 w-full md:w-auto pt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 pb-4 transition-all duration-300 whitespace-nowrap border-b-2 font-bold text-sm group relative",
                activeCategory === cat.id 
                  ? "border-zinc-900 text-zinc-900" 
                  : "border-transparent text-zinc-400 hover:text-zinc-600 hover:border-zinc-200"
              )}
            >
              <div className={cn(
                "transition-transform duration-300 group-hover:scale-110",
                activeCategory === cat.id ? "text-zinc-900" : "text-zinc-400"
              )}>
                {cat.icon}
              </div>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Action Buttons: Unified Style */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end pb-2 md:pb-0">
          <button className="flex items-center gap-2 px-5 py-2 rounded-xl border border-zinc-200 font-bold text-sm text-zinc-600 hover:bg-zinc-50 transition-all flex-1 md:flex-none justify-center bg-white">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
          
          <button className="flex items-center gap-2 px-5 py-2 rounded-xl border border-zinc-200 font-bold text-sm text-zinc-600 hover:bg-zinc-50 transition-all flex-1 md:flex-none justify-center bg-white">
            <span>Featured</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
