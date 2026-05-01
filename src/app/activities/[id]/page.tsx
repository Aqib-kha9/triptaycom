"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  MapPin, 
  Share2, 
  Heart, 
  Zap,
  Clock,
  Navigation,
  ShieldCheck,
  Calendar,
  Users,
  ChevronRight,
  Info,
  Mountain,
  Waves,
  Camera
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const IMAGES = [
  "https://images.unsplash.com/photo-1530866495547-084969f682ba?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1544131464-f999185b3400?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80&w=800",
];

const FEATURES = [
  { icon: <Clock className="w-5 h-5" />, label: "4-5 Hours Duration" },
  { icon: <Mountain className="w-5 h-5" />, label: "Moderate Difficulty" },
  { icon: <ShieldCheck className="w-5 h-5" />, label: "Certified Instructor" },
  { icon: <Zap className="w-5 h-5" />, label: "Equipment Included" },
];

export default function ActivityDetailPage() {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow pt-24">
        {/* Header Section */}
        <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">Adventure</span>
                <span className="text-zinc-300">•</span>
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Rishikesh</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">White Water River Rafting (16km)</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span>4.8</span>
                  <span className="text-zinc-400 underline">(3,450 bookings)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <span className="underline">Shivpuri, Rishikesh, India</span>
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

        {/* Activity Media (Landscape Focus) */}
        <div className="container mx-auto px-4 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] md:h-[500px] rounded-3xl overflow-hidden relative">
            <div className="md:col-span-2 relative overflow-hidden">
              <img src={IMAGES[0]} alt="Rafting" className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-rows-2 gap-4">
              <img src={IMAGES[1]} alt="River" className="w-full h-full object-cover" />
              <img src={IMAGES[2]} alt="Tents" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-16 relative">
            
            {/* Left Column: Info */}
            <div className="lg:flex-[1.5] space-y-12">
              {/* Quick Features Bento */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {FEATURES.map((feature, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col items-center text-center gap-3">
                    <div className="text-primary">{feature.icon}</div>
                    <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-tight leading-tight">{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="pb-12 border-b border-zinc-100">
                <h2 className="text-2xl font-bold text-zinc-900 mb-6">Experience Description</h2>
                <p className="text-zinc-500 leading-relaxed text-lg">
                  Prepare for the ultimate adrenaline rush as you navigate through the Grade III 
                  and IV rapids of the holy Ganges. This 16km stretch from Shivpuri to Rishikesh 
                  is perfect for both beginners and seasoned rafters.
                  <br /><br />
                  You'll be guided by certified rafting experts who ensure your safety while 
                  providing an unforgettable adventure. Highlights include the famous 'Golf Course' 
                  and 'Roller Coaster' rapids.
                </p>
              </div>

              {/* Itinerary / What to expect */}
              <div className="pb-12 border-b border-zinc-100">
                <h2 className="text-2xl font-bold text-zinc-900 mb-8">What to expect</h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg">Briefing & Gear Up</h3>
                      <p className="text-zinc-500">Meet at the base camp for safety instructions and collect your life jackets, helmets, and paddles.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg">The 16km Descent</h3>
                      <p className="text-zinc-500">Experience 7 major rapids and enjoy the scenic valley views. Optional body surfing in calmer stretches.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg">Finish & Refreshment</h3>
                      <p className="text-zinc-500">End your journey near the iconic Laxman Jhula with hot tea and snacks.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Booking Card */}
            <div className="lg:flex-1">
              <div className="sticky top-28 bg-white border border-zinc-100 rounded-[32px] p-8 shadow-2xl shadow-zinc-200/60 space-y-6">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-2xl font-bold text-zinc-900">₹1,200</span>
                    <span className="text-zinc-500 font-bold text-sm ml-1">/ person</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-primary">
                    <Zap className="w-4 h-4 fill-primary" />
                    <span>Instant Booking</span>
                  </div>
                </div>

                {/* Date/Time Selection */}
                <div className="border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-100">
                  <div className="p-3 cursor-pointer hover:bg-zinc-50 transition-colors">
                    <p className="text-[10px] font-bold uppercase text-zinc-400">Activity Date</p>
                    <p className="text-sm font-bold">May 20, 2024</p>
                  </div>
                  <div className="p-3 cursor-pointer hover:bg-zinc-50 transition-colors flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-zinc-400">Select Slot</p>
                      <p className="text-sm font-bold">Morning (9:00 AM - 1:00 PM)</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="p-3 cursor-pointer hover:bg-zinc-50 transition-colors flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-zinc-400">Participants</p>
                      <p className="text-sm font-bold">2 Persons</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </div>
                </div>

                <Button className="w-full h-16 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
                  Book Experience
                </Button>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4">
                  <div className="flex justify-between text-zinc-600 font-medium">
                    <span>₹1,200 x 2 persons</span>
                    <span>₹2,400</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 font-medium">
                    <span>GST (5%)</span>
                    <span>₹120</span>
                  </div>
                  <div className="flex justify-between text-zinc-900 font-bold pt-4 border-t border-zinc-50 text-lg">
                    <span>Total Amount</span>
                    <span>₹2,520</span>
                  </div>
                </div>

                {/* Requirements */}
                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-2">
                  <p className="text-[10px] font-bold uppercase text-orange-800">Must Carry:</p>
                  <ul className="text-[11px] text-orange-700 space-y-1 list-disc ml-3">
                    <li>Extra set of clothes & towel</li>
                    <li>Sunscreen & Sunglasses with strap</li>
                    <li>Valid ID Proof</li>
                  </ul>
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
