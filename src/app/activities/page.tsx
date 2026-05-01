"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ItemCard } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ChevronDown, Map, List, Search, Zap, Mountain, Compass, Waves, Camera } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ACTIVITY_CATEGORIES = [
  { id: "all", label: "All Activities", icon: <SlidersHorizontal className="w-4 h-4" /> },
  { id: "adventure", label: "Adventure", icon: <Zap className="w-4 h-4" /> },
  { id: "trekking", label: "Trekking", icon: <Mountain className="w-4 h-4" /> },
  { id: "experiences", label: "Local Exp", icon: <Compass className="w-4 h-4" /> },
  { id: "water", label: "Water Sports", icon: <Waves className="w-4 h-4" /> },
  { id: "photography", label: "Photography", icon: <Camera className="w-4 h-4" /> },
];

const ACTIVITIES_DATA = [
  {
    title: "River Rafting",
    location: "Rishikesh",
    price: "1,200",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1530866495547-084969f682ba?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Mountain Trek",
    location: "Triund, HP",
    price: "1,500",
    rating: "4.5",
    image: "https://images.unsplash.com/photo-1551632432-c7359b243b4d?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Paragliding",
    location: "Bir Billing, HP",
    price: "3,000",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1516245556508-7d6004ff0f39?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Village Farming",
    location: "Kasol, HP",
    price: "900",
    rating: "4.6",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Bungee Jumping",
    location: "Rishikesh",
    price: "3,500",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Scuba Diving",
    location: "Goa",
    price: "4,500",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Cycling Tour",
    location: "Chandigarh",
    price: "800",
    rating: "4.4",
    image: "https://images.unsplash.com/photo-1541625602330-2277a4c4b282?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Night Camping",
    location: "Manali",
    price: "1,800",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800",
  }
];

export default function ActivitiesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      
      {/* Listing Hero */}
      <div className="pt-24 pb-8 bg-zinc-50 border-b border-zinc-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Unforgettable Activities</h1>
              <p className="text-zinc-500">From thrill-seeking adventure to calm local experiences.</p>
            </div>
            
            {/* Compact Search Trigger */}
            <div className="flex items-center gap-3 bg-white border border-zinc-200 rounded-full p-2 pl-6 pr-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer min-w-[300px]">
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase text-zinc-400">Activity Type</p>
                <p className="text-sm font-bold text-zinc-800">Anything • Any date • Guests</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                <Search className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-xl border-b border-zinc-100 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto">
            {ACTIVITY_CATEGORIES.map((cat) => (
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
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-zinc-100 font-bold text-sm text-zinc-600 hover:bg-zinc-50 hover:border-zinc-200 transition-all flex-1 md:flex-none justify-center">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-zinc-500 font-medium">Found <span className="text-zinc-900 font-bold">85+</span> activities in your area</p>
          
          <div className="flex items-center bg-zinc-100 p-1 rounded-full">
            <button 
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                viewMode === "grid" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <List className="w-3.5 h-3.5" />
              Grid
            </button>
            <button 
              onClick={() => setViewMode("map")}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                viewMode === "map" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <Map className="w-3.5 h-3.5" />
              Map
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {ACTIVITIES_DATA.map((activity, index) => (
            <ItemCard 
              key={index}
              type="activity"
              title={activity.title}
              location={activity.location}
              price={activity.price}
              rating={activity.rating}
              image={activity.image}
            />
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <Button variant="outline" size="lg" className="rounded-full px-12 border-zinc-200 font-bold">
            Load more activities
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
