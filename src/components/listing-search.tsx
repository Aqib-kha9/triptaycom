"use client";

import { useState } from "react";
import { 
  MapPin, 
  Users, 
  Calendar, 
  Search, 
  SlidersHorizontal,
  X,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ListingSearch() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <>
      <div className="w-full bg-white border-b border-zinc-100 py-3 relative z-30">
        <div className="container mx-auto px-4">
          
          {/* Mobile Compact Search Bar */}
          <div className="lg:hidden flex items-center gap-3">
            <button 
              onClick={() => setIsSearchExpanded(true)}
              className="flex-1 flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded-full px-5 h-12 shadow-sm active:scale-[0.98] transition-all"
            >
              <Search className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="text-xs font-bold text-zinc-900">Jakarta, IND</p>
                <p className="text-[10px] text-zinc-400 font-medium">22 Dec • 24 Dec • 2 Person</p>
              </div>
            </button>
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="w-12 h-12 flex items-center justify-center bg-zinc-50 border border-zinc-100 rounded-full shadow-sm"
            >
              <SlidersHorizontal className="w-5 h-5 text-zinc-900" />
            </button>
          </div>

          {/* Desktop Full Search Bar */}
          <div className="hidden lg:flex items-end gap-4">
            {/* Location */}
            <div className="flex-1 min-w-[180px] space-y-1">
              <label className="text-xs font-bold text-zinc-500 ml-1">Location</label>
              <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-100 rounded-xl px-4 h-11 hover:border-zinc-200 transition-all cursor-pointer">
                <MapPin className="w-5 h-5 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-600">Jakarta, IND</span>
              </div>
            </div>

            {/* Person */}
            <div className="w-36 space-y-1">
              <label className="text-xs font-bold text-zinc-500 ml-1">Person</label>
              <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-100 rounded-xl px-4 h-11 hover:border-zinc-200 transition-all cursor-pointer">
                <Users className="w-5 h-5 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-600">2 Person</span>
              </div>
            </div>

            {/* Check-in */}
            <div className="w-36 space-y-1">
              <label className="text-xs font-bold text-zinc-500 ml-1">Check-in</label>
              <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-100 rounded-xl px-4 h-11 hover:border-zinc-200 transition-all cursor-pointer">
                <Calendar className="w-5 h-5 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-600">22 Dec</span>
              </div>
            </div>

            {/* Check-out */}
            <div className="w-36 space-y-1">
              <label className="text-xs font-bold text-zinc-500 ml-1">Check-out</label>
              <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-100 rounded-xl px-4 h-11 hover:border-zinc-200 transition-all cursor-pointer">
                <Calendar className="w-5 h-5 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-600">24 Dec</span>
              </div>
            </div>

            {/* Find specific hotel */}
            <div className="flex-1 min-w-[200px] space-y-1">
              <label className="text-xs font-bold text-zinc-500 ml-1">Find specific hotel</label>
              <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-100 rounded-xl px-4 h-11 group focus-within:bg-white focus-within:border-primary/30 transition-all">
                <input 
                  type="text" 
                  placeholder="Ex. Ibis Hotel" 
                  className="bg-transparent border-none outline-none text-sm font-medium text-zinc-900 w-full placeholder:text-zinc-300"
                />
                <Search className="w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            {/* Filter Button */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 opacity-0">Filter</label>
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 rounded-xl px-6 h-11 hover:bg-zinc-100 transition-all font-bold text-sm text-zinc-900"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>
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
                <h2 className="text-2xl font-black text-zinc-900">Where to?</h2>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Plan your next trip</p>
              </div>
              <button 
                onClick={() => setIsSearchExpanded(false)}
                className="w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-xl shadow-zinc-900/20 active:scale-90 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Location Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Destination</label>
                <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <MapPin className="w-5 h-5 text-primary" />
                  <input type="text" placeholder="Where are you going?" className="bg-transparent outline-none text-sm font-bold w-full" defaultValue="Jakarta, IND" />
                </div>
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Check-in</label>
                  <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm font-bold">22 Dec</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Check-out</label>
                  <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm font-bold">24 Dec</span>
                  </div>
                </div>
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Travelers</label>
                <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <Users className="w-5 h-5 text-zinc-400" />
                  <span className="text-sm font-bold">2 Person</span>
                </div>
              </div>

              <button 
                onClick={() => setIsSearchExpanded(false)}
                className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 mt-4 active:scale-95 transition-all"
              >
                Search Stays
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Filter Drawer Overlay */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-[101] shadow-2xl overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-bold text-zinc-900">Filters</h2>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 transition-all"
                  >
                    <X className="w-5 h-5 text-zinc-500" />
                  </button>
                </div>

                {/* Price Range */}
                <div className="space-y-6 mb-10">
                  <h3 className="font-bold text-zinc-900 uppercase tracking-widest text-[10px]">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm font-bold text-zinc-900">
                      <span>₹500</span>
                      <span>₹25,000+</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full relative">
                      <div className="absolute left-[10%] right-[30%] h-full bg-zinc-900 rounded-full" />
                      <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-zinc-900 rounded-full shadow-lg cursor-pointer" />
                      <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-zinc-900 rounded-full shadow-lg cursor-pointer" />
                    </div>
                  </div>
                </div>

                {/* Property Type */}
                <div className="space-y-4 mb-10">
                  <h3 className="font-bold text-zinc-900 uppercase tracking-widest text-[10px]">Property Type</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {["Villas", "Hotels", "Apartments", "Cottages", "Homestays", "Farm Stays"].map((type) => (
                      <button key={type} className="flex items-center justify-between px-4 py-3 rounded-xl border border-zinc-100 text-sm font-bold text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-all group">
                        {type}
                        <div className="w-4 h-4 rounded-full border border-zinc-200 group-hover:border-zinc-900" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-4 mb-10">
                  <h3 className="font-bold text-zinc-900 uppercase tracking-widest text-[10px]">Amenities</h3>
                  <div className="space-y-3">
                    {["Free WiFi", "Pool", "Parking", "Air Conditioning", "Breakfast Included", "Pet Friendly"].map((amenity) => (
                      <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded-md border-2 border-zinc-200 flex items-center justify-center group-hover:border-zinc-900 transition-all">
                          <Check className="w-3.5 h-3.5 text-zinc-900 opacity-0 group-hover:opacity-100" />
                        </div>
                        <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900 transition-all">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <div className="sticky bottom-0 pt-6 pb-2 bg-white border-t border-zinc-100">
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full bg-zinc-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-zinc-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Show 2,478 stays
                  </button>
                  <button className="w-full py-4 text-zinc-500 font-bold text-sm hover:text-zinc-900 transition-all">
                    Clear all filters
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
