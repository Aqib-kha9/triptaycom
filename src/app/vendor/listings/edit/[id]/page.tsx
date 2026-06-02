"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    ChevronRight,
    ChevronLeft,
    Home,
    DollarSign,
    Coffee,
    Image as ImageIcon,
    MapPin,
    Wifi,
    Wind,
    Car,
    Tv,
    Waves,
    Utensils,
    Check,
    Bed,
    Bath,
    Users,
    Clock,
    Shield,
    Star,
    X,
    Upload,
    Plus,
    Trash2,
    Sparkles,
    Map,
    Eye,
    Globe,
    Navigation,
    Landmark,
    Mountain,
    Trees,
    Building2,
    Warehouse,
    CableCar,
    Ship,
    Tent,
    TreePine,
    Snowflake,
    Flame,
    Shirt,
    Thermometer,
    Dog,
    Cigarette,
    Music,
    VolumeX,
    Languages,
    Calendar,
    Info,
    AlertCircle,
    Loader2,
    Camera,
    Video,
    Lightbulb,
    Bookmark,
    ArrowLeft,
    Save,
    type LucideIcon,
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { VendorSidebar } from "@/components/navigation/vendor-sidebar";

// ──────────────────────── Types ────────────────────────

type PropertyType =
    | "Villa" | "Apartment" | "Cottage" | "Farmhouse" | "Homestay"
    | "Bungalow" | "Tent" | "Treehouse" | "Cabin" | "Houseboat" | "Other";

type CancellationPolicy = "Flexible" | "Moderate" | "Strict" | "Non-Refundable";

interface NearbyPlace { name: string; distanceKm: number; category: string; description?: string; }
interface MealOption { mealType: "Breakfast" | "Lunch" | "Dinner" | "Snacks" | "All Meals"; included: boolean; extraPrice: number; description?: string; }
interface HouseRule { rule: string; icon?: string; }
interface SeasonalPrice { seasonName: string; startDate: string; endDate: string; pricePerNight: number; }

interface FormData {
    name: string; summary: string; description: string; propertyType: PropertyType;
    isEntirePlace: boolean; floorNumber: string; totalFloors: string;
    propertySizeSqFt: string; yearBuilt: string;
    address: string; city: string; state: string; country: string; zipCode: string;
    landmark: string; lat: string; lng: string; nearbyPlaces: NearbyPlace[];
    maxGuests: string; bedrooms: string; beds: string; bathrooms: string;
    extraMattresses: string; basePrice: string; weekendPrice: string;
    seasonalPrices: SeasonalPrice[]; cleaningFee: string; securityDeposit: string;
    extraGuestPrice: string; taxes: string; minStay: string; maxStay: string;
    checkInTime: string; checkOutTime: string; flexibleCheckIn: boolean; flexibleCheckOut: boolean;
    amenities: string[];
    meals: MealOption[]; hasKitchen: boolean; kitchenDetails: string;
    houseRules: HouseRule[]; cancellationPolicy: CancellationPolicy; cancellationDetails: string;
    isPetFriendly: boolean; petRules: string; isSmokingAllowed: boolean; isPartyAllowed: boolean;
    quietHoursStart: string; quietHoursEnd: string; languagesSpoken: string[];
    instantBook: boolean; advanceNoticeHours: string; maxGuestsPerBooking: string; videoTourUrl: string;
}

interface MediaPreview { file: File; preview: string; caption: string; isCover: boolean; }

interface ExistingMedia {
    _id: string; url: string; publicId: string; type: string;
    caption?: string; isCover: boolean; order: number;
}

interface MediaToDelete { publicId: string; _id: string; }

// ──────────────────────── Constants ────────────────────────

const PROPERTY_TYPES: { value: PropertyType; label: string; icon: LucideIcon }[] = [
    { value: "Villa", label: "Villa", icon: Building2 }, { value: "Apartment", label: "Apartment", icon: Building2 },
    { value: "Cottage", label: "Cottage", icon: Warehouse }, { value: "Farmhouse", label: "Farmhouse", icon: Trees },
    { value: "Homestay", label: "Homestay", icon: Home }, { value: "Bungalow", label: "Bungalow", icon: Building2 },
    { value: "Tent", label: "Tent", icon: Tent }, { value: "Treehouse", label: "Treehouse", icon: TreePine },
    { value: "Cabin", label: "Cabin", icon: Warehouse }, { value: "Houseboat", label: "Houseboat", icon: Ship },
    { value: "Other", label: "Other", icon: Home },
];

const AMENITIES_LIST = [
    { id: "wifi", label: "WiFi", icon: Wifi }, { id: "ac", label: "Air Conditioning", icon: Wind },
    { id: "heating", label: "Heating", icon: Flame }, { id: "parking", label: "Free Parking", icon: Car },
    { id: "pool", label: "Swimming Pool", icon: Waves }, { id: "kitchen", label: "Kitchen", icon: Utensils },
    { id: "tv", label: "TV / Cable", icon: Tv }, { id: "washer", label: "Washing Machine", icon: Shirt },
    { id: "dryer", label: "Dryer", icon: Thermometer }, { id: "workspace", label: "Dedicated Workspace", icon: Monitor },
    { id: "balcony", label: "Balcony / Terrace", icon: Mountain }, { id: "garden", label: "Garden", icon: Trees },
    { id: "bbq", label: "BBQ Grill", icon: Flame }, { id: "fireplace", label: "Fireplace", icon: Flame },
    { id: "hotTub", label: "Hot Tub / Jacuzzi", icon: Waves }, { id: "gym", label: "Gym / Fitness", icon: DumbbellIcon },
    { id: "elevator", label: "Elevator", icon: ArrowUpDownIcon }, { id: "security", label: "Security Cameras", icon: Shield },
    { id: "firstAid", label: "First Aid Kit", icon: Shield }, { id: "fireExtinguisher", label: "Fire Extinguisher", icon: Shield },
    { id: "smokeAlarm", label: "Smoke Alarm", icon: Shield }, { id: "powerBackup", label: "Power Backup", icon: Lightbulb },
    { id: "hotWater", label: "Hot Water", icon: Thermometer }, { id: "toiletries", label: "Toiletries", icon: Sparkles },
    { id: "linens", label: "Linens & Towels", icon: Bookmark }, { id: "housekeeping", label: "Housekeeping", icon: Sparkles },
    { id: "roomService", label: "Room Service", icon: Coffee }, { id: "pickup", label: "Airport Pickup", icon: Car },
    { id: "petsAllowed", label: "Pets Allowed", icon: Dog },
];

const MEAL_TYPES: MealOption["mealType"][] = ["Breakfast", "Lunch", "Dinner", "Snacks", "All Meals"];

const CANCELLATION_POLICIES: { value: CancellationPolicy; label: string; desc: string }[] = [
    { value: "Flexible", label: "Flexible", desc: "Full refund 24 hours before check-in" },
    { value: "Moderate", label: "Moderate", desc: "Full refund 5 days before check-in" },
    { value: "Strict", label: "Strict", desc: "50% refund up to 1 week before check-in" },
    { value: "Non-Refundable", label: "Non-Refundable", desc: "No refunds after booking" },
];

const LANGUAGES = [
    "English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati",
    "Kannada", "Malayalam", "Punjabi", "Odia", "Assamese", "Urdu", "Sanskrit",
    "French", "Spanish", "German", "Japanese", "Chinese", "Korean",
];

const NEARBY_CATEGORIES = [
    "Restaurant", "Cafe", "Market", "Hospital", "Pharmacy", "ATM",
    "Bus Stop", "Railway Station", "Airport", "Tourist Spot", "Trek",
    "Lake", "Temple", "Other",
];

const COMMON_HOUSE_RULES = [
    "No loud music after 10 PM", "No smoking inside the house", "No parties or events",
    "Pets are not allowed", "Shoes off inside the house", "Check-in after 12 PM only",
    "ID proof required at check-in", "No unregistered guests", "Keep the kitchen clean after use",
    "Lock all doors when leaving",
];

const STEPS = ["Basics", "Location", "Pricing", "Amenities", "Food", "Rules", "Media"];

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
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    );
}

function Monitor({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
        </svg>
    );
}

function SaveIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
        </svg>
    );
}

// ──────────────────────── Default Form ────────────────────────

const emptyForm: FormData = {
    name: "", summary: "", description: "", propertyType: "Homestay", isEntirePlace: true,
    floorNumber: "", totalFloors: "", propertySizeSqFt: "", yearBuilt: "",
    address: "", city: "", state: "", country: "India", zipCode: "", landmark: "",
    lat: "", lng: "", nearbyPlaces: [],
    maxGuests: "", bedrooms: "", beds: "", bathrooms: "", extraMattresses: "",
    basePrice: "", weekendPrice: "", seasonalPrices: [], cleaningFee: "", securityDeposit: "",
    extraGuestPrice: "", taxes: "", minStay: "1", maxStay: "0", checkInTime: "12:00 PM", checkOutTime: "11:00 AM",
    flexibleCheckIn: false, flexibleCheckOut: false,
    amenities: [], meals: [], hasKitchen: false, kitchenDetails: "",
    houseRules: [], cancellationPolicy: "Moderate", cancellationDetails: "",
    isPetFriendly: false, petRules: "", isSmokingAllowed: false, isPartyAllowed: false,
    quietHoursStart: "", quietHoursEnd: "", languagesSpoken: ["English"],
    instantBook: true, advanceNoticeHours: "", maxGuestsPerBooking: "", videoTourUrl: "",
};

// ──────────────────────── Main Component ────────────────────────

export default function EditListingPage() {
    const params = useParams();
    const router = useRouter();
    const listingId = params.id as string;

    const [step, setStep] = useState(1);
    const totalSteps = STEPS.length;
    const [formData, setFormData] = useState<FormData>(emptyForm);
    const [existingMedia, setExistingMedia] = useState<ExistingMedia[]>([]);
    const [mediaToDelete, setMediaToDelete] = useState<MediaToDelete[]>([]);
    const [mediaFiles, setMediaFiles] = useState<MediaPreview[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isLoadingListing, setIsLoadingListing] = useState(true);
    const [loadError, setLoadError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Fetch existing listing ──
    const fetchListing = useCallback(async () => {
        try {
            setIsLoadingListing(true);
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/listings/${listingId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.status !== "success") {
                setLoadError(json.message || "Failed to load listing.");
                return;
            }
            const l = json.data.listing;
            setFormData({
                name: l.name || "", summary: l.summary || "", description: l.description || "",
                propertyType: l.propertyType || "Homestay", isEntirePlace: l.isEntirePlace ?? true,
                floorNumber: l.floorNumber?.toString() || "", totalFloors: l.totalFloors?.toString() || "",
                propertySizeSqFt: l.propertySizeSqFt?.toString() || "", yearBuilt: l.yearBuilt?.toString() || "",
                address: l.address || "", city: l.city || "", state: l.state || "",
                country: l.country || "India", zipCode: l.zipCode || "", landmark: l.landmark || "",
                lat: l.coordinates?.lat?.toString() || "", lng: l.coordinates?.lng?.toString() || "",
                nearbyPlaces: l.nearbyPlaces || [],
                maxGuests: l.maxGuests?.toString() || "", bedrooms: l.bedrooms?.toString() || "",
                beds: l.beds?.toString() || "", bathrooms: l.bathrooms?.toString() || "",
                extraMattresses: l.extraMattresses?.toString() || "",
                basePrice: l.basePrice?.toString() || "", weekendPrice: l.weekendPrice?.toString() || "",
                seasonalPrices: l.seasonalPrices || [], cleaningFee: l.cleaningFee?.toString() || "",
                securityDeposit: l.securityDeposit?.toString() || "",
                extraGuestPrice: l.extraGuestPrice?.toString() || "", taxes: l.taxes?.toString() || "",
                minStay: l.minStay?.toString() || "1", maxStay: l.maxStay?.toString() || "0",
                checkInTime: l.checkInTime || "12:00 PM", checkOutTime: l.checkOutTime || "11:00 AM",
                flexibleCheckIn: l.flexibleCheckIn ?? false, flexibleCheckOut: l.flexibleCheckOut ?? false,
                amenities: l.amenities || [],
                meals: l.meals || [], hasKitchen: l.hasKitchen ?? false,
                kitchenDetails: l.kitchenDetails || "",
                houseRules: l.houseRules || [], cancellationPolicy: l.cancellationPolicy || "Moderate",
                cancellationDetails: l.cancellationDetails || "",
                isPetFriendly: l.isPetFriendly ?? false, petRules: l.petRules || "",
                isSmokingAllowed: l.isSmokingAllowed ?? false, isPartyAllowed: l.isPartyAllowed ?? false,
                quietHoursStart: l.quietHoursStart || "", quietHoursEnd: l.quietHoursEnd || "",
                languagesSpoken: l.languagesSpoken || ["English"],
                instantBook: l.instantBook ?? true, advanceNoticeHours: l.advanceNoticeHours?.toString() || "",
                maxGuestsPerBooking: l.maxGuestsPerBooking?.toString() || "", videoTourUrl: l.videoTourUrl || "",
            });
            setExistingMedia(l.media || []);
        } catch {
            setLoadError("Could not connect to server.");
        } finally {
            setIsLoadingListing(false);
        }
    }, [listingId]);

    useEffect(() => { fetchListing(); }, [fetchListing]);

    const next = () => { if (step < totalSteps) { setStep(step + 1); setErrors({}); } };
    const prev = () => { if (step > 1) { setStep(step - 1); setErrors({}); } };

    const update = (field: keyof FormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleAmenity = (id: string) => {
        setFormData((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(id) ? prev.amenities.filter((a) => a !== id) : [...prev.amenities, id],
        }));
    };

    const toggleLanguage = (lang: string) => {
        setFormData((prev) => ({
            ...prev,
            languagesSpoken: prev.languagesSpoken.includes(lang)
                ? prev.languagesSpoken.filter((l) => l !== lang) : [...prev.languagesSpoken, lang],
        }));
    };

    const toggleMeal = (mealType: MealOption["mealType"]) => {
        setFormData((prev) => {
            const exists = prev.meals.find((m) => m.mealType === mealType);
            if (exists) return { ...prev, meals: prev.meals.filter((m) => m.mealType !== mealType) };
            return { ...prev, meals: [...prev.meals, { mealType, included: true, extraPrice: 0 }] };
        });
    };

    const updateMeal = (mealType: MealOption["mealType"], field: keyof MealOption, value: any) => {
        setFormData((prev) => ({
            ...prev,
            meals: prev.meals.map((m) => (m.mealType === mealType ? { ...m, [field]: value } : m)),
        }));
    };

    const addHouseRule = (rule: string) => {
        if (!rule.trim()) return;
        setFormData((prev) => ({ ...prev, houseRules: [...prev.houseRules, { rule: rule.trim() }] }));
    };

    const removeHouseRule = (index: number) => {
        setFormData((prev) => ({ ...prev, houseRules: prev.houseRules.filter((_, i) => i !== index) }));
    };

    const addNearbyPlace = () => {
        setFormData((prev) => ({
            ...prev,
            nearbyPlaces: [...prev.nearbyPlaces, { name: "", distanceKm: 0, category: "Restaurant" }],
        }));
    };

    const removeNearbyPlace = (index: number) => {
        setFormData((prev) => ({ ...prev, nearbyPlaces: prev.nearbyPlaces.filter((_, i) => i !== index) }));
    };

    const updateNearby = (index: number, field: keyof NearbyPlace, value: any) => {
        setFormData((prev) => ({
            ...prev,
            nearbyPlaces: prev.nearbyPlaces.map((np, i) => (i === index ? { ...np, [field]: value } : np)),
        }));
    };

    const addSeasonalPrice = () => {
        setFormData((prev) => ({
            ...prev,
            seasonalPrices: [...prev.seasonalPrices, { seasonName: "", startDate: "", endDate: "", pricePerNight: 0 }],
        }));
    };

    const removeSeasonalPrice = (index: number) => {
        setFormData((prev) => ({ ...prev, seasonalPrices: prev.seasonalPrices.filter((_, i) => i !== index) }));
    };

    const updateSeasonal = (index: number, field: keyof SeasonalPrice, value: any) => {
        setFormData((prev) => ({
            ...prev,
            seasonalPrices: prev.seasonalPrices.map((sp, i) => (i === index ? { ...sp, [field]: value } : sp)),
        }));
    };

    // ── Media handlers ──
    const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const total = existingMedia.length - mediaToDelete.length + mediaFiles.length + files.length;
        if (total > 15) { setErrors({ media: "Maximum 15 photos allowed." }); return; }
        files.forEach((f) => {
            if (!f.type.startsWith("image/")) { setErrors({ media: "Only image files allowed." }); return; }
            if (f.size > 10 * 1024 * 1024) { setErrors({ media: "Each file must be under 10 MB." }); return; }
        });
        const previews = files.map((file) => ({
            file, preview: URL.createObjectURL(file), caption: "", isCover: existingMedia.length === 0 && mediaToDelete.length === existingMedia.length && mediaFiles.length === 0,
        }));
        setMediaFiles((prev) => [...prev, ...previews]);
        if (e.target) e.target.value = "";
    };

    const removeMedia = (index: number) => {
        setMediaFiles((prev) => { const m = prev[index]; if (m?.preview) URL.revokeObjectURL(m.preview); return prev.filter((_, i) => i !== index); });
    };

    const removeExistingMedia = (index: number) => {
        const m = existingMedia[index];
        setMediaToDelete((prev) => [...prev, { publicId: m.publicId, _id: m._id }]);
        setExistingMedia((prev) => prev.filter((_, i) => i !== index));
    };

    const setCover = (isExisting: boolean, index: number) => {
        if (isExisting) {
            setExistingMedia((prev) => prev.map((m, i) => ({ ...m, isCover: i === index })));
            setMediaFiles((prev) => prev.map((m) => ({ ...m, isCover: false })));
        } else {
            setMediaFiles((prev) => prev.map((m, i) => ({ ...m, isCover: i === index })));
            setExistingMedia((prev) => prev.map((m) => ({ ...m, isCover: false })));
        }
    };

    const updateCaption = (isExisting: boolean, index: number, caption: string) => {
        if (isExisting) {
            setExistingMedia((prev) => prev.map((m, i) => (i === index ? { ...m, caption } : m)));
        } else {
            setMediaFiles((prev) => prev.map((m, i) => (i === index ? { ...m, caption } : m)));
        }
    };

    // ── Validation ──
    const validateStep = (): boolean => {
        const newErrors: Record<string, string> = {};
        const f = formData;
        if (step === 1) {
            if (!f.name.trim()) newErrors.name = "Property name is required";
            if (!f.summary.trim()) newErrors.summary = "A short summary is required";
            if (!f.description.trim()) newErrors.description = "Description is required";
            if (!f.propertyType) newErrors.propertyType = "Select a property type";
        }
        if (step === 2) {
            if (!f.address.trim()) newErrors.address = "Address is required";
            if (!f.city.trim()) newErrors.city = "City is required";
            if (!f.state.trim()) newErrors.state = "State is required";
            if (!f.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
            if (!f.lat.trim() || !f.lng.trim()) newErrors.coordinates = "GPS coordinates are required";
        }
        if (step === 3) {
            if (!f.basePrice || parseFloat(f.basePrice) <= 0) newErrors.basePrice = "Enter a valid price";
            if (!f.maxGuests || parseInt(f.maxGuests) < 1) newErrors.maxGuests = "At least 1 guest required";
            if (!f.bedrooms || parseInt(f.bedrooms) < 0) newErrors.bedrooms = "Enter bedrooms";
            if (!f.beds || parseInt(f.beds) < 1) newErrors.beds = "At least 1 bed required";
            if (!f.bathrooms || parseInt(f.bathrooms) < 0) newErrors.bathrooms = "Enter bathrooms";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => { if (validateStep()) next(); };

    // ── Submit ──
    const handleSubmit = async () => {
        if (!validateStep()) return;
        setIsSubmitting(true);
        setSubmitError("");
        try {
            const token = localStorage.getItem("token");
            const payload: any = {
                name: formData.name.trim(), summary: formData.summary.trim(),
                description: formData.description.trim(), propertyType: formData.propertyType,
                isEntirePlace: formData.isEntirePlace,
                floorNumber: formData.floorNumber ? parseInt(formData.floorNumber) : undefined,
                totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : undefined,
                propertySizeSqFt: formData.propertySizeSqFt ? parseInt(formData.propertySizeSqFt) : undefined,
                yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
                address: formData.address.trim(), city: formData.city.trim(),
                state: formData.state.trim(), country: formData.country.trim(),
                zipCode: formData.zipCode.trim(), landmark: formData.landmark.trim() || undefined,
                coordinates: { lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) },
                maxGuests: parseInt(formData.maxGuests), bedrooms: parseInt(formData.bedrooms),
                beds: parseInt(formData.beds), bathrooms: parseInt(formData.bathrooms),
                extraMattresses: parseInt(formData.extraMattresses) || 0,
                basePrice: parseFloat(formData.basePrice),
                weekendPrice: formData.weekendPrice ? parseFloat(formData.weekendPrice) : undefined,
                seasonalPrices: formData.seasonalPrices, cleaningFee: parseFloat(formData.cleaningFee) || 0,
                securityDeposit: parseFloat(formData.securityDeposit) || 0,
                extraGuestPrice: parseFloat(formData.extraGuestPrice) || 0, taxes: parseFloat(formData.taxes) || 0,
                minStay: parseInt(formData.minStay) || 1, maxStay: parseInt(formData.maxStay) || 0,
                checkInTime: formData.checkInTime, checkOutTime: formData.checkOutTime,
                flexibleCheckIn: formData.flexibleCheckIn, flexibleCheckOut: formData.flexibleCheckOut,
                amenities: formData.amenities, meals: formData.meals,
                hasKitchen: formData.hasKitchen, kitchenDetails: formData.kitchenDetails.trim() || undefined,
                houseRules: formData.houseRules, cancellationPolicy: formData.cancellationPolicy,
                cancellationDetails: formData.cancellationDetails.trim() || undefined,
                isPetFriendly: formData.isPetFriendly, petRules: formData.petRules.trim() || undefined,
                isSmokingAllowed: formData.isSmokingAllowed, isPartyAllowed: formData.isPartyAllowed,
                quietHoursStart: formData.quietHoursStart || undefined,
                quietHoursEnd: formData.quietHoursEnd || undefined,
                nearbyPlaces: formData.nearbyPlaces, languagesSpoken: formData.languagesSpoken,
                instantBook: formData.instantBook,
                advanceNoticeHours: parseInt(formData.advanceNoticeHours) || 0,
                maxGuestsPerBooking: formData.maxGuestsPerBooking ? parseInt(formData.maxGuestsPerBooking) : parseInt(formData.maxGuests),
                videoTourUrl: formData.videoTourUrl.trim() || undefined,
            };

            // Step 1: Update listing data
            const res = await fetch(`${API_BASE}/listings/${listingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                credentials: "include",
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Failed to update listing");

            // Step 2: Delete removed media
            for (const md of mediaToDelete) {
                try {
                    await fetch(`${API_BASE}/listings/${listingId}/media/${md._id}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                    });
                } catch { /* non-fatal */ }
            }

            // Step 3: Upload new media
            if (mediaFiles.length > 0) {
                const fd = new FormData();
                mediaFiles.forEach((m) => {
                    fd.append("files", m.file);
                    if (m.caption) fd.append("captions", m.caption);
                    if (m.isCover) fd.append("isCover", "true");
                });
                await fetch(`${API_BASE}/listings/${listingId}/media`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: "include",
                    body: fd,
                });
            }

            setSubmitSuccess(true);
        } catch (err: any) {
            setSubmitError(err.message || "Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Render helpers ──
    const fieldError = (field: string) =>
        errors[field] ? (
            <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors[field]}
            </p>
        ) : null;

    const renderStepIndicator = () => (
        <>
            {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                    <button
                        onClick={() => { if (i + 1 <= step) { setStep(i + 1); setErrors({}); } }}
                        className={cn(
                            "w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center transition-all duration-300",
                            i + 1 < step ? "bg-primary text-white" : i + 1 === step ? "bg-primary text-white ring-4 ring-primary/20" : "bg-zinc-100 text-zinc-400"
                        )}
                    >
                        {i + 1 < step ? <Check className="w-3 h-3" /> : i + 1}
                    </button>
                    {i < STEPS.length - 1 && <div className={cn("h-px w-4 sm:w-6", i + 1 < step ? "bg-primary" : "bg-zinc-100")} />}
                </div>
            ))}
        </>
    );

    const renderSectionHeader = (title: string, subtitle: string) => (
        <div className="mb-6">
            <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
            <p className="text-[11px] text-zinc-500 font-medium mt-0.5">{subtitle}</p>
        </div>
    );

    const renderInput = (label: string, field: keyof FormData, placeholder: string, type = "text", required = false) => (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
                <Input
                    type={type}
                    placeholder={placeholder}
                    value={formData[field] as string}
                    onChange={(e) => update(field, e.target.value)}
                    className="h-10 rounded-xl border-zinc-100 bg-zinc-50/50 text-xs font-medium focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                />
            </div>
            {fieldError(field)}
        </div>
    );

    const renderToggle = (label: string, field: keyof FormData, description?: string) => (
        <div className="flex items-center justify-between py-3 border-b border-zinc-50">
            <div>
                <p className="text-[11px] font-bold text-zinc-700">{label}</p>
                {description && <p className="text-[9px] text-zinc-400 font-medium">{description}</p>}
            </div>
            <button
                type="button"
                onClick={() => update(field, !formData[field])}
                className={cn(
                    "w-10 h-6 rounded-full transition-colors duration-300 relative",
                    formData[field] ? "bg-primary" : "bg-zinc-200"
                )}
            >
                <div className={cn("w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300 shadow-sm", formData[field] ? "left-5" : "left-1")} />
            </button>
        </div>
    );

    // ── Loading / Error states ──
    if (isLoadingListing) {
        return (
            <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
                <Navbar />
                <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 text-zinc-300 animate-spin" />
                        <p className="text-xs text-zinc-500 font-medium">Loading listing data...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
                <Navbar />
                <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
                    <div className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center text-center space-y-4 max-w-sm">
                        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-400">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-zinc-900">Failed to load</h3>
                            <p className="text-xs text-zinc-500 font-medium">{loadError}</p>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={fetchListing} variant="outline" className="rounded-xl h-10 text-xs font-bold">Retry</Button>
                            <Link href="/vendor/stays"><Button className="rounded-xl h-10 text-xs font-bold">Back to Stays</Button></Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // ── Success state ──
    if (submitSuccess) {
        return (
            <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
                <Navbar />
                <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center text-center space-y-6 max-w-sm">
                        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
                            <Check className="w-10 h-10 text-emerald-500" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-black text-zinc-900">Listing Updated!</h2>
                            <p className="text-xs text-zinc-500 font-medium">Your changes have been saved successfully.</p>
                        </div>
                        <div className="flex gap-3">
                            <Link href={`/vendor/listings/${listingId}`}>
                                <Button variant="outline" className="rounded-xl h-10 text-xs font-bold gap-2"><Eye className="w-3.5 h-3.5" /> View</Button>
                            </Link>
                            <Link href="/vendor/stays">
                                <Button className="rounded-xl h-10 text-xs font-bold">Back to Stays</Button>
                            </Link>
                        </div>
                    </motion.div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
            <Navbar />
            <main className="flex-grow pt-24 pb-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <VendorSidebar />

                        <div className="flex-grow space-y-6">
                            {/* Top Bar */}
                            <div className="flex justify-between items-center px-1">
                                <div className="flex items-center gap-3">
                                    <Link href="/vendor/stays">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg"><ArrowLeft className="w-4 h-4" /></Button>
                                    </Link>
                                    <div>
                                        <h1 className="text-lg font-bold text-zinc-900 truncate max-w-[300px]">Edit: {formData.name || "Listing"}</h1>
                                        <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Step {step} of {totalSteps} — {STEPS[step - 1]}</p>
                                    </div>
                                </div>
                                <Link href={`/vendor/listings/${listingId}`}>
                                    <Button variant="outline" className="rounded-xl h-9 text-xs font-bold gap-1.5"><Eye className="w-3.5 h-3.5" /> View</Button>
                                </Link>
                            </div>

                            <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-10">
                                {/* Step Indicator */}
                                <div className="flex items-center justify-center gap-1 mb-8 overflow-x-auto">
                                    {renderStepIndicator()}
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                                        {/* ── Step 1: Basics ── */}
                                        {step === 1 && (
                                            <>
                                                {renderSectionHeader("Basic Information", "Tell guests about your property")}
                                                {renderInput("Property Name", "name", "e.g. Whispering Pines Cottage", "text", true)}
                                                {renderInput("Short Summary", "summary", "One-line headline for your listing", "text", true)}
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Description <span className="text-red-400">*</span></label>
                                                    <Textarea placeholder="Describe your property in detail..." value={formData.description} onChange={(e) => update("description", e.target.value)} className="min-h-[120px] rounded-xl border-zinc-100 bg-zinc-50/50 text-xs font-medium focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all resize-y" />
                                                    {fieldError("description")}
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Property Type <span className="text-red-400">*</span></label>
                                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                                        {PROPERTY_TYPES.map((pt) => {
                                                            const Icon = pt.icon;
                                                            return (
                                                                <button key={pt.value} type="button" onClick={() => { update("propertyType", pt.value); setErrors({}); }}
                                                                    className={cn("flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-[10px] font-bold transition-all", formData.propertyType === pt.value ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20" : "border-zinc-100 bg-zinc-50/50 text-zinc-500 hover:border-zinc-200")}>
                                                                    <Icon className="w-4 h-4" />{pt.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    {fieldError("propertyType")}
                                                </div>
                                                {renderToggle("Entire Place", "isEntirePlace", "Guests get the whole property to themselves")}
                                                {!formData.isEntirePlace && (
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {renderInput("Floor Number", "floorNumber", "e.g. 2")}
                                                        {renderInput("Total Floors", "totalFloors", "e.g. 5")}
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-2 gap-3">
                                                    {renderInput("Property Size (sq.ft)", "propertySizeSqFt", "e.g. 1200")}
                                                    {renderInput("Year Built", "yearBuilt", "e.g. 2018")}
                                                </div>
                                            </>
                                        )}

                                        {/* ── Step 2: Location ── */}
                                        {step === 2 && (
                                            <>
                                                {renderSectionHeader("Location & Nearby", "Where is your property located?")}
                                                {renderInput("Street Address", "address", "e.g. Old Manali, Hadimba Road", "text", true)}
                                                <div className="grid grid-cols-2 gap-3">
                                                    {renderInput("City", "city", "e.g. Manali", "text", true)}
                                                    {renderInput("State", "state", "e.g. Himachal Pradesh", "text", true)}
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {renderInput("Country", "country", "e.g. India")}
                                                    {renderInput("ZIP Code", "zipCode", "e.g. 175131", "text", true)}
                                                </div>
                                                {renderInput("Nearby Landmark", "landmark", "e.g. Near Hidimba Temple")}
                                                <div className="grid grid-cols-2 gap-3">
                                                    {renderInput("Latitude", "lat", "e.g. 32.2432")}
                                                    {renderInput("Longitude", "lng", "e.g. 77.1892")}
                                                </div>
                                                {fieldError("coordinates")}
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Nearby Places</label>
                                                        <Button type="button" variant="outline" size="sm" onClick={addNearbyPlace} className="rounded-lg h-8 text-[10px] font-bold gap-1"><Plus className="w-3 h-3" /> Add</Button>
                                                    </div>
                                                    {formData.nearbyPlaces.map((np, i) => (
                                                        <div key={i} className="flex gap-2 items-end">
                                                            <div className="flex-1">
                                                                <Input placeholder="Name" value={np.name} onChange={(e) => updateNearby(i, "name", e.target.value)} className="h-10 rounded-xl border-zinc-100 bg-zinc-50/50 text-xs" />
                                                            </div>
                                                            <div className="w-20">
                                                                <Input type="number" placeholder="Km" value={np.distanceKm || ""} onChange={(e) => updateNearby(i, "distanceKm", parseFloat(e.target.value) || 0)} className="h-10 rounded-xl border-zinc-100 bg-zinc-50/50 text-xs" />
                                                            </div>
                                                            <select value={np.category} onChange={(e) => updateNearby(i, "category", e.target.value)} className="h-10 rounded-xl border border-zinc-100 bg-zinc-50/50 text-xs font-medium px-2">
                                                                {NEARBY_CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                                                            </select>
                                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeNearbyPlace(i)} className="h-8 w-8 rounded-lg text-rose-400 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" /></Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}

                                        {/* ── Step 3: Pricing ── */}
                                        {step === 3 && (
                                            <>
                                                {renderSectionHeader("Pricing & Capacity", "Set your rates and guest limits")}
                                                <div className="grid grid-cols-2 gap-3">
                                                    {renderInput("Base Price (₹/night)", "basePrice", "e.g. 2500", "number", true)}
                                                    {renderInput("Weekend Price (₹/night)", "weekendPrice", "Leave empty for auto +30%")}
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                    {renderInput("Max Guests", "maxGuests", "e.g. 6", "number", true)}
                                                    {renderInput("Bedrooms", "bedrooms", "e.g. 3", "number", true)}
                                                    {renderInput("Beds", "beds", "e.g. 4", "number", true)}
                                                    {renderInput("Bathrooms", "bathrooms", "e.g. 2", "number", true)}
                                                </div>
                                                {renderInput("Extra Mattresses", "extraMattresses", "e.g. 2")}
                                                <div className="grid grid-cols-3 gap-3">
                                                    {renderInput("Cleaning Fee (₹)", "cleaningFee", "e.g. 500")}
                                                    {renderInput("Security Deposit (₹)", "securityDeposit", "e.g. 5000")}
                                                    {renderInput("Extra Guest (₹)", "extraGuestPrice", "e.g. 800")}
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {renderInput("Taxes (%)", "taxes", "e.g. 12")}
                                                    {renderInput("Min Stay (nights)", "minStay", "e.g. 1")}
                                                </div>
                                                {renderInput("Max Stay (nights)", "maxStay", "0 = no limit")}
                                                <div className="grid grid-cols-2 gap-3">
                                                    {renderInput("Check-in Time", "checkInTime", "12:00 PM")}
                                                    {renderInput("Check-out Time", "checkOutTime", "11:00 AM")}
                                                </div>
                                                {renderToggle("Flexible Check-in", "flexibleCheckIn")}
                                                {renderToggle("Flexible Check-out", "flexibleCheckOut")}

                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Seasonal Pricing</label>
                                                        <Button type="button" variant="outline" size="sm" onClick={addSeasonalPrice} className="rounded-lg h-8 text-[10px] font-bold gap-1"><Plus className="w-3 h-3" /> Add</Button>
                                                    </div>
                                                    {formData.seasonalPrices.map((sp, i) => (
                                                        <div key={i} className="flex gap-2 items-end flex-wrap">
                                                            <div className="flex-1 min-w-[120px]"><Input placeholder="Season name" value={sp.seasonName} onChange={(e) => updateSeasonal(i, "seasonName", e.target.value)} className="h-10 rounded-xl border-zinc-100 bg-zinc-50/50 text-xs" /></div>
                                                            <div className="w-28"><Input type="date" value={sp.startDate} onChange={(e) => updateSeasonal(i, "startDate", e.target.value)} className="h-10 rounded-xl border-zinc-100 bg-zinc-50/50 text-xs" /></div>
                                                            <div className="w-28"><Input type="date" value={sp.endDate} onChange={(e) => updateSeasonal(i, "endDate", e.target.value)} className="h-10 rounded-xl border-zinc-100 bg-zinc-50/50 text-xs" /></div>
                                                            <div className="w-24"><Input type="number" placeholder="₹" value={sp.pricePerNight || ""} onChange={(e) => updateSeasonal(i, "pricePerNight", parseFloat(e.target.value) || 0)} className="h-10 rounded-xl border-zinc-100 bg-zinc-50/50 text-xs" /></div>
                                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeSeasonalPrice(i)} className="h-8 w-8 rounded-lg text-rose-400 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" /></Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}

                                        {/* ── Step 4: Amenities ── */}
                                        {step === 4 && (
                                            <>
                                                {renderSectionHeader("Amenities", "What do you offer?")}
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                                    {AMENITIES_LIST.map((item) => {
                                                        const Icon = item.icon;
                                                        const selected = formData.amenities.includes(item.id);
                                                        return (
                                                            <button key={item.id} type="button" onClick={() => toggleAmenity(item.id)}
                                                                className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold transition-all", selected ? "bg-primary/5 text-primary border border-primary/20" : "bg-zinc-50 text-zinc-500 border border-zinc-50 hover:border-zinc-100")}>
                                                                <Icon className="w-3.5 h-3.5" />{item.label}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        )}

                                        {/* ── Step 5: Food ── */}
                                        {step === 5 && (
                                            <>
                                                {renderSectionHeader("Food & Dining", "Meal options and kitchen")}
                                                {renderToggle("Kitchen Available", "hasKitchen")}
                                                {formData.hasKitchen && (
                                                    <div className="space-y-1.5">
                                                        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Kitchen Details</label>
                                                        <Textarea placeholder="Describe what's in the kitchen..." value={formData.kitchenDetails} onChange={(e) => update("kitchenDetails", e.target.value)} className="min-h-[80px] rounded-xl border-zinc-100 bg-zinc-50/50 text-xs font-medium resize-y" />
                                                    </div>
                                                )}
                                                <div className="space-y-3">
                                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Meal Options</label>
                                                    {MEAL_TYPES.map((mealType) => {
                                                        const meal = formData.meals.find((m) => m.mealType === mealType);
                                                        const selected = !!meal;
                                                        return (
                                                            <div key={mealType} className={cn("border rounded-xl p-3 transition-all", selected ? "border-primary/30 bg-primary/5" : "border-zinc-100")}>
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <button type="button" onClick={() => toggleMeal(mealType)}
                                                                            className={cn("w-12 h-7 rounded-full transition-colors relative", selected ? "bg-primary" : "bg-zinc-200")}>
                                                                            <div className={cn("w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-sm", selected ? "left-6" : "left-1")} />
                                                                        </button>
                                                                        <span className="text-[11px] font-bold text-zinc-700">{mealType}</span>
                                                                    </div>
                                                                    {selected && (
                                                                        <div className="flex items-center gap-3">
                                                                            <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                                                                                Included
                                                                                <button type="button" onClick={() => updateMeal(mealType, "included", !meal.included)}
                                                                                    className={cn("w-9 h-5 rounded-full transition-colors relative", meal.included ? "bg-primary" : "bg-zinc-200")}>
                                                                                    <div className={cn("w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm", meal.included ? "left-4.5" : "left-0.5")} />
                                                                                </button>
                                                                            </label>
                                                                            <div className="relative w-24">
                                                                                <Input type="number" placeholder="Extra ₹" value={meal.extraPrice || ""} onChange={(e) => updateMeal(mealType, "extraPrice", parseFloat(e.target.value) || 0)}
                                                                                    className="h-8 rounded-lg border-zinc-100 bg-white text-[10px] font-medium pl-6" />
                                                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400">₹</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        )}

                                        {/* ── Step 6: Rules ── */}
                                        {step === 6 && (
                                            <>
                                                {renderSectionHeader("House Rules & Policies", "Set expectations for guests")}
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">House Rules</label>
                                                    <div className="flex gap-2">
                                                        <Input placeholder="Add a rule..." className="h-10 rounded-xl border-zinc-100 bg-zinc-50/50 text-xs" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHouseRule((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ""; } }} />
                                                        <Button type="button" variant="outline" size="sm" onClick={() => { const input = document.querySelector<HTMLInputElement>('input[placeholder="Add a rule..."]'); if (input) { addHouseRule(input.value); input.value = ""; } }}
                                                            className="rounded-lg h-10 text-[10px] font-bold"><Plus className="w-3 h-3" /></Button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        {COMMON_HOUSE_RULES.filter((r) => !formData.houseRules.find((hr) => hr.rule === r)).map((rule) => (
                                                            <button key={rule} type="button" onClick={() => addHouseRule(rule)} className="text-[9px] font-bold text-zinc-400 bg-zinc-50 px-2 py-1 rounded-full hover:bg-zinc-100 hover:text-zinc-600 transition-colors">{rule}</button>
                                                        ))}
                                                    </div>
                                                    <div className="space-y-1.5 mt-2">
                                                        {formData.houseRules.map((rule, i) => (
                                                            <div key={i} className="flex items-center gap-2 bg-zinc-50 rounded-lg px-3 py-2">
                                                                <Info className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                                                                <span className="text-[11px] font-medium text-zinc-700 flex-1">{rule.rule}</span>
                                                                <button type="button" onClick={() => removeHouseRule(i)} className="text-rose-400 hover:text-rose-600"><X className="w-3 h-3" /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Cancellation Policy</label>
                                                    <div className="space-y-2">
                                                        {CANCELLATION_POLICIES.map((policy) => (
                                                            <button key={policy.value} type="button" onClick={() => update("cancellationPolicy", policy.value)}
                                                                className={cn("w-full text-left p-3 rounded-xl border text-xs transition-all", formData.cancellationPolicy === policy.value ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-zinc-100 bg-zinc-50/50 hover:border-zinc-200")}>
                                                                <span className="font-bold text-zinc-800">{policy.label}</span> — <span className="text-zinc-500 font-medium">{policy.desc}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Cancellation Details</label>
                                                    <Textarea placeholder="Additional cancellation terms..." value={formData.cancellationDetails} onChange={(e) => update("cancellationDetails", e.target.value)} className="min-h-[80px] rounded-xl border-zinc-100 bg-zinc-50/50 text-xs font-medium resize-y" />
                                                </div>
                                                {renderToggle("Pet Friendly", "isPetFriendly")}
                                                {formData.isPetFriendly && renderInput("Pet Rules", "petRules", "e.g. Only small dogs allowed")}
                                                {renderToggle("Smoking Allowed", "isSmokingAllowed")}
                                                {renderToggle("Parties Allowed", "isPartyAllowed")}
                                                <div className="grid grid-cols-2 gap-3">
                                                    {renderInput("Quiet Hours Start", "quietHoursStart", "10:00 PM")}
                                                    {renderInput("Quiet Hours End", "quietHoursEnd", "7:00 AM")}
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Languages Spoken</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {LANGUAGES.map((lang) => {
                                                            const selected = formData.languagesSpoken.includes(lang);
                                                            return (
                                                                <button key={lang} type="button" onClick={() => toggleLanguage(lang)}
                                                                    className={cn("text-[10px] font-bold px-3 py-1.5 rounded-full transition-all", selected ? "bg-primary text-white" : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100")}>{lang}</button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                {renderToggle("Instant Book", "instantBook")}
                                                {renderInput("Advance Notice (hours)", "advanceNoticeHours", "e.g. 24")}
                                                {renderInput("Max Guests Per Booking", "maxGuestsPerBooking", "e.g. 6")}
                                                {renderInput("Video Tour URL", "videoTourUrl", "YouTube / Vimeo link")}
                                            </>
                                        )}

                                        {/* ── Step 7: Media ── */}
                                        {step === 7 && (
                                            <>
                                                {renderSectionHeader("Media Gallery", "Upload photos of your property")}
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Photos <span className="text-red-400">*</span></label>
                                                    <div className="relative">
                                                        <Input
                                                            ref={fileInputRef}
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handleMediaSelect}
                                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                        />
                                                        <div className="border-2 border-dashed border-zinc-200 rounded-xl p-10 flex flex-col items-center gap-3 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                                                            <Upload className="w-8 h-8 text-zinc-300" />
                                                            <div>
                                                                <p className="text-xs font-bold text-zinc-500">Drag & drop or click to browse</p>
                                                                <p className="text-[10px] text-zinc-400 font-medium mt-0.5">JPEG, PNG, WebP — Max 10 MB each</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {fieldError("media")}
                                                </div>
                                                {(existingMedia.length > 0 || mediaFiles.length > 0) && (
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                        {/* Existing media */}
                                                        {existingMedia.map((m, i) => (
                                                            <div key={m._id} className="relative group rounded-xl overflow-hidden aspect-square bg-zinc-100 shadow-sm">
                                                                <img src={m.url} alt="" className="w-full h-full object-cover" />
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex flex-col justify-between p-2">
                                                                    <div className="flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <Button type="button" variant="ghost" size="icon" onClick={() => setCover(true, i)}
                                                                            className={cn("h-6 w-6 rounded-lg bg-white/80 backdrop-blur-sm", m.isCover ? "text-primary" : "text-zinc-400")} title="Set as cover">
                                                                            <Star className="w-3 h-3" fill={m.isCover ? "currentColor" : "none"} />
                                                                        </Button>
                                                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeExistingMedia(i)}
                                                                            className="h-6 w-6 rounded-lg bg-white/80 backdrop-blur-sm text-rose-400 hover:text-rose-600"><Trash2 className="w-3 h-3" /></Button>
                                                                    </div>
                                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <Input
                                                                            placeholder="Caption..."
                                                                            value={m.caption || ""}
                                                                            onChange={(e) => updateCaption(true, i, e.target.value)}
                                                                            className="h-6 rounded-lg bg-white/80 backdrop-blur-sm text-[10px] font-medium border-0"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {m.isCover && (
                                                                    <span className="absolute top-2 left-2 bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded">COVER</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {/* New media */}
                                                        {mediaFiles.map((m, i) => (
                                                            <div key={`new-${i}`} className="relative group rounded-xl overflow-hidden aspect-square bg-zinc-100 shadow-sm">
                                                                <img src={m.preview} alt="" className="w-full h-full object-cover" />
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex flex-col justify-between p-2">
                                                                    <div className="flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <Button type="button" variant="ghost" size="icon" onClick={() => setCover(false, i)}
                                                                            className={cn("h-6 w-6 rounded-lg bg-white/80 backdrop-blur-sm", m.isCover ? "text-primary" : "text-zinc-400")} title="Set as cover">
                                                                            <Star className="w-3 h-3" fill={m.isCover ? "currentColor" : "none"} />
                                                                        </Button>
                                                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeMedia(i)}
                                                                            className="h-6 w-6 rounded-lg bg-white/80 backdrop-blur-sm text-rose-400 hover:text-rose-600"><Trash2 className="w-3 h-3" /></Button>
                                                                    </div>
                                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <Input
                                                                            placeholder="Caption..."
                                                                            value={m.caption}
                                                                            onChange={(e) => updateCaption(false, i, e.target.value)}
                                                                            className="h-6 rounded-lg bg-white/80 backdrop-blur-sm text-[10px] font-medium border-0"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {m.isCover && (
                                                                    <span className="absolute top-2 left-2 bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded">COVER</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* ── Navigation Buttons ── */}
                                <div className="pt-6 mt-6 border-t border-zinc-50 flex items-center justify-between">
                                    <Button type="button" variant="outline" onClick={prev} disabled={step === 1 || isSubmitting}
                                        className="rounded-xl h-10 text-xs font-bold gap-1.5">
                                        <ChevronLeft className="w-3.5 h-3.5" /> Previous
                                    </Button>
                                    {step === totalSteps ? (
                                        <Button type="button" onClick={handleSubmit} disabled={isSubmitting}
                                            className="rounded-xl h-10 text-xs font-bold gap-2 bg-primary hover:bg-primary/90 px-6">
                                            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <SaveIcon className="w-3.5 h-3.5" />}
                                            {isSubmitting ? "Saving..." : "Save Changes"}
                                        </Button>
                                    ) : (
                                        <Button type="button" onClick={handleNext} className="rounded-xl h-10 text-xs font-bold gap-1.5">
                                            Next <ChevronRight className="w-3.5 h-3.5" />
                                        </Button>
                                    )}
                                </div>
                                {submitError && (
                                    <p className="text-[11px] font-bold text-red-500 mt-3 text-center">{submitError}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}