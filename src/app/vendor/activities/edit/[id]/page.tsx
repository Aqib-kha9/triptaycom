"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    X,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
    CheckCircle,
    XCircle,
    Upload,
    Star,
    Camera,
    Trash2,
    ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type ActivityType =
    | "Rafting" | "Trekking" | "Paragliding" | "Camping" | "Bungee Jumping"
    | "Skiing" | "Scuba Diving" | "Safari" | "Cycling" | "Kayaking"
    | "Rock Climbing" | "Zip Lining" | "Hot Air Balloon" | "Wildlife Safari"
    | "Cultural Tour" | "Photography Tour" | "Fishing" | "Surfing" | "Caving" | "Other";

type Difficulty = "Easy" | "Moderate" | "Challenging" | "Extreme";
type AvailabilityType = "Daily" | "Weekdays" | "Weekends" | "Custom";
type CancellationPolicy = "Flexible" | "Moderate" | "Strict" | "Non-Refundable";

interface NearbyPlace {
    name: string;
    distanceKm: string;
    category: string;
    description: string;
}

interface HouseRule {
    rule: string;
    icon: string;
}

interface SeasonalPrice {
    seasonName: string;
    startDate: string;
    endDate: string;
    pricePerPerson: string;
}

interface FormData {
    name: string;
    summary: string;
    description: string;
    activityType: ActivityType;
    difficulty: Difficulty;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    landmark: string;
    meetingPoint: string;
    lat: string;
    lng: string;
    durationHours: string;
    durationDays: string;
    startTimes: string[];
    availability: AvailabilityType;
    availabilityNotes: string;
    minAge: string;
    maxGroupSize: string;
    minGroupSize: string;
    basePrice: string;
    weekendPrice: string;
    childPrice: string;
    foreignerPrice: string;
    seasonalPrices: SeasonalPrice[];
    taxes: string;
    securityDeposit: string;
    equipmentProvided: string[];
    equipmentRequired: string[];
    safetyGuidelines: string;
    hasInsurance: boolean;
    certifiedGuides: boolean;
    guideRatio: string;
    included: string[];
    excluded: string[];
    houseRules: HouseRule[];
    cancellationPolicy: CancellationPolicy;
    cancellationDetails: string;
    isPetFriendly: boolean;
    petRules: string;
    restrictions: string;
    instantBook: boolean;
    advanceNoticeHours: string;
    maxGuestsPerBooking: string;
    languagesSpoken: string[];
    videoTourUrl: string;
}

interface MediaPreview {
    file: File;
    preview: string;
    isCover: boolean;
    caption: string;
}

interface ExistingMedia {
    _id: string;
    url: string;
    publicId: string;
    isCover: boolean;
    caption: string;
    type: string;
    order: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STEPS = [
    { id: 1, label: "Basics" },
    { id: 2, label: "Location" },
    { id: 3, label: "Duration & Pricing" },
    { id: 4, label: "Safety & Equipment" },
    { id: 5, label: "Inclusions & Rules" },
    { id: 6, label: "Booking Settings" },
    { id: 7, label: "Media & Publish" },
];

const ACTIVITY_TYPES: { value: ActivityType; icon: string }[] = [
    { value: "Rafting", icon: "🛶" }, { value: "Trekking", icon: "🥾" },
    { value: "Paragliding", icon: "🪂" }, { value: "Camping", icon: "⛺" },
    { value: "Bungee Jumping", icon: "🪢" }, { value: "Skiing", icon: "⛷️" },
    { value: "Scuba Diving", icon: "🤿" }, { value: "Safari", icon: "🦁" },
    { value: "Cycling", icon: "🚴" }, { value: "Kayaking", icon: "🛶" },
    { value: "Rock Climbing", icon: "🧗" }, { value: "Zip Lining", icon: "🪶" },
    { value: "Hot Air Balloon", icon: "🎈" }, { value: "Wildlife Safari", icon: "🐘" },
    { value: "Cultural Tour", icon: "🏛️" }, { value: "Photography Tour", icon: "📸" },
    { value: "Fishing", icon: "🎣" }, { value: "Surfing", icon: "🏄" },
    { value: "Caving", icon: "🕳️" }, { value: "Other", icon: "🎯" },
];

const DIFFICULTY_LEVELS: { value: Difficulty; color: string }[] = [
    { value: "Easy", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    { value: "Moderate", color: "bg-amber-100 text-amber-800 border-amber-200" },
    { value: "Challenging", color: "bg-orange-100 text-orange-800 border-orange-200" },
    { value: "Extreme", color: "bg-red-100 text-red-800 border-red-200" },
];

const AVAILABILITY_OPTIONS: AvailabilityType[] = ["Daily", "Weekdays", "Weekends", "Custom"];
const CANCELLATION_POLICIES: { value: CancellationPolicy; description: string }[] = [
    { value: "Flexible", description: "Free cancellation up to 24h before" },
    { value: "Moderate", description: "Free cancellation up to 3 days before" },
    { value: "Strict", description: "50% refund up to 7 days before" },
    { value: "Non-Refundable", description: "No refunds on cancellation" },
];

const LANGUAGES = [
    "English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati",
    "Kannada", "Malayalam", "Punjabi", "Urdu", "Odia", "Assamese", "Rajasthani",
    "Nepali", "French", "German", "Spanish", "Japanese",
];

const COMMON_HOUSE_RULES = [
    "Follow guide instructions at all times",
    "No alcohol before or during activity",
    "Wear appropriate clothing and footwear",
    "Arrive 30 minutes before start time",
    "Pregnant women not allowed",
    "Medical conditions must be disclosed",
    "Weight limit: 100kg",
    "Minimum age strictly enforced",
];

const NEARBY_CATEGORIES = [
    "Restaurant", "Cafe", "Market", "Hospital", "Pharmacy",
    "ATM", "Bus Stop", "Railway Station", "Airport",
    "Tourist Spot", "Trek", "Lake", "Temple", "Other",
];

// ─── Inline Icons ────────────────────────────────────────────────────────────

function DumbbellIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 6.5h11v11H6.5z" /><path d="M3 8.5v7" /><path d="M21 8.5v7" />
        </svg>
    );
}

function ArrowUpDownIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" /><path d="m19 12-7 7-7-7" /><path d="m5 12 7-7 7 7" />
        </svg>
    );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function EditActivityPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const router = useRouter();

    const [step, setStep] = useState(1);
    const totalSteps = STEPS.length;
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        name: "", summary: "", description: "", activityType: "Rafting", difficulty: "Moderate",
        address: "", city: "", state: "", country: "India", zipCode: "", landmark: "", meetingPoint: "",
        lat: "", lng: "", durationHours: "3", durationDays: "0", startTimes: [],
        availability: "Daily", availabilityNotes: "", minAge: "12", maxGroupSize: "20", minGroupSize: "2",
        basePrice: "", weekendPrice: "", childPrice: "", foreignerPrice: "", seasonalPrices: [],
        taxes: "0", securityDeposit: "0", equipmentProvided: [], equipmentRequired: [],
        safetyGuidelines: "", hasInsurance: true, certifiedGuides: true, guideRatio: "1:5",
        included: [], excluded: [], houseRules: [], cancellationPolicy: "Moderate",
        cancellationDetails: "", isPetFriendly: false, petRules: "", restrictions: "",
        instantBook: false, advanceNoticeHours: "24", maxGuestsPerBooking: "20",
        languagesSpoken: ["English", "Hindi"], videoTourUrl: "",
    });

    const [existingMedia, setExistingMedia] = useState<ExistingMedia[]>([]);
    const [mediaFiles, setMediaFiles] = useState<MediaPreview[]>([]);
    const [mediaToDelete, setMediaToDelete] = useState<string[]>([]);

    // ─── Fetch Existing Activity ──────────────────────────────────────────────

    const fetchActivity = useCallback(async () => {
        try {
            setIsLoading(true);
            setLoadError("");
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/activities/${params.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.status === "success") {
                const a = json.data.activity;
                setFormData({
                    name: a.name || "", summary: a.summary || "", description: a.description || "",
                    activityType: a.activityType || "Rafting", difficulty: a.difficulty || "Moderate",
                    address: a.address || "", city: a.city || "", state: a.state || "",
                    country: a.country || "India", zipCode: a.zipCode || "",
                    landmark: a.landmark || "", meetingPoint: a.meetingPoint || "",
                    lat: a.coordinates?.lat?.toString() || "", lng: a.coordinates?.lng?.toString() || "",
                    durationHours: a.durationHours?.toString() || "3",
                    durationDays: a.durationDays?.toString() || "0",
                    startTimes: a.startTimes || [],
                    availability: a.availability || "Daily",
                    availabilityNotes: a.availabilityNotes || "",
                    minAge: a.minAge?.toString() || "12",
                    maxGroupSize: a.maxGroupSize?.toString() || "20",
                    minGroupSize: a.minGroupSize?.toString() || "2",
                    basePrice: a.basePrice?.toString() || "",
                    weekendPrice: a.weekendPrice?.toString() || "",
                    childPrice: a.childPrice?.toString() || "",
                    foreignerPrice: a.foreignerPrice?.toString() || "",
                    seasonalPrices: (a.seasonalPrices || []).map((sp: any) => ({
                        seasonName: sp.seasonName || "",
                        startDate: sp.startDate ? new Date(sp.startDate).toISOString().split("T")[0] : "",
                        endDate: sp.endDate ? new Date(sp.endDate).toISOString().split("T")[0] : "",
                        pricePerPerson: sp.pricePerPerson?.toString() || "",
                    })),
                    taxes: a.taxes?.toString() || "0",
                    securityDeposit: a.securityDeposit?.toString() || "0",
                    equipmentProvided: a.equipmentProvided || [],
                    equipmentRequired: a.equipmentRequired || [],
                    safetyGuidelines: a.safetyGuidelines || "",
                    hasInsurance: a.hasInsurance ?? true,
                    certifiedGuides: a.certifiedGuides ?? true,
                    guideRatio: a.guideRatio || "1:5",
                    included: a.included || [],
                    excluded: a.excluded || [],
                    houseRules: a.houseRules || [],
                    cancellationPolicy: a.cancellationPolicy || "Moderate",
                    cancellationDetails: a.cancellationDetails || "",
                    isPetFriendly: a.isPetFriendly ?? false,
                    petRules: a.petRules || "",
                    restrictions: a.restrictions || "",
                    instantBook: a.instantBook ?? false,
                    advanceNoticeHours: a.advanceNoticeHours?.toString() || "24",
                    maxGuestsPerBooking: a.maxGuestsPerBooking?.toString() || "20",
                    languagesSpoken: a.languagesSpoken || ["English", "Hindi"],
                    videoTourUrl: a.videoTourUrl || "",
                });
                setExistingMedia(a.media || []);
            } else {
                setLoadError(json.message || "Activity not found");
            }
        } catch {
            setLoadError("Could not connect to server.");
        } finally {
            setIsLoading(false);
        }
    }, [params.id]);

    useEffect(() => { fetchActivity(); }, [fetchActivity]);

    // ─── Helpers ──────────────────────────────────────────────────────────────

    const update = (field: keyof FormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    };

    const toggleLanguage = (lang: string) => {
        setFormData((prev) => ({
            ...prev,
            languagesSpoken: prev.languagesSpoken.includes(lang)
                ? prev.languagesSpoken.filter((l) => l !== lang)
                : [...prev.languagesSpoken, lang],
        }));
    };

    const addStartTime = (time: string) => {
        if (!time.trim()) return;
        setFormData((prev) => ({ ...prev, startTimes: [...prev.startTimes, time.trim()] }));
    };
    const removeStartTime = (index: number) => {
        setFormData((prev) => ({ ...prev, startTimes: prev.startTimes.filter((_, i) => i !== index) }));
    };

    const addNearbyPlace = () => {
        setFormData((prev) => ({
            ...prev,
            nearbyPlaces: [...(prev as any).nearbyPlaces || [], { name: "", distanceKm: "", category: "Restaurant", description: "" }],
        }));
    };
    const removeNearbyPlace = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            nearbyPlaces: ((prev as any).nearbyPlaces || []).filter((_: any, i: number) => i !== index),
        }));
    };
    const updateNearby = (index: number, field: keyof NearbyPlace, value: any) => {
        setFormData((prev) => {
            const arr = [...((prev as any).nearbyPlaces || [])];
            (arr[index] as any)[field] = value;
            return { ...prev, nearbyPlaces: arr };
        });
    };

    const addSeasonalPrice = () => {
        setFormData((prev) => ({
            ...prev,
            seasonalPrices: [...prev.seasonalPrices, { seasonName: "", startDate: "", endDate: "", pricePerPerson: "" }],
        }));
    };
    const removeSeasonalPrice = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            seasonalPrices: prev.seasonalPrices.filter((_, i) => i !== index),
        }));
    };
    const updateSeasonal = (index: number, field: keyof SeasonalPrice, value: any) => {
        setFormData((prev) => {
            const arr = [...prev.seasonalPrices];
            arr[index] = { ...arr[index], [field]: value };
            return { ...prev, seasonalPrices: arr };
        });
    };

    const addListItem = (field: "equipmentProvided" | "equipmentRequired" | "included" | "excluded", value: string) => {
        if (!value.trim()) return;
        setFormData((prev) => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    };
    const removeListItem = (field: "equipmentProvided" | "equipmentRequired" | "included" | "excluded", index: number) => {
        setFormData((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    };

    const addHouseRule = (rule: string) => {
        if (!rule.trim()) return;
        setFormData((prev) => ({ ...prev, houseRules: [...prev.houseRules, { rule: rule.trim(), icon: "" }] }));
    };
    const removeHouseRule = (index: number) => {
        setFormData((prev) => ({ ...prev, houseRules: prev.houseRules.filter((_, i) => i !== index) }));
    };

    // ─── Media Handling ───────────────────────────────────────────────────────

    const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newFiles: MediaPreview[] = files.map((f) => ({
            file: f,
            preview: URL.createObjectURL(f),
            isCover: false,
            caption: "",
        }));
        setMediaFiles((prev) => [...prev, ...newFiles]);
        if (e.target) e.target.value = "";
    };
    const removeNewMedia = (index: number) => {
        setMediaFiles((prev) => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };
    const setNewCover = (index: number) => {
        setMediaFiles((prev) => prev.map((m, i) => ({ ...m, isCover: i === index })));
        setExistingMedia((prev) => prev.map((m) => ({ ...m, isCover: false })));
    };
    const updateNewCaption = (index: number, caption: string) => {
        setMediaFiles((prev) => prev.map((m, i) => (i === index ? { ...m, caption } : m)));
    };

    const removeExistingMedia = (index: number) => {
        const m = existingMedia[index];
        setMediaToDelete((prev) => [...prev, m.publicId]);
        setExistingMedia((prev) => prev.filter((_, i) => i !== index));
    };
    const setExistingCover = (index: number) => {
        setExistingMedia((prev) => prev.map((m, i) => ({ ...m, isCover: i === index })));
        setMediaFiles((prev) => prev.map((m) => ({ ...m, isCover: false })));
    };
    const updateExistingCaption = (index: number, caption: string) => {
        setExistingMedia((prev) => prev.map((m, i) => (i === index ? { ...m, caption } : m)));
    };

    // ─── Validation ───────────────────────────────────────────────────────────

    const validateStep = (): boolean => {
        const errs: Record<string, string> = {};
        const fd = formData;

        if (step === 1) {
            if (!fd.name.trim()) errs.name = "Activity name is required";
            if (!fd.summary.trim()) errs.summary = "Summary is required";
            if (!fd.description.trim()) errs.description = "Description is required";
            if (!fd.activityType) errs.activityType = "Select an activity type";
            if (!fd.difficulty) errs.difficulty = "Select difficulty level";
        }
        if (step === 2) {
            if (!fd.address.trim()) errs.address = "Address is required";
            if (!fd.city.trim()) errs.city = "City is required";
            if (!fd.state.trim()) errs.state = "State is required";
            if (!fd.zipCode.trim()) errs.zipCode = "ZIP code is required";
            if (!fd.lat.trim()) errs.lat = "Latitude is required";
            if (!fd.lng.trim()) errs.lng = "Longitude is required";
        }
        if (step === 3) {
            if (!fd.basePrice.trim() || isNaN(Number(fd.basePrice)) || Number(fd.basePrice) <= 0)
                errs.basePrice = "Valid base price required";
            if (!fd.maxGroupSize.trim() || isNaN(Number(fd.maxGroupSize)) || Number(fd.maxGroupSize) <= 0)
                errs.maxGroupSize = "Valid max group size required";
            if (!fd.durationHours.trim() || isNaN(Number(fd.durationHours)) || Number(fd.durationHours) <= 0)
                errs.durationHours = "Valid duration required";
        }
        if (step === 4) {
            if (!fd.safetyGuidelines.trim()) errs.safetyGuidelines = "Safety guidelines are required";
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, totalSteps)); };
    const prev = () => setStep((s) => Math.max(s - 1, 1));

    // ─── Submit ───────────────────────────────────────────────────────────────

    const handleSubmit = async () => {
        if (!validateStep()) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");

            // 1) Update activity
            const payload: any = {
                name: formData.name.trim(),
                summary: formData.summary.trim(),
                description: formData.description.trim(),
                activityType: formData.activityType,
                difficulty: formData.difficulty,
                address: formData.address.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                country: formData.country.trim(),
                zipCode: formData.zipCode.trim(),
                landmark: formData.landmark.trim() || undefined,
                meetingPoint: formData.meetingPoint.trim() || undefined,
                coordinates: { lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) },
                durationHours: parseInt(formData.durationHours) || 0,
                durationDays: parseInt(formData.durationDays) || 0,
                startTimes: formData.startTimes,
                availability: formData.availability,
                availabilityNotes: formData.availabilityNotes.trim() || undefined,
                minAge: parseInt(formData.minAge) || 0,
                maxGroupSize: parseInt(formData.maxGroupSize) || 0,
                minGroupSize: parseInt(formData.minGroupSize) || 0,
                basePrice: parseFloat(formData.basePrice) || 0,
                weekendPrice: formData.weekendPrice ? parseFloat(formData.weekendPrice) : undefined,
                childPrice: formData.childPrice ? parseFloat(formData.childPrice) : undefined,
                foreignerPrice: formData.foreignerPrice ? parseFloat(formData.foreignerPrice) : undefined,
                seasonalPrices: formData.seasonalPrices.map((sp) => ({
                    seasonName: sp.seasonName,
                    startDate: sp.startDate,
                    endDate: sp.endDate,
                    pricePerPerson: parseFloat(sp.pricePerPerson) || 0,
                })),
                taxes: parseFloat(formData.taxes) || 0,
                securityDeposit: parseFloat(formData.securityDeposit) || 0,
                equipmentProvided: formData.equipmentProvided,
                equipmentRequired: formData.equipmentRequired,
                safetyGuidelines: formData.safetyGuidelines.trim(),
                hasInsurance: formData.hasInsurance,
                certifiedGuides: formData.certifiedGuides,
                guideRatio: formData.guideRatio.trim() || undefined,
                included: formData.included,
                excluded: formData.excluded,
                houseRules: formData.houseRules,
                cancellationPolicy: formData.cancellationPolicy,
                cancellationDetails: formData.cancellationDetails.trim() || undefined,
                isPetFriendly: formData.isPetFriendly,
                petRules: formData.petRules.trim() || undefined,
                restrictions: formData.restrictions.trim() || undefined,
                nearbyPlaces: ((formData as any).nearbyPlaces || []).map((np: any) => ({
                    name: np.name,
                    distanceKm: parseFloat(np.distanceKm) || 0,
                    category: np.category,
                    description: np.description || undefined,
                })),
                instantBook: formData.instantBook,
                advanceNoticeHours: parseInt(formData.advanceNoticeHours) || 24,
                maxGuestsPerBooking: parseInt(formData.maxGuestsPerBooking) || 20,
                languagesSpoken: formData.languagesSpoken,
                videoTourUrl: formData.videoTourUrl.trim() || undefined,
            };

            const res = await fetch(`http://localhost:5000/api/activities/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (json.status !== "success") throw new Error(json.message || "Update failed");

            // 2) Delete removed media
            for (const publicId of mediaToDelete) {
                await fetch(`http://localhost:5000/api/activities/${params.id}/media/${publicId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            // 3) Upload new media
            if (mediaFiles.length > 0) {
                const formData2 = new FormData();
                mediaFiles.forEach((m) => {
                    formData2.append("files", m.file);
                    formData2.append("captions", m.caption);
                    formData2.append("isCover", m.isCover ? "true" : "false");
                });
                await fetch(`http://localhost:5000/api/activities/${params.id}/media`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData2,
                });
            }

            setIsSuccess(true);
        } catch (err: any) {
            alert(err.message || "Failed to update activity");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Render Helpers ───────────────────────────────────────────────────────

    const fieldError = (field: string) =>
        errors[field] ? (
            <p className="text-[10px] font-bold text-red-500 mt-1">{errors[field]}</p>
        ) : null;

    const renderStepIndicator = () => (
        <>
            {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center gap-1.5">
                    <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all",
                        step > s.id ? "bg-primary border-primary text-white" :
                            step === s.id ? "bg-primary text-white border-primary" :
                                "bg-white text-zinc-400 border-zinc-200"
                    )}>
                        {step > s.id ? <CheckCircle className="w-3 h-3" /> : s.id}
                    </div>
                    <span className={cn("text-[10px] font-bold hidden sm:block", step === s.id ? "text-primary" : "text-zinc-400")}>
                        {s.label}
                    </span>
                    {i < STEPS.length - 1 && <div className={cn("w-5 h-0.5 hidden sm:block", step > s.id ? "bg-primary" : "bg-zinc-200")} />}
                </div>
            ))}
        </>
    );

    const renderSectionHeader = (title: string, subtitle: string) => (
        <div className="mb-6">
            <h2 className="text-base font-black text-zinc-900">{title}</h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">{subtitle}</p>
        </div>
    );

    const renderInput = (
        label: string, field: keyof FormData, placeholder: string,
        type = "text", required = false
    ) => (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-700">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
                <Input
                    type={type}
                    value={formData[field] as string}
                    onChange={(e) => update(field, e.target.value)}
                    placeholder={placeholder}
                    className={cn("h-11 rounded-xl text-xs", errors[field] && "border-red-400 focus:ring-red-400")}
                />
            </div>
            {fieldError(field)}
        </div>
    );

    const renderToggle = (label: string, field: keyof FormData, description?: string) => (
        <div className="flex items-center justify-between py-3 px-4 bg-zinc-50 rounded-xl">
            <div>
                <span className="text-[11px] font-bold text-zinc-800">{label}</span>
                {description && <p className="text-[10px] text-zinc-500">{description}</p>}
            </div>
            <button
                type="button"
                onClick={() => update(field, !formData[field])}
                className={cn("relative w-10 h-5 rounded-full transition-colors", formData[field] ? "bg-primary" : "bg-zinc-300")}
            >
                <span className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform", formData[field] ? "left-5" : "left-0.5")} />
            </button>
        </div>
    );

    // ─── Loading ──────────────────────────────────────────────────────────────

    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
                <Navbar />
                <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center text-center space-y-4 max-w-sm">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-sm font-medium text-zinc-500">Loading activity…</p>
                    </motion.div>
                </main>
                <Footer />
            </div>
        );
    }

    // ─── Error ────────────────────────────────────────────────────────────────

    if (loadError) {
        return (
            <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
                <Navbar />
                <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center text-center space-y-6 max-w-sm">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-zinc-800">Failed to Load</p>
                            <p className="text-xs text-zinc-500 mt-1">{loadError}</p>
                        </div>
                        <Button variant="outline" className="rounded-xl h-10 text-xs font-bold" onClick={() => router.push("/vendor/activities")}>
                            Back to Activities
                        </Button>
                    </motion.div>
                </main>
                <Footer />
            </div>
        );
    }

    // ─── Success ──────────────────────────────────────────────────────────────

    if (isSuccess) {
        return (
            <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
                <Navbar />
                <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center text-center space-y-6 max-w-sm">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-zinc-900">Activity Updated!</h2>
                            <p className="text-xs text-zinc-500 mt-1">Your changes have been saved successfully.</p>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <Button variant="outline" className="rounded-xl h-10 text-xs font-bold" onClick={() => router.push("/vendor/activities")}>
                                Back to Activities
                            </Button>
                            <Button className="rounded-xl h-10 text-xs font-bold" onClick={() => router.push(`/vendor/activities/${params.id}`)}>
                                View Activity
                            </Button>
                        </div>
                    </motion.div>
                </main>
                <Footer />
            </div>
        );
    }

    // ─── Main Form ────────────────────────────────────────────────────────────

    return (
        <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
            <Navbar />

            <main className="flex-grow pt-24 pb-20">
                <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
                    {/* Back Link */}
                    <div className="flex justify-end mb-4">
                        <Button variant="ghost" className="h-8 text-[11px] font-bold rounded-lg gap-1.5 text-zinc-500" onClick={() => router.push(`/vendor/activities/${params.id}`)}>
                            <ChevronLeft className="w-3.5 h-3.5" /> Cancel
                        </Button>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-center gap-0 sm:gap-4 mb-10 overflow-x-auto">
                        {renderStepIndicator()}
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-10">
                        <AnimatePresence mode="wait">
                            <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">

                                {/* ─── Step 1: Basics ──────────────────────────────────── */}
                                {step === 1 && (
                                    <>
                                        {renderSectionHeader("Activity Basics", "Name and describe your experience.")}
                                        {renderInput("Activity Name", "name", "e.g. Ganga River Rafting", "text", true)}
                                        {renderInput("Summary", "summary", "A short, exciting tagline...", "text", true)}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-zinc-700">Description <span className="text-red-400">*</span></label>
                                            <Textarea value={formData.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe the thrill..." className={cn("h-28 rounded-xl text-xs", errors.description && "border-red-400")} />
                                            {fieldError("description")}
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold text-zinc-700 mb-2 block">Activity Type</label>
                                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                                {ACTIVITY_TYPES.map((at) => (
                                                    <button key={at.value} type="button" onClick={() => update("activityType", at.value)}
                                                        className={cn("flex flex-col items-center gap-1 p-2 rounded-xl border text-[10px] font-bold transition-all",
                                                            formData.activityType === at.value ? "border-primary bg-primary/5 text-primary" : "border-zinc-200 text-zinc-500 hover:border-zinc-300")}>
                                                        <span className="text-lg">{at.icon}</span>{at.value}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold text-zinc-700 mb-2 block">Difficulty Level</label>
                                            <div className="flex gap-2">
                                                {DIFFICULTY_LEVELS.map((dl) => (
                                                    <button key={dl.value} type="button" onClick={() => update("difficulty", dl.value)}
                                                        className={cn("flex-1 py-2.5 rounded-xl text-[11px] font-black border transition-all",
                                                            formData.difficulty === dl.value ? dl.color + " border-current" : "bg-zinc-50 text-zinc-500 border-zinc-200")}>
                                                        {dl.value}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold text-zinc-700 mb-2 block">Languages Spoken</label>
                                            <div className="flex flex-wrap gap-1.5">
                                                {LANGUAGES.map((lang) => (
                                                    <button key={lang} type="button" onClick={() => toggleLanguage(lang)}
                                                        className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all",
                                                            formData.languagesSpoken.includes(lang) ? "bg-primary text-white border-primary" : "bg-zinc-50 text-zinc-500 border-zinc-200")}>
                                                        {lang}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* ─── Step 2: Location ────────────────────────────────── */}
                                {step === 2 && (
                                    <>
                                        {renderSectionHeader("Location", "Where does this activity take place?")}
                                        {renderInput("Address", "address", "Street address", "text", true)}
                                        <div className="grid grid-cols-2 gap-3">
                                            {renderInput("City", "city", "e.g. Rishikesh", "text", true)}
                                            {renderInput("State", "state", "e.g. Uttarakhand", "text", true)}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {renderInput("Country", "country", "e.g. India", "text", true)}
                                            {renderInput("ZIP Code", "zipCode", "e.g. 249201", "text", true)}
                                        </div>
                                        {renderInput("Landmark", "landmark", "Nearby famous landmark")}
                                        {renderInput("Meeting Point", "meetingPoint", "Where guests should arrive")}
                                        <div className="grid grid-cols-2 gap-3">
                                            {renderInput("Latitude", "lat", "e.g. 30.0869", "text", true)}
                                            {renderInput("Longitude", "lng", "e.g. 78.2676", "text", true)}
                                        </div>

                                        {/* Nearby Places */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-zinc-700">Nearby Places</label>
                                            {((formData as any).nearbyPlaces || []).map((np: any, i: number) => (
                                                <div key={i} className="flex gap-2 items-start">
                                                    <div className="flex-1 grid grid-cols-3 gap-2">
                                                        <Input value={np.name} onChange={(e) => updateNearby(i, "name", e.target.value)} placeholder="Name" className="h-9 rounded-lg text-[11px]" />
                                                        <Input value={np.distanceKm} onChange={(e) => updateNearby(i, "distanceKm", e.target.value)} placeholder="KM" type="number" className="h-9 rounded-lg text-[11px]" />
                                                        <select value={np.category} onChange={(e) => updateNearby(i, "category", e.target.value)}
                                                            className="h-9 rounded-lg border border-zinc-200 bg-white text-[11px] font-medium px-2">
                                                            {NEARBY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                                        </select>
                                                    </div>
                                                    <Button variant="ghost" size="icon" onClick={() => removeNearbyPlace(i)} className="h-9 w-9 text-red-400 hover:text-red-600">
                                                        <X className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button variant="outline" onClick={addNearbyPlace} className="h-9 rounded-lg text-[11px] font-bold gap-1.5">
                                                <Plus className="w-3.5 h-3.5" /> Add Place
                                            </Button>
                                        </div>
                                    </>
                                )}

                                {/* ─── Step 3: Duration & Pricing ──────────────────────── */}
                                {step === 3 && (
                                    <>
                                        {renderSectionHeader("Duration & Pricing", "Set schedule and pricing details.")}
                                        <div className="grid grid-cols-2 gap-3">
                                            {renderInput("Duration (Hours)", "durationHours", "e.g. 3", "number", true)}
                                            {renderInput("Duration (Days)", "durationDays", "e.g. 0", "number")}
                                        </div>

                                        {/* Start Times */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-zinc-700">Start Times</label>
                                            <div className="flex gap-2">
                                                <Input placeholder="e.g. 07:00 AM" className="h-10 rounded-xl text-xs" onKeyDown={(e) => {
                                                    if (e.key === "Enter") { addStartTime((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ""; }
                                                }} />
                                                <Button variant="outline" onClick={() => {
                                                    const input = document.querySelector<HTMLInputElement>('input[placeholder="e.g. 07:00 AM"]');
                                                    if (input) { addStartTime(input.value); input.value = ""; }
                                                }} className="h-10 rounded-xl text-[11px] font-bold">Add</Button>
                                            </div>
                                            {formData.startTimes.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {formData.startTimes.map((t, i) => (
                                                        <span key={i} className="inline-flex items-center gap-1 text-[10px] font-bold bg-primary/5 text-primary px-2.5 py-1 rounded-full">
                                                            {t} <X className="w-3 h-3 cursor-pointer" onClick={() => removeStartTime(i)} />
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Availability */}
                                        <div>
                                            <label className="text-[11px] font-bold text-zinc-700 mb-2 block">Availability</label>
                                            <div className="flex gap-2">
                                                {AVAILABILITY_OPTIONS.map((opt) => (
                                                    <button key={opt} type="button" onClick={() => update("availability", opt)}
                                                        className={cn("flex-1 py-2 rounded-xl text-[11px] font-bold border transition-all",
                                                            formData.availability === opt ? "border-primary bg-primary/5 text-primary" : "border-zinc-200 text-zinc-500")}>
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Pricing */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {renderInput("Base Price (₹/person)", "basePrice", "e.g. 1500", "number", true)}
                                            {renderInput("Weekend Price (₹)", "weekendPrice", "e.g. 2000", "number")}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {renderInput("Child Price (₹)", "childPrice", "e.g. 800", "number")}
                                            {renderInput("Foreigner Price (₹)", "foreignerPrice", "e.g. 3000", "number")}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {renderInput("Min Age", "minAge", "e.g. 12", "number")}
                                            {renderInput("Min Group Size", "minGroupSize", "e.g. 2", "number")}
                                        </div>
                                        {renderInput("Max Group Size", "maxGroupSize", "e.g. 20", "number", true)}

                                        {/* Seasonal Pricing */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-zinc-700">Seasonal Pricing</label>
                                            {formData.seasonalPrices.map((sp, i) => (
                                                <div key={i} className="flex gap-2 items-start">
                                                    <div className="flex-1 grid grid-cols-4 gap-2">
                                                        <Input value={sp.seasonName} onChange={(e) => updateSeasonal(i, "seasonName", e.target.value)} placeholder="Season" className="h-9 rounded-lg text-[11px]" />
                                                        <Input value={sp.startDate} onChange={(e) => updateSeasonal(i, "startDate", e.target.value)} type="date" className="h-9 rounded-lg text-[11px]" />
                                                        <Input value={sp.endDate} onChange={(e) => updateSeasonal(i, "endDate", e.target.value)} type="date" className="h-9 rounded-lg text-[11px]" />
                                                        <Input value={sp.pricePerPerson} onChange={(e) => updateSeasonal(i, "pricePerPerson", e.target.value)} placeholder="₹/person" type="number" className="h-9 rounded-lg text-[11px]" />
                                                    </div>
                                                    <Button variant="ghost" size="icon" onClick={() => removeSeasonalPrice(i)} className="h-9 w-9 text-red-400">
                                                        <X className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button variant="outline" onClick={addSeasonalPrice} className="h-9 rounded-lg text-[11px] font-bold gap-1.5">
                                                <Plus className="w-3.5 h-3.5" /> Add Season
                                            </Button>
                                        </div>
                                    </>
                                )}

                                {/* ─── Step 4: Safety & Equipment ──────────────────────── */}
                                {step === 4 && (
                                    <>
                                        {renderSectionHeader("Safety & Equipment", "What you provide and what guests need.")}

                                        {/* Equipment Provided */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-zinc-700">Equipment Provided</label>
                                            <div className="flex gap-2">
                                                <Input placeholder="e.g. Life jacket" className="h-10 rounded-xl text-xs" onKeyDown={(e) => {
                                                    if (e.key === "Enter") { addListItem("equipmentProvided", (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ""; }
                                                }} />
                                                <Button variant="outline" onClick={() => {
                                                    const el = document.querySelector<HTMLInputElement>('input[placeholder="e.g. Life jacket"]');
                                                    if (el) { addListItem("equipmentProvided", el.value); el.value = ""; }
                                                }} className="h-10 rounded-xl text-[11px] font-bold">Add</Button>
                                            </div>
                                            {formData.equipmentProvided.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {formData.equipmentProvided.map((item, i) => (
                                                        <span key={i} className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                                                            <CheckCircle className="w-3 h-3" />{item} <X className="w-3 h-3 cursor-pointer" onClick={() => removeListItem("equipmentProvided", i)} />
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Equipment Required */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-zinc-700">What to Bring</label>
                                            <div className="flex gap-2">
                                                <Input placeholder="e.g. Sunscreen" className="h-10 rounded-xl text-xs" onKeyDown={(e) => {
                                                    if (e.key === "Enter") { addListItem("equipmentRequired", (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ""; }
                                                }} />
                                                <Button variant="outline" onClick={() => {
                                                    const el = document.querySelector<HTMLInputElement>('input[placeholder="e.g. Sunscreen"]');
                                                    if (el) { addListItem("equipmentRequired", el.value); el.value = ""; }
                                                }} className="h-10 rounded-xl text-[11px] font-bold">Add</Button>
                                            </div>
                                            {formData.equipmentRequired.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {formData.equipmentRequired.map((item, i) => (
                                                        <span key={i} className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" />{item} <X className="w-3 h-3 cursor-pointer" onClick={() => removeListItem("equipmentRequired", i)} />
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Safety Guidelines */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-zinc-700">Safety Guidelines <span className="text-red-400">*</span></label>
                                            <Textarea value={formData.safetyGuidelines} onChange={(e) => update("safetyGuidelines", e.target.value)} placeholder="Describe safety protocols..." className={cn("h-24 rounded-xl text-xs", errors.safetyGuidelines && "border-red-400")} />
                                            {fieldError("safetyGuidelines")}
                                        </div>

                                        {renderToggle("Insurance Included", "hasInsurance")}
                                        {renderToggle("Certified Guides", "certifiedGuides")}
                                        {renderInput("Guide Ratio", "guideRatio", "e.g. 1:5")}
                                    </>
                                )}

                                {/* ─── Step 5: Inclusions & Rules ──────────────────────── */}
                                {step === 5 && (
                                    <>
                                        {renderSectionHeader("Inclusions & Rules", "What's included, excluded, and the rules.")}

                                        {/* Included */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-zinc-700">Included</label>
                                            <div className="flex gap-2">
                                                <Input placeholder="e.g. Meals" className="h-10 rounded-xl text-xs" onKeyDown={(e) => {
                                                    if (e.key === "Enter") { addListItem("included", (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ""; }
                                                }} />
                                                <Button variant="outline" onClick={() => {
                                                    const el = document.querySelector<HTMLInputElement>('input[placeholder="e.g. Meals"]');
                                                    if (el) { addListItem("included", el.value); el.value = ""; }
                                                }} className="h-10 rounded-xl text-[11px] font-bold">Add</Button>
                                            </div>
                                            {formData.included.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between bg-emerald-50 px-3 py-2 rounded-lg">
                                                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" />{item}</span>
                                                    <X className="w-3.5 h-3.5 text-emerald-400 cursor-pointer" onClick={() => removeListItem("included", i)} />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Excluded */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-zinc-700">Excluded</label>
                                            <div className="flex gap-2">
                                                <Input placeholder="e.g. Flights" className="h-10 rounded-xl text-xs" onKeyDown={(e) => {
                                                    if (e.key === "Enter") { addListItem("excluded", (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ""; }
                                                }} />
                                                <Button variant="outline" onClick={() => {
                                                    const el = document.querySelector<HTMLInputElement>('input[placeholder="e.g. Flights"]');
                                                    if (el) { addListItem("excluded", el.value); el.value = ""; }
                                                }} className="h-10 rounded-xl text-[11px] font-bold">Add</Button>
                                            </div>
                                            {formData.excluded.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between bg-red-50 px-3 py-2 rounded-lg">
                                                    <span className="text-[11px] font-bold text-red-700 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" />{item}</span>
                                                    <X className="w-3.5 h-3.5 text-red-400 cursor-pointer" onClick={() => removeListItem("excluded", i)} />
                                                </div>
                                            ))}
                                        </div>

                                        {/* House Rules */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-zinc-700">Activity Rules</label>
                                            <div className="flex gap-2">
                                                <Input placeholder="e.g. Follow guide instructions" className="h-10 rounded-xl text-xs" onKeyDown={(e) => {
                                                    if (e.key === "Enter") { addHouseRule((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ""; }
                                                }} />
                                                <Button variant="outline" onClick={() => {
                                                    const el = document.querySelector<HTMLInputElement>('input[placeholder="e.g. Follow guide instructions"]');
                                                    if (el) { addHouseRule(el.value); el.value = ""; }
                                                }} className="h-10 rounded-xl text-[11px] font-bold">Add</Button>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {COMMON_HOUSE_RULES.filter((r) => !formData.houseRules.find((hr) => hr.rule === r)).map((rule) => (
                                                    <button key={rule} type="button" onClick={() => addHouseRule(rule)}
                                                        className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                                                        + {rule}
                                                    </button>
                                                ))}
                                            </div>
                                            {formData.houseRules.map((rule, i) => (
                                                <div key={i} className="flex items-center justify-between bg-zinc-50 px-3 py-2 rounded-lg">
                                                    <span className="text-[11px] font-bold text-zinc-700">{rule.rule}</span>
                                                    <X className="w-3.5 h-3.5 text-zinc-400 cursor-pointer" onClick={() => removeHouseRule(i)} />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Cancellation */}
                                        <div>
                                            <label className="text-[11px] font-bold text-zinc-700 mb-2 block">Cancellation Policy</label>
                                            <div className="space-y-2">
                                                {CANCELLATION_POLICIES.map((policy) => (
                                                    <button key={policy.value} type="button" onClick={() => update("cancellationPolicy", policy.value)}
                                                        className={cn("w-full text-left p-3 rounded-xl border text-[11px] font-bold transition-all",
                                                            formData.cancellationPolicy === policy.value ? "border-primary bg-primary/5 text-primary" : "border-zinc-200 text-zinc-600")}>
                                                        {policy.value} <span className="font-medium text-zinc-400 ml-1">— {policy.description}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {renderInput("Cancellation Details", "cancellationDetails", "Additional cancellation terms...")}
                                        {renderToggle("Pet Friendly", "isPetFriendly")}
                                        {renderInput("Restrictions", "restrictions", "Medical, weight, height restrictions...")}
                                    </>
                                )}

                                {/* ─── Step 6: Booking Settings ────────────────────────── */}
                                {step === 6 && (
                                    <>
                                        {renderSectionHeader("Booking Settings", "Configure how guests can book.")}
                                        {renderToggle("Instant Book", "instantBook", "Guests can book without host approval")}
                                        {renderInput("Advance Notice (Hours)", "advanceNoticeHours", "e.g. 24", "number")}
                                        {renderInput("Max Guests Per Booking", "maxGuestsPerBooking", "e.g. 20", "number")}
                                        {renderInput("Security Deposit (₹)", "securityDeposit", "e.g. 0", "number")}
                                        {renderInput("Taxes (%)", "taxes", "e.g. 18", "number")}
                                        {renderInput("Video Tour URL", "videoTourUrl", "YouTube or Vimeo link...")}
                                    </>
                                )}

                                {/* ─── Step 7: Media & Publish ─────────────────────────── */}
                                {step === 7 && (
                                    <>
                                        {renderSectionHeader("Media & Publish", "Upload photos and set the cover image.")}

                                        {/* Existing Media */}
                                        {existingMedia.length > 0 && (
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-zinc-700">Current Media</label>
                                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                    {existingMedia.map((m, i) => (
                                                        <div key={m._id} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-zinc-100">
                                                            <img src={m.url} alt={m.caption || ""} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                                                            <div className="absolute top-1.5 right-1.5 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button type="button" variant="ghost" size="icon" onClick={() => setExistingCover(i)}
                                                                    className={cn("h-7 w-7 rounded-full bg-white/90", m.isCover && "bg-primary text-white")}>
                                                                    <Star className={cn("w-3 h-3", m.isCover ? "fill-white" : "")} />
                                                                </Button>
                                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeExistingMedia(i)}
                                                                    className="h-7 w-7 rounded-full bg-white/90 text-red-500">
                                                                    <Trash2 className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                            {m.isCover && (
                                                                <span className="absolute bottom-0 inset-x-0 bg-primary/90 text-white text-[8px] font-black text-center py-0.5 truncate">COVER</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Upload New */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-zinc-700">Upload New Photos</label>
                                            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleMediaSelect} className="hidden" id="media-upload" />
                                            <label htmlFor="media-upload" className="cursor-pointer">
                                                <div className="border-2 border-dashed border-zinc-200 rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                                                    <Upload className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
                                                    <p className="text-[11px] font-bold text-zinc-500">Click to upload photos</p>
                                                    <p className="text-[10px] text-zinc-400 mt-0.5">JPEG, PNG, WebP • Max 5 files</p>
                                                </div>
                                            </label>
                                        </div>

                                        {/* New Media Previews */}
                                        {mediaFiles.length > 0 && (
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                {mediaFiles.map((m, i) => (
                                                    <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-zinc-100">
                                                        <img src={m.preview} alt="" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                                                        <div className="absolute top-1.5 right-1.5 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button type="button" variant="ghost" size="icon" onClick={() => setNewCover(i)}
                                                                className={cn("h-7 w-7 rounded-full bg-white/90", m.isCover && "bg-primary text-white")}>
                                                                <Star className={cn("w-3 h-3", m.isCover ? "fill-white" : "")} />
                                                            </Button>
                                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeNewMedia(i)}
                                                                className="h-7 w-7 rounded-full bg-white/90 text-red-500">
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                        {m.isCover && (
                                                            <span className="absolute bottom-0 inset-x-0 bg-primary/90 text-white text-[8px] font-black text-center py-0.5">COVER</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}

                            </motion.div>
                        </AnimatePresence>

                        {/* ─── Navigation Buttons ──────────────────────────────────────── */}
                        <div className="pt-6 mt-6 border-t border-zinc-50 flex items-center justify-between">
                            <Button type="button" variant="outline" onClick={prev} disabled={step === 1 || isSubmitting}
                                className="h-10 rounded-xl text-xs font-bold gap-1.5">
                                <ChevronLeft className="w-3.5 h-3.5" /> Previous
                            </Button>
                            {step === totalSteps ? (
                                <Button type="button" onClick={handleSubmit} disabled={isSubmitting}
                                    className="h-10 rounded-xl text-xs font-bold gap-1.5 bg-primary hover:bg-primary/90">
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                            Saving...
                                        </>
                                    ) : (
                                        <>Save Changes</>
                                    )}
                                </Button>
                            ) : (
                                <Button type="button" onClick={next} className="h-10 rounded-xl text-xs font-bold gap-1.5">
                                    Next <ChevronRight className="w-3.5 h-3.5" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}