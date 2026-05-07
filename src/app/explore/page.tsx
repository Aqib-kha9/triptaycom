"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ListingSearch } from "@/components/listing-search";
import { ItemCard } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Zap, MapPin, SlidersHorizontal, ArrowUpDown } from "lucide-react";

const STAYS_DATA = [
  { title: "Harmony Suites", location: "South Jakarta", price: "4,500", rating: "5.0", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800" },
  { title: "Radiant Residences", location: "West Jakarta", price: "3,200", rating: "4.8", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800" },
];

const ACTIVITIES_DATA = [
  { title: "River Rafting", location: "Rishikesh, UK", price: "1,200", rating: "4.8", image: "https://images.unsplash.com/photo-1530866495547-084969f682ba?auto=format&fit=crop&q=80&w=800" },
  { title: "Mountain Trek", location: "Triund, HP", price: "1,500", rating: "4.5", image: "https://images.unsplash.com/photo-1551632432-c7359b243b4d?auto=format&fit=crop&q=80&w=800" },
];

export default function SearchResultPage() {
  const [activeTab, setActiveTab] = useState<"stays" | "activities">("stays");

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      
      <div className="h-16" />

      {/* Global Search Bar */}
      <div className="sticky top-16 z-40 bg-white shadow-sm">
        <ListingSearch mode={activeTab} />
      </div>

      <main className="flex-grow">
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
          
          {/* Search Header & Tab Switcher */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="px-2">
              <h1 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tighter mb-4">
                Explore <span className="text-primary">Triptay.</span>
              </h1>
              <div className="flex items-center p-1.5 bg-zinc-100 rounded-2xl w-fit">
                <button 
                  onClick={() => setActiveTab("stays")}
                  className={cn(
                    "flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                    activeTab === "stays" ? "bg-white text-zinc-900 shadow-md" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  <Home className="w-4 h-4" />
                  Stays
                </button>
                <button 
                  onClick={() => setActiveTab("activities")}
                  className={cn(
                    "flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                    activeTab === "activities" ? "bg-white text-zinc-900 shadow-md" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  <Zap className="w-4 h-4" />
                  Activities
                </button>
              </div>
            </div>

            {/* Sort & Quick Info */}
            <div className="flex items-center gap-4 px-2">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest hidden sm:block">
                Showing {activeTab === "stays" ? STAYS_DATA.length : ACTIVITIES_DATA.length} results
              </p>
              <Button variant="outline" className="rounded-xl border-zinc-200 gap-2 h-12 px-6 font-bold text-sm">
                <ArrowUpDown className="w-4 h-4" />
                Sort By
              </Button>
            </div>
          </div>

          {/* Results Grid with Animation */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
            >
              {activeTab === "stays" ? (
                STAYS_DATA.map((item, i) => (
                  <ItemCard key={i} {...item} type="homestay" />
                ))
              ) : (
                ACTIVITIES_DATA.map((item, i) => (
                  <ItemCard key={i} {...item} type="activity" />
                ))
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center py-24">
            <Button variant="outline" size="lg" className="rounded-full px-12 h-14 border-zinc-200 font-bold text-sm hover:bg-zinc-50">
              Load more results
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
