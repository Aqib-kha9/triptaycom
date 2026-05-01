"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ListingSearch } from "@/components/listing-search";
import { ItemCard } from "@/components/cards";
import { Map as MapIcon, List, Search, Maximize2, Star, MapPin,X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const STAYS_DATA = [
  {
    title: "Harmony Suites",
    location: "Blissful Street, South Jakarta",
    price: "4,500",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Radiant Residences",
    location: "Serene Avenue, West Jakarta",
    price: "3,200",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Tranquil Haven Hotel",
    location: "Peaceful Lane, North Jakarta",
    price: "2,800",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1449156006079-eb5881679b0b?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Greenwood Stay",
    location: "Nature Park, East Jakarta",
    price: "3,000",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "The Cedar Cabin",
    location: "Forest Hill, South Jakarta",
    price: "5,500",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Skyline Apartment",
    location: "Central Business District",
    price: "6,200",
    rating: "4.6",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
  }
];

export default function StaysPage() {
  const [showMapMobile, setShowMapMobile] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Spacer to push content below the fixed Navbar */}
      <div className="h-16" />

      {/* Sticky Header with Search - Sticks below Navbar */}
      <div className="sticky top-16 z-40 bg-white shadow-sm lg:shadow-none">
        <ListingSearch />
      </div>

      <main className="relative">
        <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-140px)] overflow-hidden">
          
          {/* Left Column: Listings */}
          <div className={cn(
            "w-full lg:w-[60%] xl:w-[68%] overflow-y-auto no-scrollbar bg-white",
            showMapMobile ? "hidden lg:block" : "block"
          )}>
            <div className="p-4 md:p-8">
              <div className="mb-8 md:mb-10 px-2">
                <h1 className="text-2xl md:text-[28px] font-extrabold text-zinc-900 tracking-tight mb-1">Hotels in Jakarta, Indonesia</h1>
                <p className="text-sm text-zinc-500 font-medium">
                  We found <span className="text-zinc-900 font-bold">2478</span> Premium Hotels
                </p>
              </div>

              {/* Grid - Adaptive Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-12">
                {STAYS_DATA.map((stay, index) => (
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

              <div className="flex justify-center py-12 md:py-16">
                <Button variant="outline" size="lg" className="rounded-full px-10 md:px-12 border-zinc-200 font-bold text-sm">
                  Load more stays
                </Button>
              </div>

              {/* Mobile Bottom Padding */}
              <div className="h-20 lg:hidden" />
            </div>
          </div>

          {/* Right Column: Map (Responsive) */}
          <div className={cn(
            "w-full lg:w-[40%] xl:w-[32%] h-[60vh] lg:h-full p-4 lg:p-4",
            showMapMobile ? "block fixed inset-0 z-50 pt-24 bg-white lg:relative lg:block lg:pt-4" : "hidden lg:block"
          )}>
            <div className="relative w-full h-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-zinc-100 group shadow-lg">
              
              {/* Back button for mobile map view */}
              <button 
                onClick={() => setShowMapMobile(false)}
                className="absolute top-6 left-6 z-20 lg:hidden flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-xl border border-zinc-100"
              >
                <X className="w-5 h-5 text-zinc-900" />
              </button>

              <button className="absolute top-6 left-6 hidden lg:flex z-20 items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-lg border border-zinc-100 font-bold text-xs hover:scale-105 transition-all">
                <Maximize2 className="w-4 h-4" />
                <span>Expand Map</span>
              </button>

              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=Jakarta,Indonesia&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 grayscale-[0.1] contrast-[1.05]"
              ></iframe>
            </div>
          </div>

        </div>

        {/* Floating Mobile Map Toggle */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 lg:hidden">
          <button 
            onClick={() => setShowMapMobile(!showMapMobile)}
            className="flex items-center gap-2 bg-zinc-900 text-white px-8 py-3.5 rounded-full shadow-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all"
          >
            {showMapMobile ? (
              <><List className="w-4 h-4" /><span>Show List</span></>
            ) : (
              <><MapIcon className="w-4 h-4" /><span>Show Map</span></>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
