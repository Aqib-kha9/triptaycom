"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/cards";
import { useWishlist } from "@/context/WishlistContext";
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
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ── TypeScript Interfaces ──

interface ListingDetail {
  _id: string;
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
  host: { _id: string; name: string; avatar?: string; email?: string; phone?: string } | null;
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

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [guestCount, setGuestCount] = useState(2);
  const [similarProperties, setSimilarProperties] = useState<any[]>([]);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showFullGallery, setShowFullGallery] = useState(false);

  // ── Fetch listing detail ──
  useEffect(() => {
    let cancelled = false;

    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/public/listing/${params.id}`);
        const json = await res.json().catch(() => null);

        if (!cancelled) {
          if (json?.status === "success" && json.data?.listing) {
            setListing(json.data.listing);
            const l = json.data.listing;
            fetchSimilar(l.city, l._id);
          } else {
            setError(json?.message || "Stay not found.");
          }
        }
      } catch {
        if (!cancelled) setError("Unable to load stay details. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function fetchSimilar(city: string, excludeId: string) {
      try {
        const res = await fetch(
          `${API_BASE}/listings/browse?city=${encodeURIComponent(city)}&limit=3&sort=-avgRating`
        );
        const json = await res.json().catch(() => null);
        if (!cancelled && json?.status === "success" && Array.isArray(json.data?.listings)) {
          setSimilarProperties(
            json.data.listings.filter((l: any) => l._id !== excludeId).slice(0, 3)
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
            <p className="text-gray-600 font-semibold text-lg">Loading stay details...</p>
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
            className="text-center space-y-5 max-w-md"
          >
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-gray-800 font-semibold text-xl">{error || "Stay not found"}</p>
            <p className="text-gray-500 text-sm">
              The stay you're looking for may have been removed or is no longer available.
            </p>
            <Link href="/stays">
              <Button variant="outline" className="rounded-xl mt-2 gap-2 h-12 px-6 font-semibold">
                <ArrowLeft className="w-4 h-4" /> Browse all stays
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
                  alt={listing.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Side images */}
              {images.slice(1, 5).map((img, i) => (
                <div key={i} className="relative overflow-hidden cursor-pointer">
                  <img
                    src={img}
                    alt={`${listing.name} - ${i + 2}`}
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
              {/* Title */}
              <h1 className="text-2xl md:text-[26px] font-semibold text-gray-900 leading-tight">
                {listing.name}
              </h1>

              {/* Sub‑row: rating + location + badges */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-current text-gray-900" />
                  <span className="font-semibold">{listing.avgRating?.toFixed(1) || "New"}</span>
                  {listing.totalReviews > 0 && (
                    <>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500 underline cursor-pointer hover:text-gray-700">
                        {listing.totalReviews} review{listing.totalReviews !== 1 ? "s" : ""}
                      </span>
                    </>
                  )}
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
                onClick={() => toggleWishlist(listing?._id || params.id, "stay")}
                className={cn(
                  "rounded-xl gap-2 font-semibold text-sm transition-colors",
                  isWishlisted(listing?._id || params.id, "stay") && "text-rose-500 border-rose-200 bg-rose-50 hover:bg-rose-100"
                )}
              >
                <Heart className={cn("w-4 h-4", isWishlisted(listing?._id || params.id, "stay") && "fill-rose-500")} />
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
                  <Button variant="outline" className="rounded-xl font-semibold text-sm gap-2 sm:ml-auto">
                    <MessageCircle className="w-4 h-4" /> Message Host
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
                    {listing.meals && listing.meals.length > 0 && (
                      <div className="space-y-3">
                        {listing.meals.map((meal) => (
                          <div key={meal.mealType} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                            <div>
                              <p className="font-semibold text-gray-900">{meal.mealType}</p>
                              {meal.description && (
                                <p className="text-sm text-gray-500">{meal.description}</p>
                              )}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {meal.included ? (
                                <span className="text-emerald-600">Included</span>
                              ) : (
                                `₹${meal.extraPrice?.toLocaleString("en-IN")}`
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
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

              {/* ── Nearby Places ── */}
              {listing.nearbyPlaces && listing.nearbyPlaces.length > 0 && (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Nearby Places
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {listing.nearbyPlaces.map((place, i) => (
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
                                {place.distanceKm} km away
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                            {place.category}
                          </span>
                        </div>
                      ))}
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
                      {listing.seasonalPrices.map((sp, i) => (
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
                            ₹{sp.pricePerNight.toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
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
                  <div className="h-[350px] w-full rounded-2xl bg-gray-100 overflow-hidden border border-gray-200">
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="text-center">
                        <div className="bg-rose-100 p-4 rounded-full inline-block mb-3">
                          <MapPin className="w-6 h-6 text-rose-500" />
                        </div>
                        <p className="font-semibold text-gray-700">{listing.city}, {listing.state}</p>
                        <p className="text-sm text-gray-500 mt-1 max-w-[250px] mx-auto">
                          {listing.address}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Exact location provided after booking
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                      <div className="flex-1 p-3">
                        <p className="text-[10px] font-semibold uppercase text-gray-500 mb-0.5">Check-in</p>
                        <p className="text-sm text-gray-900">{listing.checkInTime}</p>
                      </div>
                      <div className="flex-1 p-3">
                        <p className="text-[10px] font-semibold uppercase text-gray-500 mb-0.5">Check-out</p>
                        <p className="text-sm text-gray-900">{listing.checkOutTime}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-300 p-3 flex items-center justify-between">
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
                  </div>

                  {/* Book button */}
                  <Link href={`/checkout/stay/${listing.slug || listing._id}`} className="block">
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
                        ₹{fmt(listing.basePrice)} × {listing.minStay} night{listing.minStay > 1 ? "s" : ""}
                      </span>
                      <span>₹{fmt(listing.basePrice * listing.minStay)}</span>
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
                      <span className="underline decoration-gray-200 underline-offset-4">Platform fee</span>
                      <span>₹{fmt(Math.round(listing.basePrice * listing.minStay * 0.05))}</span>
                    </div>
                    {listing.taxes > 0 && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="underline decoration-gray-200 underline-offset-4">Taxes ({listing.taxes}%)</span>
                        <span>₹{fmt(Math.round((listing.basePrice * listing.minStay + listing.cleaningFee) * listing.taxes / 100))}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-gray-900 pt-3 border-t border-gray-200">
                      <span>Total</span>
                      <span>
                        ₹{fmt(
                          Math.round(
                            listing.basePrice * listing.minStay +
                            listing.cleaningFee +
                            listing.basePrice * listing.minStay * 0.05 +
                            ((listing.basePrice * listing.minStay + listing.cleaningFee) * (listing.taxes || 0)) / 100
                          )
                        )}
                      </span>
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
                {similarProperties.map((prop: any) => (
                  <ItemCard
                    key={prop._id}
                    id={prop.slug || prop._id}
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
