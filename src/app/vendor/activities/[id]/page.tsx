"use client";

import { Navbar } from "@/components/navbar";
import { useState, useEffect, useCallback, use } from "react";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Pencil,
    Trash2,
    MapPin,
    Clock,
    Users,
    Shield,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Star,
    Calendar,
    Phone,
    Globe,
    Camera,
    Compass,
    Loader2,
    AlertCircle,
    LucideIcon,
    DollarSign,
    Clock3,
    CalendarDays,
    Timer,
    Gauge,
    Anchor,
    ListChecks,
    Ban,
    PawPrint,
    Eye,
    Building2,
    Navigation,
    Heart,
    type LucideProps,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VendorSidebar } from "@/components/navigation/vendor-sidebar";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NearbyPlace {
    name: string;
    distanceKm: number;
    category: string;
    description?: string;
}

interface HouseRule {
    rule: string;
    icon?: string;
}

interface MediaItem {
    _id: string;
    url: string;
    publicId: string;
    type: "photo" | "video";
    caption?: string;
    isCover: boolean;
    order: number;
}

interface SeasonalPrice {
    seasonName: string;
    startDate: string;
    endDate: string;
    pricePerPerson: number;
}

interface ActivityData {
    _id: string;
    name: string;
    slug: string;
    description: string;
    summary: string;
    activityType: string;
    difficulty: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates: { lat: number; lng: number };
    landmark?: string;
    meetingPoint?: string;
    durationHours: number;
    durationDays: number;
    startTimes: string[];
    availability: string;
    availabilityNotes?: string;
    minAge: number;
    maxGroupSize: number;
    minGroupSize: number;
    basePrice: number;
    weekendPrice?: number;
    childPrice?: number;
    foreignerPrice?: number;
    seasonalPrices: SeasonalPrice[];
    taxes: number;
    securityDeposit: number;
    equipmentProvided: string[];
    equipmentRequired: string[];
    safetyGuidelines: string;
    hasInsurance: boolean;
    certifiedGuides: boolean;
    guideRatio?: string;
    included: string[];
    excluded: string[];
    houseRules: HouseRule[];
    cancellationPolicy: string;
    cancellationDetails?: string;
    isPetFriendly: boolean;
    petRules?: string;
    restrictions?: string;
    nearbyPlaces: NearbyPlace[];
    media: MediaItem[];
    videoTourUrl?: string;
    instantBook: boolean;
    advanceNoticeHours: number;
    maxGuestsPerBooking: number;
    status: string;
    isActive: boolean;
    isFeatured: boolean;
    avgRating: number;
    totalReviews: number;
    languagesSpoken: string[];
    createdAt: string;
    updatedAt: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
    Rafting: "Rafting", Trekking: "Trekking", Paragliding: "Paragliding",
    Camping: "Camping", "Bungee Jumping": "Bungee Jumping", Skiing: "Skiing",
    "Scuba Diving": "Scuba Diving", Safari: "Safari", Cycling: "Cycling",
    Kayaking: "Kayaking", "Rock Climbing": "Rock Climbing", "Zip Lining": "Zip Lining",
    "Hot Air Balloon": "Hot Air Balloon", "Wildlife Safari": "Wildlife Safari",
    "Cultural Tour": "Cultural Tour", "Photography Tour": "Photography Tour",
    Fishing: "Fishing", Surfing: "Surfing", Caving: "Caving", Other: "Other",
};

const DIFFICULTY_COLORS: Record<string, string> = {
    Easy: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Moderate: "bg-amber-100 text-amber-800 border-amber-200",
    Challenging: "bg-orange-100 text-orange-800 border-orange-200",
    Extreme: "bg-red-100 text-red-800 border-red-200",
};

const CANCELLATION_COLORS: Record<string, string> = {
    Flexible: "bg-emerald-100 text-emerald-800",
    Moderate: "bg-amber-100 text-amber-800",
    Strict: "bg-orange-100 text-orange-800",
    "Non-Refundable": "bg-red-100 text-red-800",
};

const NEARBY_CATEGORY_ICONS: Record<string, string> = {
    Restaurant: "🍽️", Cafe: "☕", Market: "🛒", Hospital: "🏥", Pharmacy: "💊",
    ATM: "🏧", "Bus Stop": "🚌", "Railway Station": "🚂", Airport: "✈️",
    "Tourist Spot": "🎯", Trek: "🥾", Lake: "🌊", Temple: "🛕", Other: "📍",
};

// ─── Inline Icons ────────────────────────────────────────────────────────────

function DumbbellIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 6.5h11v11H6.5z" />
            <path d="M3 8.5v7" />
            <path d="M21 8.5v7" />
        </svg>
    );
}

function ArrowUpDownIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
            <path d="m5 12 7-7 7 7" />
        </svg>
    );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ViewActivityPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const router = useRouter();
    const [activity, setActivity] = useState<ActivityData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeImage, setActiveImage] = useState(0);
    const [showDelete, setShowDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // ─── Fetch ───────────────────────────────────────────────────────────────

    const fetchActivity = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/activities/${params.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.status === "success") {
                setActivity(json.data.activity);
            } else {
                setError(json.message || "Activity not found");
            }
        } catch {
            setError("Could not connect to server.");
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        fetchActivity();
    }, [fetchActivity]);

    // ─── Delete ──────────────────────────────────────────────────────────────

    const handleDelete = async () => {
        if (!activity) return;
        try {
            setIsDeleting(true);
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/activities/${activity._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.status === "success") {
                router.push("/vendor/activities");
            } else {
                alert(json.message || "Delete failed");
            }
        } catch {
            alert("Could not delete activity.");
        } finally {
            setIsDeleting(false);
        }
    };

    // ─── Helpers ─────────────────────────────────────────────────────────────

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "published":
                return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-bold uppercase tracking-wider rounded-lg border">Published</Badge>;
            case "draft":
                return <Badge className="bg-zinc-100 text-zinc-600 border-zinc-200 text-[10px] font-bold uppercase tracking-wider rounded-lg border">Draft</Badge>;
            case "unlisted":
                return <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px] font-bold uppercase tracking-wider rounded-lg border">Unlisted</Badge>;
            case "rejected":
                return <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] font-bold uppercase tracking-wider rounded-lg border">Rejected</Badge>;
            default:
                return null;
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
    };

    const formatDate = (d: string) => {
        return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    };

    const formatDuration = (hours: number, days: number) => {
        if (days > 0) return `${days}d ${hours > 0 ? `${hours}h` : ""}`;
        return `${hours}h`;
    };

    const sortedMedia = activity?.media ? [...activity.media].sort((a, b) => {
        if (a.isCover) return -1;
        if (b.isCover) return 1;
        return a.order - b.order;
    }) : [];

    const SectionHeader = ({ title, icon: Icon }: { title: string; icon: LucideIcon }) => (
        <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-black text-zinc-900">{title}</h3>
        </div>
    );

    const InfoRow = ({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) => (
        <div className={cn("flex items-center justify-between py-2.5 border-b border-zinc-50", className)}>
            <span className="text-xs text-zinc-500 font-medium">{label}</span>
            <span className="text-xs font-bold text-zinc-800 text-right">{value}</span>
        </div>
    );

    const BoolBadge = ({ val }: { val: boolean }) =>
        val ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" /> Yes
            </span>
        ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-full">
                <XCircle className="w-3 h-3" /> No
            </span>
        );

    // ─── Loading ─────────────────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
                <Navbar />
                <main className="flex-grow pt-20 pb-12 flex items-center justify-center">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center text-center space-y-4 max-w-sm">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-sm font-medium text-zinc-500">Loading activity…</p>
                    </motion.div>
                </main>
            </div>
        );
    }

    // ─── Error ───────────────────────────────────────────────────────────────

    if (error || !activity) {
        return (
            <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
                <Navbar />
                <main className="flex-grow pt-20 pb-12 flex items-center justify-center">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center text-center space-y-6 max-w-sm">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-zinc-800">Activity Not Found</p>
                            <p className="text-xs text-zinc-500 mt-1">{error || "This activity may have been removed."}</p>
                        </div>
                        <Button variant="outline" className="rounded-xl h-10 text-xs font-bold" onClick={() => router.push("/vendor/activities")}>
                            Back to Activities
                        </Button>
                    </motion.div>
                </main>
            </div>
        );
    }

    // ─── Render ──────────────────────────────────────────────────────────────

    return (
        <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
            <Navbar />

            <main className="flex-grow pt-20 pb-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <VendorSidebar />

                        <div className="flex-grow space-y-6">
                            <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
                                {/* ─── Breadcrumb & Actions ───────────────────────────────────── */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <Link href="/vendor/activities">
                                            <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold rounded-lg gap-1.5 text-zinc-500">
                                                <ChevronLeft className="w-3.5 h-3.5" />
                                                Activities
                                            </Button>
                                        </Link>
                                        <span className="text-zinc-300">/</span>
                                        <span className="text-xs font-bold text-zinc-800 truncate max-w-[200px]">{activity.name}</span>
                                        {getStatusBadge(activity.status)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/vendor/activities/edit/${activity._id}`}>
                                            <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold rounded-lg gap-1.5">
                                                <Pencil className="w-3.5 h-3.5" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-[11px] font-bold rounded-lg gap-1.5 text-red-500 border-red-200 hover:bg-red-50"
                                            onClick={() => setShowDelete(true)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>

                                {/* ─── Media Gallery ──────────────────────────────────────────── */}
                                {sortedMedia.length > 0 && (
                                    <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden mb-6">
                                        {/* Main Image */}
                                        <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-zinc-100">
                                            <img
                                                src={sortedMedia[activeImage]?.url}
                                                alt={sortedMedia[activeImage]?.caption || activity.name}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Nav Arrows */}
                                            {sortedMedia.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={() => setActiveImage((prev) => (prev === 0 ? sortedMedia.length - 1 : prev - 1))}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                                                    >
                                                        <ChevronLeft className="w-4 h-4 text-zinc-700" />
                                                    </button>
                                                    <button
                                                        onClick={() => setActiveImage((prev) => (prev === sortedMedia.length - 1 ? 0 : prev + 1))}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                                                    >
                                                        <ChevronRight className="w-4 h-4 text-zinc-700" />
                                                    </button>
                                                </>
                                            )}
                                            {/* Image counter */}
                                            <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                                                {activeImage + 1} / {sortedMedia.length}
                                            </span>
                                        </div>

                                        {/* Thumbnail Strip */}
                                        {sortedMedia.length > 1 && (
                                            <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
                                                {sortedMedia.map((m, i) => (
                                                    <button
                                                        key={m._id || i}
                                                        onClick={() => setActiveImage(i)}
                                                        className={cn(
                                                            "relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                                                            i === activeImage ? "border-primary shadow-md" : "border-transparent opacity-60 hover:opacity-100"
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

                                {/* ─── Two Column Layout ──────────────────────────────────────── */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Column - Details */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* ── Overview ─────────────────────────────────────────────── */}
                                        <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-2xl">{activity.activityType === "Rafting" ? "🛶" : activity.activityType === "Trekking" ? "🥾" : activity.activityType === "Paragliding" ? "🪂" : activity.activityType === "Camping" ? "⛺" : "🎯"}</span>
                                                <div>
                                                    <h1 className="text-lg font-black text-zinc-900">{activity.name}</h1>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[11px] font-bold text-zinc-500 uppercase">
                                                            {ACTIVITY_TYPE_LABELS[activity.activityType] || activity.activityType}
                                                        </span>
                                                        <span className="text-zinc-300">•</span>
                                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${DIFFICULTY_COLORS[activity.difficulty] || "bg-zinc-100 text-zinc-700"}`}>
                                                            {activity.difficulty}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-zinc-600 leading-relaxed">{activity.description}</p>

                                            {/* Quick Info Grid */}
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-zinc-50">
                                                <div className="text-center">
                                                    <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
                                                    <p className="text-[10px] text-zinc-500 font-medium">Duration</p>
                                                    <p className="text-xs font-black text-zinc-800">{formatDuration(activity.durationHours, activity.durationDays)}</p>
                                                </div>
                                                <div className="text-center">
                                                    <Users className="w-4 h-4 text-primary mx-auto mb-1" />
                                                    <p className="text-[10px] text-zinc-500 font-medium">Group Size</p>
                                                    <p className="text-xs font-black text-zinc-800">{activity.minGroupSize}-{activity.maxGroupSize}</p>
                                                </div>
                                                <div className="text-center">
                                                    <Gauge className="w-4 h-4 text-primary mx-auto mb-1" />
                                                    <p className="text-[10px] text-zinc-500 font-medium">Min Age</p>
                                                    <p className="text-xs font-black text-zinc-800">{activity.minAge}+ yrs</p>
                                                </div>
                                                <div className="text-center">
                                                    <CalendarDays className="w-4 h-4 text-primary mx-auto mb-1" />
                                                    <p className="text-[10px] text-zinc-500 font-medium">Availability</p>
                                                    <p className="text-xs font-black text-zinc-800">{activity.availability}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── Location ─────────────────────────────────────────────── */}
                                        <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                                            <SectionHeader title="Location" icon={MapPin} />
                                            <div className="space-y-3">
                                                <InfoRow label="Address" value={activity.address} />
                                                <InfoRow label="City" value={activity.city} />
                                                <InfoRow label="State" value={activity.state} />
                                                <InfoRow label="ZIP Code" value={activity.zipCode} />
                                                {activity.landmark && <InfoRow label="Landmark" value={activity.landmark} />}
                                                {activity.meetingPoint && <InfoRow label="Meeting Point" value={activity.meetingPoint} />}
                                            </div>

                                            {/* Nearby Places */}
                                            {activity.nearbyPlaces && activity.nearbyPlaces.length > 0 && (
                                                <div className="mt-5 pt-5 border-t border-zinc-50">
                                                    <h4 className="text-xs font-black text-zinc-800 mb-3">Nearby Places</h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {activity.nearbyPlaces.map((np, i) => (
                                                            <div key={i} className="flex items-center gap-2 bg-zinc-50 rounded-xl p-2.5">
                                                                <span className="text-lg">{NEARBY_CATEGORY_ICONS[np.category] || "📍"}</span>
                                                                <div className="min-w-0">
                                                                    <p className="text-[11px] font-bold text-zinc-800 truncate">{np.name}</p>
                                                                    <p className="text-[10px] text-zinc-500">{np.distanceKm} km • {np.category}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* ── Safety & Equipment ───────────────────────────────────── */}
                                        {(activity.equipmentProvided.length > 0 || activity.equipmentRequired.length > 0 || activity.safetyGuidelines) && (
                                            <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                                                <SectionHeader title="Safety & Equipment" icon={Shield} />

                                                {activity.equipmentProvided.length > 0 && (
                                                    <div className="mb-4">
                                                        <h4 className="text-[11px] font-black text-zinc-800 mb-2">Equipment Provided</h4>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {activity.equipmentProvided.map((item, i) => (
                                                                <span key={i} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                                                                    <CheckCircle className="w-3 h-3 inline mr-1" />
                                                                    {item}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {activity.equipmentRequired.length > 0 && (
                                                    <div className="mb-4">
                                                        <h4 className="text-[11px] font-black text-zinc-800 mb-2">What to Bring</h4>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {activity.equipmentRequired.map((item, i) => (
                                                                <span key={i} className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                                                                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                                                                    {item}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {activity.safetyGuidelines && (
                                                    <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-100">
                                                        <p className="text-[10px] font-black text-red-800 mb-1">Safety Guidelines</p>
                                                        <p className="text-[11px] text-red-700 leading-relaxed">{activity.safetyGuidelines}</p>
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap gap-3 mt-4">
                                                    <InfoRow label="Insurance" value={<BoolBadge val={activity.hasInsurance} />} className="flex-1 min-w-[120px]" />
                                                    <InfoRow label="Certified Guides" value={<BoolBadge val={activity.certifiedGuides} />} className="flex-1 min-w-[120px]" />
                                                    {activity.guideRatio && <InfoRow label="Guide Ratio" value={activity.guideRatio} className="flex-1 min-w-[120px]" />}
                                                </div>
                                            </div>
                                        )}

                                        {/* ── Inclusions & Exclusions ──────────────────────────────── */}
                                        {(activity.included.length > 0 || activity.excluded.length > 0) && (
                                            <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                                                <SectionHeader title="Inclusions & Exclusions" icon={ListChecks} />

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {activity.included.length > 0 && (
                                                        <div>
                                                            <h4 className="text-[11px] font-black text-emerald-800 mb-2 flex items-center gap-1">
                                                                <CheckCircle className="w-3.5 h-3.5" /> Included
                                                            </h4>
                                                            <ul className="space-y-1.5">
                                                                {activity.included.map((item, i) => (
                                                                    <li key={i} className="text-[11px] text-zinc-700 flex items-start gap-1.5">
                                                                        <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                                        {item}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {activity.excluded.length > 0 && (
                                                        <div>
                                                            <h4 className="text-[11px] font-black text-red-800 mb-2 flex items-center gap-1">
                                                                <XCircle className="w-3.5 h-3.5" /> Excluded
                                                            </h4>
                                                            <ul className="space-y-1.5">
                                                                {activity.excluded.map((item, i) => (
                                                                    <li key={i} className="text-[11px] text-zinc-700 flex items-start gap-1.5">
                                                                        <XCircle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                                                                        {item}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* ── House Rules ──────────────────────────────────────────── */}
                                        {(activity.houseRules.length > 0 || activity.restrictions) && (
                                            <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                                                <SectionHeader title="Rules & Policies" icon={Anchor} />

                                                <div className="flex flex-wrap gap-3 mb-3">
                                                    <InfoRow label="Cancellation" value={
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CANCELLATION_COLORS[activity.cancellationPolicy] || "bg-zinc-100 text-zinc-700"}`}>
                                                            {activity.cancellationPolicy}
                                                        </span>
                                                    } className="flex-1 min-w-[140px]" />
                                                    <InfoRow label="Pet Friendly" value={<BoolBadge val={activity.isPetFriendly} />} className="flex-1 min-w-[120px]" />
                                                </div>

                                                {activity.houseRules.length > 0 && (
                                                    <div className="mt-3">
                                                        <h4 className="text-[11px] font-black text-zinc-800 mb-2">Activity Rules</h4>
                                                        <ul className="space-y-1.5">
                                                            {activity.houseRules.map((r, i) => (
                                                                <li key={i} className="text-[11px] text-zinc-600 flex items-center gap-2">
                                                                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                                                    {r.rule}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {activity.restrictions && (
                                                    <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                                        <p className="text-[10px] font-black text-amber-800 mb-1">Restrictions</p>
                                                        <p className="text-[11px] text-amber-700 leading-relaxed">{activity.restrictions}</p>
                                                    </div>
                                                )}

                                                {activity.cancellationDetails && (
                                                    <div className="mt-3 p-3 bg-zinc-50 rounded-xl">
                                                        <p className="text-[10px] font-black text-zinc-800 mb-1">Cancellation Details</p>
                                                        <p className="text-[11px] text-zinc-600 leading-relaxed">{activity.cancellationDetails}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* ── Languages ────────────────────────────────────────────── */}
                                        {activity.languagesSpoken && activity.languagesSpoken.length > 0 && (
                                            <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                                                <SectionHeader title="Languages Spoken" icon={Globe} />
                                                <div className="flex flex-wrap gap-1.5">
                                                    {activity.languagesSpoken.map((lang) => (
                                                        <span key={lang} className="text-[10px] font-bold text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-full">
                                                            {lang}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column - Pricing & Booking Card */}
                                    <div className="space-y-6">
                                        {/* ── Pricing Card ─────────────────────────────────────────── */}
                                        <div className="bg-white rounded-2xl border border-zinc-100 p-6 sticky top-24">
                                            <SectionHeader title="Pricing" icon={DollarSign} />

                                            <div className="space-y-3">
                                                <div className="bg-primary/5 rounded-xl p-4 text-center">
                                                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Per Person</p>
                                                    <p className="text-2xl font-black text-primary">{formatPrice(activity.basePrice)}</p>
                                                </div>

                                                {activity.weekendPrice && activity.weekendPrice > 0 && (
                                                    <InfoRow label="Weekend Price" value={formatPrice(activity.weekendPrice)} />
                                                )}
                                                {activity.childPrice && activity.childPrice > 0 && (
                                                    <InfoRow label="Child Price" value={formatPrice(activity.childPrice)} />
                                                )}
                                                {activity.foreignerPrice && activity.foreignerPrice > 0 && (
                                                    <InfoRow label="Foreigner Price" value={formatPrice(activity.foreignerPrice)} />
                                                )}
                                                {activity.taxes > 0 && (
                                                    <InfoRow label="Taxes" value={`${activity.taxes}%`} />
                                                )}
                                                {activity.securityDeposit > 0 && (
                                                    <InfoRow label="Security Deposit" value={formatPrice(activity.securityDeposit)} />
                                                )}
                                            </div>

                                            {/* Seasonal Pricing */}
                                            {activity.seasonalPrices && activity.seasonalPrices.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-zinc-50">
                                                    <h4 className="text-[11px] font-black text-zinc-800 mb-2">Seasonal Pricing</h4>
                                                    <div className="space-y-2">
                                                        {activity.seasonalPrices.map((sp, i) => (
                                                            <div key={i} className="bg-zinc-50 rounded-xl p-3">
                                                                <p className="text-[11px] font-bold text-zinc-800">{sp.seasonName}</p>
                                                                <p className="text-[10px] text-zinc-500">
                                                                    {formatDate(sp.startDate)} – {formatDate(sp.endDate)}
                                                                </p>
                                                                <p className="text-sm font-black text-primary mt-1">{formatPrice(sp.pricePerPerson)} <span className="text-[10px] text-zinc-400">/ person</span></p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Booking Settings */}
                                            <div className="mt-4 pt-4 border-t border-zinc-50 space-y-2">
                                                <InfoRow label="Instant Book" value={<BoolBadge val={activity.instantBook} />} />
                                                <InfoRow label="Advance Notice" value={`${activity.advanceNoticeHours}h`} />
                                                <InfoRow label="Max Per Booking" value={`${activity.maxGuestsPerBooking} guests`} />
                                            </div>

                                            {/* Start Times */}
                                            {activity.startTimes && activity.startTimes.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-zinc-50">
                                                    <h4 className="text-[11px] font-black text-zinc-800 mb-2">Start Times</h4>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {activity.startTimes.map((t, i) => (
                                                            <span key={i} className="text-[10px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-full">
                                                                <Clock3 className="w-3 h-3 inline mr-1" />
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Ratings */}
                                            {activity.avgRating > 0 && (
                                                <div className="mt-4 pt-4 border-t border-zinc-50">
                                                    <div className="flex items-center gap-2">
                                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                        <span className="text-sm font-black text-zinc-800">{activity.avgRating.toFixed(1)}</span>
                                                        <span className="text-[11px] text-zinc-500">({activity.totalReviews} reviews)</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ─── Delete Confirmation Modal ──────────────────────────────────── */}
            <AnimatePresence>
                {showDelete && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50"
                            onClick={() => !isDeleting && setShowDelete(false)}
                        />
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
                                    <span className="font-bold text-zinc-700">"{activity.name}"</span>?
                                    This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-10 rounded-xl text-xs font-bold"
                                    onClick={() => setShowDelete(false)}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 h-10 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
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