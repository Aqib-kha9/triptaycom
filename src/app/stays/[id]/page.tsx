"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/cards";
import { useWishlist } from "@/context/WishlistContext";
import { listingsApi, getToken, publicApi, chatApi, reviewsApi } from "@/lib/api-client";
import type { ListingItem } from "@/types/api";
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
  Users,
  ChevronRight,
  ChevronLeft,
  Clock,
  ArrowRight,
  Inbox,
  Bed,
  Bath,
  Home,
  Dog,
  Cigarette,
  PartyPopper,
  AlertCircle,
  Loader2,
  Utensils,
  Sparkles,
  Check,
  X,
  Ruler,
  Building2,
  Hash,
  Moon,
  CreditCard,
  Percent,
  ClipboardCheck,
  ArrowLeft,
  Eye,
  ChevronDown,
  ChevronUp,
  Award,
  Gem,
  Flame,
  Gauge,
  Layers,
  Luggage,
  DoorOpen,
  Sunrise,
  Wallet,
  Calendar,
  Camera,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import { useState, useEffect, use } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ── TypeScript Interfaces ──

interface ListingDetail {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  propertyType: string;
  city: string;
  state: string;
  country: string;
  address: string;
  zipCode?: string;
  basePrice: number;
  weekendPrice?: number;
  effectiveWeekendPrice: number;
  avgRating: number;
  totalReviews: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  extraMattresses?: number;
  amenities: string[];
  media: { url: string; publicId: string; type: string; caption?: string; isCover: boolean }[];
  coordinates: { lat: number; lng: number };
  host: { id: string; name: string; avatar?: string; email?: string; phone?: string } | null;
  meals: { mealType: string; included: boolean; extraPrice: number; description?: string }[];
  hasKitchen?: boolean;
  kitchenDetails?: string;
  houseRules: { rule: string; icon?: string }[];
  nearbyPlaces: { name: string; distanceKm: number; category: string; description?: string }[];
  isPetFriendly: boolean;
  petRules?: string;
  isSmokingAllowed: boolean;
  isPartyAllowed: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  checkInTime: string;
  checkOutTime: string;
  flexibleCheckIn?: boolean;
  flexibleCheckOut?: boolean;
  cancellationPolicy: string;
  cancellationDetails?: string;
  cleaningFee: number;
  securityDeposit: number;
  extraGuestPrice?: number;
  taxes: number;
  minStay: number;
  maxStay?: number;
  instantBook: boolean;
  advanceNoticeHours?: number;
  maxGuestsPerBooking?: number;
  isEntirePlace: boolean;
  languagesSpoken: string[];
  seasonalPrices: { seasonName: string; startDate: string; endDate: string; pricePerNight: number }[];
  videoTourUrl?: string;
  landmark?: string;
  propertySizeSqFt?: number;
  yearBuilt?: number;
  floorNumber?: number;
  totalFloors?: number;
  isFeatured?: boolean;
}

// ── Amenity Icon Map ──

const amenityIconMap: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-5 h-5" />,
  tv: <Tv className="w-5 h-5" />,
  kitchen: <Utensils className="w-5 h-5" />,
  parking: <Car className="w-5 h-5" />,
  ac: <Wind className="w-5 h-5" />,
  heater: <Sparkles className="w-5 h-5" />,
  "coffee maker": <Coffee className="w-5 h-5" />,
  coffee: <Coffee className="w-5 h-5" />,
  workspace: <Home className="w-5 h-5" />,
  pool: <Sparkles className="w-5 h-5" />,
  gym: <Flame className="w-5 h-5" />,
  garden: <Sparkles className="w-5 h-5" />,
  washer: <Luggage className="w-5 h-5" />,
  dryer: <Luggage className="w-5 h-5" />,
  "hot water": <Flame className="w-5 h-5" />,
  "fire extinguisher": <ShieldCheck className="w-5 h-5" />,
  "first aid": <ShieldCheck className="w-5 h-5" />,
  "smoke alarm": <ShieldCheck className="w-5 h-5" />,
  "carbon monoxide alarm": <ShieldCheck className="w-5 h-5" />,
  balcony: <Home className="w-5 h-5" />,
  "private entrance": <DoorOpen className="w-5 h-5" />,
  "lake access": <Sparkles className="w-5 h-5" />,
  "river view": <Sparkles className="w-5 h-5" />,
  "mountain view": <Sparkles className="w-5 h-5" />,
  "valley view": <Sparkles className="w-5 h-5" />,
  "bonfire pit": <Flame className="w-5 h-5" />,
  barbecue: <Flame className="w-5 h-5" />,
  "outdoor furniture": <Home className="w-5 h-5" />,
  "dining area": <Utensils className="w-5 h-5" />,
  essentials: <Check className="w-5 h-5" />,
  hangers: <Check className="w-5 h-5" />,
  "bed linen": <Bed className="w-5 h-5" />,
  "extra pillows": <Bed className="w-5 h-5" />,
  "room darkening shades": <Moon className="w-5 h-5" />,
  "clothing storage": <Luggage className="w-5 h-5" />,
  "board games": <BookOpen className="w-5 h-5" />,
  "bluetooth speaker": <Sparkles className="w-5 h-5" />,
  "sound system": <Sparkles className="w-5 h-5" />,
  "electric kettle": <Coffee className="w-5 h-5" />,
  refrigerator: <Utensils className="w-5 h-5" />,
  microwave: <Utensils className="w-5 h-5" />,
  "cooking basics": <Utensils className="w-5 h-5" />,
  dishes: <Utensils className="w-5 h-5" />,
  "cleaning products": <Sparkles className="w-5 h-5" />,
  "hair dryer": <Wind className="w-5 h-5" />,
  shampoo: <Sparkles className="w-5 h-5" />,
  "hot water kettle": <Coffee className="w-5 h-5" />,
  "body soap": <Sparkles className="w-5 h-5" />,
  "outdoor shower": <Sparkles className="w-5 h-5" />,
  "free parking": <Car className="w-5 h-5" />,
  "paid parking": <Car className="w-5 h-5" />,
  "dedicated workspace": <Home className="w-5 h-5" />,
  "pets allowed": <Dog className="w-5 h-5" />,
  "long term stays": <Calendar className="w-5 h-5" />,
  "self check-in": <DoorOpen className="w-5 h-5" />,
  "lock box": <ShieldCheck className="w-5 h-5" />,
  "luggage dropoff": <Luggage className="w-5 h-5" />,
  "breakfast": <Coffee className="w-5 h-5" />,
  "indoor fireplace": <Flame className="w-5 h-5" />,
  heating: <Flame className="w-5 h-5" />,
  "air conditioning": <Wind className="w-5 h-5" />,
  "patio or balcony": <Home className="w-5 h-5" />,
  backyard: <Sparkles className="w-5 h-5" />,
  "indoor kitchen": <Utensils className="w-5 h-5" />,
  "outdoor kitchen": <Utensils className="w-5 h-5" />,
};

function getAmenityIcon(name: string): React.ReactNode {
  const key = name.toLowerCase().trim();
  if (amenityIconMap[key]) return amenityIconMap[key];
  // fuzzy match
  for (const [k, icon] of Object.entries(amenityIconMap)) {
    if (key.includes(k) || k.includes(key)) return icon;
  }
  return <Check className="w-5 h-5" />;
}

// ── Main Component ──

export default function StayDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [guestCount, setGuestCount] = useState(2);
  const [similarProperties, setSimilarProperties] = useState<ListingItem[]>([]);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [platformFeeRate, setPlatformFeeRate] = useState(5);
  const [messageLoading, setMessageLoading] = useState(false);

  // Reviews states
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Fetch reviews when listing loads
  useEffect(() => {
    const listingId = listing?.id;
    if (!listingId) return;
    let active = true;
    (async () => {
      setReviewsLoading(true);
      try {
        const res = await reviewsApi.getItemReviews("listing", listingId);
        if (active && res.status === "success") {
          setReviews(res.data?.reviews || []);
        }
      } catch (err) {
        console.error("Failed to load listing reviews:", err);
      } finally {
        if (active) setReviewsLoading(false);
      }
    })();
    return () => { active = false; };
  }, [listing]);

  // Availability calendar states
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [calendarError, setCalendarError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await publicApi.getConfigurations();
        if (res?.status === "success" && res.data?.configuration) {
          const rate = res.data.configuration.platform_fee_rate;
          if (rate !== undefined) setPlatformFeeRate(Number(rate));
        }
      } catch (err) {
        console.error("Failed to load public config:", err);
      }
    }
    fetchConfig();
  }, []);

  // Fetch listing availability (blocked and booked dates)
  useEffect(() => {
    const listingId = listing?.id;
    if (!listingId) return;
    const id: string = listingId;
    async function fetchAvailability() {
      try {
        const res = await listingsApi.getListingAvailability(id);
        if (res.status === "success" && res.data) {
          setBlockedDates(res.data.blockedDates || []);
          setBookedDates(res.data.bookedDates || []);
        }
      } catch (err) {
        console.error("Failed to fetch availability:", err);
      }
    }
    fetchAvailability();
  }, [listing]);

  // Calendar Helpers
  const formatDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const todayStr = formatDateString(new Date());

  const isDateDisabled = (dateStr: string) => {
    return dateStr < todayStr || blockedDates.includes(dateStr) || bookedDates.includes(dateStr);
  };

  const handleDateClick = (dateStr: string) => {
    if (isDateDisabled(dateStr)) return;

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr);
      setCheckOut("");
      setCalendarError("");
    } else {
      if (dateStr <= checkIn) {
        setCheckIn(dateStr);
      } else {
        // Check if any date in the range is blocked/booked
        const start = new Date(checkIn);
        const end = new Date(dateStr);
        let hasConflict = false;
        const current = new Date(start);
        while (current < end) {
          if (isDateDisabled(formatDateString(current))) {
            hasConflict = true;
            break;
          }
          current.setDate(current.getDate() + 1);
        }

        if (hasConflict) {
          setCalendarError("Selected range contains booked/blocked dates.");
        } else {
          setCheckOut(dateStr);
          setCalendarError("");
        }
      }
    }
  };

  const getDaysInMonth = (month: number, year: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    const firstDayIndex = date.getDay();
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const handleMessageHost = async () => {
    if (!listing?.host?.id) return;
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    setMessageLoading(true);
    try {
      const res = await chatApi.getOrCreateConversation({
        participantId: listing.host.id,
        listingId: listing.id,
        bookingContext: {
          title: listing.name,
          dateRange: checkIn && checkOut ? `${checkIn} to ${checkOut}` : "General Inquiry",
          type: "Stay Inquiry"
        }
      });
      if (res?.status === "success" && res.data?.conversation?._id) {
        router.push(`/messages?conversationId=${res.data.conversation._id}`);
      }
    } catch (err) {
      console.error("Failed to start message room with host:", err);
      alert("Failed to connect with host. Please try again.");
    } finally {
      setMessageLoading(false);
    }
  };

  // ── Fetch listing detail ──
  useEffect(() => {
    let cancelled = false;

    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        let res;
        try {
          res = await listingsApi.getPublic(params.id);
          if (res?.status !== "success" || !res.data?.listing) {
            throw new Error(res?.message || "Public stay not found");
          }
        } catch (publicErr) {
          const token = getToken();
          if (token) {
            // Attempt to load private details if logged in
            res = await listingsApi.getById(params.id);
          } else {
            throw publicErr;
          }
        }

        if (!cancelled) {
          if (res?.status === "success" && res.data?.listing) {
            setListing(res.data.listing as unknown as ListingDetail);
            const l = res.data.listing as unknown as ListingDetail;
            fetchSimilar(l.city, l.id);
          } else {
            setError(res?.message || "Stay not found.");
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load stay details. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function fetchSimilar(city: string, excludeId: string) {
      try {
        const res = await listingsApi.browse({ city, limit: 3, sort: "-avgRating" });
        if (!cancelled && res?.status === "success" && Array.isArray(res.data?.listings)) {
          setSimilarProperties(
            res.data.listings.filter((l: ListingItem) => l.id !== excludeId).slice(0, 3)
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
  const images = listing?.media?.map((m) => m.url) ?? [];
  const displayAmenities = showAllAmenities
    ? listing?.amenities ?? []
    : (listing?.amenities ?? []).slice(0, 10);
  const hasMoreAmenities = (listing?.amenities?.length ?? 0) > 10;
  const fmt = (n: number) => n?.toLocaleString("en-IN") ?? "0";

  // Dynamic booking details
  const nights = checkIn && checkOut
    ? Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : listing?.minStay ?? 1;

  const baseTotal = (listing?.basePrice ?? 0) * nights;
  const platformFee = Math.round(baseTotal * platformFeeRate / 100);
  const taxesTotal = Math.round((baseTotal + (listing?.cleaningFee ?? 0)) * (listing?.taxes ?? 0) / 100);
  const grandTotal = baseTotal + (listing?.cleaningFee ?? 0) + (listing?.securityDeposit ?? 0) + platformFee + taxesTotal;

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
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
            <p className="text-lg font-semibold text-gray-700">Loading stay details...</p>
            <p className="text-sm text-gray-500">Fetching the best homestay for you</p>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Error State ──
  if (error || !listing) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 max-w-md"
          >
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Oops! Something went wrong</h2>
            <p className="text-gray-500">{error || "Stay not found"}</p>
            <Link href="/stays">
              <Button variant="outline" className="rounded-xl gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Stays
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
        {/* GALLERY                                                          */}
        {/* ================================================================ */}
        <section className="pt-20 pb-0">
          {images.length > 0 ? (
            <div className="relative">
              {/* Main image + 4 grid items */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-2.5 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="md:col-span-2 md:row-span-2 h-[320px] md:h-[480px] rounded-xl overflow-hidden">
                  <img
                    src={images[0]}
                    alt={`${listing.name} - main`}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                    onClick={() => setShowFullGallery(true)}
                  />
                </div>
                {images.slice(1, 5).map((img, i) => (
                  <div
                    key={i}
                    className="hidden md:block h-[237px] rounded-xl overflow-hidden relative"
                  >
                    <img
                      src={img}
                      alt={`${listing.name} - ${i + 2}`}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                      onClick={() => setShowFullGallery(true)}
                    />
                    {i === 3 && images.length > 5 && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">+{images.length - 5} more</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
              {/* Title */}
              <h1 className="text-2xl md:text-[26px] font-semibold text-gray-900 leading-tight">
                {listing.name}
              </h1>

              {/* Sub‑row: rating + location + badges */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-current text-gray-900" />
                  {(() => {
                    const count = reviews.length;
                    const avg = count > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / count) : 0;
                    return (
                      <>
                        <span className="font-semibold">{avg > 0 ? avg.toFixed(1) : "New"}</span>
                        {count > 0 && (
                          <>
                            <span className="text-gray-400">·</span>
                            <span className="text-gray-500 underline cursor-pointer hover:text-gray-700">
                              {count} review{count !== 1 ? "s" : ""}
                            </span>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Verified badge */}
                <span className="flex items-center gap-1 text-gray-900 font-medium text-xs">
                  <Award className="w-3.5 h-3.5 text-rose-500" />
                  {listing.isFeatured ? "Featured" : "Verified"}
                </span>

                {/* Superhost / Entire place */}
                {listing.isEntirePlace && (
                  <span className="flex items-center gap-1 text-gray-900 font-medium text-xs">
                    <Gem className="w-3.5 h-3.5" />
                    Entire {listing.propertyType}
                  </span>
                )}

                {/* Location */}
                <span className="flex items-center gap-1.5 text-gray-500 underline cursor-pointer hover:text-gray-700">
                  <MapPin className="w-4 h-4" />
                  {listing.city}, {listing.state}, {listing.country}
                </span>
              </div>

              {/* Quick stats pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                  <Users className="w-4 h-4 text-gray-400" /> {listing.maxGuests} guests
                </span>
                <span className="text-gray-300">·</span>
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                  <Bed className="w-4 h-4 text-gray-400" /> {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? "s" : ""}
                </span>
                <span className="text-gray-300">·</span>
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                  <Bed className="w-4 h-4 text-gray-400" /> {listing.beds} bed{listing.beds !== 1 ? "s" : ""}
                </span>
                <span className="text-gray-300">·</span>
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                  <Bath className="w-4 h-4 text-gray-400" /> {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? "s" : ""}
                </span>
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
                onClick={() => toggleWishlist(listing?.id || params.id, "stay")}
                className={cn(
                  "rounded-xl gap-2 font-semibold text-sm transition-colors",
                  isWishlisted(listing?.id || params.id, "stay") && "text-rose-500 border-rose-200 bg-rose-50 hover:bg-rose-100"
                )}
              >
                <Heart className={cn("w-4 h-4", isWishlisted(listing?.id || params.id, "stay") && "fill-rose-500")} />
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
              {/* ── Host + Description ── */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {listing.host && (
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                      {listing.host.avatar ? (
                        <img
                          src={listing.host.avatar}
                          alt={listing.host.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                          {listing.host.name?.charAt(0)?.toUpperCase() || "H"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Hosted by {listing.host.name}</p>
                      {listing.languagesSpoken?.length > 0 && (
                        <p className="text-sm text-gray-500">Speaks {listing.languagesSpoken.join(", ")}</p>
                      )}
                    </div>
                  </div>
                )}
                {/* Optional: message host button */}
                {listing.host && (
                  <Button
                    variant="outline"
                    onClick={handleMessageHost}
                    disabled={messageLoading}
                    className="rounded-xl font-semibold text-sm gap-2 sm:ml-auto"
                  >
                    {messageLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MessageCircle className="w-4 h-4" />
                    )}
                    {messageLoading ? "Connecting..." : "Message Host"}
                  </Button>
                )}
              </div>

              {/* Divider */}
              <hr className="border-gray-100" />

              {/* ── About / Description ── */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  About this {listing.propertyType}
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {listing.description || listing.summary || "No description available."}
                </p>
              </div>

              {/* ── Sleeping Arrangements ── */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Where you'll sleep
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Array.from({ length: listing.bedrooms }).map((_, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-gray-200 space-y-2"
                    >
                      <Bed className="w-5 h-5 text-gray-500" />
                      <p className="text-sm font-semibold text-gray-900">Bedroom {i + 1}</p>
                      <p className="text-xs text-gray-500">
                        {Math.ceil(listing.beds / listing.bedrooms) >= 2 ? "2 beds" : "1 bed"}
                      </p>
                    </div>
                  ))}
                  {listing.extraMattresses != null && listing.extraMattresses > 0 && (
                    <div className="p-4 rounded-xl border border-gray-200 space-y-2">
                      <Hash className="w-5 h-5 text-gray-500" />
                      <p className="text-sm font-semibold text-gray-900">Extra Mattresses</p>
                      <p className="text-xs text-gray-500">{listing.extraMattresses} available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <hr className="border-gray-100" />

              {/* ── Amenities ── */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  What this place offers
                </h2>
                {listing.amenities && listing.amenities.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {displayAmenities.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="text-gray-500 flex-shrink-0">
                            {getAmenityIcon(item)}
                          </div>
                          <span className="text-gray-700 text-sm capitalize">{item}</span>
                        </div>
                      ))}
                    </div>
                    {hasMoreAmenities && (
                      <button
                        onClick={() => setShowAllAmenities(!showAllAmenities)}
                        className="mt-6 px-6 py-2.5 border border-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                      >
                        {showAllAmenities
                          ? "Show fewer amenities"
                          : `Show all ${listing.amenities.length} amenities`}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-gray-400 text-sm">No amenities listed.</p>
                )}
              </div>

              {/* Divider */}
              <hr className="border-gray-100" />

              {/* ── Food & Dining ── */}
              {(listing.meals?.length > 0 || listing.hasKitchen) && (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Food & Dining
                    </h2>
                    {listing.hasKitchen && listing.kitchenDetails && (
                      <div className="mb-4 flex items-start gap-3">
                        <Utensils className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Kitchen available</p>
                          <p className="text-sm text-gray-500">{listing.kitchenDetails}</p>
                        </div>
                      </div>
                    )}
                    <div className="space-y-3">
                      {listing.meals.map((meal: any, index) => {
                        const mealName = meal.type || meal.mealType || `Meal ${index + 1}`;
                        const isIncluded = meal.available ?? meal.included ?? false;
                        const mealPrice = typeof meal.price === "number" ? meal.price : (typeof meal.extraPrice === "number" ? meal.extraPrice : 0);

                        return (
                          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                            <div>
                              <p className="font-semibold text-gray-900">{mealName}</p>
                              {meal.description && (
                                <p className="text-sm text-gray-500">{meal.description}</p>
                              )}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {isIncluded ? (
                                <span className="text-emerald-600">Included</span>
                              ) : (
                                `₹${mealPrice.toLocaleString("en-IN")}`
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <hr className="border-gray-100" />
                </>
              )}

              {/* ── Check-in / Check-out ── */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Check-in & Check-out
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-gray-200 space-y-1">
                    <div className="flex items-center gap-3">
                      <Sunrise className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Check-in</p>
                        <p className="text-sm text-gray-600">{listing.checkInTime}</p>
                      </div>
                    </div>
                    {listing.flexibleCheckIn && (
                      <p className="text-xs text-emerald-600 ml-8">Flexible check-in available</p>
                    )}
                  </div>
                  <div className="p-4 rounded-xl border border-gray-200 space-y-1">
                    <div className="flex items-center gap-3">
                      <DoorOpen className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Check-out</p>
                        <p className="text-sm text-gray-600">{listing.checkOutTime}</p>
                      </div>
                    </div>
                    {listing.flexibleCheckOut && (
                      <p className="text-xs text-emerald-600 ml-8">Flexible check-out available</p>
                    )}
                  </div>
                </div>
                {listing.quietHoursStart && listing.quietHoursEnd && (
                  <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
                    <Moon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    Quiet hours: {listing.quietHoursStart} – {listing.quietHoursEnd}
                  </div>
                )}
              </div>

              {/* Divider */}
              <hr className="border-gray-100" />

              {/* ── House Rules ── */}
              {listing.houseRules && listing.houseRules.length > 0 && (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      House Rules
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {listing.houseRules.map((rule, i) => (
                        <div key={i} className="flex items-center gap-3 py-1">
                          <Check className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{rule.rule}</span>
                        </div>
                      ))}
                    </div>
                    {/* Rule badges */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {listing.isPetFriendly && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700">
                          <Dog className="w-3.5 h-3.5" /> Pet Friendly
                        </span>
                      )}
                      {!listing.isPetFriendly && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-400">
                          <X className="w-3.5 h-3.5" /> No Pets
                        </span>
                      )}
                      {listing.isSmokingAllowed && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700">
                          <Cigarette className="w-3.5 h-3.5" /> Smoking Allowed
                        </span>
                      )}
                      {listing.isPartyAllowed && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700">
                          <PartyPopper className="w-3.5 h-3.5" /> Parties Allowed
                        </span>
                      )}
                      {!listing.isPartyAllowed && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-400">
                          <X className="w-3.5 h-3.5" /> No Parties
                        </span>
                      )}
                      {listing.instantBook && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700">
                          <Gauge className="w-3.5 h-3.5" /> Instant Book
                        </span>
                      )}
                    </div>
                    {listing.isPetFriendly && listing.petRules && (
                      <p className="mt-3 text-sm text-gray-500">
                        <span className="font-semibold">Pet rules:</span> {listing.petRules}
                      </p>
                    )}
                  </div>
                  <hr className="border-gray-100" />
                </>
              )}

              {/* ── Availability Calendar ── */}
              <div id="availability-calendar" className="space-y-4 scroll-mt-28">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-rose-500" />
                  Select Booking Dates
                </h2>
                <p className="text-sm text-gray-500">
                  Select your check-in and check-out dates. Days marked in red are already booked by other guests, and days with a line-through are blocked by the host.
                </p>

                {/* Calendar grid container */}
                <div className="border border-gray-200 rounded-[32px] p-6 bg-white shadow-sm max-w-md">
                  {/* Month header control */}
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => {
                        const prev = new Date(currentYear, currentMonth - 1, 1);
                        setCurrentMonth(prev.getMonth());
                        setCurrentYear(prev.getFullYear());
                      }}
                      className="p-2 hover:bg-gray-50 rounded-full border border-gray-200 transition-colors"
                      disabled={currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth()}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-sm text-gray-950">
                      {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })} {currentYear}
                    </span>
                    <button
                      onClick={() => {
                        const next = new Date(currentYear, currentMonth + 1, 1);
                        setCurrentMonth(next.getMonth());
                        setCurrentYear(next.getFullYear());
                      }}
                      className="p-2 hover:bg-gray-50 rounded-full border border-gray-200 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Day labels */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-400 mb-2">
                    <span>Su</span>
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                  </div>

                  {/* Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth(currentMonth, currentYear).map((day, idx) => {
                      if (!day) return <div key={`empty-${idx}`} />;
                      const dateStr = formatDateString(day);
                      const isPast = dateStr < todayStr;
                      const isBlocked = blockedDates.includes(dateStr);
                      const isBooked = bookedDates.includes(dateStr);
                      const isDisabled = isPast || isBlocked || isBooked;

                      const isSelectedStart = checkIn === dateStr;
                      const isSelectedEnd = checkOut === dateStr;
                      const isBetween = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;

                      return (
                        <button
                          key={dateStr}
                          onClick={() => handleDateClick(dateStr)}
                          disabled={isPast}
                          className={cn(
                            "h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all relative",
                            isPast && "text-gray-300 cursor-not-allowed",
                            isBlocked && "text-gray-300 line-through bg-gray-50 border border-dashed border-gray-200 cursor-not-allowed",
                            isBooked && "text-rose-500 bg-rose-50 border border-rose-100 cursor-not-allowed",
                            !isDisabled && !isSelectedStart && !isSelectedEnd && !isBetween && "text-gray-800 hover:bg-gray-100",
                            isSelectedStart && "bg-rose-500 text-white shadow-lg shadow-rose-500/20",
                            isSelectedEnd && "bg-rose-500 text-white shadow-lg shadow-rose-500/20",
                            isBetween && "bg-rose-50 text-rose-600 rounded-none"
                          )}
                          title={isBlocked ? "Blocked by Host" : isBooked ? "Booked" : ""}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  {calendarError && (
                    <p className="mt-4 text-xs font-semibold text-rose-500 bg-rose-50 p-2 rounded-xl text-center">
                      {calendarError}
                    </p>
                  )}

                  {checkIn && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs font-bold text-gray-600">
                      <div>
                        <span>Check-in: </span>
                        <span className="text-gray-950">{checkIn}</span>
                      </div>
                      {checkOut && (
                        <div>
                          <span>Check-out: </span>
                          <span className="text-gray-950">{checkOut}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <hr className="border-gray-100" />

              {/* ── Cancellation Policy ── */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Cancellation Policy
                </h2>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="font-semibold text-gray-900">{listing.cancellationPolicy}</p>
                  {listing.cancellationDetails && (
                    <p className="text-sm text-gray-500 mt-2">{listing.cancellationDetails}</p>
                  )}
                </div>
              </div>

              {/* Divider */}
              <hr className="border-gray-100" />

              {listing.nearbyPlaces && listing.nearbyPlaces.length > 0 && (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Nearby Places
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {listing.nearbyPlaces.map((place: any, i) => {
                        const distance = place.distance ?? place.distanceKm ?? 0;
                        const category = place.type || place.category || "attraction";

                        return (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {place.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {distance} km away
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                              {category}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <hr className="border-gray-100" />
                </>
              )}

              {/* ── Seasonal Rates ── */}
              {listing.seasonalPrices && listing.seasonalPrices.length > 0 && (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Seasonal Rates
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {listing.seasonalPrices.map((sp: any, i) => {
                        const seasonName = sp.seasonName || "Seasonal Rate";
                        const startDate = sp.startDate || sp.from;
                        const endDate = sp.endDate || sp.to;
                        const price = sp.pricePerNight !== undefined ? sp.pricePerNight : (sp.price || 0);
                        return (
                          <div
                            key={i}
                            className="p-4 rounded-xl border border-gray-200 flex justify-between items-center"
                          >
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{seasonName}</p>
                              <p className="text-xs text-gray-500">
                                {startDate ? new Date(startDate).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                }) : "N/A"}{" "}
                                –{" "}
                                {endDate ? new Date(endDate).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                }) : "N/A"}
                              </p>
                            </div>
                            <span className="font-semibold text-gray-900">
                              ₹{price.toLocaleString("en-IN")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <hr className="border-gray-100" />
                </>
              )}

              {/* ── Property Details ── */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Property Details
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div><p className="text-xs text-gray-500">Type</p><p className="font-semibold text-gray-900">{listing.propertyType}</p></div>
                  <div><p className="text-xs text-gray-500">Max Guests</p><p className="font-semibold text-gray-900">{listing.maxGuests}</p></div>
                  <div><p className="text-xs text-gray-500">Bedrooms</p><p className="font-semibold text-gray-900">{listing.bedrooms}</p></div>
                  <div><p className="text-xs text-gray-500">Beds</p><p className="font-semibold text-gray-900">{listing.beds}</p></div>
                  <div><p className="text-xs text-gray-500">Bathrooms</p><p className="font-semibold text-gray-900">{listing.bathrooms}</p></div>
                  {listing.extraMattresses != null && listing.extraMattresses > 0 && (
                    <div><p className="text-xs text-gray-500">Extra Mattresses</p><p className="font-semibold text-gray-900">{listing.extraMattresses}</p></div>
                  )}
                  {listing.propertySizeSqFt != null && (
                    <div><p className="text-xs text-gray-500">Size</p><p className="font-semibold text-gray-900">{listing.propertySizeSqFt} sq.ft</p></div>
                  )}
                  {listing.yearBuilt != null && (
                    <div><p className="text-xs text-gray-500">Year Built</p><p className="font-semibold text-gray-900">{listing.yearBuilt}</p></div>
                  )}
                  {listing.floorNumber != null && (
                    <div><p className="text-xs text-gray-500">Floor</p><p className="font-semibold text-gray-900">{listing.floorNumber}{listing.totalFloors ? ` of ${listing.totalFloors}` : ""}</p></div>
                  )}
                  <div><p className="text-xs text-gray-500">Min Stay</p><p className="font-semibold text-gray-900">{listing.minStay} night{listing.minStay > 1 ? "s" : ""}</p></div>
                  {listing.maxStay && listing.maxStay > 0 && (
                    <div><p className="text-xs text-gray-500">Max Stay</p><p className="font-semibold text-gray-900">{listing.maxStay} nights</p></div>
                  )}
                  {listing.advanceNoticeHours != null && (
                    <div><p className="text-xs text-gray-500">Advance Notice</p><p className="font-semibold text-gray-900">{listing.advanceNoticeHours}h</p></div>
                  )}
                  <div><p className="text-xs text-gray-500">City</p><p className="font-semibold text-gray-900">{listing.city}</p></div>
                  <div><p className="text-xs text-gray-500">State</p><p className="font-semibold text-gray-900">{listing.state}</p></div>
                  <div><p className="text-xs text-gray-500">Country</p><p className="font-semibold text-gray-900">{listing.country}</p></div>
                  {listing.zipCode && <div><p className="text-xs text-gray-500">ZIP</p><p className="font-semibold text-gray-900">{listing.zipCode}</p></div>}
                  {listing.landmark && <div><p className="text-xs text-gray-500">Landmark</p><p className="font-semibold text-gray-900">{listing.landmark}</p></div>}
                </div>
              </div>

              {/* Divider */}
              <hr className="border-gray-100" />

              {/* ── Location / Map ── */}
              {listing.coordinates && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Where you'll be
                  </h2>
                  <div className="h-[350px] w-full rounded-2xl overflow-hidden border border-gray-200">
                    {listing.coordinates.lat && listing.coordinates.lng ? (
                      <iframe
                        title="Google Map of stay location"
                        width="100%"
                        height="100%"
                        className="border-0"
                        src={`https://maps.google.com/maps?q=${listing.coordinates.lat},${listing.coordinates.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
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
                      Be one of the first to book this stay and share your experience with the community!
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

            {/* ── RIGHT COLUMN: Sticky Booking Card ── */}
            <div className="lg:flex-1">
              <div className="sticky top-24 space-y-6">
                {/* Booking Card */}
                <div className="rounded-2xl border border-gray-200 p-6 shadow-xl shadow-gray-200/50">
                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-2xl font-semibold text-gray-900">
                      ₹{fmt(listing.basePrice)}
                    </span>
                    <span className="text-gray-500">/ night</span>
                  </div>

                  {/* Simple booking form */}
                  <div className="border border-gray-300 rounded-xl overflow-hidden mb-4">
                    <div className="flex divide-x divide-gray-300">
                      <button
                        onClick={() => document.getElementById("availability-calendar")?.scrollIntoView({ behavior: "smooth" })}
                        className="flex-1 p-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <p className="text-[10px] font-semibold uppercase text-gray-500 mb-0.5">Check-in</p>
                        <p className={cn("text-sm font-medium", checkIn ? "text-gray-900" : "text-gray-400")}>
                          {checkIn || "Select date"}
                        </p>
                      </button>
                      <button
                        onClick={() => document.getElementById("availability-calendar")?.scrollIntoView({ behavior: "smooth" })}
                        className="flex-1 p-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <p className="text-[10px] font-semibold uppercase text-gray-500 mb-0.5">Check-out</p>
                        <p className={cn("text-sm font-medium", checkOut ? "text-gray-900" : "text-gray-400")}>
                          {checkOut || "Select date"}
                        </p>
                      </button>
                    </div>
                    <div className="border-t border-gray-300 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-semibold uppercase text-gray-500 mb-0.5">Guests</p>
                          <p className="text-sm text-gray-900">{guestCount} guest{guestCount !== 1 ? "s" : ""}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-900 transition-colors"
                          >
                            −
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{guestCount}</span>
                          <button
                            onClick={() => setGuestCount(Math.min(listing.maxGuests, guestCount + 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-900 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      {guestCount === listing.maxGuests && (
                        <p className="text-[9px] text-amber-600 font-bold mt-2 text-right">
                          * Maximum limit of {listing.maxGuests} guests reached for this stay.
                        </p>
                      )}
                      {guestCount === 1 && (
                        <p className="text-[9px] text-amber-600 font-bold mt-2 text-right">
                          * Minimum 1 guest required.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Book button */}
                  <Link
                    href={checkIn && checkOut
                      ? `/checkout/stay/${listing.slug || listing.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guestCount}`
                      : `#availability-calendar`
                    }
                    className="block"
                    onClick={(e) => {
                      if (!checkIn || !checkOut) {
                        e.preventDefault();
                        document.getElementById("availability-calendar")?.scrollIntoView({ behavior: "smooth" });
                        setCalendarError("Please select check-in and check-out dates first.");
                      }
                    }}
                  >
                    <Button className="w-full h-14 rounded-xl text-base font-semibold bg-rose-500 hover:bg-rose-600 transition-colors gap-2">
                      {listing.instantBook ? "Instant Book" : "Reserve"}
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
                        ₹{fmt(listing.basePrice)} × {nights} night{nights !== 1 ? "s" : ""}
                      </span>
                      <span>₹{fmt(baseTotal)}</span>
                    </div>
                    {listing.cleaningFee > 0 && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="underline decoration-gray-200 underline-offset-4">Cleaning fee</span>
                        <span>₹{fmt(listing.cleaningFee)}</span>
                      </div>
                    )}
                    {listing.securityDeposit > 0 && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="underline decoration-gray-200 underline-offset-4">Security deposit</span>
                        <span>₹{fmt(listing.securityDeposit)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="underline decoration-gray-200 underline-offset-4">Platform fee ({platformFeeRate}%)</span>
                      <span>₹{fmt(platformFee)}</span>
                    </div>
                    {listing.taxes > 0 && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="underline decoration-gray-200 underline-offset-4">Taxes ({listing.taxes}%)</span>
                        <span>₹{fmt(taxesTotal)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-gray-900 pt-3 border-t border-gray-200">
                      <span>Total</span>
                      <span>₹{fmt(grandTotal)}</span>
                    </div>
                  </div>

                  {/* Popular badge */}
                  {listing.avgRating >= 4.5 && listing.totalReviews > 10 && (
                    <div className="mt-6 flex gap-3 p-4 bg-rose-50 rounded-xl text-sm text-rose-800">
                      <Flame className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
                      <p>
                        <span className="font-semibold">Rare find.</span> This is one of the few places in {listing.city} with this rating!
                      </p>
                    </div>
                  )}
                </div>

                {/* Trust badge */}
                <div className="p-4 rounded-xl border border-gray-200 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Triptay Guarantee</p>
                    <p className="text-xs text-gray-500">
                      Every booking includes free protection from Host cancellations, listing inaccuracies, and other issues.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* SIMILAR PROPERTIES                                                */}
          {/* ================================================================ */}
          {similarProperties.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pt-16 mt-16 border-t border-gray-200"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Similar stays in {listing.city}
                </h2>
                <Link
                  href="/stays"
                  className="text-sm font-semibold text-gray-900 underline hover:no-underline flex items-center gap-1"
                >
                  Show all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarProperties.map((prop: ListingItem) => (
                  <ItemCard
                    key={prop.id}
                    id={prop.slug || prop.id}
                    title={prop.name}
                    location={`${prop.city}, ${prop.state}`}
                    price={prop.basePrice?.toLocaleString("en-IN")}
                    rating={prop.avgRating ? String(prop.avgRating) : "New"}
                    image={prop.media?.[0]?.url || ""}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
