"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Unlock, 
  RefreshCw
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { VendorSidebar } from "@/components/navigation/vendor-sidebar";
import { cn } from "@/lib/utils";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["October", "November", "December"];
const BOOKED_DATES = [12, 13, 14, 20, 21];
const BLOCKED_DATES = [5, 6, 28, 29];

export default function VendorCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [activeListing, setActiveListing] = useState("Mountain Whisper Villa");

  const toggleDate = (day: number) => {
    if (BOOKED_DATES.includes(day)) return;
    setSelectedDates(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <VendorSidebar />

            <div className="flex-grow space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">Availability</h1>
                  <p className="text-xs text-zinc-500 font-medium italic">Manage listing dates.</p>
                </div>
                <select 
                  value={activeListing}
                  onChange={(e) => setActiveListing(e.target.value)}
                  className="h-10 pl-3 pr-8 rounded-xl border border-zinc-100 bg-white text-xs font-bold outline-none"
                >
                  <option>Mountain Whisper Villa</option>
                  <option>River Rafting Adventure</option>
                </select>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Main Calendar */}
                <div className="xl:col-span-2 space-y-4">
                  <div className="bg-white rounded-2xl border border-zinc-100 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-lg font-bold text-zinc-900">{MONTHS[currentMonth]} 2024</h2>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-zinc-100"><ChevronLeft className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-zinc-100"><ChevronRight className="w-4 h-4" /></Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 mb-4">
                      {DAYS.map(day => (
                        <div key={day} className="text-center text-[9px] font-black uppercase tracking-widest text-zinc-400">{day}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                        const isBooked = BOOKED_DATES.includes(day);
                        const isBlocked = BLOCKED_DATES.includes(day);
                        const isSelected = selectedDates.includes(day);

                        return (
                          <button
                            key={day}
                            onClick={() => toggleDate(day)}
                            className={cn(
                              "h-12 sm:h-16 rounded-xl border flex flex-col items-center justify-center transition-all relative text-xs font-bold",
                              isBooked ? "bg-indigo-50 border-indigo-100 text-indigo-400 cursor-not-allowed" :
                              isBlocked ? "bg-zinc-100 border-zinc-200 text-zinc-400" :
                              isSelected ? "bg-primary border-primary text-white" :
                              "bg-white border-zinc-50 text-zinc-900 hover:border-zinc-200"
                            )}
                          >
                            {day}
                            {isBooked && <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-indigo-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 px-2">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                      <div className="w-2 h-2 rounded-full bg-indigo-400" /> Booked
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                      <div className="w-2 h-2 rounded-full bg-zinc-200" /> Blocked
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                      <div className="w-2 h-2 rounded-full bg-primary" /> Selected
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-2xl border border-zinc-100 p-6 space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Bulk Actions</h3>
                    <p className="text-[10px] text-zinc-500 font-medium">Select dates on the calendar.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">Selected</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedDates.length > 0 ? selectedDates.sort((a,b)=>a-b).map(d => (
                        <span key={d} className="px-2 py-0.5 bg-white rounded border border-zinc-100 text-[10px] font-bold text-zinc-900">{d} Oct</span>
                      )) : <span className="text-[10px] text-zinc-400 italic font-medium">None</span>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button disabled={selectedDates.length === 0} className="w-full h-11 rounded-xl text-xs font-bold gap-2">
                      <Lock className="w-3.5 h-3.5" /> Block Dates
                    </Button>
                    <Button variant="outline" disabled={selectedDates.length === 0} className="w-full h-11 rounded-xl text-xs font-bold gap-2 border-zinc-100">
                      <Unlock className="w-3.5 h-3.5" /> Make Available
                    </Button>
                  </div>

                  <Button variant="ghost" className="w-full justify-start gap-2 text-zinc-500 font-bold text-[10px] uppercase tracking-widest hover:text-zinc-900 rounded-lg">
                    <RefreshCw className="w-3.5 h-3.5" /> Sync Calendar
                  </Button>
                </div>

              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
