"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ItemCard } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { ListingSearch } from "@/components/listing-search";
import { Zap, Mountain, Compass, Waves, Camera, SlidersHorizontal, Inbox } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ACTIVITY_CATEGORIES = [
  { id: "all", label: "All", icon: <SlidersHorizontal className="w-4 h-4" /> },
  { id: "adventure", label: "Adventure", icon: <Zap className="w-4 h-4" /> },
  { id: "trekking", label: "Trekking", icon: <Mountain className="w-4 h-4" /> },
  { id: "experiences", label: "Local", icon: <Compass className="w-4 h-4" /> },
  { id: "water", label: "Water", icon: <Waves className="w-4 h-4" /> },
  { id: "photography", label: "Photo", icon: <Camera className="w-4 h-4" /> },
];

export default function ActivitiesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activities] = useState<any[]>([]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {/* Spacer */}
      <div className="h-16" />

      {/* Integrated Search Bar */}
      <div className="sticky top-16 z-40 bg-white shadow-sm">
        <ListingSearch mode="activities" />
      </div>

      <main className="flex-grow">
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">

          {/* Header & Categories */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
            <div className="px-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight mb-2">Adventure Activities</h1>
              <p className="text-sm md:text-base text-zinc-500 font-medium">
                Showing <span className="text-zinc-900 font-bold">{activities.length}</span> experiences
              </p>
            </div>

            {/* Premium Category Switcher */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {ACTIVITY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-6 py-3 rounded-2xl transition-all duration-300 whitespace-nowrap border font-bold text-sm group",
                    activeCategory === cat.id
                      ? "bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-200"
                      : "bg-zinc-50 border-zinc-100 text-zinc-500 hover:border-zinc-300 hover:text-zinc-900"
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
          </div>

          {activities.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-100 p-16 flex flex-col items-center justify-center text-center space-y-4">
              <Inbox className="w-12 h-12 text-zinc-300" />
              <h3 className="text-lg font-bold text-zinc-900">No activities found</h3>
              <p className="text-sm text-zinc-500 max-w-md">
                There are no available activities matching your search at the moment. Try adjusting your filters or check back later.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                {activities.map((activity, index) => (
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

              <div className="flex justify-center py-16 md:py-24">
                <Button variant="outline" size="lg" className="rounded-full px-12 h-14 border-zinc-200 font-bold text-sm hover:bg-zinc-50 transition-all">
                  Load more activities
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
