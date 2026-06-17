"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Star, 
  MapPin, 
  Edit3, 
  Trash2,
  Plus
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";

const PENDING_REVIEWS = [
  { id: "TRP-4421", title: "Beachside Shack", location: "Goa, India", date: "05 Sep - 08 Sep, 2024", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=300" },
];

const MY_REVIEWS = [
  { id: "REV-101", title: "Mountain Whisper Villa", rating: 5, comment: "Amazing stay! The view from the balcony was breathtaking and the host was very welcoming. Highly recommended for families.", date: "25 Aug, 2024", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=300" },
  { id: "REV-102", title: "Desert Safari Jaisalmer", rating: 4, comment: "Great experience overall. The sunset was beautiful. The only thing is it was a bit crowded.", date: "15 Aug, 2024", image: "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&q=80&w=300" }
];

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "published">("pending");
  const [editingReview, setEditingReview] = useState<any>(null);
  const [rating, setRating] = useState(0);

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-28 lg:pb-12">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col lg:flex-row gap-6">
            
            <DashboardSidebar />

            {/* Reviews Content */}
            <div className="flex-grow space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">Reviews & Ratings</h1>
                  <p className="text-xs text-zinc-500 font-medium italic">Manage your feedback.</p>
                </div>
              </div>

              {/* Status Tabs */}
              <div className="flex items-center p-1 bg-zinc-100 rounded-xl w-fit max-w-full overflow-x-auto no-scrollbar snap-x">
                {(["pending", "published"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize shrink-0 snap-start",
                      activeTab === tab ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                    )}
                  >
                    {tab === "pending" ? "Pending" : "My Reviews"}
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded",
                      activeTab === tab ? "bg-primary/10 text-primary" : "bg-zinc-200 text-zinc-400"
                    )}>
                      {tab === "pending" ? PENDING_REVIEWS.length : MY_REVIEWS.length}
                    </span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {activeTab === "pending" ? (
                    PENDING_REVIEWS.map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl border border-zinc-100 p-4 sm:p-5 flex flex-col md:flex-row gap-5">
                        <div className="w-full md:w-32 h-40 md:h-24 rounded-xl overflow-hidden shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-zinc-900 leading-tight">{item.title}</h3>
                            <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-zinc-400" />
                              {item.location} • {item.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-4">
                            <Button onClick={() => setEditingReview(item)} className="flex-1 sm:flex-none rounded-xl h-9 px-5 text-xs font-bold gap-1.5">
                              <Plus className="w-3.5 h-3.5" /> Write Review
                            </Button>
                            <Button variant="ghost" className="flex-1 sm:flex-none rounded-xl h-9 px-4 text-xs font-bold text-zinc-400">Dismiss</Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    MY_REVIEWS.map((review) => (
                      <div key={review.id} className="bg-white rounded-2xl border border-zinc-100 p-4 sm:p-5 flex flex-col md:flex-row gap-5 group hover:border-primary/20 transition-all">
                        <div className="w-full md:w-24 h-40 md:h-24 rounded-xl overflow-hidden shrink-0">
                          <img src={review.image} alt={review.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-0.5">
                              <h3 className="text-sm font-bold text-zinc-900 leading-tight">{review.title}</h3>
                              <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">{review.date}</p>
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                  key={s} 
                                  className={cn(
                                    "w-3 h-3", 
                                    s <= review.rating ? "text-amber-500 fill-amber-500" : "text-zinc-200"
                                  )} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-zinc-500 font-medium leading-relaxed italic">
                            "{review.comment}"
                          </p>
                          <div className="flex items-center gap-3 pt-3 mt-2 border-t border-zinc-50">
                            <button onClick={() => setEditingReview(review)} className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1.5">
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <span className="text-zinc-200 text-xs">|</span>
                            <button className="text-[10px] font-bold text-rose-500 hover:underline flex items-center gap-1.5">
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              </AnimatePresence>

            </div>

          </div>
        </div>
      </main>

      {/* Write/Edit Review Modal */}
      <AnimatePresence>
        {editingReview && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingReview(null)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl"
            >
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold text-zinc-900">How was your experience?</h2>
                <p className="text-xs text-zinc-500 font-medium italic">{editingReview.title}</p>
              </div>

              {/* Star Rating */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setRating(s)}
                    className="group transition-transform active:scale-90"
                  >
                    <Star 
                      className={cn(
                        "w-8 h-8 transition-colors", 
                        s <= (rating || editingReview.rating || 0) ? "text-amber-500 fill-amber-500" : "text-zinc-200 group-hover:text-amber-200"
                      )} 
                    />
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Your Review</label>
                <Textarea 
                  defaultValue={editingReview.comment}
                  placeholder="Tell others about your experience..." 
                  className="min-h-[120px] rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white text-xs p-4 focus:outline-none" 
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setEditingReview(null)} className="flex-1 rounded-xl h-10 font-bold text-xs">Cancel</Button>
                <Button onClick={() => setEditingReview(null)} className="flex-1 rounded-xl h-10 font-bold text-xs">Submit</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
