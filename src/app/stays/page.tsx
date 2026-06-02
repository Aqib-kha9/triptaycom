"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ListingSearch } from "@/components/listing-search";
import { ItemCard } from "@/components/cards";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Inbox } from "lucide-react";

export default function StaysPage() {
  const [stays] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Spacer to push content below the fixed Navbar */}
      <div className="h-16" />

      {/* Sticky Header with Search - Sticks below Navbar */}
      <div className="sticky top-16 z-40 bg-white shadow-sm">
        <ListingSearch />
      </div>

      <main className="relative">
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="mb-12 px-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight mb-2">Stays</h1>
            <p className="text-sm md:text-base text-zinc-500 font-medium">
              We found <span className="text-zinc-900 font-bold">{stays.length}</span> stays
            </p>
          </div>

          {stays.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-100 p-16 flex flex-col items-center justify-center text-center space-y-4">
              <Inbox className="w-12 h-12 text-zinc-300" />
              <h3 className="text-lg font-bold text-zinc-900">No stays found</h3>
              <p className="text-sm text-zinc-500 max-w-md">
                There are no available stays matching your search at the moment. Try adjusting your filters or check back later.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                {stays.map((stay, index) => (
                  <ItemCard
                    key={index}
                    title={stay.title}
                    location={stay.location}
                    price={stay.price}
                    rating={stay.rating}
                    image={stay.image}
                  />
                ))}
              </div>

              <div className="flex justify-center py-16 md:py-24">
                <Button variant="outline" size="lg" className="rounded-full px-12 h-14 border-zinc-200 font-bold text-sm hover:bg-zinc-50 transition-all">
                  Load more stays
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
