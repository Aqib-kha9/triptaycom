"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
import {
    ArrowLeft,
    Edit2,
    Trash2,
    Home,
    MapPin,
    Star,
    Users,
    Bed,
    Bath,
    DollarSign,
    Clock,
    Shield,
    Wifi,
    Wind,
    Car,
    Tv,
    Waves,
    Utensils,
    Check,
    X,
    AlertCircle,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Coffee,
    Dog,
    Cigarette,
    Music,
    Languages,
    Flame,
    Shirt,
    Thermometer,
    Monitor,
    Lightbulb,
    Bookmark,
    Sparkles,
    Building2,
    Warehouse,
    Trees,
    Tent,
    TreePine,
    Ship,
    Calendar,
    Eye,
    Globe,
    Mountain,
    Camera,
    Landmark,
    Info,
    type LucideIcon,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { VendorSidebar } from "@/components/navigation/vendor-sidebar";

// ──────────────────────── Types ────────────────────────

interface NearbyPlace {
    name: string;
    distanceKm: number;
    category: string;
    description?: string;
}

interface MealOption {
    mealType: string;
    included: boolean;
    extraPrice: number;
    description?: string;
}

interface HouseRule {
    rule: string;
    icon?: string;
}

interface SeasonalPrice {
    seasonName: string;
    startDate: string;
    endDate: string;
    pricePerNight: number;
}

interface MediaItem {
    url: string;
    publicId: string;
    type: string;
    caption?: string;
    isCover: boolean;
    order: number;
}

interface ListingData {
    _id: string;
    host: string;
    name: string;
    slug: string;
    description: string;
    summary: string;
    propertyType: string;
    floorNumber?: number;
    totalFloors?: number;
    propertySizeSqFt?: number;
    yearBuilt?: number;
    isEntirePlace: boolean;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates: { lat: number; lng: number };
    landmark?: string;
    maxGuests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    extraMattresses?: number;
    basePrice: number;
    weekendPrice?: number;
    seasonalPrices: SeasonalPrice[];
    cleaningFee: number;
    securityDeposit: number;
    extraGuestPrice: number;
    taxes: number;
    minStay: number;
    maxStay: number;
    checkInTime: string;
    checkOutTime: string;
    flexibleCheckIn: boolean;
    flexibleCheckOut: boolean;
    amenities: string[];
    meals: MealOption[];
    hasKitchen: boolean;
    kitchenDetails?: string;
    houseRules: HouseRule[];
    cancellationPolicy: string;
    cancellationDetails?: string;
    isPetFriendly: boolean;
    petRules?: string;
    isSmokingAllowed: boolean;
    isPartyAllowed: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
    nearbyPlaces: NearbyPlace[];
    media: MediaItem[];
    videoTourUrl?: string;
    instantBook: boolean;
    advanceNoticeHours: number;
    maxGuestsPerBooking: number;
    status: string;
    languagesSpoken: string[];
    avgRating: number;
    totalReviews: number;
    createdAt: string;
    updatedAt: string;
}

// ──────────────────────── Icons ────────────────────────

function DumbbellIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 6.5h11" /><path d="M21 5.5v13" /><path d="M3 5.5v13" />
            <path d="M6.5 17.5h11" /><path d="M8 8.5v7" /><path d="M16 8.5v7" />
        </svg>
    );
}

function ArrowUpDownIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    );
}

// ──────────────────────── Amenity Map ────────────────────────

const AMENITY_ICONS: Record<string, LucideIcon> = {
    wifi: Wifi, ac: Wind, heating: Flame, parking: Car, pool: Waves,
    kitchen: Utensils, tv: Tv, washer: Shirt, dryer: Thermometer,
    workspace: Monitor, balcony: Mountain, garden: Trees, bbq: Flame,
    fireplace: Flame, hotTub: Waves, gym: DumbbellIcon as any,
    elevator: ArrowUpDownIcon as any, security: Shield, firstAid: Shield,
    fireExtinguisher: Shield, smokeAlarm: Shield, powerBackup: Lightbulb,
    hotWater: Thermometer, toiletries: Sparkles, linens: Bookmark,
    housekeeping: Sparkles, roomService: Coffee, pickup: Car, petsAllowed: Dog,
};

const AMENITY_LABELS: Record<string, string> = {
    wifi: "WiFi", ac: "Air Conditioning", heating: "Heating", parking: "Free Parking",
    pool: "Swimming Pool", kitchen: "Kitchen", tv: "TV / Cable", washer: "Washing Machine",
    dryer: "Dryer", workspace: "Dedicated Workspace", balcony: "Balcony / Terrace",
    garden: "Garden", bbq: "BBQ Grill", fireplace: "Fireplace", hotTub: "Hot Tub / Jacuzzi",
    gym: "Gym / Fitness", elevator: "Elevator", security: "Security Cameras",
    firstAid: "First Aid Kit", fireExtinguisher: "Fire Extinguisher", smokeAlarm: "Smoke Alarm",
    powerBackup: "Power Backup", hotWater: "Hot Water", toiletries: "Toiletries",
    linens: "Linens & Towels", housekeeping: "Housekeeping", roomService: "Room Service",
    pickup: "Airport Pickup", petsAllowed: "Pets Allowed",
};

// ──────────────────────── Main Component ────────────────────────

export default function ViewListingPage() {
    const params = useParams();
    const router = useRouter();
    const listingId = params.id as string;

    const [listing, setListing] = useState<ListingData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const fetchListing = useCallback(async () => {
        try {
            setIsLoading(true);
            setError("");
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/listings/${listingId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.status === "success") {
                setListing(json.data.listing);
            } else {
                setError(json.message || "Failed to load listing.");
            }
        } catch {
            setError("Could not connect to server.");
        } finally {
            setIsLoading(false);
        }
    }, [listingId]);

    useEffect(() => {
        fetchListing();
    }, [fetchListing]);

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
                router.push("/vendor/stays");
            }
        } catch {
            // silently fail
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const map: Record<string, string> = {
            published: "bg-emerald-50 text-emerald-600 border-emerald-200",
            draft: "bg-amber-50 text-amber-600 border-amber-200",
            unlisted: "bg-zinc-50 text-zinc-500 border-zinc-200",
            rejected: "bg-rose-50 text-rose-600 border-rose-200",
        };
        return cn(
            "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border",
            map[status] || "bg-zinc-50 text-zinc-400 border-zinc-200"
        );
    };

    const formatPrice = (n: number) => `₹${n?.toLocaleString("en-IN")}`;

    const formatDate = (d: string) => {
        if (!d) return "";
        return new Date(d).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
        });
    };

    const SectionHeader = ({ title, icon: Icon }: { title: string; icon: LucideIcon }) => (
        <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-sm font-bold text-zinc-900">{title}</h2>
        </div>
    );

    const InfoRow = ({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) => (
        <div className={cn("flex items-center justify-between py-2.5 border-b border-zinc-50 last:border-0", className)}>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{label}</span>
            <span className="text-xs font-semibold text-zinc-800 text-right max-w-[60%]">{value}</span>
        </div>
    );

    const BoolBadge = ({ val }: { val: boolean }) =>
        val ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3" /> Yes
            </span>
        ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-full">
                <X className="w-3 h-3" /> No
            </span>
        );

    // ── Loading ──
    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
                <Navbar />
                <main className="flex-grow pt-20 pb-12 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 text-zinc-300 animate-spin" />
                        <p className="text-xs text-zinc-500 font-medium">Loading listing details...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // ── Error ──
    if (error || !listing) {
        return (
            <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
                <Navbar />
                <main className="flex-grow pt-20 pb-12 flex items-center justify-center">
                    <div className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center text-center space-y-4 max-w-sm">
                        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-400">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-zinc-900">Failed to load</h3>
                            <p className="text-xs text-zinc-500 font-medium">{error || "Listing not found."}</p>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={fetchListing} variant="outline" className="rounded-xl h-10 text-xs font-bold">Retry</Button>
                            <Link href="/vendor/stays">
                                <Button className="rounded-xl h-10 text-xs font-bold">Back to Stays</Button>
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const coverUrl = listing.media?.find((m) => m.isCover)?.url || listing.media?.[0]?.url || "";
    const sortedMedia = [...(listing.media || [])].sort((a, b) => a.order - b.order);

    return (
        <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
            <Navbar />

            <main className="flex-grow pt-20 pb-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <VendorSidebar />

                        <div className="flex-grow space-y-6">
                            {/* ── Top Bar ── */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                                <div className="flex items-center gap-3">
                                    <Link href="/vendor/stays">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                                            <ArrowLeft className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    <div>
                                        <h1 className="text-xl font-bold text-zinc-900 truncate max-w-[300px]">{listing.name}</h1>
                                        <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">/{listing.slug}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={getStatusBadge(listing.status)}>{listing.status}</span>
                                    <Link href={`/vendor/listings/edit/${listing._id}`}>
                                        <Button variant="outline" className="rounded-xl h-9 text-xs font-bold gap-1.5">
                                            <Edit2 className="w-3.5 h-3.5" /> Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        onClick={() => setDeleteId(listing._id)}
                                        className="rounded-xl h-9 text-xs font-bold gap-1.5 text-rose-500 border-rose-200 hover:bg-rose-50"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </Button>
                                </div>
                            </div>

                            {/* ── Media Gallery ── */}
                            {sortedMedia.length > 0 && (
                                <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
                                    <div className="relative aspect-[16/7] bg-zinc-100 overflow-hidden">
                                        {coverUrl && activeImage === sortedMedia.findIndex((m) => m.isCover) ? (
                                            <img src={coverUrl} alt={listing.name} className="w-full h-full object-cover" />
                                        ) : sortedMedia[activeImage]?.url ? (
                                            <img src={sortedMedia[activeImage].url} alt={listing.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                                <Camera className="w-12 h-12" />
                                            </div>
                                        )}
                                        {sortedMedia.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => setActiveImage((prev) => (prev === 0 ? sortedMedia.length - 1 : prev - 1))}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-zinc-700 hover:bg-white transition-colors shadow-sm"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setActiveImage((prev) => (prev === sortedMedia.length - 1 ? 0 : prev + 1))}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-zinc-700 hover:bg-white transition-colors shadow-sm"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                            {sortedMedia.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setActiveImage(i)}
                                                    className={cn(
                                                        "w-1.5 h-1.5 rounded-full transition-all",
                                                        i === activeImage ? "bg-white w-4" : "bg-white/50"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {sortedMedia.length > 1 && (
                                        <div className="flex gap-2 p-3 overflow-x-auto">
                                            {sortedMedia.map((m, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setActiveImage(i)}
                                                    className={cn(
                                                        "relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                                                        i === activeImage ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-60 hover:opacity-100"
                                                    )}
                                                >
                                                    <img src={m.url} alt="" className="w-full h-full object-cover" />
                                                    {m.isCover && (
                                                        <span className="absolute bottom-0 inset-x-0 bg-primary/90 text-white text-[8px] font-black text-center py-0.5 truncate">
                                                            COVER
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* ── Left Column ── */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* ── Property Details ── */}
                                    <div className="bg-white rounded-2xl border border-zinc-100 p-5 sm:p-6">
                                        <SectionHeader title="Property Details" icon={Home} />
                                        <p className="text-xs text-zinc-600 leading-relaxed mb-4">{listing.description}</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                            <div className="bg-zinc-50 rounded-xl p-3 text-center">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Property Type</p>
                                                <p className="text-xs font-bold text-zinc-800 mt-0.5">{listing.propertyType}</p>
                                            </div>
                                            <div className="bg-zinc-50 rounded-xl p-3 text-center">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Place Type</p>
                                                <p className="text-xs font-bold text-zinc-800 mt-0.5">{listing.isEntirePlace ? "Entire Place" : "Shared"}</p>
                                            </div>
                                            {listing.floorNumber != null && (
                                                <div className="bg-zinc-50 rounded-xl p-3 text-center">
                                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Floor</p>
                                                    <p className="text-xs font-bold text-zinc-800 mt-0.5">{listing.floorNumber} / {listing.totalFloors}</p>
                                                </div>
                                            )}
                                            {listing.propertySizeSqFt && (
                                                <div className="bg-zinc-50 rounded-xl p-3 text-center">
                                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Size</p>
                                                    <p className="text-xs font-bold text-zinc-800 mt-0.5">{listing.propertySizeSqFt} sq.ft</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <InfoRow label="Bedrooms" value={`${listing.bedrooms}`} />
                                            <InfoRow label="Beds" value={`${listing.beds}`} />
                                            <InfoRow label="Bathrooms" value={`${listing.bathrooms}`} />
                                            <InfoRow label="Max Guests" value={`${listing.maxGuests}`} />
                                            {listing.extraMattresses != null && <InfoRow label="Extra Mattresses" value={`${listing.extraMattresses}`} />}
                                            {listing.yearBuilt && <InfoRow label="Year Built" value={`${listing.yearBuilt}`} />}
                                        </div>
                                    </div>

                                    {/* ── Location ── */}
                                    <div className="bg-white rounded-2xl border border-zinc-100 p-5 sm:p-6">
                                        <SectionHeader title="Location" icon={MapPin} />
                                        <div className="grid grid-cols-2 gap-2">
                                            <InfoRow label="Address" value={listing.address} />
                                            <InfoRow label="City" value={listing.city} />
                                            <InfoRow label="State" value={listing.state} />
                                            <InfoRow label="Country" value={listing.country} />
                                            <InfoRow label="ZIP Code" value={listing.zipCode} />
                                            <InfoRow label="GPS" value={`${listing.coordinates.lat.toFixed(4)}, ${listing.coordinates.lng.toFixed(4)}`} />
                                            {listing.landmark && <InfoRow label="Landmark" value={listing.landmark} />}
                                        </div>

                                        {/* Nearby Places */}
                                        {listing.nearbyPlaces && listing.nearbyPlaces.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-2">Nearby Places</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {listing.nearbyPlaces.map((np, i) => (
                                                        <div key={i} className="bg-zinc-50 rounded-lg px-3 py-2 flex items-center gap-2">
                                                            <Landmark className="w-3.5 h-3.5 text-zinc-400" />
                                                            <div>
                                                                <p className="text-[11px] font-bold text-zinc-700">{np.name}</p>
                                                                <p className="text-[9px] text-zinc-400 font-medium">{np.distanceKm} km — {np.category}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* ── Amenities ── */}
                                    {listing.amenities && listing.amenities.length > 0 && (
                                        <div className="bg-white rounded-2xl border border-zinc-100 p-5 sm:p-6">
                                            <SectionHeader title="Amenities" icon={Sparkles} />
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {listing.amenities.map((a) => {
                                                    const IconComp = AMENITY_ICONS[a] || Check;
                                                    return (
                                                        <div key={a} className="flex items-center gap-2 py-1.5 px-2">
                                                            <IconComp className="w-3.5 h-3.5 text-primary" />
                                                            <span className="text-[11px] font-medium text-zinc-700">{AMENITY_LABELS[a] || a}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Food & Dining ── */}
                                    <div className="bg-white rounded-2xl border border-zinc-100 p-5 sm:p-6">
                                        <SectionHeader title="Food & Dining" icon={Utensils} />
                                        <div className="space-y-2">
                                            <InfoRow label="Kitchen" value={<BoolBadge val={listing.hasKitchen} />} />
                                            {listing.kitchenDetails && <InfoRow label="Kitchen Details" value={listing.kitchenDetails} />}
                                        </div>
                                        {listing.meals && listing.meals.length > 0 && (
                                            <div className="mt-4 space-y-2">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-2">Meal Options</p>
                                                {listing.meals.map((m, i) => (
                                                    <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-50 last:border-0">
                                                        <div className="flex items-center gap-2">
                                                            <Coffee className="w-3.5 h-3.5 text-zinc-400" />
                                                            <span className="text-[11px] font-bold text-zinc-700">{m.mealType}</span>
                                                            <BoolBadge val={m.included} />
                                                        </div>
                                                        <span className="text-[11px] font-semibold text-zinc-500">
                                                            {m.included ? "Included" : `+${formatPrice(m.extraPrice)}`}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* ── House Rules ── */}
                                    <div className="bg-white rounded-2xl border border-zinc-100 p-5 sm:p-6">
                                        <SectionHeader title="House Rules & Policies" icon={Shield} />
                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            <InfoRow label="Pets Allowed" value={<BoolBadge val={listing.isPetFriendly} />} />
                                            {listing.petRules && <InfoRow label="Pet Rules" value={listing.petRules} />}
                                            <InfoRow label="Smoking" value={<BoolBadge val={listing.isSmokingAllowed} />} />
                                            <InfoRow label="Parties" value={<BoolBadge val={listing.isPartyAllowed} />} />
                                            {listing.quietHoursStart && (
                                                <InfoRow label="Quiet Hours" value={`${listing.quietHoursStart} – ${listing.quietHoursEnd}`} />
                                            )}
                                            <InfoRow label="Cancellation" value={listing.cancellationPolicy} />
                                            {listing.cancellationDetails && <InfoRow label="Policy Details" value={listing.cancellationDetails} />}
                                        </div>
                                        {listing.houseRules && listing.houseRules.length > 0 && (
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-2">Rules</p>
                                                {listing.houseRules.map((r, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-[11px] font-medium text-zinc-600">
                                                        <Info className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                                                        {r.rule}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* ── Languages ── */}
                                    {listing.languagesSpoken && listing.languagesSpoken.length > 0 && (
                                        <div className="bg-white rounded-2xl border border-zinc-100 p-5 sm:p-6">
                                            <SectionHeader title="Languages Spoken" icon={Languages} />
                                            <div className="flex flex-wrap gap-2">
                                                {listing.languagesSpoken.map((lang) => (
                                                    <span key={lang} className="text-[10px] font-bold text-zinc-600 bg-zinc-50 px-3 py-1.5 rounded-full">
                                                        {lang}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* ── Right Column ── */}
                                <div className="space-y-6">
                                    {/* ── Pricing Card ── */}
                                    <div className="bg-white rounded-2xl border border-zinc-100 p-5 sm:p-6 sticky top-24">
                                        <SectionHeader title="Pricing" icon={DollarSign} />
                                        <div className="space-y-2">
                                            <InfoRow label="Base Price" value={<span className="text-sm font-black text-primary">{formatPrice(listing.basePrice)}<span className="text-[10px] font-medium text-zinc-400">/night</span></span>} />
                                            {listing.weekendPrice && <InfoRow label="Weekend Price" value={`${formatPrice(listing.weekendPrice)}/night`} />}
                                            <InfoRow label="Cleaning Fee" value={listing.cleaningFee > 0 ? formatPrice(listing.cleaningFee) : "Free"} />
                                            <InfoRow label="Security Deposit" value={listing.securityDeposit > 0 ? formatPrice(listing.securityDeposit) : "None"} />
                                            <InfoRow label="Extra Guest" value={`${formatPrice(listing.extraGuestPrice)}/person`} />
                                            <InfoRow label="Taxes" value={`${listing.taxes}%`} />
                                        </div>

                                        {listing.seasonalPrices && listing.seasonalPrices.length > 0 && (
                                            <div className="mt-4 space-y-2">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-2">Seasonal Pricing</p>
                                                {listing.seasonalPrices.map((sp, i) => (
                                                    <div key={i} className="bg-zinc-50 rounded-lg p-2.5">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[11px] font-bold text-zinc-700">{sp.seasonName}</span>
                                                            <span className="text-[11px] font-black text-primary">{formatPrice(sp.pricePerNight)}</span>
                                                        </div>
                                                        <p className="text-[9px] text-zinc-400 font-medium mt-0.5">
                                                            {formatDate(sp.startDate)} – {formatDate(sp.endDate)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <hr className="my-4 border-zinc-50" />

                                        <div className="space-y-2">
                                            <InfoRow label="Min Stay" value={`${listing.minStay} night${listing.minStay > 1 ? "s" : ""}`} />
                                            <InfoRow label="Max Stay" value={listing.maxStay > 0 ? `${listing.maxStay} nights` : "No limit"} />
                                            <InfoRow label="Check-in" value={listing.checkInTime} />
                                            <InfoRow label="Check-out" value={listing.checkOutTime} />
                                            <InfoRow label="Flexible Check-in" value={<BoolBadge val={listing.flexibleCheckIn} />} />
                                            <InfoRow label="Flexible Check-out" value={<BoolBadge val={listing.flexibleCheckOut} />} />
                                        </div>

                                        <hr className="my-4 border-zinc-50" />

                                        <div className="space-y-2">
                                            <InfoRow label="Instant Book" value={<BoolBadge val={listing.instantBook} />} />
                                            <InfoRow label="Advance Notice" value={`${listing.advanceNoticeHours}h`} />
                                            <InfoRow label="Max Per Booking" value={`${listing.maxGuestsPerBooking} guests`} />
                                        </div>

                                        {listing.videoTourUrl && (
                                            <div className="mt-4">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">Video Tour</p>
                                                <a href={listing.videoTourUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-primary break-all hover:underline">
                                                    {listing.videoTourUrl}
                                                </a>
                                            </div>
                                        )}

                                        <div className="mt-4 pt-3 border-t border-zinc-50">
                                            <p className="text-[9px] text-zinc-400 font-medium">
                                                Created: {formatDate(listing.createdAt)}<br />
                                                Updated: {formatDate(listing.updatedAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* ── Delete Confirmation Modal ── */}
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
                                <h3 className="text-lg font-bold text-zinc-900">Delete "{listing.name}"?</h3>
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
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}