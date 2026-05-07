"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ListingSearch } from "@/components/listing-search";
import { ItemCard } from "@/components/cards";
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
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight mb-2">Hotels in Jakarta, Indonesia</h1>
            <p className="text-sm md:text-base text-zinc-500 font-medium">
              We found <span className="text-zinc-900 font-bold">2,478</span> Premium Hotels
            </p>
          </div>

          {/* Grid - Adaptive Columns, taking full width */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
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

          <div className="flex justify-center py-16 md:py-24">
            <Button variant="outline" size="lg" className="rounded-full px-12 h-14 border-zinc-200 font-bold text-sm hover:bg-zinc-50 transition-all">
              Load more stays
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
