"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, Home, Ticket, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SearchForm() {
  const [activeTab, setActiveTab] = useState<"homestays" | "activities" | "nearby">("homestays");

  return (
    <div className="w-full max-w-[850px]">
      {/* Left-Aligned Minimal Tabs - Scrollable on Mobile */}
      <div className="flex gap-6 md:gap-10 mb-4 ml-2 md:ml-6 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setActiveTab("homestays")}
          className={cn(
            "text-[14px] md:text-[15px] font-bold transition-all relative flex items-center gap-2 pb-1 flex-shrink-0",
            activeTab === "homestays" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
          )}
        >
          <Home className={cn("h-4 w-4", activeTab === "homestays" ? "text-primary" : "text-zinc-400")} />
          Homestays
          {activeTab === "homestays" && (
            <motion.div 
              layoutId="activeTab"
              className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary" 
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("activities")}
          className={cn(
            "text-[14px] md:text-[15px] font-bold transition-all relative flex items-center gap-2 pb-1 flex-shrink-0",
            activeTab === "activities" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
          )}
        >
          <Ticket className={cn("h-4 w-4", activeTab === "activities" ? "text-primary" : "text-zinc-400")} />
          Activities
          {activeTab === "activities" && (
            <motion.div 
              layoutId="activeTab"
              className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary" 
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("nearby")}
          className={cn(
            "text-[14px] md:text-[15px] font-bold transition-all relative flex items-center gap-2 pb-1 flex-shrink-0",
            activeTab === "nearby" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
          )}
        >
          <Compass className={cn("h-4 w-4", activeTab === "nearby" ? "text-primary" : "text-zinc-400")} />
          Find Nearby
          {activeTab === "nearby" && (
            <motion.div 
              layoutId="activeTab"
              className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary" 
            />
          )}
        </button>
      </div>

      {/* Modern Pill Search Bar - Responsive Grid on Mobile */}
      <div className="bg-white border border-zinc-200 rounded-[24px] p-1 md:rounded-full flex flex-col md:flex-row items-stretch md:items-center hover:border-zinc-300 transition-all shadow-xl shadow-zinc-200/50 md:shadow-none">
        
        {/* Where */}
        <div className="flex-1 cursor-pointer py-3 md:py-2 px-6 md:pl-8 md:pr-4 border-b md:border-b-0 md:border-r border-zinc-100">
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-zinc-900">Location</p>
          <input 
            type="text" 
            placeholder={activeTab === "nearby" ? "Current Location" : "Search destinations"} 
            disabled={activeTab === "nearby"}
            className={cn(
              "bg-transparent border-none outline-none text-[14px] md:text-[15px] placeholder:text-zinc-300 w-full mt-0.5",
              activeTab === "nearby" ? "text-primary font-semibold" : "text-zinc-500"
            )}
          />
        </div>

        {/* When */}
        <div className="flex-1 cursor-pointer py-3 md:py-2 px-6 md:px-4 border-b md:border-b-0 md:border-r border-zinc-100">
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-zinc-900">Date</p>
          <p className="text-[14px] md:text-[15px] text-zinc-300 mt-0.5">Add dates</p>
        </div>

        {/* Who */}
        <div className="flex-1 cursor-pointer py-3 md:py-2 px-6 md:px-4 flex items-center justify-between pr-4">
          <div>
            <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-zinc-900">Guests</p>
            <p className="text-[14px] md:text-[15px] text-zinc-300 mt-0.5">Add guests</p>
          </div>
          <ChevronDown className="h-4 w-4 text-zinc-300" />
        </div>

        {/* Circular Search Button */}
        <button 
          title={activeTab === "nearby" ? "Search Nearby" : "Search"}
          className="bg-primary hover:bg-primary/90 text-white h-14 md:h-auto p-4 md:p-4 rounded-xl md:rounded-full transition-all flex items-center justify-center  active:scale-95 mt-2 md:mt-0"
        >
          <Search className="h-5 w-5 md:h-5 md:w-5 stroke-[3]" />
          <span className="md:hidden ml-2 font-bold uppercase tracking-wider text-sm">Search</span>
        </button>
      </div>
    </div>
  );
}
