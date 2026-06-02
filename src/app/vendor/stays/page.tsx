"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  Inbox,
  Loader2,
  Eye,
  Home,
  MapPin,
  Star,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { VendorSidebar } from "@/components/navigation/vendor-sidebar";

interface ListingItem {
  _id: string;
  name: string;
  slug: string;
  summary: string;
  propertyType: string;
  city: string;
  state: string;
  basePrice: number;
  status: "draft" | "published" | "unlisted" | "rejected";
  media: { url: string; isCover: boolean; type: string }[];
  bedrooms: number;
  maxGuests: number;
  createdAt: string;
}

export default function VendorStaysPage() {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchListings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/listings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.status === "success") {
        setListings(json.data.listings);
      } else {
        setError(json.message || "Failed to load listings.");
      }
    } catch {
      setError("Could not connect to server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/listings/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.status === "success") {
        setListings((prev) => prev.filter((l) => l._id !== deleteId));
      }
    } catch {
      // silently fail, keep modal open
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const getCoverImage = (listing: ListingItem) => {
    const cover = listing.media?.find((m) => m.isCover);
    return cover?.url || listing.media?.[0]?.url || "";
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      published: "bg-emerald-50 text-emerald-600",
      draft: "bg-amber-50 text-amber-600",
      unlisted: "bg-zinc-100 text-zinc-500",
      rejected: "bg-rose-50 text-rose-600",
    };
    return cn(
      "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
      map[status] || "bg-zinc-50 text-zinc-400"
    );
  };

  const filtered = listings.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase()) ||
      l.propertyType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <VendorSidebar />

            <div className="flex-grow space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">My Homestays</h1>
                  <p className="text-xs text-zinc-500 font-medium italic">
                    {listings.length > 0
                      ? `${listings.length} listing${listings.length !== 1 ? "s" : ""} — manage your property portfolio.`
                      : "Manage your property portfolio."}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <Input
                      placeholder="Search stays..."
                      className="h-10 pl-9 rounded-xl border-zinc-100 bg-white w-48 text-xs"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Link href="/vendor/listings/new">
                    <Button className="rounded-xl px-5 h-10 text-xs font-bold gap-2">
                      <Plus className="w-3.5 h-3.5" />
                      Add Stay
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <Loader2 className="w-8 h-8 text-zinc-300 animate-spin" />
                  <p className="text-xs text-zinc-500 font-medium">Loading your listings...</p>
                </div>
              )}

              {/* Error State */}
              {!isLoading && error && (
                <div className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-400">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-zinc-900">Failed to load</h3>
                    <p className="text-xs text-zinc-500 font-medium max-w-xs">{error}</p>
                  </div>
                  <Button
                    onClick={fetchListings}
                    variant="outline"
                    className="rounded-xl h-10 text-xs font-bold"
                  >
                    Retry
                  </Button>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && filtered.length === 0 && (
                <div className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300">
                    <Inbox className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-zinc-900">
                      {search ? "No matching stays" : "No stays yet"}
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium max-w-xs">
                      {search
                        ? "Try a different search term."
                        : "Create your first homestay listing to start welcoming guests."}
                    </p>
                  </div>
                  {!search && (
                    <Link href="/vendor/listings/new">
                      <Button className="rounded-xl h-10 text-xs font-bold gap-2">
                        <Plus className="w-3.5 h-3.5" />
                        Add Stay
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              {/* Listings Grid */}
              {!isLoading && !error && filtered.length > 0 && (
                <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden divide-y divide-zinc-50">
                  {filtered.map((listing) => (
                    <div
                      key={listing._id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-zinc-50/50 transition-colors group"
                    >
                      <div className="flex items-center gap-5 w-full sm:w-auto">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500 bg-zinc-100">
                          {getCoverImage(listing) ? (
                            <img
                              src={getCoverImage(listing)}
                              alt={listing.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                              <Home className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={getStatusBadge(listing.status)}>
                              {listing.status}
                            </span>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                              {listing.propertyType}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-zinc-900 leading-tight truncate max-w-[280px]">
                            {listing.name}
                          </h3>
                          <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-medium">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {listing.city}, {listing.state}
                            </span>
                            <span className="flex items-center gap-1">
                              <Home className="w-3 h-3" />
                              {listing.bedrooms} BR
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {listing.maxGuests} Guests
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-10">
                        <div className="flex gap-6">
                          <div className="text-center">
                            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">
                              Price
                            </p>
                            <p className="font-bold text-zinc-900 text-xs">
                              ₹{listing.basePrice?.toLocaleString("en-IN")}
                              <span className="text-[10px] font-medium text-zinc-400 ml-0.5">/night</span>
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">
                              Slug
                            </p>
                            <p className="font-bold text-zinc-900 text-xs truncate max-w-[100px]">
                              {listing.slug}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Link href={`/vendor/listings/${listing._id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/5"
                              title="View"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                          <Link href={`/vendor/listings/edit/${listing._id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/5"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(listing._id)}
                            className="h-8 w-8 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white rounded-2xl p-8 space-y-6"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-zinc-900">Delete Stay?</h3>
                <p className="text-xs text-zinc-500 font-medium">
                  This action cannot be undone. All media and data will be permanently removed.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteId(null)}
                  disabled={isDeleting}
                  className="flex-1 h-11 rounded-xl text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 h-11 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
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
