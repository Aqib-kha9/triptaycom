"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { ItemCard } from "@/components/cards";
import { activitiesApi, getToken, bookingsApi, reviewsApi } from "@/lib/api-client";
import { ApiError, NetworkError } from "@/lib/api-client";
import type { ActivityItem } from "@/types/api";
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
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ── TypeScript Interfaces ──

interface ActivityDetail {
  id: string;
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
  host: { id: string; name: string; avatar?: string; email?: string; phone?: string } | null;
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
  const router = useRouter();

  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [personCount, setPersonCount] = useState(2);
  const [similarActivities, setSimilarActivities] = useState<ActivityItem[]>([]);
  const [showFullGallery, setShowFullGallery] = useState(false);

  // Availability calendar/slot states
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>({});
  const [availabilityError, setAvailabilityError] = useState("");
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const [previewData, setPreviewData] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Reviews states
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Fetch reviews when activity loads
  useEffect(() => {
    const activityId = activity?.id;
    if (!activityId) return;
    let active = true;
    (async () => {
      setReviewsLoading(true);
      try {
        const res = await reviewsApi.getItemReviews("activity", activityId);
        if (active && res.status === "success") {
          setReviews(res.data?.reviews || []);
        }
      } catch (err) {
        console.error("Failed to load activity reviews:", err);
      } finally {
        if (active) setReviewsLoading(false);
      }
    })();
    return () => { active = false; };
  }, [activity]);

  // Fetch pricing preview from backend to ensure consistent platform fee / tax calculation
  useEffect(() => {
    const activityId = activity?.id;
    if (!activityId) return;
    let active = true;
    (async () => {
      setPreviewLoading(true);
      try {
        const res = await bookingsApi.getBookingPreview({
          itemId: activityId,
          itemType: "activity",
          activityDate: selectedDate ? new Date(selectedDate).toISOString() : undefined,
          guests: personCount,
        });
        if (!active) return;
        if (res.status === "success" && res.data?.pricing) {
          setPreviewData(res.data.pricing);
        }
      } catch (err) {
        console.error("Failed to fetch booking preview pricing:", err);
      } finally {
        if (active) setPreviewLoading(false);
      }
    })();
    return () => { active = false; };
  }, [activity, selectedDate, personCount]);

  // Fetch activity availability
  useEffect(() => {
    const activityId = activity?.id;
    if (!activityId) return;
    async function fetchAvailability(activityId: string) {
      setAvailabilityLoading(true);
      try {
        const res = await activitiesApi.getActivityAvailability(activityId);
        if (res.status === "success" && res.data) {
          setBlockedDates(res.data.blockedDates || []);
          setBookedSlots(res.data.bookedSlots || {});
        }
      } catch (err) {
        console.error("Failed to fetch activity availability:", err);
      } finally {
        setAvailabilityLoading(false);
      }
    }
    fetchAvailability(activityId);
  }, [activity]);

  // ── Fetch activity detail ──
  useEffect(() => {
    let cancelled = false;

    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        let res;
        try {
          res = await activitiesApi.getPublic(params.id);
          if (res?.status !== "success" || !res.data?.activity) {
            throw new Error("Public activity not found");
          }
        } catch (publicErr) {
          const token = getToken();
          if (token) {
            // Attempt to load private details if logged in
            res = await activitiesApi.getById(params.id);
          } else {
            throw publicErr;
          }
        }

        if (!cancelled) {
          if (res.data?.activity) {
            const a = res.data.activity as unknown as ActivityDetail;
            setActivity(a);
            fetchSimilar(a.city, a.id);
          } else {
            setError("Activity not found.");
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          if (err instanceof ApiError) {
            setError(err.message);
          } else if (err instanceof NetworkError) {
            setError("Unable to connect. Please check your internet.");
          } else {
            setError("Unable to load activity details. Please try again.");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function fetchSimilar(city: string, excludeId: string) {
      try {
        const res = await activitiesApi.browse({
          city,
          limit: 4,
          sort: "-avgRating",
        });
        if (!cancelled && res.data?.activities) {
          setSimilarActivities(
            res.data.activities.filter((a) => a.id !== excludeId).slice(0, 4)
          );
        }
      } catch {
        // Silently fail for similar activities
      }
    }

    fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  // ── Helpers ──

  const fmt = (n: number | undefined | null): string =>
    n != null ? n.toLocaleString("en-IN") : "0";

  const images = activity?.media || [];

  // ── Loading State ──
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-gray-500">Loading adventure details...</p>
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
            className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center text-center space-y-6 max-w-sm"
          >
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <p className="font-semibold text-gray-900">{error || "Activity not found"}</p>
            <Link href="/activities">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Activities
              </Button>
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Success State ──
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* ================================================================ */}
        {/* GALLERY                                                           */}
        {/* ================================================================ */}
        <section className="pt-20 pb-0">
          {images.length > 0 ? (
            <div className="max-w-7xl mx-auto px-2 md:px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[400px]">
                {/* Main image */}
                <div className="md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={images[0].url}
                    alt={activity.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {images.slice(1, 5).map((img, i) => (
                  <div
                    key={i}
                    className={`relative overflow-hidden bg-gray-100 ${i === 0 ? "md:col-span-1" : "hidden md:block"
                      } ${i === 0 ? "" : ""} rounded-xl`}
                  >
                    <img
                      src={img.url}
                      alt={`${activity.name} - ${i + 2}`}
                      className="w-full h-full object-cover"
                    />
                    {i === 2 && images.length > 5 && (
                      <button
                        onClick={() => setShowFullGallery(true)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-sm hover:bg-black/50 transition-colors"
                      >
                        Show all {images.length} photos
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-4 h-[300px] md:h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-300" />
            </div>
          )}
        </section>

        {/* ================================================================ */}
        {/* HEADER & MAIN CONTENT                                             */}
        {/* ================================================================ */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-start gap-2 mb-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                getDifficultyColor(activity.difficulty)
              )}
            >
              <Gauge className="w-3 h-3" />
              {activity.difficulty}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-primary/5 text-primary border-primary/10">
              {getActivityIcon(activity.activityType)}
              {activity.activityType}
            </span>
            {activity.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200">
                <Award className="w-3 h-3" /> Featured
              </span>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Column — Details */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {activity.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {activity.city}, {activity.state}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {(() => {
                    const count = reviews.length;
                    const avg = count > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / count) : 0;
                    return (
                      <>
                        {avg > 0 ? avg.toFixed(1) : "New"} ({count} {count === 1 ? "review" : "reviews"})
                      </>
                    );
                  })()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {activity.durationHours}h {activity.durationDays > 0 ? `${activity.durationDays}d` : ""}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => toggleWishlist(activity?.id || params.id, "activity")}
                  className={cn(
                    "rounded-xl gap-2 font-semibold text-sm transition-colors",
                    isWishlisted(activity?.id || params.id, "activity") && "text-rose-500 border-rose-200 bg-rose-50 hover:bg-rose-100"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isWishlisted(activity?.id || params.id, "activity") && "fill-rose-500")} />
                  Save
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl gap-2 font-semibold text-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  <Share2 className="w-4 h-4" /> Share
                </Button>
              </div>

              {/* Host Info */}
              {activity.host && (
                <div className="mt-6 flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg overflow-hidden">
                    {activity.host.avatar ? (
                      <img src={activity.host.avatar} alt={activity.host.name} className="w-full h-full object-cover" />
                    ) : (
                      activity.host.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{activity.host.name}</p>
                    <p className="text-xs text-gray-500">
                      {activity.certifiedGuides ? "Certified Guide" : "Activity Host"}
                    </p>
                  </div>
                </div>
              )}

              <hr className="my-6 border-gray-100" />

              {/* Summary */}
              <p className="text-gray-700 leading-relaxed mb-6">{activity.summary}</p>

              {/* Description */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-gray-900">About this activity</h3>
                <div className="text-gray-600 leading-relaxed space-y-3 whitespace-pre-line">
                  {activity.description}
                </div>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Duration</p>
                  <p className="font-semibold text-gray-900">
                    {activity.durationHours}h {activity.durationDays > 0 ? `${activity.durationDays}d` : ""}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Group Size</p>
                  <p className="font-semibold text-gray-900">
                    {activity.minGroupSize}–{activity.maxGroupSize} people
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Min Age</p>
                  <p className="font-semibold text-gray-900">{activity.minAge}+ years</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Languages</p>
                  <p className="font-semibold text-gray-900">
                    {activity.languagesSpoken?.join(", ") || "English"}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Availability</p>
                  <p className="font-semibold text-gray-900">{activity.availability}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Start Times</p>
                  <p className="font-semibold text-gray-900">
                    {activity.startTimes?.length > 0 ? activity.startTimes.join(", ") : "Flexible"}
                  </p>
                </div>
              </div>

              {/* Start Times */}
              {activity.startTimes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Start Times</h3>
                  <div className="flex flex-wrap gap-2">
                    {activity.startTimes.map((time, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/5 text-primary border border-primary/10"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Included / Excluded */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {activity.included.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Check className="w-5 h-5 text-emerald-500" /> Included
                    </h3>
                    <ul className="space-y-2">
                      {activity.included.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {activity.excluded.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <X className="w-5 h-5 text-red-400" /> Not Included
                    </h3>
                    <ul className="space-y-2">
                      {activity.excluded.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Safety & Guidelines */}
              {activity.safetyGuidelines && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" /> Safety Guidelines
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{activity.safetyGuidelines}</p>
                </div>
              )}

              {/* Equipment */}
              {(activity.equipmentProvided.length > 0 || activity.equipmentRequired.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {activity.equipmentProvided.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Gem className="w-5 h-5 text-primary" /> Equipment Provided
                      </h3>
                      <ul className="space-y-2">
                        {activity.equipmentProvided.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {activity.equipmentRequired.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Info className="w-5 h-5 text-amber-500" /> What to Bring
                      </h3>
                      <ul className="space-y-2">
                        {activity.equipmentRequired.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <ArrowRight className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Restrictions */}
              {activity.restrictions && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" /> Restrictions
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{activity.restrictions}</p>
                </div>
              )}

              {/* Meeting Point */}
              {activity.meetingPoint && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-primary" /> Meeting Point
                  </h3>
                  <p className="text-gray-600 text-sm">{activity.meetingPoint}</p>
                  {activity.landmark && (
                    <p className="text-gray-500 text-xs mt-1">Landmark: {activity.landmark}</p>
                  )}
                </div>
              )}

              {/* Cancellation Policy */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" /> Cancellation Policy
                </h3>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="font-semibold text-gray-900 text-sm">{activity.cancellationPolicy}</p>
                  {activity.cancellationDetails && (
                    <p className="text-gray-500 text-xs mt-1">{activity.cancellationDetails}</p>
                  )}
                </div>
              </div>

              {/* Nearby Places */}
              {activity.nearbyPlaces.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" /> Nearby Attractions
                  </h3>
                  <div className="space-y-3">
                    {activity.nearbyPlaces.map((place: any, i) => {
                      const distance = place.distance ?? place.distanceKm ?? 0;
                      const category = place.type || place.category || "attraction";

                      return (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{place.name}</p>
                            <p className="text-xs text-gray-400">{category}</p>
                          </div>
                          <span className="text-xs font-semibold text-gray-500">
                            {distance} km
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Seasonal Prices */}
              {activity.seasonalPrices.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Umbrella className="w-5 h-5 text-primary" /> Seasonal Pricing
                  </h3>
                  <div className="space-y-2">
                    {activity.seasonalPrices.map((sp: any, i) => {
                      const fromVal = sp.from || sp.startDate || "";
                      const toVal = sp.to || sp.endDate || "";
                      const priceVal = sp.price ?? sp.pricePerPerson ?? 0;

                      const startDateStr = fromVal ? new Date(fromVal).toLocaleDateString() : "Invalid Date";
                      const endDateStr = toVal ? new Date(toVal).toLocaleDateString() : "Invalid Date";

                      return (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{sp.seasonName}</p>
                            <p className="text-xs text-gray-400">
                              {startDateStr} – {endDateStr}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">₹{fmt(priceVal)}/person</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* House Rules */}
              {activity.houseRules.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-primary" /> Rules & Guidelines
                  </h3>
                  <ul className="space-y-2">
                    {activity.houseRules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        {rule.rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pet Friendly */}
              {activity.isPetFriendly ? (
                <div className="mb-8 p-4 border border-emerald-200 bg-emerald-50 rounded-xl">
                  <p className="font-semibold text-emerald-800 text-sm mb-1">🐾 Pet Friendly</p>
                  <p className="text-xs text-emerald-700">
                    {activity.petRules || "Pets are welcome on this activity!"}
                  </p>
                </div>
              ) : (
                <div className="mb-8 p-4 border border-gray-200 bg-gray-50 rounded-xl">
                  <p className="font-semibold text-gray-600 text-sm">No pets allowed</p>
                </div>
              )}

              {/* Location / Map */}
              {activity.coordinates && (
                <div className="mb-8 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" /> Location
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 font-medium">{activity.address}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.city}, {activity.state}, {activity.country}
                    </p>
                  </div>
                  <div className="h-[350px] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                    {activity.coordinates.lat && activity.coordinates.lng ? (
                      <iframe
                        title="Google Map of activity location"
                        width="100%"
                        height="100%"
                        className="border-0"
                        src={`https://maps.google.com/maps?q=${activity.coordinates.lat},${activity.coordinates.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center p-6">
                          <div className="bg-rose-100 p-4 rounded-full inline-block mb-3">
                            <MapPin className="w-6 h-6 text-rose-500" />
                          </div>
                          <p className="font-bold text-gray-700">Location Preview</p>
                          <p className="text-xs text-zinc-400 mt-1">Coordinates not available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div className="mt-12 pt-12 border-t border-zinc-100 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    Reviews & Ratings ({reviews.length})
                  </h3>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl">
                      <span className="text-sm font-black text-amber-700">
                        {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                      </span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={cn(
                              "w-3 h-3",
                              s <= Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
                                ? "text-amber-500 fill-amber-500"
                                : "text-zinc-200"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {reviewsLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="bg-zinc-50 rounded-2xl p-8 text-center space-y-3">
                    <p className="text-sm font-bold text-zinc-500">No reviews yet</p>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
                      Be one of the first to book this activity and share your experience with the community!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((r) => (
                      <div key={r.id} className="bg-white p-6 rounded-3xl border border-zinc-100 space-y-4 hover:border-zinc-200 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 overflow-hidden flex items-center justify-center">
                              {r.user?.avatar ? (
                                <img src={r.user.avatar} alt={r.user.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs font-black text-zinc-400">
                                  {r.user?.name ? r.user.name.charAt(0).toUpperCase() : "G"}
                                </span>
                              )}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-zinc-800">{r.user?.name || "Verified Guest"}</h4>
                              <p className="text-[10px] text-zinc-400 font-semibold">
                                {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={cn(
                                  "w-3 h-3",
                                  s <= r.rating ? "text-amber-500 fill-amber-500" : "text-zinc-100"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-zinc-600 font-medium leading-relaxed italic">
                          "{r.comment}"
                        </p>
                        {r.hostReply && (
                          <div className="bg-zinc-50 p-4 rounded-2xl border-l-2 border-primary/40 mt-3 space-y-1">
                            <p className="text-[10px] font-black uppercase text-primary tracking-widest">Host Response</p>
                            <p className="text-[11px] text-zinc-500 font-medium italic leading-relaxed">
                              "{r.hostReply}"
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column — Booking Card */}
            <div className="w-full lg:w-[380px] flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-4">
                {/* Booking Card */}
                <div className="rounded-2xl border border-gray-200 p-6 shadow-xl shadow-gray-200/50">
                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-semibold text-gray-900">
                      ₹{fmt(activity.basePrice)}
                    </span>
                    <span className="text-gray-500">/ person</span>
                  </div>
                  <div className="mb-4" />

                  {/* Date and Slot picker form */}
                  <div className="border border-gray-300 rounded-xl overflow-hidden mb-4 p-4 space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Select Date</label>
                      <input
                        type="date"
                        min={(() => {
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          return tomorrow.toISOString().split("T")[0];
                        })()}
                        value={selectedDate}
                        onChange={(e) => {
                          const dateVal = e.target.value;
                          setSelectedDate(dateVal);
                          setSelectedSlot(""); // reset slot on date change
                          setAvailabilityError("");

                          if (blockedDates.includes(dateVal)) {
                            setAvailabilityError("This date is blocked by the host.");
                          }
                        }}
                        className="w-full text-sm font-semibold bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 outline-none focus:border-primary transition-all text-zinc-800"
                      />
                    </div>

                    {selectedDate && !blockedDates.includes(selectedDate) && (
                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Select Time Slot</label>
                        <div className="grid grid-cols-2 gap-2">
                          {activity.startTimes?.length > 0 ? (
                            activity.startTimes.map((time) => {
                              const isFull = bookedSlots[selectedDate]?.includes(time);
                              const isSelected = selectedSlot === time;

                              return (
                                <button
                                  key={time}
                                  type="button"
                                  disabled={isFull}
                                  onClick={() => {
                                    setSelectedSlot(time);
                                    setAvailabilityError("");
                                  }}
                                  className={cn(
                                    "p-2 text-xs font-semibold rounded-lg border text-center transition-all",
                                    isFull && "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed line-through",
                                    !isFull && !isSelected && "bg-white hover:border-zinc-300 text-zinc-700 border-zinc-200",
                                    isSelected && "bg-primary/5 border-primary text-primary ring-2 ring-primary/10"
                                  )}
                                >
                                  {time} {isFull && "(Full)"}
                                </button>
                              );
                            })
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSlot("Flexible");
                                setAvailabilityError("");
                              }}
                              className={cn(
                                "col-span-2 p-2 text-xs font-semibold rounded-lg border text-center transition-all",
                                selectedSlot === "Flexible" ? "bg-primary/5 border-primary text-primary" : "bg-white text-zinc-700 border-zinc-200"
                              )}
                            >
                              Flexible / Anytime
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase text-gray-500 mb-0.5">Participants</p>
                          <p className="text-sm text-gray-900">{personCount} person{personCount !== 1 ? "s" : ""}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPersonCount(Math.max(activity.minGroupSize || 1, personCount - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-900 transition-colors"
                          >
                            −
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{personCount}</span>
                          <button
                            type="button"
                            onClick={() => setPersonCount(Math.min(activity.maxGroupSize || 20, personCount + 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-900 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      {personCount === (activity.maxGroupSize || 20) && (
                        <p className="text-[9px] text-amber-600 font-bold mt-2 text-right">
                          * Maximum limit of {activity.maxGroupSize || 20} participants reached.
                        </p>
                      )}
                      {personCount === (activity.minGroupSize || 1) && (
                        <p className="text-[9px] text-amber-600 font-bold mt-2 text-right">
                          * Minimum {activity.minGroupSize || 1} participant required.
                        </p>
                      )}
                    </div>
                  </div>

                  {availabilityError && (
                    <div className="flex items-start gap-2 p-3 mb-4 rounded-xl bg-red-50 border border-red-200">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs font-semibold text-red-700">{availabilityError}</p>
                    </div>
                  )}

                  {/* Book button */}
                  <Button
                    onClick={() => {
                      if (!selectedDate || !selectedSlot) {
                        setAvailabilityError("Please select a date and time slot first.");
                        return;
                      }
                      router.push(`/checkout/activity/${activity.slug || activity.id}?activityDate=${selectedDate}&startTime=${selectedSlot}&guests=${personCount}`);
                    }}
                    disabled={!selectedDate || !selectedSlot || !!availabilityError}
                    className={cn(
                      "w-full h-14 rounded-xl text-base font-semibold transition-colors gap-2",
                      (!selectedDate || !selectedSlot || !!availabilityError)
                        ? "bg-zinc-200 text-zinc-400 hover:bg-zinc-200 cursor-not-allowed"
                        : "bg-primary hover:bg-primary/90 text-white"
                    )}
                  >
                    {activity.instantBook ? "Instant Book" : "Reserve"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <p className="text-center text-gray-400 text-xs mt-3">
                    You won't be charged yet
                  </p>

                  {/* Price breakdown */}
                  <div className={cn("mt-6 space-y-3 pt-4 border-t border-gray-100", previewLoading && "opacity-45 transition-opacity")}>
                    {previewData ? (
                      <>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span className="underline decoration-gray-200 underline-offset-4">
                            ₹{fmt(activity.basePrice)} × {personCount} person{personCount !== 1 ? "s" : ""}
                          </span>
                          <span>₹{fmt(previewData.baseAmount)}</span>
                        </div>
                        {previewData.platformFee > 0 && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span className="underline decoration-gray-200 underline-offset-4">Platform fee</span>
                            <span>₹{fmt(previewData.platformFee)}</span>
                          </div>
                        )}
                        {previewData.taxAmount > 0 && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span className="underline decoration-gray-200 underline-offset-4">Taxes ({activity.taxes || 0}%)</span>
                            <span>₹{fmt(previewData.taxAmount)}</span>
                          </div>
                        )}
                        {previewData.securityDeposit > 0 && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span className="underline decoration-gray-200 underline-offset-4">Security deposit</span>
                            <span>₹{fmt(previewData.securityDeposit)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-gray-900 pt-3 border-t border-gray-200">
                          <span>Total</span>
                          <span>₹{fmt(previewData.totalAmount)}</span>
                        </div>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
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
                {similarActivities.map((act) => (
                  <ItemCard
                    key={act.id}
                    type="activity"
                    id={act.slug || act.id}
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
