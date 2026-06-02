"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ItemCard } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { Heart, Home, Zap, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const [activeTab, setActiveTab] = useState<"stays" | "activities">("stays");
  const { stays, activities, loading } = useWishlist();

  const currentItems = activeTab === "stays" ? stays : activities;

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col lg:flex-row gap-6">
            <DashboardSidebar />

            <div className="flex-grow space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                    My Wishlist
                    <div className="w-6 h-6 rounded-lg bg-rose-50 flex items-center justify-center">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    </div>
                  </h1>
                  <p className="text-xs text-zinc-500 font-medium italic">Your saved favorites.</p>
                </div>
              </div>

              {/* Tab Switcher */}
              <div className="flex items-center p-1 bg-zinc-100 rounded-xl w-fit">
                <button
                  onClick={() => setActiveTab("stays")}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all",
                    activeTab === "stays" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  <Home className="w-3.5 h-3.5" />
                  Stays ({stays.length})
                </button>
                <button
                  onClick={() => setActiveTab("activities")}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all",
                    activeTab === "activities" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  <Zap className="w-3.5 h-3.5" />
                  Activities ({activities.length})
                </button>
              </div>

              {/* Grid Area */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="pt-2"
                >
                  {loading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : currentItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {currentItems.map((entry) => {
                        const item = entry.item;
                        return (
                          <div key={entry.wishlistId} className="group relative">
                            <ItemCard
                              id={item._id}
                              image={item.image || ""}
                              title={item.title}
                              location={item.location}
                              price={item.price.toLocaleString("en-IN")}
                              rating={item.avgRating.toFixed(1)}
                              type={entry.itemType === "stay" ? "homestay" : "activity"}
                            />
                            <div className="mt-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0 duration-300">
                              <Link href={`/checkout/${entry.itemType === "stay" ? "stay" : "activity"}/${item._id}`}>
                                <Button className="w-full rounded-xl gap-1.5 font-bold h-10 text-xs">
                                  Quick Book <ArrowRight className="w-3.5 h-3.5" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-zinc-300 shadow-sm">
                        <Heart className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900">Your wishlist is empty</h3>
                        <p className="text-xs text-zinc-500 mt-1">Explore our listings and save your favorites here.</p>
                      </div>
                      <Link href="/explore">
                        <Button className="rounded-xl px-6 h-10 font-bold text-xs mt-2">Explore</Button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
