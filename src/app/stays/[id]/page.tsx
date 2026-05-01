"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  MapPin, 
  Share2, 
  Heart, 
  Wifi, 
  Coffee, 
  Car, 
  Tv, 
  Wind,
  ShieldCheck,
  Calendar,
  Users,
  ChevronRight,
  Info
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const IMAGES = [
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1449156006079-eb5881679b0b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&q=80&w=800",
];

const AMENITIES = [
  { icon: <Wifi className="w-5 h-5" />, label: "High-speed Wi-Fi" },
  { icon: <Coffee className="w-5 h-5" />, label: "Breakfast included" },
  { icon: <Car className="w-5 h-5" />, label: "Free parking" },
  { icon: <Tv className="w-5 h-5" />, label: "Smart TV" },
  { icon: <Wind className="w-5 h-5" />, label: "Air conditioning" },
  { icon: <ShieldCheck className="w-5 h-5" />, label: "Dedicated security" },
];

export default function StayDetailPage() {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow pt-24">
        {/* Header Section */}
        <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">The Creek Villa: A Riverside Sanctuary</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span>4.9</span>
                  <span className="text-zinc-400 underline">(124 reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <span className="underline">Manali, Himachal Pradesh, India</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="rounded-full gap-2 hover:bg-zinc-100">
                <Share2 className="w-4 h-4" />
                <span className="font-bold text-xs uppercase tracking-wider">Share</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={cn(
                  "rounded-full gap-2 transition-all",
                  isWishlisted ? "text-primary bg-primary/5" : "hover:bg-zinc-100"
                )}
              >
                <Heart className={cn("w-4 h-4", isWishlisted && "fill-primary")} />
                <span className="font-bold text-xs uppercase tracking-wider">Save</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Image Gallery Grid */}
        <div className="container mx-auto px-4 mb-12">
          <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[500px] rounded-3xl overflow-hidden relative group">
            <div className="col-span-2 row-span-2 relative overflow-hidden">
              <img src={IMAGES[0]} alt="Property" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
            </div>
            <div className="relative overflow-hidden">
              <img src={IMAGES[1]} alt="Property" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
            </div>
            <div className="relative overflow-hidden">
              <img src={IMAGES[2]} alt="Property" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
            </div>
            <div className="relative overflow-hidden">
              <img src={IMAGES[3]} alt="Property" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
            </div>
            <div className="relative overflow-hidden">
              <img src={IMAGES[4]} alt="Property" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
            </div>
            
            <Button className="absolute bottom-6 right-6 bg-white hover:bg-zinc-100 text-zinc-900 font-bold border border-zinc-200 rounded-xl px-6 py-4 shadow-xl shadow-black/10">
              Show all photos
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-16 relative">
            
            {/* Left Column: Info */}
            <div className="lg:flex-[1.5] space-y-12">
              {/* Host Info */}
              <div className="flex items-center justify-between pb-8 border-b border-zinc-100">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-1">Stay with Aryan Singh</h2>
                  <p className="text-zinc-500 font-medium text-sm">Hosted since 2021 • Superhost</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-zinc-100 overflow-hidden ring-4 ring-zinc-50">
                  <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100" alt="Host" />
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-6">
                <div className="flex gap-6">
                  <div className="mt-1"><Star className="w-6 h-6 text-primary" /></div>
                  <div>
                    <h3 className="font-bold text-zinc-900">Highly rated for cleanliness</h3>
                    <p className="text-zinc-500 text-sm">Guests consistently praised the hygiene and sanitization of this villa.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="mt-1"><MapPin className="w-6 h-6 text-primary" /></div>
                  <div>
                    <h3 className="font-bold text-zinc-900">Great location</h3>
                    <p className="text-zinc-500 text-sm">95% of recent guests gave the location a 5-star rating.</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="pb-12 border-b border-zinc-100">
                <h2 className="text-2xl font-bold text-zinc-900 mb-6">About this place</h2>
                <p className="text-zinc-500 leading-relaxed text-lg">
                  Nestled right by the rushing Beas River, The Creek Villa offers an unparalleled 
                  experience of Manali's natural beauty. Wake up to the sound of flowing water 
                  and the panoramic views of snow-capped Himalayan peaks.
                  <br /><br />
                  This handcrafted wooden villa features locally sourced cedar and stone, 
                  blending rustic charm with modern luxury. Perfect for families or groups 
                  looking for a private retreat.
                </p>
                <button className="mt-6 text-zinc-900 font-bold underline flex items-center gap-1">
                  Show more <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Amenities */}
              <div className="pb-12 border-b border-zinc-100">
                <h2 className="text-2xl font-bold text-zinc-900 mb-8">What this place offers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  {AMENITIES.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-zinc-600">
                      <div className="text-zinc-400">{item.icon}</div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-10 rounded-xl px-8 h-14 font-bold border-zinc-200">
                  Show all 45 amenities
                </Button>
              </div>
            </div>

            {/* Right Column: Sticky Booking Card */}
            <div className="lg:flex-1">
              <div className="sticky top-28 bg-white border border-zinc-100 rounded-[32px] p-8 shadow-2xl shadow-zinc-200/60 space-y-6">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-2xl font-bold text-zinc-900">₹4,500</span>
                    <span className="text-zinc-500 font-bold text-sm ml-1">/ night</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span>4.9</span>
                  </div>
                </div>

                {/* Date/Guest Selection */}
                <div className="border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-100">
                  <div className="flex divide-x divide-zinc-100">
                    <div className="flex-1 p-3 cursor-pointer hover:bg-zinc-50 transition-colors">
                      <p className="text-[10px] font-bold uppercase text-zinc-400">Check-in</p>
                      <p className="text-sm font-bold">May 15, 2024</p>
                    </div>
                    <div className="flex-1 p-3 cursor-pointer hover:bg-zinc-50 transition-colors">
                      <p className="text-[10px] font-bold uppercase text-zinc-400">Checkout</p>
                      <p className="text-sm font-bold">May 20, 2024</p>
                    </div>
                  </div>
                  <div className="p-3 cursor-pointer hover:bg-zinc-50 transition-colors flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-zinc-400">Guests</p>
                      <p className="text-sm font-bold">2 adults, 1 child</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </div>
                </div>

                <Button className="w-full h-16 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
                  Book Sanctuary
                </Button>

                <p className="text-center text-zinc-400 text-xs font-medium">You won't be charged yet</p>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4">
                  <div className="flex justify-between text-zinc-600 font-medium">
                    <span className="underline">₹4,500 x 5 nights</span>
                    <span>₹22,500</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 font-medium">
                    <span className="underline">Food Add-on (B+D)</span>
                    <span>₹2,500</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 font-medium">
                    <span className="underline">GST (5%)</span>
                    <span>₹1,250</span>
                  </div>
                  <div className="flex justify-between text-zinc-900 font-bold pt-4 border-t border-zinc-50 text-lg">
                    <span>Total Amount</span>
                    <span>₹26,250</span>
                  </div>
                </div>

                {/* Info Alert */}
                <div className="flex gap-3 p-4 bg-zinc-50 rounded-2xl text-[11px] leading-relaxed text-zinc-500">
                  <Info className="w-4 h-4 flex-shrink-0 text-zinc-400" />
                  <p>This property is highly in demand. Only 2 rooms left for these dates.</p>
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
