"use client";

import { useState } from "react";
import { 
  MapPin, 
  Users, 
  Calendar, 
  Search, 
  SlidersHorizontal,
  X,
  Check,
  ChevronDown,
  Zap,
  Mountain,
  Clock,
  Navigation
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ListingSearchProps {
  mode?: "stays" | "activities";
}

export function ListingSearch({ mode = "stays" }: ListingSearchProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <div className="w-full bg-white border-b border-zinc-100 relative z-30">
      <div className="container mx-auto px-4 py-2">
        
        {/* Mobile Compact Search Bar */}
        <div className="lg:hidden flex items-center gap-3">
          <button 
            onClick={() => setIsSearchExpanded(true)}
            className="flex-1 flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded-full px-5 h-12 shadow-sm active:scale-[0.98] transition-all"
          >
            <Search className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="text-xs font-bold text-zinc-900">{mode === "stays" ? "Jakarta, IND" : "Rishikesh, UK"}</p>
              <p className="text-[10px] text-zinc-400 font-medium">
                {mode === "stays" ? "22 Dec • 24 Dec • 2 Person" : "20 May • 2 Adults"}
              </p>
            </div>
          </button>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-full shadow-sm transition-all",
              isFilterOpen ? "bg-primary text-white" : "bg-zinc-50 border border-zinc-100 text-zinc-900"
            )}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Full Search Bar */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex-1 flex items-center bg-zinc-50 border border-zinc-100 rounded-2xl p-1 shadow-sm hover:shadow-md transition-all">
            {/* Location */}
            <div className="flex-1 flex items-center gap-3 px-3 py-1.5 border-r border-zinc-100 cursor-pointer hover:bg-white rounded-xl transition-all group">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Location</p>
                <p className="text-sm font-bold text-zinc-900">{mode === "stays" ? "Jakarta, IND" : "Rishikesh, UK"}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="flex-1 flex items-center gap-3 px-3 py-1.5 border-r border-zinc-100 cursor-pointer hover:bg-white rounded-xl transition-all group">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{mode === "stays" ? "Dates" : "Activity Date"}</p>
                <p className="text-sm font-bold text-zinc-900">{mode === "stays" ? "22 Dec - 24 Dec" : "20 May, 2024"}</p>
              </div>
            </div>

            {/* Guests / Participants */}
            <div className="w-44 flex items-center gap-3 px-3 py-1.5 cursor-pointer hover:bg-white rounded-xl transition-all group">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{mode === "stays" ? "Guests" : "People"}</p>
                <p className="text-sm font-bold text-zinc-900">2 {mode === "stays" ? "Person" : "Adults"}</p>
              </div>
            </div>

            {/* Search Button */}
            <Button className="h-12 w-12 rounded-xl shadow-xl shadow-primary/20 flex-shrink-0">
              <Search className="w-6 h-6" />
            </Button>
          </div>

          {/* Filter Button */}
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "flex items-center gap-3 px-5 h-14 rounded-2xl font-bold text-sm transition-all border",
              isFilterOpen 
                ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" 
                : "bg-white border-zinc-100 text-zinc-900 hover:bg-zinc-50 shadow-sm"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown className={cn("w-4 h-4 transition-transform", isFilterOpen && "rotate-180")} />
          </button>
        </div>

        {/* Inline Expanding Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="overflow-hidden"
            >
              <div className="pt-8 pb-4">
                <div className="bg-zinc-50/50 rounded-[32px] border border-zinc-100 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    
                    {/* Mode Specific Filter 1: Price / Difficulty */}
                    <div className="space-y-6">
                      <h3 className="font-bold text-zinc-900 uppercase tracking-widest text-[10px]">
                        {mode === "stays" ? "Price Range" : "Budget per person"}
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm font-bold text-zinc-900">
                          <span>₹{mode === "stays" ? "500" : "200"}</span>
                          <span>₹{mode === "stays" ? "25k+" : "10k+"}</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-200 rounded-full relative">
                          <div className="absolute left-[10%] right-[30%] h-full bg-primary rounded-full" />
                          <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-lg cursor-pointer" />
                          <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-lg cursor-pointer" />
                        </div>
                      </div>
                    </div>

                    {/* Mode Specific Filter 2: Property Type / Difficulty */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-zinc-900 uppercase tracking-widest text-[10px]">
                        {mode === "stays" ? "Property Type" : "Difficulty Level"}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(mode === "stays" 
                          ? ["Villas", "Hotels", "Apartments", "Cottages"]
                          : ["Easy", "Moderate", "Hard", "Expert"]
                        ).map((item) => (
                          <button key={item} className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-600 hover:border-primary hover:text-primary transition-all">
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mode Specific Filter 3: Amenities / Duration */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-zinc-900 uppercase tracking-widest text-[10px]">
                        {mode === "stays" ? "Amenities" : "Duration"}
                      </h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {(mode === "stays"
                          ? ["WiFi", "Pool", "Parking", "AC"]
                          : ["2-4 Hours", "Full Day", "Overnight", "Multi-day"]
                        ).map((item) => (
                          <label key={item} className="flex items-center gap-2 cursor-pointer group">
                            <div className="w-4 h-4 rounded border border-zinc-300 flex items-center justify-center group-hover:border-primary transition-all">
                              <Check className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100" />
                            </div>
                            <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-900 transition-all">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-col justify-end gap-3">
                      <Button className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/10">
                        {mode === "stays" ? "Show stays" : "Show activities"}
                      </Button>
                      <button className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-all">
                        Reset All
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-[200] p-6 overflow-y-auto"
          >
            {/* Fixed Header */}
            <div className="sticky top-0 z-[210] bg-white pt-2 pb-6 flex items-center justify-between border-b border-zinc-50 mb-8">
              <div>
                <h2 className="text-2xl font-black text-zinc-900">{mode === "stays" ? "Where to?" : "What to do?"}</h2>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Plan your next adventure</p>
              </div>
              <button 
                onClick={() => setIsSearchExpanded(false)}
                className="w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-xl shadow-zinc-900/20 active:scale-90 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Location</label>
                <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <MapPin className="w-5 h-5 text-primary" />
                  <input type="text" placeholder="Search destination" className="bg-transparent outline-none text-sm font-bold w-full" defaultValue={mode === "stays" ? "Jakarta, IND" : "Rishikesh, UK"} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{mode === "stays" ? "Check-in" : "Date"}</label>
                  <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm font-bold">{mode === "stays" ? "22 Dec" : "20 May"}</span>
                  </div>
                </div>
                {mode === "stays" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Check-out</label>
                    <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <Calendar className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm font-bold">24 Dec</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{mode === "stays" ? "Travelers" : "Participants"}</label>
                <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <Users className="w-5 h-5 text-zinc-400" />
                  <span className="text-sm font-bold">2 Person</span>
                </div>
              </div>

              <button 
                onClick={() => setIsSearchExpanded(false)}
                className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 mt-4 active:scale-95 transition-all"
              >
                Search {mode === "stays" ? "Stays" : "Activities"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
