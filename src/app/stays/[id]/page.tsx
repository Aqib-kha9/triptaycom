"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/cards";
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
  Info,
  Clock,
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { useState, use } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

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

const REVIEWS = [
  { id: 1, name: "Sneha Reddy", rating: 5, date: "April 2024", comment: "Absolutely stunning villa! The riverside view is breath-taking. Aryan was an amazing host.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha" },
  { id: 2, name: "Amit Sharma", rating: 4, date: "March 2024", comment: "Great place for a family getaway. The food was delicious, especially the local dishes.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit" },
];

const SIMILAR_PROPERTIES = [
  { title: "River View Cottage", location: "Rishikesh, UK", price: "3,200", rating: "4.5", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600" },
  { title: "Mountain Echo", location: "Kasol, HP", price: "2,800", rating: "4.8", image: "https://images.unsplash.com/photo-1449156006079-eb5881679b0b?auto=format&fit=crop&q=80&w=600" },
  { title: "Greenwood Stay", location: "Bir, HP", price: "3,000", rating: "4.9", image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600" },
];

export default function StayDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [guestCount, setGuestCount] = useState(2);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* Header Section */}
        <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-3">The Creek Villa: A Riverside Sanctuary</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm font-bold">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span>4.9</span>
                  <span className="text-zinc-400 font-medium underline">(124 reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 uppercase tracking-widest text-[10px]">Verified Property</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <span className="underline text-zinc-600 font-medium">Manali, Himachal Pradesh, India</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-full gap-2 border-zinc-200 font-bold text-xs uppercase">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={cn(
                  "rounded-full gap-2 border-zinc-200 font-bold text-xs uppercase transition-all",
                  isWishlisted ? "text-primary border-primary bg-primary/5" : "hover:bg-zinc-50"
                )}
              >
                <Heart className={cn("w-4 h-4", isWishlisted && "fill-primary")} />
                {isWishlisted ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Image Gallery Grid */}
        <div className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[400px] md:h-[600px] rounded-[40px] overflow-hidden relative group shadow-2xl shadow-zinc-200">
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

            <Button className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md hover:bg-white text-zinc-900 font-bold border border-zinc-200 rounded-2xl px-6 py-6 shadow-2xl shadow-black/10 transition-all">
              Show all photos
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-20 relative">

            {/* Left Column: Info */}
            <div className="lg:flex-[1.5] space-y-16">

              {/* Host & Overview */}
              <div className="flex items-start justify-between pb-12 border-b border-zinc-100">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-zinc-900">Experience Manali with Aryan Singh</h2>
                  <div className="flex items-center gap-4 text-zinc-500 font-medium">
                    <span>6 guests</span>
                    <span>•</span>
                    <span>3 bedrooms</span>
                    <span>•</span>
                    <span>4 beds</span>
                    <span>•</span>
                    <span>3.5 bathrooms</span>
                  </div>
                </div>
                <div className="relative group flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-zinc-100 overflow-hidden ring-4 ring-zinc-50 shadow-lg">
                    <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200" alt="Host" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full border-4 border-white flex items-center justify-center text-white">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Highlights Bento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-[32px] bg-zinc-50 border border-zinc-100 flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm flex-shrink-0"><Star className="w-6 h-6" /></div>
                  <div>
                    <h3 className="font-bold text-zinc-900 mb-1">Superhost Quality</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">Aryan is a highly rated, experienced host committed to providing great stays for guests.</p>
                  </div>
                </div>
                <div className="p-8 rounded-[32px] bg-zinc-50 border border-zinc-100 flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm flex-shrink-0"><MapPin className="w-6 h-6" /></div>
                  <div>
                    <h3 className="font-bold text-zinc-900 mb-1">Great Location</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">95% of recent guests gave the location a 5-star rating.</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-zinc-900">About this Sanctuary</h2>
                <p className="text-zinc-600 leading-relaxed text-lg font-medium">
                  Nestled right by the rushing Beas River, The Creek Villa offers an unparalleled
                  experience of Manali's natural beauty. Wake up to the sound of flowing water
                  and the panoramic views of snow-capped Himalayan peaks.
                  <br /><br />
                  This handcrafted wooden villa features locally sourced cedar and stone,
                  blending rustic charm with modern luxury. Perfect for families or groups
                  looking for a private retreat.
                </p>
                <button className="text-primary font-bold underline flex items-center gap-1 hover:gap-2 transition-all">
                  Show more <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Amenities Section */}
              <div className="space-y-8 pt-12 border-t border-zinc-100">
                <h2 className="text-2xl font-bold text-zinc-900">What this place offers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  {AMENITIES.map((item, i) => (
                    <div key={i} className="flex items-center gap-6 text-zinc-600">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400">{item.icon}</div>
                      <span className="font-bold">{item.label}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="rounded-2xl px-10 h-16 font-bold border-zinc-200 hover:bg-zinc-50">
                  Show all 45 amenities
                </Button>
              </div>

              {/* Food Pricing Section */}
              <div className="space-y-8 pt-12 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-zinc-900">Food Options</h2>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Optional Add-ons</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Breakfast", price: "₹250", desc: "Fresh fruits, local eggs & tea" },
                    { label: "Lunch", price: "₹450", desc: "Traditional Himachali thali" },
                    { id: "dinner", label: "Dinner", price: "₹550", desc: "Multi-cuisine buffet" },
                  ].map((food) => (
                    <div key={food.label} className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-zinc-900">{food.label}</h4>
                        <span className="text-primary font-bold">{food.price}</span>
                      </div>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed">{food.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Google Map Mock */}
              <div className="space-y-8 pt-12 border-t border-zinc-100">
                <h2 className="text-2xl font-bold text-zinc-900">Where you'll be</h2>
                <div className="h-[400px] w-full rounded-[40px] bg-zinc-100 overflow-hidden relative border border-zinc-100">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center grayscale opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-primary/20 p-8 rounded-full animate-pulse">
                      <div className="bg-primary p-4 rounded-full text-white shadow-2xl shadow-primary/40">
                        <MapPin className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-zinc-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-zinc-900">Manali, Himachal Pradesh</p>
                      <p className="text-xs text-zinc-500 font-medium">Detailed location after booking</p>
                    </div>
                    <Button variant="ghost" className="font-bold text-primary">Get Directions</Button>
                  </div>
                </div>
              </div>

              {/* Nearby Attractions */}
              <div className="space-y-8 pt-12 border-t border-zinc-100">
                <h2 className="text-2xl font-bold text-zinc-900">Nearby Attractions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Solang Valley", distance: "4.5 km away", type: "Nature" },
                    { name: "Hadimba Temple", distance: "2.1 km away", type: "Historic" },
                    { name: "Old Manali Market", distance: "1.5 km away", type: "Shopping" },
                    { name: "Jogini Falls", distance: "3.2 km away", type: "Hiking" },
                  ].map((attr) => (
                    <div key={attr.name} className="p-6 rounded-2xl border border-zinc-100 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 text-sm">{attr.name}</p>
                          <p className="text-xs text-zinc-400 font-medium">{attr.distance}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{attr.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="space-y-12 pt-12 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star className="w-8 h-8 fill-primary text-primary" />
                    <h2 className="text-3xl font-bold text-zinc-900">4.9 • 124 reviews</h2>
                  </div>
                  <Button variant="outline" className="rounded-xl px-8 font-bold border-zinc-200">Rate Stay</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {REVIEWS.map((review) => (
                    <div key={review.id} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-100 ring-2 ring-zinc-50">
                          <img src={review.avatar} alt={review.name} />
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-900">{review.name}</h4>
                          <p className="text-xs text-zinc-500 font-medium">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-primary text-primary" : "text-zinc-200")} />
                        ))}
                      </div>
                      <p className="text-zinc-600 leading-relaxed font-medium">{review.comment}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full h-16 rounded-2xl font-bold border-zinc-200 text-zinc-600 hover:bg-zinc-50">
                  Show all 124 reviews
                </Button>
              </div>

            </div>

            {/* Right Column: Sticky Booking Card */}
            <div className="lg:flex-1">
              <div className="sticky top-28 space-y-6">
                <div className="bg-white border border-zinc-100 rounded-[40px] p-8 shadow-2xl shadow-zinc-200/50 space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-12 translate-x-12 blur-2xl" />

                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-3xl font-bold text-zinc-900">₹4,500</span>
                      <span className="text-zinc-500 font-bold text-sm ml-1">/ night</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bold bg-zinc-50 px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span>4.9</span>
                    </div>
                  </div>

                  {/* Booking Form Interface */}
                  <div className="space-y-4">
                    {/* Dates */}
                    <div className="border border-zinc-100 rounded-3xl overflow-hidden divide-y divide-zinc-50 bg-zinc-50/50">
                      <div className="flex divide-x divide-zinc-50">
                        <div className="flex-1 p-5 cursor-pointer hover:bg-zinc-50 transition-colors">
                          <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest mb-1">Check-in</p>
                          <p className="text-sm font-bold text-zinc-900">15 May, 2024</p>
                        </div>
                        <div className="flex-1 p-5 cursor-pointer hover:bg-zinc-50 transition-colors">
                          <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest mb-1">Checkout</p>
                          <p className="text-sm font-bold text-zinc-900">20 May, 2024</p>
                        </div>
                      </div>
                      <div className="p-5 cursor-pointer hover:bg-zinc-50 transition-colors flex justify-between items-center group">
                        <div>
                          <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest mb-1">Guests</p>
                          <p className="text-sm font-bold text-zinc-900">{guestCount} adults, 1 child</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    <Link href={`/checkout/stay/${params.id}`} className="block">
                      <Button className="w-full h-16 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 gap-2 group">
                        Book Sanctuary
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>

                  <p className="text-center text-zinc-400 text-xs font-medium">You won't be charged until next step</p>

                  {/* Price Breakdown Preview */}
                  <div className="space-y-4 pt-6 border-t border-zinc-50">
                    <div className="flex justify-between text-zinc-500 font-medium text-sm">
                      <span className="underline">₹4,500 x 5 nights</span>
                      <span>₹22,500</span>
                    </div>
                    <div className="flex justify-between text-zinc-500 font-medium text-sm">
                      <span className="underline">Platform Fee</span>
                      <span>₹1,125</span>
                    </div>
                    <div className="flex justify-between text-zinc-900 font-bold pt-4 text-xl">
                      <span>Total</span>
                      <span>₹23,625</span>
                    </div>
                  </div>

                  {/* Urgency Alert */}
                  <div className="flex gap-4 p-5 bg-amber-50/50 rounded-3xl border border-amber-100 text-[11px] leading-relaxed text-amber-900 font-medium">
                    <Info className="w-5 h-5 flex-shrink-0 text-amber-500" />
                    <p>Highly in demand! 84 people are looking at this stay for your dates.</p>
                  </div>
                </div>

                {/* Trust Section */}
                <div className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100 flex items-center gap-4">
                  <ShieldCheck className="w-8 h-8 text-emerald-500" />
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Triptay Guarantee</p>
                    <p className="text-[10px] text-zinc-500 font-medium">Secure payment & verified property check.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Similar Properties Section */}
          <div className="pt-24 border-t border-zinc-100 space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-zinc-900">Similar properties nearby</h2>
              <Link href="/stays" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                Explore all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {SIMILAR_PROPERTIES.map((prop, i) => (
                <ItemCard
                  key={i}
                  title={prop.title}
                  location={prop.location}
                  price={prop.price}
                  rating={prop.rating}
                  image={prop.image}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
