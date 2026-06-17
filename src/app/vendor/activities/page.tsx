"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Clock,
  Users,
  MapPin,
  Trash2,
  Eye,
  Pencil,
  Loader2,
  AlertCircle,
  Compass,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { VendorSidebar } from "@/components/navigation/vendor-sidebar";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ActivityItem {
  _id: string;
  name: string;
  activityType: string;
  difficulty: string;
  city: string;
  state: string;
  durationHours: number;
  durationDays: number;
  basePrice: number;
  maxGroupSize: number;
  minAge: number;
  status: "draft" | "published" | "unpublished";
  media: { url: string; isCover: boolean }[];
  avgRating: number;
  totalReviews: number;
  createdAt: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  Rafting: "Rafting",
  Trekking: "Trekking",
  Paragliding: "Paragliding",
  Camping: "Camping",
  "Bungee Jumping": "Bungee Jumping",
  Skiing: "Skiing",
  "Scuba Diving": "Scuba Diving",
  Safari: "Safari",
  Cycling: "Cycling",
  Kayaking: "Kayaking",
  "Rock Climbing": "Rock Climbing",
  "Zip Lining": "Zip Lining",
  "Hot Air Balloon": "Hot Air Balloon",
  "Wildlife Safari": "Wildlife Safari",
  "Cultural Tour": "Cultural Tour",
  "Photography Tour": "Photography Tour",
  Fishing: "Fishing",
  Surfing: "Surfing",
  Caving: "Caving",
  Other: "Other",
};

const ACTIVITY_TYPE_ICONS: Record<string, string> = {
  Rafting: "🛶",
  Trekking: "🥾",
  Paragliding: "🪂",
  Camping: "⛺",
  "Bungee Jumping": "🪢",
  Skiing: "⛷️",
  "Scuba Diving": "🤿",
  Safari: "🦁",
  Cycling: "🚴",
  Kayaking: "🛶",
  "Rock Climbing": "🧗",
  "Zip Lining": "🪶",
  "Hot Air Balloon": "🎈",
  "Wildlife Safari": "🐘",
  "Cultural Tour": "🏛️",
  "Photography Tour": "📸",
  Fishing: "🎣",
  Surfing: "🏄",
  Caving: "🕳️",
  Other: "🎯",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Moderate: "bg-amber-100 text-amber-800 border-amber-200",
  Challenging: "bg-orange-100 text-orange-800 border-orange-200",
  Extreme: "bg-red-100 text-red-800 border-red-200",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function VendorActivitiesPage() {
  const router = useRouter();
  const [listings, setListings] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ActivityItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Fetch ───────────────────────────────────────────────────────────────

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/activities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.status === "success") {
        setListings(json.data.activities);
      } else {
        setError(json.message || "Failed to load activities.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // ─── Delete ──────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/activities/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.status !== "success") throw new Error(json.message || "Delete failed");
      setListings((prev) => prev.filter((l) => l._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete activity");
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────

  const getCoverImage = (listing: ActivityItem) => {
    const cover = listing.media?.find((m) => m.isCover);
    if (cover) return cover.url;
    if (listing.media?.[0]) return listing.media[0].url;
    return null;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-bold uppercase tracking-wider rounded-lg border">
            Published
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-zinc-100 text-zinc-600 border-zinc-200 text-[10px] font-bold uppercase tracking-wider rounded-lg border">
            Draft
          </Badge>
        );
      case "unpublished":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] font-bold uppercase tracking-wider rounded-lg border">
            Unpublished
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDuration = (hours: number, days: number) => {
    if (days > 0) {
      return `${days}d ${hours > 0 ? `${hours}h` : ""}`;
    }
    return `${hours}h`;
  };

  const filtered = listings.filter(
    (l) =>
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.city?.toLowerCase().includes(search.toLowerCase()) ||
      l.activityType?.toLowerCase().includes(search.toLowerCase())
  );

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-28 lg:pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <VendorSidebar />

            <div className="flex-grow space-y-6">
              {/* Title + Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-zinc-900">My Activities</h1>
                  <p className="text-sm text-zinc-500 mt-1">
                    Manage your adventure experiences
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <Input
                      placeholder="Search activities..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 h-10 rounded-xl text-xs bg-white border-zinc-200 w-full sm:w-52"
                    />
                  </div>
                  <Link href="/vendor/activities/new">
                    <Button className="rounded-xl px-5 h-10 text-xs font-bold gap-2">
                      <Plus className="w-4 h-4" />
                      Add New
                    </Button>
                  </Link>
                </div>
              </div>

              {/* ─── Loading ────────────────────────────────────────────────── */}
              {loading && (
                <div className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm text-zinc-500 font-medium">Loading activities…</p>
                </div>
              )}

              {/* ─── Error ──────────────────────────────────────────────────── */}
              {!loading && error && (
                <div className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                  <div>
                    <p className="text-sm font-bold text-zinc-800">Failed to Load</p>
                    <p className="text-xs text-zinc-500 mt-1">{error}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl h-10 text-xs font-bold"
                    onClick={fetchListings}
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* ─── Empty ──────────────────────────────────────────────────── */}
              {!loading && !error && filtered.length === 0 && (
                <div className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Compass className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-800">
                      {search ? "No matching activities" : "No activities yet"}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {search
                        ? "Try a different search term"
                        : "Create your first activity to start earning"}
                    </p>
                  </div>
                  {!search && (
                    <Link href="/vendor/activities/new">
                      <Button className="rounded-xl h-10 text-xs font-bold gap-2">
                        <Plus className="w-4 h-4" />
                        Create Activity
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              {/* ─── Activity Cards ─────────────────────────────────────────── */}
              {!loading && !error && filtered.length > 0 && (
                <div className="space-y-4">
                  {filtered.map((listing) => {
                    const cover = getCoverImage(listing);
                    return (
                      <motion.div
                        key={listing._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-zinc-100 overflow-hidden hover:border-zinc-200 hover:shadow-sm transition-all"
                      >
                        <div className="flex flex-col sm:flex-row">
                          {/* Thumbnail */}
                          <div className="sm:w-52 sm:min-w-[208px] h-40 sm:h-auto relative bg-zinc-100 overflow-hidden">
                            {cover ? (
                              <img
                                src={cover}
                                alt={listing.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Compass className="w-8 h-8 text-zinc-300" />
                              </div>
                            )}
                            {/* Difficulty badge on image */}
                            <span
                              className={`absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${DIFFICULTY_COLORS[listing.difficulty] || "bg-zinc-100 text-zinc-700 border-zinc-200"}`}
                            >
                              {listing.difficulty}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                            <div>
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm">
                                      {ACTIVITY_TYPE_ICONS[listing.activityType] || "🎯"}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                                      {ACTIVITY_TYPE_LABELS[listing.activityType] || listing.activityType}
                                    </span>
                                  </div>
                                  <h3 className="text-sm font-bold text-zinc-900 truncate">
                                    {listing.name}
                                  </h3>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {listing.avgRating > 0 && (
                                    <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5">
                                      ★ {listing.avgRating.toFixed(1)}
                                    </span>
                                  )}
                                  {getStatusBadge(listing.status)}
                                </div>
                              </div>

                              {/* Meta row */}
                              <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-zinc-500 font-medium">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {listing.city}, {listing.state}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDuration(listing.durationHours, listing.durationDays)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  Max {listing.maxGroupSize}
                                </span>
                                {listing.minAge > 0 && (
                                  <span className="text-zinc-400">
                                    Age {listing.minAge}+
                                  </span>
                                )}
                              </div>

                              {/* Price */}
                              <div className="mt-2">
                                <span className="text-sm font-black text-primary">
                                  {formatPrice(listing.basePrice)}
                                </span>
                                <span className="text-[10px] text-zinc-400 font-medium ml-1">
                                  / person
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-zinc-50">
                              <Link href={`/vendor/activities/${listing._id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-[11px] font-bold rounded-lg gap-1.5 text-zinc-500 hover:text-zinc-800"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  View
                                </Button>
                              </Link>
                              <Link href={`/vendor/activities/edit/${listing._id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-[11px] font-bold rounded-lg gap-1.5 text-zinc-500 hover:text-primary"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-[11px] font-bold rounded-lg gap-1.5 text-zinc-400 hover:text-red-600 ml-auto"
                                onClick={() => setDeleteTarget(listing)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ─── Delete Confirmation Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => !isDeleting && setDeleteTarget(null)}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white rounded-2xl p-8 space-y-6"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-base font-black text-zinc-900">Delete Activity?</h3>
                <p className="text-xs text-zinc-500 mt-2">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-zinc-700">
                    "{deleteTarget.name}"
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-10 rounded-xl text-xs font-bold"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-10 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDelete}
                  disabled={isDeleting}
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
    </div>
  );
}
