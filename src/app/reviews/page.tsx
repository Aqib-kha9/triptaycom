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
  Plus,
  Loader2,
  Inbox
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { bookingsApi, reviewsApi } from "@/lib/api-client";

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "published">("pending");
  const [editingReview, setEditingReview] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [myReviews, setMyReviews] = useState<any[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);

  const fetchReviewsData = async () => {
    setLoading(true);
    try {
      // 1. Fetch guest reviews
      const reviewsRes = await reviewsApi.getMyReviews();
      const reviews = reviewsRes.data?.reviews || [];
      setMyReviews(reviews);

      // 2. Fetch completed bookings
      const bookingsRes = await bookingsApi.getMyBookings({ role: "guest" });
      const completedBookings = (bookingsRes.data?.bookings || []).filter(
        (b: any) => b.status === "Completed"
      );

      // 3. Filter bookings that don't have reviews yet
      const pending = completedBookings.filter(
        (b: any) => !reviews.some((r: any) => r.bookingId === b.id)
      );
      setPendingReviews(pending);
    } catch (err) {
      console.error("Failed to load reviews data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsData();
  }, []);

  const handleOpenWriteReview = (booking: any) => {
    setEditingReview(booking);
    setRating(5);
    setCommentInput("");
  };

  const handleOpenEditReview = (review: any) => {
    setEditingReview(review);
    setRating(review.rating);
    setCommentInput(review.comment || "");
  };

  const handleSubmitReview = async () => {
    if (!editingReview) return;
    setSubmitting(true);
    try {
      const isNew = !editingReview.rating; // If no rating field exists in the modal object, it's a booking object
      if (isNew) {
        await reviewsApi.createReview({
          bookingId: editingReview.id,
          rating,
          comment: commentInput
        });
      } else {
        await reviewsApi.updateReview(editingReview.id, {
          rating,
          comment: commentInput
        });
      }
      setEditingReview(null);
      await fetchReviewsData();
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await reviewsApi.deleteReview(reviewId);
      await fetchReviewsData();
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  const getBookingDates = (b: any) => {
    if (b.itemType === "activity" && b.activityDate) {
      return new Date(b.activityDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    }
    if (b.checkIn && b.checkOut) {
      const start = new Date(b.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      const end = new Date(b.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      return `${start} - ${end}`;
    }
    return b.checkIn ? new Date(b.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
  };

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
                      {tab === "pending" ? pendingReviews.length : myReviews.length}
                    </span>
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex items-center justify-center p-20 flex-col gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Loading reviews...</p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {activeTab === "pending" ? (
                      pendingReviews.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center justify-center text-center space-y-4">
                          <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300">
                            <Inbox className="w-8 h-8" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-zinc-900">No pending reviews</h3>
                            <p className="text-xs text-zinc-500 font-medium max-w-xs">You have reviewed all your completed bookings!</p>
                          </div>
                        </div>
                      ) : (
                        pendingReviews.map((item) => (
                          <div key={item.id} className="bg-white rounded-2xl border border-zinc-100 p-4 sm:p-5 flex flex-col md:flex-row gap-5">
                            <div className="w-full md:w-32 h-40 md:h-24 rounded-xl overflow-hidden shrink-0 bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                              {item.itemImage ? (
                                <img src={item.itemImage} alt={item.itemName} className="w-full h-full object-cover" />
                              ) : (
                                <Star className="w-8 h-8 text-zinc-200" />
                              )}
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1">
                              <div className="space-y-1">
                                <h3 className="text-sm font-bold text-zinc-900 leading-tight">{item.itemName}</h3>
                                <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-zinc-400" />
                                  {item.location} • {getBookingDates(item)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 mt-4">
                                <Button onClick={() => handleOpenWriteReview(item)} className="flex-1 sm:flex-none rounded-xl h-9 px-5 text-xs font-bold gap-1.5 bg-zinc-950 text-white hover:bg-zinc-900">
                                  <Plus className="w-3.5 h-3.5" /> Write Review
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )
                    ) : (
                      myReviews.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center justify-center text-center space-y-4">
                          <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300">
                            <Inbox className="w-8 h-8" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-zinc-900">No reviews published</h3>
                            <p className="text-xs text-zinc-500 font-medium max-w-xs">Your reviews will appear here once you write them.</p>
                          </div>
                        </div>
                      ) : (
                        myReviews.map((review) => (
                          <div key={review.id} className="bg-white rounded-2xl border border-zinc-100 p-4 sm:p-5 flex flex-col md:flex-row gap-5 group hover:border-primary/20 transition-all">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-0.5">
                                  <h3 className="text-sm font-bold text-zinc-900 leading-tight">{review.title || "Review"}</h3>
                                  <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                                    {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                  </p>
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
                                <button onClick={() => handleOpenEditReview(review)} className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1.5">
                                  <Edit3 className="w-3.5 h-3.5" /> Edit
                                </button>
                                <span className="text-zinc-200 text-xs">|</span>
                                <button onClick={() => handleDeleteReview(review.id)} className="text-[10px] font-bold text-rose-500 hover:underline flex items-center gap-1.5">
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

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
                <p className="text-xs text-zinc-500 font-medium italic">{editingReview.itemName || editingReview.title}</p>
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
                        s <= rating ? "text-amber-500 fill-amber-500" : "text-zinc-200 group-hover:text-amber-200"
                      )} 
                    />
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Your Review</label>
                <Textarea 
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Tell others about your experience..." 
                  className="min-h-[120px] rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white text-xs p-4 focus:outline-none text-zinc-800 font-medium" 
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setEditingReview(null)} className="flex-1 rounded-xl h-10 font-bold text-xs">Cancel</Button>
                <Button onClick={handleSubmitReview} disabled={submitting} className="flex-1 rounded-xl h-10 font-bold text-xs bg-zinc-950 text-white hover:bg-zinc-900">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
