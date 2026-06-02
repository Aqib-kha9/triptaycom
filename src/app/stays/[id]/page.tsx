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
  basePrice: number;
  weekendPrice?: number;
  effectiveWeekendPrice: number;
  avgRating: number;
  totalReviews: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
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
  isSmokingAllowed: boolean;
  isPartyAllowed: boolean;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  cancellationDetails?: string;
  cleaningFee: number;
  securityDeposit: number;
  taxes: number;
  minStay: number;
  instantBook: boolean;
  isEntirePlace: boolean;
  languagesSpoken: string[];
  seasonalPrices: { seasonName: string; startDate: string; endDate: string; pricePerNight: number }[];
  videoTourUrl?: string;
  landmark?: string;
}

// ── Amenity Icon Map ──

const amenityIconMap: Record<string, React.ReactNode> = {
  "wifi": <Wifi className="w-5 h-5" />,
  "tv": <Tv className="w-5 h-5" />,
  "kitchen": <Utensils className="w-5 h-5" />,
  "parking": <Car className="w-5 h-5" />,
  "ac": <Wind className="w-5 h-5" />,
  "heater": <Sparkles className="w-5 h-5" />,
  "coffee": <Coffee className="w-5 h-5" />,
  "workspace": <Home className="w-5 h-5" />,
};

function getAmenityIcon(name: string): React.ReactNode {
  const key = name.toLowerCase().replace(/[^a-z]/g, "");
  for (const [k, icon] of Object.entries(amenityIconMap)) {
    if (key.includes(k)) return icon;
  }
  return <Check className="w-5 h-5" />;
}

// ── Nearby Category Badge Color ──

function getCategoryColor(cat: string): string {
  const map: Record<string, string> = {
    "Restaurant": "bg-orange-50 text-orange-600 border-orange-100",
    "Cafe": "bg-amber-50 text-amber-600 border-amber-100",
    "Market": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Hospital": "bg-red-50 text-red-600 border-red-100",
    "Tourist Spot": "bg-blue-50 text-blue-600 border-blue-100",
    "Trek": "bg-green-50 text-green-600 border-green-100",
    "Lake": "bg-cyan-50 text-cyan-600 border-cyan-100",
    "Temple": "bg-purple-50 text-purple-600 border-purple-100",
  };
  return map[cat] || "bg-zinc-50 text-zinc-500 border-zinc-100";
}

// ── Main Component ──

export default function StayDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [guestCount, setGuestCount] = useState(2);
  const [similarProperties, setSimilarProperties] = useState<any[]>([]);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

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
            // Fetch similar properties
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
        const res = await fetch(`${API_BASE}/listings/browse?city=${encodeURIComponent(city)}&limit=3&sort=-avgRating`);
        const json = await res.json().catch(() => null);
        if (!cancelled && json?.status === "success" && Array.isArray(json.data?.listings)) {
          setSimilarProperties(
            json.data.listings.filter((l: any) => l._id !== excludeId).slice(0, 3)
          );
        }
      } catch { /* ignore */ }
    }

    fetchDetail();
    return () => { cancelled = true; };
  }, [params.id]);

  // ── Derived values ──
  const images = listing?.media?.map((m) => m.url) ?? [];
  const coverImage = images[activeImageIdx] || images[0] || "";
  const displayAmenities = showAllAmenities
    ? (listing?.amenities ?? [])
    : (listing?.amenities ?? []).slice(0, 8);
  const hasMoreAmenities = (listing?.amenities?.length ?? 0) > 8;

  // ── Loading State ──
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
            <p className="text-zinc-500 font-medium">Loading stay details...</p>
          </div>
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
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-zinc-400" />
            </div>
            <p className="text-zinc-600 font-bold text-lg">{error || "Stay not found"}</p>
            <p className="text-zinc-400 text-sm">The stay you're looking for may have been removed or is no longer available.</p>
            <Link href="/stays">
              <Button variant="outline" className="rounded-xl mt-2 gap-2">Browse other stays</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* ── Header Section ── */}
        <div className="container mx-auto px-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-3">{listing.name}</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm font-bold">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span>{listing.avgRating?.toFixed(1) || "New"}</span>
                  {listing.totalReviews > 0 && (
                    <span className="text-zinc-400 font-medium underline">({listing.totalReviews} reviews)</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 uppercase tracking-widest text-[10px]">Verified Property</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <span className="underline text-zinc-600 font-medium">{listing.city}, {listing.state}, {listing.country}</span>
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
          </motion.div>
        </div>

        {/* ── Image Gallery ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="container mx-auto px-4 mb-16"
        >
          {images.length > 0 ? (
            <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[400px] md:h-[600px] rounded-[40px] overflow-hidden relative group shadow-2xl shadow-zinc-200">
              <div className="col-span-2 row-span-2 relative overflow-hidden">
                <img
                  src={images[activeImageIdx] || images[0]}
                  alt={listing.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer"
                />
              </div>
              {images.slice(1, 5).map((img, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden cursor-pointer"
                  onClick={() => setActiveImageIdx(i + 1)}
                >
                  <img src={img} alt={`${listing.name} ${i + 2}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
              {images.length > 5 && (
                <Button
                  onClick={() => setActiveImageIdx((activeImageIdx + 1) % images.length)}
                  className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md hover:bg-white text-zinc-900 font-bold border border-zinc-200 rounded-2xl px-6 py-6 shadow-2xl shadow-black/10 transition-all"
                >
                  Show all {images.length} photos
                </Button>
              )}
            </div>
          ) : (
            <div className="h-[400px] md:h-[600px] rounded-[40px] bg-zinc-100 flex items-center justify-center shadow-2xl shadow-zinc-200">
              <div className="text-center text-zinc-300">
                <Inbox className="w-16 h-16 mx-auto mb-2" />
                <p className="font-medium">No photos available</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Content Section ── */}
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-20 relative">

            {/* ── Left Column: Info ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:flex-[1.5] space-y-16"
            >
              {/* Host & Overview */}
              <div className="flex items-start justify-between pb-12 border-b border-zinc-100">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-zinc-900">
                    {listing.isEntirePlace ? "Entire" : "Private room in"} {listing.city} {listing.host ? `with ${listing.host.name}` : ""}
                  </h2>
                  <div className="flex items-center gap-4 text-zinc-500 font-medium">
                    <span>{listing.maxGuests} guests</span>
                    <span>•</span>
                    <span>{listing.bedrooms} bedroom{listing.bedrooms !== 1 ? "s" : ""}</span>
                    <span>•</span>
                    <span>{listing.beds} bed{listing.beds !== 1 ? "s" : ""}</span>
                    <span>•</span>
                    <span>{listing.bathrooms} bathroom{listing.bathrooms !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                {listing.host && (
                  <div className="relative group flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-zinc-100 overflow-hidden ring-4 ring-zinc-50 shadow-lg">
                      {listing.host.avatar ? (
                        <img src={listing.host.avatar} alt={listing.host.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-xl">
                          {listing.host.name?.charAt(0)?.toUpperCase() || "H"}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full border-4 border-white flex items-center justify-center text-white">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>

              {/* Highlights Bento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-[32px] bg-zinc-50 border border-zinc-100 flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 mb-1">
                      {listing.avgRating >= 4.5 ? "Highly Rated" : "Great Stay"}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      {listing.totalReviews > 0
                        ? `Rated ${listing.avgRating?.toFixed(1)} by ${listing.totalReviews} guests.`
                        : "Be one of the first to experience this stay."}
                    </p>
                  </div>
                </div>
                <div className="p-8 rounded-[32px] bg-zinc-50 border border-zinc-100 flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 mb-1">{listing.city}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      {listing.landmark ? `Near ${listing.landmark}` : `Located in ${listing.state}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Property Info Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <Bed className="w-5 h-5" />, label: "Bedrooms", value: listing.bedrooms },
                  { icon: <Bath className="w-5 h-5" />, label: "Bathrooms", value: listing.bathrooms },
                  { icon: <Users className="w-5 h-5" />, label: "Max Guests", value: listing.maxGuests },
                  { icon: <Home className="w-5 h-5" />, label: "Type", value: listing.propertyType },
                ].map((item) => (
                  <div key={item.label} className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 text-center">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary mx-auto mb-2 shadow-sm">
                      {item.icon}
                    </div>
                    <p className="text-lg font-black text-zinc-900">{item.value}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Check-in / Check-out */}
              <div className="flex gap-6 p-6 rounded-3xl bg-zinc-50 border border-zinc-100">
                <div className="flex-1 flex items-center gap-4">
                  <Clock className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Check-in</p>
                    <p className="font-bold text-zinc-900">{listing.checkInTime}</p>
                  </div>
                </div>
                <div className="w-px bg-zinc-200" />
                <div className="flex-1 flex items-center gap-4">
                  <Clock className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Checkout</p>
                    <p className="font-bold text-zinc-900">{listing.checkOutTime}</p>
                  </div>
                </div>
                <div className="w-px bg-zinc-200" />
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Min Stay</p>
                  <p className="font-bold text-zinc-900">{listing.minStay} night{listing.minStay > 1 ? "s" : ""}</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-zinc-900">About this {listing.propertyType}</h2>
                <p className="text-zinc-600 leading-relaxed text-lg font-medium whitespace-pre-line">
                  {listing.description || listing.summary || "No description available."}
                </p>
                {listing.languagesSpoken?.length > 0 && (
                  <p className="text-sm text-zinc-400 font-medium">
                    Host speaks: {listing.languagesSpoken.join(", ")}
                  </p>
                )}
              </div>

              {/* Amenities Section */}
              <div className="space-y-8 pt-12 border-t border-zinc-100">
                <h2 className="text-2xl font-bold text-zinc-900">What this place offers</h2>
                {listing.amenities && listing.amenities.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                      {displayAmenities.map((item, i) => (
                        <div key={i} className="flex items-center gap-6 text-zinc-600">
                          <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                            {getAmenityIcon(item)}
                          </div>
                          <span className="font-bold capitalize">{item}</span>
                        </div>
                      ))}
                    </div>
                    {hasMoreAmenities && (
                      <Button
                        variant="outline"
                        onClick={() => setShowAllAmenities(!showAllAmenities)}
                        className="rounded-2xl px-10 h-16 font-bold border-zinc-200 hover:bg-zinc-50"
                      >
                        {showAllAmenities ? "Show fewer" : `Show all ${listing.amenities.length} amenities`}
                      </Button>
                    )}
                  </>
                ) : (
                  <p className="text-zinc-400 text-sm">No amenities listed.</p>
                )}
              </div>

              {/* Food Options */}
              {listing.meals && listing.meals.length > 0 && (
                <div className="space-y-8 pt-12 border-t border-zinc-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-zinc-900">Food Options</h2>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                      {listing.hasKitchen ? "Kitchen Available" : "Optional Add-ons"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {listing.meals.map((meal) => (
                      <div key={meal.mealType} className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-zinc-900">{meal.mealType}</h4>
                          {meal.included ? (
                            <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">Included</span>
                          ) : (
                            <span className="text-primary font-bold">₹{meal.extraPrice.toLocaleString("en-IN")}</span>
                          )}
                        </div>
                        {meal.description && (
                          <p className="text-xs text-zinc-500 font-medium leading-relaxed">{meal.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* House Rules */}
              {listing.houseRules && listing.houseRules.length > 0 && (
                <div className="space-y-8 pt-12 border-t border-zinc-100">
                  <h2 className="text-2xl font-bold text-zinc-900">House Rules</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listing.houseRules.map((rule, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary">
                          <Check className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm text-zinc-700">{rule.rule}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {listing.isPetFriendly && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                        <Dog className="w-4 h-4" /> Pet Friendly
                      </span>
                    )}
                    {listing.isSmokingAllowed && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                        <Cigarette className="w-4 h-4" /> Smoking Allowed
                      </span>
                    )}
                    {!listing.isPartyAllowed && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                        <X className="w-4 h-4" /> No Parties
                      </span>
                    )}
                  </div>
                  <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Cancellation Policy</p>
                    <p className="font-bold text-zinc-900">{listing.cancellationPolicy}</p>
                    {listing.cancellationDetails && (
                      <p className="text-xs text-zinc-500 mt-1">{listing.cancellationDetails}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Map Section */}
              {listing.coordinates && (
                <div className="space-y-8 pt-12 border-t border-zinc-100">
                  <h2 className="text-2xl font-bold text-zinc-900">Where you'll be</h2>
                  <div className="h-[400px] w-full rounded-[40px] bg-zinc-100 overflow-hidden relative border border-zinc-100">
                    <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="bg-primary/20 p-6 rounded-full inline-block mb-4 animate-pulse">
                          <MapPin className="w-8 h-8 text-primary" />
                        </div>
                        <p className="font-bold text-zinc-600">{listing.city}, {listing.state}</p>
                        <p className="text-xs text-zinc-400 mt-1">{listing.address}</p>
                      </div>
                    </div>
                    <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-zinc-100 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-zinc-900">{listing.city}, {listing.state}</p>
                        <p className="text-xs text-zinc-500 font-medium">{listing.landmark ? `Near ${listing.landmark}` : "Detailed location after booking"}</p>
                      </div>
                      <Button variant="ghost" className="font-bold text-primary">Get Directions</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Nearby Places */}
              {listing.nearbyPlaces && listing.nearbyPlaces.length > 0 && (
                <div className="space-y-8 pt-12 border-t border-zinc-100">
                  <h2 className="text-2xl font-bold text-zinc-900">Nearby Places</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listing.nearbyPlaces.map((place, i) => (
                      <div
                        key={i}
                        className="p-6 rounded-2xl border border-zinc-100 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 text-sm">{place.name}</p>
                            <p className="text-xs text-zinc-400 font-medium">{place.distanceKm} km away</p>
                          </div>
                        </div>
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border", getCategoryColor(place.category))}>
                          {place.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Seasonal Prices */}
              {listing.seasonalPrices && listing.seasonalPrices.length > 0 && (
                <div className="space-y-8 pt-12 border-t border-zinc-100">
                  <h2 className="text-2xl font-bold text-zinc-900">Seasonal Rates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listing.seasonalPrices.map((sp, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-zinc-900">{sp.seasonName}</p>
                          <p className="text-xs text-zinc-400">
                            {new Date(sp.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} –{" "}
                            {new Date(sp.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </p>
                        </div>
                        <span className="text-primary font-black text-lg">₹{sp.pricePerNight.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>

            {/* ── Right Column: Sticky Booking Card ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:flex-1"
            >
              <div className="sticky top-28 space-y-6">
                <div className="bg-white border border-zinc-100 rounded-[40px] p-8 shadow-2xl shadow-zinc-200/50 space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-12 translate-x-12 blur-2xl" />

                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-3xl font-black text-zinc-900">₹{listing.basePrice.toLocaleString("en-IN")}</span>
                      <span className="text-zinc-500 font-bold text-sm ml-1">/ night</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold bg-zinc-50 px-3 py-1.5 rounded-full">
                      <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                      <span>{listing.avgRating?.toFixed(1) || "New"}</span>
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">Property Type</p>
                    <p className="text-xs font-bold text-zinc-800">{listing.propertyType} • {listing.isEntirePlace ? "Entire Place" : "Private Room"}</p>
                  </div>

                  {/* Booking Form */}
                  <div className="space-y-4">
                    <div className="border border-zinc-100 rounded-3xl overflow-hidden divide-y divide-zinc-50 bg-zinc-50/50">
                      <div className="flex divide-x divide-zinc-50">
                        <div className="flex-1 p-5 cursor-pointer hover:bg-zinc-50 transition-colors">
                          <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest mb-1">Check-in</p>
                          <p className="text-sm font-bold text-zinc-900">{listing.checkInTime}</p>
                        </div>
                        <div className="flex-1 p-5 cursor-pointer hover:bg-zinc-50 transition-colors">
                          <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest mb-1">Checkout</p>
                          <p className="text-sm font-bold text-zinc-900">{listing.checkOutTime}</p>
                        </div>
                      </div>
                      <div className="p-5 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest mb-1">Guests</p>
                          <p className="text-sm font-bold text-zinc-900">
                            {guestCount} {guestCount === 1 ? "guest" : "guests"} (max {listing.maxGuests})
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-8 h-8 rounded-full p-0"
                            onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                          >
                            −
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-8 h-8 rounded-full p-0"
                            onClick={() => setGuestCount(Math.min(listing.maxGuests, guestCount + 1))}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Link href={`/checkout/stay/${listing.slug || listing._id}`} className="block">
                      <Button className="w-full h-16 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 gap-2 group">
                        {listing.instantBook ? "Instant Book" : "Request to Book"}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>

                  <p className="text-center text-zinc-400 text-xs font-medium">You won't be charged until next step</p>

                  {/* Price Breakdown */}
                  <div className="space-y-4 pt-6 border-t border-zinc-50">
                    <div className="flex justify-between text-zinc-500 font-medium text-sm">
                      <span className="underline">₹{listing.basePrice.toLocaleString("en-IN")} x {listing.minStay} night{listing.minStay > 1 ? "s" : ""}</span>
                      <span>₹{(listing.basePrice * listing.minStay).toLocaleString("en-IN")}</span>
                    </div>
                    {listing.cleaningFee > 0 && (
                      <div className="flex justify-between text-zinc-500 font-medium text-sm">
                        <span className="underline">Cleaning Fee</span>
                        <span>₹{listing.cleaningFee.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-zinc-500 font-medium text-sm">
                      <span className="underline">Platform Fee</span>
                      <span>₹{Math.round(listing.basePrice * listing.minStay * 0.05).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-zinc-900 font-bold pt-4 text-xl">
                      <span>Total</span>
                      <span>₹{Math.round((listing.basePrice * listing.minStay) + listing.cleaningFee + (listing.basePrice * listing.minStay * 0.05)).toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {listing.avgRating >= 4.5 && listing.totalReviews > 10 && (
                    <div className="flex gap-4 p-5 bg-amber-50/50 rounded-3xl border border-amber-100 text-[11px] leading-relaxed text-amber-900 font-medium">
                      <Info className="w-5 h-5 flex-shrink-0 text-amber-500" />
                      <p>Highly in demand! This is a popular stay in {listing.city}.</p>
                    </div>
                  )}
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
            </motion.div>

          </div>

          {/* Similar Properties Section */}
          <AnimatePresence>
            {similarProperties.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="pt-24 border-t border-zinc-100 space-y-12 mt-24"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-zinc-900">Similar properties in {listing.city}</h2>
                  <Link href="/stays" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                    Explore all <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {similarProperties.map((prop: any) => (
                    <ItemCard
                      key={prop._id}
                      id={prop.slug || prop._id}
                      title={prop.name}
                      location={`${prop.city}, ${prop.state}`}
                      price={prop.basePrice?.toLocaleString("en-IN")}
                      rating={prop.avgRating || 0}
                      image={prop.media?.[0]?.url || ""}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
