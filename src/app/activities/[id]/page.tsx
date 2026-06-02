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
  Zap,
  Clock,
  Navigation,
  ShieldCheck,
  Calendar,
  Users,
  ChevronRight,
  Info,
  ArrowRight,
  Inbox,
  Mountain,
  Waves,
  Camera,
  CheckCircle2,
  ThumbsUp,
  MessageCircle,
  Award,
  Check,
  X
} from "lucide-react";
import { useState, use } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ActivityDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [personCount, setPersonCount] = useState(2);
  const [images] = useState<any[]>([]);
  const [features] = useState<any[]>([]);
  const [reviews] = useState<any[]>([]);
  const [similarActivities] = useState<any[]>([]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* Header Section */}
        <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">Adventure</span>
                <span className="text-zinc-300">•</span>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Rishikesh, UK</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-3">White Water River Rafting: 16km Thrill</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm font-bold">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span>4.8</span>
                  <span className="text-zinc-400 font-medium underline">(3,450 bookings)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 uppercase tracking-widest text-[10px]">Instant Confirmation</span>
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

        {/* Media Grid */}
        <div className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] md:h-[500px] rounded-[40px] overflow-hidden relative shadow-2xl shadow-zinc-200">
            <div className="md:col-span-2 relative overflow-hidden group">
              {images[0] ? <img src={images[0]} alt="Rafting" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer" /> : <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-300"><Inbox className="w-10 h-10" /></div>}
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="relative overflow-hidden group">
                {images[1] ? <img src={images[1]} alt="River" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer" /> : <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-300"><Inbox className="w-8 h-8" /></div>}
              </div>
              <div className="relative overflow-hidden group">
                {images[2] ? <img src={images[2]} alt="Tents" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer" /> : <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-300"><Inbox className="w-8 h-8" /></div>}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-20 relative">

            {/* Left Column: Info */}
            <div className="lg:flex-[1.5] space-y-16">

              {/* Quick Features Bento */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {features.length === 0 ? (
                  <div className="col-span-2 md:col-span-4 bg-white rounded-[28px] border border-zinc-100 p-12 flex flex-col items-center justify-center text-center space-y-3">
                    <Inbox className="w-8 h-8 text-zinc-300" />
                    <p className="text-sm font-bold text-zinc-400">No features listed</p>
                    <p className="text-xs text-zinc-400 font-medium">Activity details will appear here once available</p>
                  </div>
                ) : (
                  features.map((feature, i) => (
                    <div key={i} className="p-6 rounded-[28px] bg-zinc-50 border border-zinc-100 flex flex-col items-center text-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">{feature.icon}</div>
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tight leading-tight">{feature.label}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Description */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-zinc-900">Experience Description</h2>
                <p className="text-zinc-600 leading-relaxed text-lg font-medium">
                  Prepare for the ultimate adrenaline rush as you navigate through the Grade III
                  and IV rapids of the holy Ganges. This 16km stretch from Shivpuri to Rishikesh
                  is perfect for both beginners and seasoned rafters.
                  <br /><br />
                  You'll be guided by certified rafting experts who ensure your safety while
                  providing an unforgettable adventure. Highlights include the famous 'Golf Course'
                  and 'Roller Coaster' rapids.
                </p>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-zinc-100">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-zinc-900">What's Included</h3>
                  <ul className="space-y-4">
                    {["All safety equipment", "Certified river guide", "16km rafting stretch", "Life jacket and helmet", "Hot tea/coffee after activity"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-zinc-600 font-medium">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-emerald-500" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-zinc-900">What's Not Included</h3>
                  <ul className="space-y-4">
                    {["Personal expenses", "Camera/GoPro footage", "Transportation to base camp", "Personal medication", "Tipping for guides"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-zinc-400 font-medium line-through">
                        <div className="w-5 h-5 rounded-full bg-zinc-50 flex items-center justify-center flex-shrink-0">
                          <X className="w-3 h-3 text-zinc-300" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Itinerary */}
              <div className="space-y-10 pt-12 border-t border-zinc-100">
                <h2 className="text-2xl font-bold text-zinc-900">Experience Timeline</h2>
                <div className="space-y-8">
                  {[
                    { step: "01", title: "Briefing & Gear Up", desc: "Meet at the base camp for safety instructions and collect your high-quality gear." },
                    { step: "02", title: "The 16km Descent", desc: "Experience 7 major rapids and enjoy the scenic valley views. Optional body surfing included." },
                    { step: "03", title: "Finish & Refreshment", desc: "End your journey with hot tea and snacks near the iconic Laxman Jhula." },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-8 group">
                      <div className="text-4xl font-black text-zinc-100 group-hover:text-primary/20 transition-colors">{item.step}</div>
                      <div>
                        <h3 className="font-bold text-zinc-900 text-lg mb-1">{item.title}</h3>
                        <p className="text-zinc-500 font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vendor Details */}
              <div className="pt-12 border-t border-zinc-100">
                <h2 className="text-2xl font-bold text-zinc-900 mb-8">Meet your instructor</h2>
                <div className="bg-zinc-50 rounded-[32px] p-8 flex flex-col sm:flex-row items-center gap-8">
                  <div className="w-24 h-24 rounded-full bg-zinc-200 overflow-hidden flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" alt="Vendor" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-4 text-center sm:text-left">
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900">Vikram Negi</h3>
                      <p className="text-zinc-500 font-medium italic">Professional Rafting Guide (12+ Years Exp)</p>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-600 bg-white px-3 py-1.5 rounded-full border border-zinc-100 shadow-sm">
                        <Award className="w-4 h-4 text-primary" />
                        <span>Certified Pro</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-600 bg-white px-3 py-1.5 rounded-full border border-zinc-100 shadow-sm">
                        <Star className="w-4 h-4 text-primary" />
                        <span>4.9 Rating</span>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-500 leading-relaxed max-w-lg">
                      "I've been navigating the Ganges for over a decade. My mission is to give you an adrenaline rush while keeping safety as my number one priority."
                    </p>
                    <Button variant="outline" className="rounded-full font-bold border-zinc-200">Contact Vendor</Button>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="pt-12 border-t border-zinc-100 space-y-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-3">
                    <Star className="w-6 h-6 fill-primary text-primary" />
                    4.8 • 3,450 Reviews
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {reviews.length === 0 ? (
                    <div className="col-span-2 bg-white rounded-2xl border border-zinc-100 p-10 flex flex-col items-center justify-center text-center space-y-3">
                      <Inbox className="w-8 h-8 text-zinc-300" />
                      <p className="text-sm font-bold text-zinc-400">No reviews yet</p>
                      <p className="text-xs text-zinc-400 font-medium">Be the first to share your experience</p>
                    </div>
                  ) : (
                    reviews.map((review, i) => (
                      <div key={i} className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 font-bold">
                            {review.name?.[0] ?? '?'}
                          </div>
                          <div>
                            <h4 className="font-bold text-zinc-900">{review.name}</h4>
                            <p className="text-xs text-zinc-400 font-medium">{review.date}</p>
                          </div>
                        </div>
                        <p className="text-zinc-600 font-medium leading-relaxed italic">"{review.comment}"</p>
                      </div>
                    ))
                  )}
                </div>
                <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5">Show all reviews</Button>
              </div>

            </div>

            {/* Right Column: Sticky Booking Card */}
            <div className="lg:flex-1">
              <div className="sticky top-28 space-y-6">
                <div className="bg-white border border-zinc-100 rounded-[40px] p-8 shadow-2xl shadow-zinc-200/50 space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-12 translate-x-12 blur-2xl" />

                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-3xl font-bold text-zinc-900">₹1,200</span>
                      <span className="text-zinc-500 font-bold text-sm ml-1">/ person</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-full">
                      <Zap className="w-4 h-4 fill-primary" />
                      <span>Popular</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-zinc-100 rounded-3xl overflow-hidden divide-y divide-zinc-50 bg-zinc-50/50">
                      <div className="p-5 cursor-pointer hover:bg-zinc-50 transition-colors">
                        <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest mb-1">Activity Date</p>
                        <p className="text-sm font-bold text-zinc-900">20 May, 2024</p>
                      </div>
                      <div className="p-5 cursor-pointer hover:bg-zinc-50 transition-colors flex justify-between items-center group">
                        <div>
                          <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest mb-1">Select Slot</p>
                          <p className="text-sm font-bold text-zinc-900">Morning (9:00 AM)</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="p-5 cursor-pointer hover:bg-zinc-50 transition-colors flex justify-between items-center group">
                        <div>
                          <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest mb-1">Participants</p>
                          <p className="text-sm font-bold text-zinc-900">{personCount} Adults</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    <Link href={`/checkout/activity/${params.id}`} className="block">
                      <Button className="w-full h-16 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 gap-2 group">
                        Quick Book
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>

                  {/* Price breakdown */}
                  <div className="space-y-4 pt-6 border-t border-zinc-50">
                    <div className="flex justify-between text-zinc-500 font-medium text-sm">
                      <span className="underline">₹1,200 x 2 persons</span>
                      <span>₹2,400</span>
                    </div>
                    <div className="flex justify-between text-zinc-900 font-bold pt-4 text-xl">
                      <span>Total Amount</span>
                      <span>₹2,520</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 text-center font-medium italic">Inclusive of 5% GST</p>
                  </div>
                </div>

                <div className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100 flex items-center gap-4">
                  <Navigation className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Meeting Point</p>
                    <p className="text-[10px] text-zinc-500 font-medium">Shivpuri Base Camp, Rishikesh.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Similar Activities Section */}
          <div className="pt-24 border-t border-zinc-100 space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-zinc-900">Other adventures you might like</h2>
              <Link href="/activities" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                Explore all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {similarActivities.length === 0 ? (
                <div className="col-span-full bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center justify-center text-center space-y-3">
                  <Inbox className="w-8 h-8 text-zinc-300" />
                  <p className="text-sm font-bold text-zinc-400">No similar activities found</p>
                  <p className="text-xs text-zinc-400 font-medium">Check back later for more adventures</p>
                </div>
              ) : (
                similarActivities.map((act, i) => (
                  <ItemCard
                    key={i}
                    type="activity"
                    title={act.title}
                    location={act.location}
                    price={act.price}
                    rating={act.rating}
                    image={act.image}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
