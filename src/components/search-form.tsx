"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SearchForm() {
  const [activeTab, setActiveTab] = useState<"homestays" | "activities">("homestays");

  return (
    <div className="w-full max-w-[850px]">
      {/* Left-Aligned Minimal Tabs */}
      <div className="flex gap-10 mb-4 ml-6">
        <button
          onClick={() => setActiveTab("homestays")}
          className={cn(
            "text-[15px] font-bold transition-all relative",
            activeTab === "homestays" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
          )}
        >
          Homestays
          {activeTab === "homestays" && (
            <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("activities")}
          className={cn(
            "text-[15px] font-bold transition-all relative",
            activeTab === "activities" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
          )}
        >
          Activities
          {activeTab === "activities" && (
            <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Modern Pill Search Bar (No Shadows) */}
      <div className="bg-white border border-zinc-200 rounded-full py-2 pl-8 pr-2 flex items-center hover:border-zinc-300 transition-all">
        
        {/* Where */}
        <div className="flex-1 cursor-pointer py-2">
          <p className="text-[11px] font-black uppercase tracking-wider text-zinc-900">Location</p>
          <input 
            type="text" 
            placeholder="Search destinations" 
            className="bg-transparent border-none outline-none text-[15px] text-zinc-500 placeholder:text-zinc-300 w-full"
          />
        </div>

        <div className="w-px h-8 bg-zinc-200 mx-4" />

        {/* When */}
        <div className="flex-1 cursor-pointer py-2">
          <p className="text-[11px] font-black uppercase tracking-wider text-zinc-900">Date</p>
          <p className="text-[15px] text-zinc-300">Add dates</p>
        </div>

        <div className="w-px h-8 bg-zinc-200 mx-4" />

        {/* Who */}
        <div className="flex-1 cursor-pointer py-2 flex items-center justify-between pr-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-zinc-900">Guests</p>
            <p className="text-[15px] text-zinc-300">Add guests</p>
          </div>
          <ChevronDown className="h-4 w-4 text-zinc-300" />
        </div>

        {/* Circular Search Button */}
        <button className="bg-primary hover:bg-primary/90 text-white p-4 rounded-full transition-all flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90">
          <Search className="h-5 w-5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
}
