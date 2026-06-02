"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { ItemCard } from "@/components/cards";
import {
  Star,
  MapPin,
  Share2,
  Heart,
  Users,
  ChevronRight,
  Clock,
  ArrowRight,
  Inbox,
  ShieldCheck,
  ArrowLeft,
  Award,
  Gem,
  Flame,
  Gauge,
  Calendar,
  Camera,
  Loader2,
  AlertCircle,
  Check,
  X,
  Zap,
  Mountain,
  Waves,
  Crosshair,
  Telescope,
  Umbrella,
  Compass,
  Sunrise,
  Navigation,
  Info,
  Ruler,
  Sparkles,
  Building2,
} from "lucide-react";
import { useState, useEffect, use } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ── TypeScript Interfaces ──

interface ActivityDetail {
  _id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  activityType: string;
  difficulty: string;
  city: string;
  state: string;
  country: string;
  address: string;
  zipCode?: string;
  basePrice: number;
  weekendPrice?: number;
  childPrice?: number;
  foreignerPrice?: number;
  effectiveWeekendPrice: number;
  avgRating: number;
  totalReviews: number;
  durationHours: number;
  durationDays: number;
  startTimes: string[];
  availability: string;
  availabilityNotes?: string;
  minAge: number;
  maxGroupSize: number;
  minGroupSize: number;
  equipmentProvided: string[];
  equipmentRequired: string[];
  safetyGuidelines?: string;
  hasInsurance: boolean;
  certifiedGuides: boolean;
  guideRatio?: string;
  included: string[];
  excluded: string[];
  houseRules: { rule: string; icon?: string }[];
  cancellationPolicy: string;
  cancellationDetails?: string;
  isPetFriendly: boolean;
  petRules?: string;
  restrictions?: string;
  media: { url: string; publicId: string; type: string; caption?: string; isCover: boolean }[];
  coordinates: { lat: number; lng: number };
  meetingPoint?: string;
  landmark?: string;
  host: { _id: string; name: string; avatar?: string; email?: string; phone?: string } | null;
  instantBook: boolean;
  advanceNoticeHours: number;
  maxGuestsPerBooking?: number;
  taxes: number;
  securityDeposit: number;
  languagesSpoken: string[];
  seasonalPrices: { seasonName: string; startDate: string; endDate: string; pricePerPerson: number }[];
  nearbyPlaces: { name: string; distanceKm: number; category: string; description?: string }[];
  isFeatured: boolean;
}

// ── Activity type → icon map ──

function getActivityIcon(activityType: string): React.ReactNode {
  const map: Record<string, React.ReactNode> = {
    Rafting: <Waves className="w-5 h-5" />,
    Trekking: <Mountain className="w-5 h-5" />,
    Paragliding: <Compass className="w-5 h-5" />,
    Camping: <Telescope className="w-5 h-5" />,
    "Bungee Jumping": <Zap className="w-5 h-5" />,
    Skiing: <Mountain className="w-5 h-5" />,
    "Scuba Diving": <Waves className="w-5 h-5" />,
    Safari: <Telescope className="w-5 h-5" />,
    Cycling: <Crosshair className="w-5 h-5" />,
    Kayaking: <Waves className="w-5 h-5" />,
    "Rock Climbing": <Mountain className="w-5 h-5" />,
    "Zip Lining": <Zap className="w-5 h-5" />,
    "Hot Air Balloon": <Sunrise className="w-5 h-5" />,
    "Wildlife Safari": <Telescope className="w-5 h-5" />,
    "Cultural Tour": <Building2 className="w-5 h-5" />,
    "Photography Tour": <Camera className="w-5 h-5" />,
    Fishing: <Waves className="w-5 h-5" />,
    Surfing: <Waves className="w-5 h-5" />,
    Caving: <Mountain className="w-5 h-5" />,
  };
  return map[activityType] || <Sparkles className="w-5 h-5" />;
}

// ── Difficulty color ──

function getDifficultyColor(difficulty: string): string {
  const map: Record<string, string> = {
    Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Moderate: "bg-amber-50 text-amber-700 border-amber-200",
    Challenging: "bg-orange-50 text-orange-700 border-orange-200",
    Extreme: "bg-red-50 text-red-700 border-red-200",
  };
  return map[difficulty] || "bg-zinc-50 text-zinc-700 border-zinc-200";
}

// ── Main Component ──

export default function ActivityDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);

  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [personCount, setPersonCount] = useState(2);
  const [similarActivities, setSimilarActivities] = useState<any[]>([]);
  const [showFullGallery, setShowFullGallery] = useState(false);

  // ── Fetch activity detail ──
  useEffect(() => {
    let cancelled = false;

    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/public/activity/${params.id}`);
        const json = await res.json().catch(() => null);

        if (!cancelled) {
          if (json?.status === "success" && json.data?.activity) {
            setActivity(json.data.activity);
            const a = json.data.activity;
            fetchSimilar(a.city, a._id);
          } else {
            setError(json?.message || "Activity not found.");
          }
        }
      } catch {
        if (!cancelled) setError("Unable to load activity details. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function fetchSimilar(city: string, excludeId: string) {
      try {
        const res = await fetch(
          `${API_BASE}/activities/browse?city=${encodeURIComponent(city)}&limit=4&sort=-avgRating`
        );
        const json = await res.json().catch(() => null);
        if (!cancelled && json?.status === "success" && Array.isArray(json.data?.activities)) {
          setSimilarActivities(
            json.data.activities.filter((a: any) => a._id !== excludeId).slice(0, 4)
          );
        }
      } catch {
        /* ignore */
      }
    }

    fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  // ── Derived values ──
  const images = activity?.media?.map((m) => m.url) ?? [];
  const fmt = (n: number) => n?.toLocaleString("en-IN") ?? "0";
  const durationText =
    activity && activity.durationDays > 0
      ? `${activity.durationDays} day${activity.durationDays > 1 ? "s" : ""} ${activity.durationHours > 0 ? `${activity.durationHours}h` : ""}`
      : activity
        ? `${activity.durationHours} hour${activity.durationHours !== 1 ? "s" : ""}`
        : "";

  // ── Loading State ──
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
            <p className="text-gray-600 font-semibold text-lg">Loading activity details...</p>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Error State ──
  if (error || !activity) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-5 max-w-md"
          >
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-gray-800 font-semibold text-xl">{error || "Activity not found"}</p>
            <p className="text-gray-500 text-sm">
              The activity you're looking for may have been removed or is no longer available.
            </p>
            <Link href="/activities">
              <Button variant="outline" className="rounded-xl mt-2 gap-2 h-12 px-6 font-semibold">
                <ArrowLeft className="w-4 h-4" /> Browse all activities
              </Button>
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* ================================================================ */}
        {/* IMAGE GALLERY — Airbnb‑style grid                                */}
        {/* ================================================================ */}
        <section className="pt-20 pb-0">
          {images.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 h-[320px] md:h-[480px]">
              {/* Main large image */}
              <div className="col-span-2 row-span-2 relative overflow-hidden cursor-pointer">
                <img
                  src={images[0]}
                  alt={activity.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Side images */}
              {images.slice(1, 5).map((img, i) => (
                <div key={i} className="relative overflow-hidden cursor-pointer">
                  <img
                    src={img}
                    alt={`${activity.name} - ${i + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
              {/* Show all photos button */}
              <button
                onClick={() => setShowFullGallery(true)}
                className="absolute bottom-6 right-6 bg-white rounded-lg px-4 py-2 text-sm font-semibold border border-gray-200 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Show all {images.length} photos
              </button>
            </div>
          ) : (
            <div className="h-[320px] md:h-[480px] bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-300">
                <Inbox className="w-16 h-16 mx-auto mb-2" />
                <p className="font-medium">No photos available</p>
              </div>
            </div>
          )}
        </section>

        {/* ================================================================ */}
        {/* HEADER: Title, rating, location, badges                         */}
        {/* ================================================================ */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="flex-1 space-y-3">
              {/* Activity type badge + difficulty */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  {getActivityIcon(activity.activityType)}
                  {activity.activityType}
                </span>
                <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border", getDifficultyColor(activity.difficulty))}>
                  <Gauge className="w-3 h-3" />
                  {activity.difficulty}
                </span>
                {activity.instantBook && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                    <Zap className="w-3 h-3 fill-emerald-500" />
                    Instant Book
                  </span>
                )}
                {activity.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
                    <Award className="w-3 h-3" />
                    Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-[26px] font-semibold text-gray-900 leading-tight">
                {activity.name}
              </h1>

              {/* Sub‑row: rating + location + quick stats */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-current text-gray-900" />
                  <span className="font-semibold">{activity.avgRating?.toFixed(1) || "New"}</span>
                  {activity.totalReviews > 0 && (
                    <>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500 underline cursor-pointer hover:text-gray-700">
                        {activity.totalReviews} review{activity.totalReviews !== 1 ? "s" : ""}
                      </span>
                    </>
                  )}
                </div>

                {/* Location */}
                <span className="flex items-center gap-1.5 text-gray-500 underline cursor-pointer hover:text-gray-700">
                  <MapPin className="w-4 h-4" />
                  {activity.city}, {activity.state}
                </span>
              </div>

              {/* Quick stats pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                  <Clock className="w-4 h-4 text-gray-400" /> {durationText}
                </span>
                <span className="text-gray-300">·</span>
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                  <Users className="w-4 h-4 text-gray-400" /> Up to {activity.maxGroupSize} people
                </span>
                {activity.minAge > 0 && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                      <Ruler className="w-4 h-4 text-gray-400" /> Age {activity.minAge}+
                    </span>
                  </>
                )}
                {activity.languagesSpoken && activity.languagesSpoken.length > 0 && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                      <Sparkles className="w-4 h-4 text-gray-400" /> {activity.languagesSpoken.join(", ")}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="rounded-xl gap-2 font-semibold text-sm"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={() => toggleWishlist(activity?._id || params.id, "activity")}
                className={cn(
                  "rounded-xl gap-2 font-semibold text-sm transition-colors",
                  isWishlisted(activity?._id || params.id, "activity") && "text-rose-500 border-rose-200 bg-rose-50 hover:bg-rose-100"
                )}
              >
                <Heart className={cn("w-4 h-4", isWishlisted(activity?._id || params.id, "activity") && "fill-rose-500")} />
                Save
              </Button>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <hr className="border-gray-100" />
        </div>

        {/* ================================================================ */}
        {/* TWO-COLUMN LAYOUT                                                */}
        {/* ================================================================ */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* ── LEFT COLUMN (content) ── */}
            <div className="lg:flex-[1.6] space-y-10">
              {/* ── Host + Duration card ── */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {activity.host && (
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                      {activity.host.avatar ? (
                        <img
                          src={activity.host.avatar}
                          alt={activity.host.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                          {activity.host.name?.charAt(0)?.toUpperCase() || "H"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Guided by {activity.host.name}</p>
                      {activity.languagesSpoken?.length > 0 && (
                        <p className="text-sm text-gray-500">Speaks {activity.languagesSpoken.join(", ")}</p>
                      )}
                    </div>
                  </div>
                )}
                {activity.certifiedGuides && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold border border-primary/10 sm:ml-auto">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Certified Guides
                  </span>
                )}
              </div>

              {/* Divider */}
              <hr className="border-gray-100" />

              {/* ── Summary / Description ── */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About this experience</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {activity.summary || activity.description?.slice(0, 250)}
                </p>
              </div>

              {/* ── Full Description ── */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">What you'll do</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {activity.description || "No detailed description available."}
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-100" />

              {/* ── Quick Info Grid ── */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center space-y-1">
                  <Clock className="w-5 h-5 text-gray-500 mx-auto" />
                  <p className="text-xs text-gray-500 font-medium">Duration</p>
                  <p className="text-sm font-bold text-gray-900">{durationText}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center space-y-1">
                  <Users className="w-5 h-5 text-gray-500 mx-auto" />
                  <p className="text-xs text-gray-500 font-medium">Group Size</p>
                  <p className="text-sm font-bold text-gray-900">{activity.minGroupSize}–{activity.maxGroupSize}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center space-y-1">
                  <Ruler className="w-5 h-5 text-gray-500 mx-auto" />
                  <p className="text-xs text-gray-500 font-medium">Min Age</p>
                  <p className="text-sm font-bold text-gray-900">{activity.minAge > 0 ? `${activity.minAge}+ yrs` : "All ages"}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center space-y-1">
                  <Calendar className="w-5 h-5 text-gray-500 mx-auto" />
                  <p className="text-xs text-gray-500 font-medium">Availability</p>
                  <p className="text-sm font-bold text-gray-900">{activity.availability}</p>
                </div>
              </div>

              {/* ── Start Times ── */}
              {activity.startTimes && activity.startTimes.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Start Times</h2>
                  <div className="flex flex-wrap gap-2">
                    {activity.startTimes.map((time, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 bg-gray-50 hover:border-gray-300 transition-colors"
                      >
                        <Sunrise className="w-3.5 h-3.5 text-gray-400" />
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <hr className="border-gray-100" />

              {/* ── Inclusions & Exclusions ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {activity.included && activity.included.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Check className="w-5 h-5 text-emerald-500" /> What's Included
                    </h2>
                    <ul className="space-y-3">
                      {activity.included.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                          <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {activity.excluded && activity.excluded.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <X className="w-5 h-5 text-red-400" /> What's Not Included
                    </h2>
                    <ul className="space-y-3">
                      {activity.excluded.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-400 text-sm line-through decoration-gray-300">
                          <X className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* ── Safety & Equipment ── */}
              {(activity.equipmentProvided.length > 0 || activity.equipmentRequired.length > 0 || activity.safetyGuidelines || activity.hasInsurance || activity.certifiedGuides) && (
                <>
                  <hr className="border-gray-100" />
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-gray-700" /> Safety & Equipment
                    </h2>

                    {/* Safety badges */}
                    <div className="flex flex-wrap gap-3">
                      {activity.hasInsurance && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-200">
                          <ShieldCheck className="w-4 h-4" />
                          Insurance Included
                        </span>
                      )}
                      {activity.certifiedGuides && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-semibold border border-primary/10">
                          <Award className="w-4 h-4" />
                          Certified Guides
                        </span>
                      )}
                      {activity.guideRatio && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold border border-amber-200">
                          <Users className="w-4 h-4" />
                          Guide Ratio {activity.guideRatio}
                        </span>
                      )}
                    </div>

                    {/* Safety guidelines */}
                    {activity.safetyGuidelines && (
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                        <p className="text-sm font-semibold text-amber-800 mb-1 flex items-center gap-2">
                          <Info className="w-4 h-4" /> Safety Guidelines
                        </p>
                        <p className="text-sm text-amber-700 leading-relaxed">{activity.safetyGuidelines}</p>
                      </div>
                    )}

                    {/* Equipment provided */}
                    {activity.equipmentProvided.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Equipment We Provide</h3>
                        <div className="flex flex-wrap gap-2">
                          {activity.equipmentProvided.map((item, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                              <Check className="w-3 h-3" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Equipment required */}
                    {activity.equipmentRequired.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">What to Bring</h3>
                        <div className="flex flex-wrap gap-2">
                          {activity.equipmentRequired.map((item, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-100">
                              <Umbrella className="w-3 h-3" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ── Restrictions ── */}
              {activity.restrictions && (
                <>
                  <hr className="border-gray-100" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Restrictions</h2>
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                      <p className="text-sm text-red-800 leading-relaxed">{activity.restrictions}</p>
                    </div>
                  </div>
                </>
              )}

              {/* ── Meeting Point ── */}
              {activity.meetingPoint && (
                <>
                  <hr className="border-gray-100" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Meeting Point</h2>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-4">
                      <Navigation className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{activity.meetingPoint}</p>
                        {activity.address && (
                          <p className="text-xs text-gray-500 mt-1">{activity.address}, {activity.city}, {activity.state}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── Cancellation Policy ── */}
              <hr className="border-gray-100" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Cancellation Policy</h2>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="font-semibold text-gray-900">{activity.cancellationPolicy}</p>
                  {activity.cancellationDetails && (
                    <p className="text-sm text-gray-500 mt-2">{activity.cancellationDetails}</p>
                  )}
                </div>
              </div>

              {/* ── Nearby Places ── */}
              {activity.nearbyPlaces && activity.nearbyPlaces.length > 0 && (
                <>
                  <hr className="border-gray-100" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Nearby Places</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activity.nearbyPlaces.map((place, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{place.name}</p>
                              <p className="text-xs text-gray-500">{place.distanceKm} km away</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                            {place.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── Seasonal Prices ── */}
              {activity.seasonalPrices && activity.seasonalPrices.length > 0 && (
                <>
                  <hr className="border-gray-100" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Seasonal Rates</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activity.seasonalPrices.map((sp, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl border border-gray-200 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{sp.seasonName}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(sp.startDate).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}{" "}
                              –{" "}
                              {new Date(sp.endDate).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}
                            </p>
                          </div>
                          <span className="font-semibold text-gray-900">
                            ₹{sp.pricePerPerson.toLocaleString("en-IN")}/person
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── House Rules ── */}
              {activity.houseRules && activity.houseRules.length > 0 && (
                <>
                  <hr className="border-gray-100" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Rules & Guidelines</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activity.houseRules.map((rule, i) => (
                        <div key={i} className="flex items-center gap-3 py-1">
                          <Check className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{rule.rule}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {activity.isPetFriendly ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700">
                          🐾 Pet Friendly
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-400">
                          <X className="w-3.5 h-3.5" /> No Pets
                        </span>
                      )}
                    </div>
                    {activity.isPetFriendly && activity.petRules && (
                      <p className="mt-3 text-sm text-gray-500">
                        <span className="font-semibold">Pet rules:</span> {activity.petRules}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* ── Location / Map ── */}
              {activity.coordinates && (
                <>
                  <hr className="border-gray-100" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Where you'll be</h2>
                    <div className="h-[350px] w-full rounded-2xl bg-gray-100 overflow-hidden border border-gray-200">
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <div className="text-center">
                          <div className="bg-primary/10 p-4 rounded-full inline-block mb-3">
                            <MapPin className="w-6 h-6 text-primary" />
                          </div>
                          <p className="font-semibold text-gray-700">{activity.city}, {activity.state}</p>
                          <p className="text-sm text-gray-500 mt-1 max-w-[250px] mx-auto">
                            {activity.address}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {activity.landmark ? `Near ${activity.landmark}` : "Exact location provided after booking"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── Property / Activity Details ── */}
              <hr className="border-gray-100" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Details</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div><p className="text-xs text-gray-500">Type</p><p className="font-semibold text-gray-900">{activity.activityType}</p></div>
                  <div><p className="text-xs text-gray-500">Difficulty</p><p className="font-semibold text-gray-900">{activity.difficulty}</p></div>
                  <div><p className="text-xs text-gray-500">Duration</p><p className="font-semibold text-gray-900">{durationText}</p></div>
                  <div><p className="text-xs text-gray-500">Max Group Size</p><p className="font-semibold text-gray-900">{activity.maxGroupSize}</p></div>
                  <div><p className="text-xs text-gray-500">Min Group Size</p><p className="font-semibold text-gray-900">{activity.minGroupSize}</p></div>
                  <div><p className="text-xs text-gray-500">Min Age</p><p className="font-semibold text-gray-900">{activity.minAge > 0 ? `${activity.minAge} yrs` : "All ages"}</p></div>
                  <div><p className="text-xs text-gray-500">Availability</p><p className="font-semibold text-gray-900">{activity.availability}</p></div>
                  {activity.advanceNoticeHours > 0 && (
                    <div><p className="text-xs text-gray-500">Advance Notice</p><p className="font-semibold text-gray-900">{activity.advanceNoticeHours}h</p></div>
                  )}
                  {activity.maxGuestsPerBooking && (
                    <div><p className="text-xs text-gray-500">Max Per Booking</p><p className="font-semibold text-gray-900">{activity.maxGuestsPerBooking}</p></div>
                  )}
                  <div><p className="text-xs text-gray-500">City</p><p className="font-semibold text-gray-900">{activity.city}</p></div>
                  <div><p className="text-xs text-gray-500">State</p><p className="font-semibold text-gray-900">{activity.state}</p></div>
                  <div><p className="text-xs text-gray-500">Country</p><p className="font-semibold text-gray-900">{activity.country}</p></div>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Sticky Booking Card ── */}
            <div className="lg:flex-1">
              <div className="sticky top-24 space-y-6">
                {/* Booking Card */}
                <div className="rounded-2xl border border-gray-200 p-6 shadow-xl shadow-gray-200/50">
                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-semibold text-gray-900">
                      ₹{fmt(activity.basePrice)}
                    </span>
                    <span className="text-gray-500">/ person</span>
                  </div>
                  {activity.childPrice != null && activity.childPrice > 0 && (
                    <p className="text-xs text-gray-400 mb-4">₹{fmt(activity.childPrice)} / child</p>
                  )}
                  {activity.foreignerPrice != null && activity.foreignerPrice > 0 && (
                    <p className="text-xs text-gray-400 mb-4">₹{fmt(activity.foreignerPrice)} / foreign national</p>
                  )}
                  {!activity.childPrice && !activity.foreignerPrice && <div className="mb-4" />}

                  {/* Simple booking form */}
                  <div className="border border-gray-300 rounded-xl overflow-hidden mb-4">
                    <div className="flex divide-x divide-gray-300">
                      <div className="flex-1 p-3">
                        <p className="text-[10px] font-semibold uppercase text-gray-500 mb-0.5">Date</p>
                        <p className="text-sm text-gray-900">Select date</p>
                      </div>
                      <div className="flex-1 p-3">
                        <p className="text-[10px] font-semibold uppercase text-gray-500 mb-0.5">Slot</p>
                        <p className="text-sm text-gray-900">
                          {activity.startTimes?.length > 0 ? activity.startTimes[0] : "Flexible"}
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-gray-300 p-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase text-gray-500 mb-0.5">Participants</p>
                        <p className="text-sm text-gray-900">{personCount} person{personCount !== 1 ? "s" : ""}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPersonCount(Math.max(activity.minGroupSize || 1, personCount - 1))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-900 transition-colors"
                        >
                          −
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{personCount}</span>
                        <button
                          onClick={() => setPersonCount(Math.min(activity.maxGroupSize, personCount + 1))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-900 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Book button */}
                  <Link href={`/checkout/activity/${activity.slug || activity._id}`} className="block">
                    <Button className="w-full h-14 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 transition-colors gap-2">
                      {activity.instantBook ? "Instant Book" : "Reserve"}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  <p className="text-center text-gray-400 text-xs mt-3">
                    You won't be charged yet
                  </p>

                  {/* Price breakdown */}
                  <div className="mt-6 space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="underline decoration-gray-200 underline-offset-4">
                        ₹{fmt(activity.basePrice)} × {personCount} person{personCount !== 1 ? "s" : ""}
                      </span>
                      <span>₹{fmt(activity.basePrice * personCount)}</span>
                    </div>
                    {activity.securityDeposit > 0 && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="underline decoration-gray-200 underline-offset-4">Security deposit</span>
                        <span>₹{fmt(activity.securityDeposit)}</span>
                      </div>
                    )}
                    {activity.taxes > 0 && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="underline decoration-gray-200 underline-offset-4">Taxes ({activity.taxes}%)</span>
                        <span>₹{fmt(Math.round(activity.basePrice * personCount * activity.taxes / 100))}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-gray-900 pt-3 border-t border-gray-200">
                      <span>Total</span>
                      <span>
                        ₹{fmt(
                          Math.round(
                            activity.basePrice * personCount +
                            activity.securityDeposit +
                            (activity.basePrice * personCount * (activity.taxes || 0)) / 100
                          )
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Popular badge */}
                  {activity.avgRating >= 4.5 && activity.totalReviews > 10 && (
                    <div className="mt-6 flex gap-3 p-4 bg-primary/5 rounded-xl text-sm text-primary">
                      <Flame className="w-4 h-4 flex-shrink-0 text-primary mt-0.5" />
                      <p>
                        <span className="font-semibold">Rare find.</span> This is one of the highest-rated activities in {activity.city}!
                      </p>
                    </div>
                  )}
                </div>

                {/* Trust badge */}
                <div className="p-4 rounded-xl border border-gray-200 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Triptay Guarantee</p>
                    <p className="text-xs text-gray-500">
                      Every booking includes free protection from cancellations, listing inaccuracies, and other issues.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* SIMILAR ACTIVITIES                                                */}
          {/* ================================================================ */}
          {similarActivities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pt-16 mt-16 border-t border-gray-200"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Similar activities in {activity.city}
                </h2>
                <Link
                  href="/activities"
                  className="text-sm font-semibold text-gray-900 underline hover:no-underline flex items-center gap-1"
                >
                  Show all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarActivities.map((act: any) => (
                  <ItemCard
                    key={act._id}
                    type="activity"
                    id={act.slug || act._id}
                    title={act.name}
                    location={`${act.city}, ${act.state}`}
                    price={act.basePrice?.toLocaleString("en-IN") || String(act.basePrice)}
                    rating={act.avgRating ? String(act.avgRating) : "New"}
                    image={act.media?.[0]?.url || ""}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty similar activities fallback */}
          {similarActivities.length === 0 && (
            <div className="pt-16 mt-16 border-t border-gray-200">
              <div className="text-center py-10">
                <Inbox className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-400">No similar activities found nearby</p>
                <p className="text-xs text-gray-400 mt-1">Check back later for more adventures</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
