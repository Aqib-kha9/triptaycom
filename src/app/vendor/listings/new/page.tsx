"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
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
  type LucideIcon,
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ──────────────────────── Types ────────────────────────

type PropertyType =
  | "Villa"
  | "Apartment"
  | "Cottage"
  | "Farmhouse"
  | "Homestay"
  | "Bungalow"
  | "Tent"
  | "Treehouse"
  | "Cabin"
  | "Houseboat"
  | "Other";

type CancellationPolicy = "Flexible" | "Moderate" | "Strict" | "Non-Refundable";

interface NearbyPlace {
  name: string;
  distanceKm: number;
  category: string;
  description?: string;
}

interface MealOption {
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snacks" | "All Meals";
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

interface FormData {
  // Basics
  name: string;
  summary: string;
  description: string;
  propertyType: PropertyType;
  isEntirePlace: boolean;
  floorNumber: string;
  totalFloors: string;
  propertySizeSqFt: string;
  yearBuilt: string;

  // Location
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  landmark: string;
  lat: string;
  lng: string;
  nearbyPlaces: NearbyPlace[];

  // Capacity & Pricing
  maxGuests: string;
  bedrooms: string;
  beds: string;
  bathrooms: string;
  extraMattresses: string;
  basePrice: string;
  weekendPrice: string;
  seasonalPrices: SeasonalPrice[];
  cleaningFee: string;
  securityDeposit: string;
  extraGuestPrice: string;
  taxes: string;
  minStay: string;
  maxStay: string;
  checkInTime: string;
  checkOutTime: string;
  flexibleCheckIn: boolean;
  flexibleCheckOut: boolean;

  // Amenities
  amenities: string[];

  // Food & Dining
  meals: MealOption[];
  hasKitchen: boolean;
  kitchenDetails: string;

  // Rules & Policies
  houseRules: HouseRule[];
  cancellationPolicy: CancellationPolicy;
  cancellationDetails: string;
  isPetFriendly: boolean;
  petRules: string;
  isSmokingAllowed: boolean;
  isPartyAllowed: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  languagesSpoken: string[];

  // Media & Booking
  instantBook: boolean;
  advanceNoticeHours: string;
  maxGuestsPerBooking: string;
  videoTourUrl: string;
}

interface MediaPreview {
  file: File;
  preview: string;
  caption: string;
  isCover: boolean;
}

// ──────────────────────── Constants ────────────────────────

const PROPERTY_TYPES: { value: PropertyType; label: string; icon: LucideIcon }[] = [
  { value: "Villa", label: "Villa", icon: Building2 },
  { value: "Apartment", label: "Apartment", icon: Building2 },
  { value: "Cottage", label: "Cottage", icon: Warehouse },
  { value: "Farmhouse", label: "Farmhouse", icon: Trees },
  { value: "Homestay", label: "Homestay", icon: Home },
  { value: "Bungalow", label: "Bungalow", icon: Building2 },
  { value: "Tent", label: "Tent", icon: Tent },
  { value: "Treehouse", label: "Treehouse", icon: TreePine },
  { value: "Cabin", label: "Cabin", icon: Warehouse },
  { value: "Houseboat", label: "Houseboat", icon: Ship },
  { value: "Other", label: "Other", icon: Home },
];

const AMENITIES_LIST = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "ac", label: "Air Conditioning", icon: Wind },
  { id: "heating", label: "Heating", icon: Flame },
  { id: "parking", label: "Free Parking", icon: Car },
  { id: "pool", label: "Swimming Pool", icon: Waves },
  { id: "kitchen", label: "Kitchen", icon: Utensils },
  { id: "tv", label: "TV / Cable", icon: Tv },
  { id: "washer", label: "Washing Machine", icon: Shirt },
  { id: "dryer", label: "Dryer", icon: Thermometer },
  { id: "workspace", label: "Dedicated Workspace", icon: Monitor },
  { id: "balcony", label: "Balcony / Terrace", icon: Mountain },
  { id: "garden", label: "Garden", icon: Trees },
  { id: "bbq", label: "BBQ Grill", icon: Flame },
  { id: "fireplace", label: "Fireplace", icon: Flame },
  { id: "hotTub", label: "Hot Tub / Jacuzzi", icon: Waves },
  { id: "gym", label: "Gym / Fitness", icon: DumbbellIcon },
  { id: "elevator", label: "Elevator", icon: ArrowUpDownIcon },
  { id: "security", label: "Security Cameras", icon: Shield },
  { id: "firstAid", label: "First Aid Kit", icon: Shield },
  { id: "fireExtinguisher", label: "Fire Extinguisher", icon: Shield },
  { id: "smokeAlarm", label: "Smoke Alarm", icon: Shield },
  { id: "powerBackup", label: "Power Backup", icon: Lightbulb },
  { id: "hotWater", label: "Hot Water", icon: Thermometer },
  { id: "toiletries", label: "Toiletries", icon: Sparkles },
  { id: "linens", label: "Linens & Towels", icon: Bookmark },
  { id: "housekeeping", label: "Housekeeping", icon: Sparkles },
  { id: "roomService", label: "Room Service", icon: Coffee },
  { id: "pickup", label: "Airport Pickup", icon: Car },
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
  "No loud music after 10 PM",
  "No smoking inside the house",
  "No parties or events",
  "Pets are not allowed",
  "Shoes off inside the house",
  "Check-in after 12 PM only",
  "ID proof required at check-in",
  "No unregistered guests",
  "Keep the kitchen clean after use",
  "Lock all doors when leaving",
];

// ──────────────────────── Icons (inline for missing ones) ────────────────────────

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
      <path d="m3 16 4 4 4-4" /><path d="M7 20V4" /><path d="m21 8-4-4-4 4" /><path d="M17 4v16" />
    </svg>
  );
}
function Monitor({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" />
    </svg>
  );
}

// ──────────────────────── Step Definitions ────────────────────────

const STEPS = [
  { id: 1, name: "Basics", icon: <Home className="w-4 h-4" /> },
  { id: 2, name: "Location", icon: <MapPin className="w-4 h-4" /> },
  { id: 3, name: "Pricing", icon: <DollarSign className="w-4 h-4" /> },
  { id: 4, name: "Amenities", icon: <Sparkles className="w-4 h-4" /> },
  { id: 5, name: "Food", icon: <Coffee className="w-4 h-4" /> },
  { id: 6, name: "Rules", icon: <Shield className="w-4 h-4" /> },
  { id: 7, name: "Media", icon: <ImageIcon className="w-4 h-4" /> },
];

// ──────────────────────── Initial Form Data ────────────────────────

const INITIAL_FORM_DATA: FormData = {
  name: "",
  summary: "",
  description: "",
  propertyType: "Homestay",
  isEntirePlace: true,
  floorNumber: "",
  totalFloors: "",
  propertySizeSqFt: "",
  yearBuilt: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  zipCode: "",
  landmark: "",
  lat: "",
  lng: "",
  nearbyPlaces: [],
  maxGuests: "2",
  bedrooms: "1",
  beds: "1",
  bathrooms: "1",
  extraMattresses: "0",
  basePrice: "",
  weekendPrice: "",
  seasonalPrices: [],
  cleaningFee: "0",
  securityDeposit: "0",
  extraGuestPrice: "0",
  taxes: "0",
  minStay: "1",
  maxStay: "0",
  checkInTime: "12:00 PM",
  checkOutTime: "11:00 AM",
  flexibleCheckIn: false,
  flexibleCheckOut: false,
  amenities: [],
  meals: [],
  hasKitchen: false,
  kitchenDetails: "",
  houseRules: [],
  cancellationPolicy: "Moderate",
  cancellationDetails: "",
  isPetFriendly: false,
  petRules: "",
  isSmokingAllowed: false,
  isPartyAllowed: false,
  quietHoursStart: "",
  quietHoursEnd: "",
  languagesSpoken: [],
  instantBook: true,
  advanceNoticeHours: "0",
  maxGuestsPerBooking: "",
  videoTourUrl: "",
};

const FILLER_DATA: FormData = {
  name: "Whispering Pines Cottage",
  summary: "A cozy mountain retreat with stunning valley views, surrounded by pine forests and apple orchards. Perfect for families and couples seeking peace.",
  description: "Nestled at 7,000 feet in the Himalayas, Whispering Pines Cottage offers a tranquil escape from city life. Wake up to panoramic mountain views, enjoy home-cooked meals, and explore nearby trails. The cottage features wooden interiors, a sun-drenched balcony, and a warm fireplace for chilly evenings. Our family has been hosting guests for over 10 years, and we take pride in offering authentic Himachali hospitality.",
  propertyType: "Cottage",
  isEntirePlace: true,
  floorNumber: "1",
  totalFloors: "2",
  propertySizeSqFt: "1200",
  yearBuilt: "2018",
  address: "Village Shuru, P.O. Prini, Near Hidimba Temple Road",
  city: "Manali",
  state: "Himachal Pradesh",
  country: "India",
  zipCode: "175131",
  landmark: "Hidimba Devi Temple",
  lat: "32.2396",
  lng: "77.1887",
  nearbyPlaces: [
    { name: "Hidimba Temple", distanceKm: 1.5, category: "Temple" },
    { name: "Old Manali Market", distanceKm: 3.2, category: "Market" },
    { name: "Solang Valley", distanceKm: 12.0, category: "Tourist Spot" },
  ],
  maxGuests: "6",
  bedrooms: "3",
  beds: "3",
  bathrooms: "2",
  extraMattresses: "2",
  basePrice: "2500",
  weekendPrice: "3200",
  seasonalPrices: [
    { seasonName: "Summer Peak (May-Jun)", startDate: "2026-05-01", endDate: "2026-06-30", pricePerNight: 3500 },
    { seasonName: "Christmas & New Year", startDate: "2026-12-22", endDate: "2027-01-02", pricePerNight: 5000 },
  ],
  cleaningFee: "300",
  securityDeposit: "2000",
  extraGuestPrice: "500",
  taxes: "12",
  minStay: "1",
  maxStay: "30",
  checkInTime: "12:00 PM",
  checkOutTime: "11:00 AM",
  flexibleCheckIn: true,
  flexibleCheckOut: false,
  amenities: ["wifi", "parking", "kitchen", "heating", "hotWater", "workspace", "balcony", "fireplace", "powerBackup", "linens", "toiletries", "firstAid", "fireExtinguisher"],
  meals: [
    { mealType: "Breakfast", included: true, extraPrice: 200 },
    { mealType: "Dinner", included: true, extraPrice: 350 },
  ],
  hasKitchen: true,
  kitchenDetails: "Fully equipped with gas stove, microwave, refrigerator, toaster, and basic utensils. Tea/coffee maker provided.",
  houseRules: [
    { rule: "No loud music after 10 PM" },
    { rule: "Smoking only in designated outdoor areas" },
    { rule: "Pets allowed with prior approval" },
    { rule: "Shoes off inside the house" },
  ],
  cancellationPolicy: "Moderate",
  cancellationDetails: "Free cancellation up to 5 days before check-in. 50% refund up to 2 days before. No refund for cancellations within 48 hours.",
  isPetFriendly: true,
  petRules: "Pets allowed on the ground floor only. Please bring your pet's bedding.",
  isSmokingAllowed: false,
  isPartyAllowed: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
  languagesSpoken: ["English", "Hindi", "Punjabi"],
  instantBook: true,
  advanceNoticeHours: "24",
  maxGuestsPerBooking: "6",
  videoTourUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
};

// ──────────────────────── Component ────────────────────────

export default function AddHomestayPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({ ...INITIAL_FORM_DATA });
  const [mediaFiles, setMediaFiles] = useState<MediaPreview[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [listingId, setListingId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAutoFill = () => {
    setFormData({ ...FILLER_DATA });
    setErrors({});
    setSubmitSuccess(false);
    setSubmitError("");
  };

  const totalSteps = 7;

  // ── Navigation ──
  const next = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  // ── Form Field Update ──
  const update = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ── Toggle Amenity ──
  const toggleAmenity = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((a) => a !== id)
        : [...prev.amenities, id],
    }));
  };

  // ── Toggle Language ──
  const toggleLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languagesSpoken: prev.languagesSpoken.includes(lang)
        ? prev.languagesSpoken.filter((l) => l !== lang)
        : [...prev.languagesSpoken, lang],
    }));
  };

  // ── Meal Management ──
  const toggleMeal = (mealType: MealOption["mealType"]) => {
    setFormData((prev) => {
      const exists = prev.meals.find((m) => m.mealType === mealType);
      if (exists) {
        return { ...prev, meals: prev.meals.filter((m) => m.mealType !== mealType) };
      }
      return {
        ...prev,
        meals: [...prev.meals, { mealType, included: false, extraPrice: 0 }],
      };
    });
  };
  const updateMeal = (mealType: MealOption["mealType"], field: keyof MealOption, value: any) => {
    setFormData((prev) => ({
      ...prev,
      meals: prev.meals.map((m) =>
        m.mealType === mealType ? { ...m, [field]: value } : m
      ),
    }));
  };

  // ── House Rule Management ──
  const addHouseRule = (rule: string) => {
    if (!rule.trim()) return;
    if (formData.houseRules.some((r) => r.rule === rule.trim())) return;
    setFormData((prev) => ({
      ...prev,
      houseRules: [...prev.houseRules, { rule: rule.trim() }],
    }));
  };
  const removeHouseRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      houseRules: prev.houseRules.filter((_, i) => i !== index),
    }));
  };
  const [customRule, setCustomRule] = useState("");

  // ── Nearby Place Management ──
  const [newNearby, setNewNearby] = useState<NearbyPlace>({
    name: "",
    distanceKm: 0,
    category: "Restaurant",
    description: "",
  });
  const addNearbyPlace = () => {
    if (!newNearby.name.trim() || newNearby.distanceKm <= 0) return;
    setFormData((prev) => ({
      ...prev,
      nearbyPlaces: [...prev.nearbyPlaces, { ...newNearby }],
    }));
    setNewNearby({ name: "", distanceKm: 0, category: "Restaurant", description: "" });
  };
  const removeNearbyPlace = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      nearbyPlaces: prev.nearbyPlaces.filter((_, i) => i !== index),
    }));
  };

  // ── Seasonal Price Management ──
  const [newSeason, setNewSeason] = useState<SeasonalPrice>({
    seasonName: "",
    startDate: "",
    endDate: "",
    pricePerNight: 0,
  });
  const addSeasonalPrice = () => {
    if (!newSeason.seasonName.trim() || !newSeason.startDate || !newSeason.endDate || newSeason.pricePerNight <= 0) return;
    setFormData((prev) => ({
      ...prev,
      seasonalPrices: [...prev.seasonalPrices, { ...newSeason }],
    }));
    setNewSeason({ seasonName: "", startDate: "", endDate: "", pricePerNight: 0 });
  };
  const removeSeasonalPrice = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      seasonalPrices: prev.seasonalPrices.filter((_, i) => i !== index),
    }));
  };

  // ── Media Handling ──
  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles: MediaPreview[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (mediaFiles.length + newFiles.length >= 15) break;
      if (file.size > 10 * 1024 * 1024) {
        setSubmitError("Each file must be under 10 MB.");
        continue;
      }
      newFiles.push({
        file,
        preview: URL.createObjectURL(file),
        caption: "",
        isCover: mediaFiles.length === 0 && newFiles.length === 0,
      });
    }
    setMediaFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const removeMedia = (index: number) => {
    setMediaFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (prev[index]?.isCover && updated.length > 0) {
        updated[0].isCover = true;
      }
      return updated;
    });
  };
  const setCover = (index: number) => {
    setMediaFiles((prev) =>
      prev.map((m, i) => ({ ...m, isCover: i === index }))
    );
  };
  const updateCaption = (index: number, caption: string) => {
    setMediaFiles((prev) =>
      prev.map((m, i) => (i === index ? { ...m, caption } : m))
    );
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
    if (step === 7) {
      if (mediaFiles.length === 0) newErrors.media = "Upload at least 1 photo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) next();
  };

  // ── Submit Listing ──
  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const token = localStorage.getItem("token");
      const payload: any = {
        name: formData.name.trim(),
        summary: formData.summary.trim(),
        description: formData.description.trim(),
        propertyType: formData.propertyType,
        isEntirePlace: formData.isEntirePlace,
        floorNumber: formData.floorNumber ? parseInt(formData.floorNumber) : undefined,
        totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : undefined,
        propertySizeSqFt: formData.propertySizeSqFt ? parseInt(formData.propertySizeSqFt) : undefined,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim(),
        zipCode: formData.zipCode.trim(),
        landmark: formData.landmark.trim() || undefined,
        coordinates: { lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) },
        maxGuests: parseInt(formData.maxGuests),
        bedrooms: parseInt(formData.bedrooms),
        beds: parseInt(formData.beds),
        bathrooms: parseInt(formData.bathrooms),
        extraMattresses: parseInt(formData.extraMattresses) || 0,
        basePrice: parseFloat(formData.basePrice),
        weekendPrice: formData.weekendPrice ? parseFloat(formData.weekendPrice) : undefined,
        seasonalPrices: formData.seasonalPrices,
        cleaningFee: parseFloat(formData.cleaningFee) || 0,
        securityDeposit: parseFloat(formData.securityDeposit) || 0,
        extraGuestPrice: parseFloat(formData.extraGuestPrice) || 0,
        taxes: parseFloat(formData.taxes) || 0,
        minStay: parseInt(formData.minStay) || 1,
        maxStay: parseInt(formData.maxStay) || 0,
        checkInTime: formData.checkInTime,
        checkOutTime: formData.checkOutTime,
        flexibleCheckIn: formData.flexibleCheckIn,
        flexibleCheckOut: formData.flexibleCheckOut,
        amenities: formData.amenities,
        meals: formData.meals,
        hasKitchen: formData.hasKitchen,
        kitchenDetails: formData.kitchenDetails.trim() || undefined,
        houseRules: formData.houseRules,
        cancellationPolicy: formData.cancellationPolicy,
        cancellationDetails: formData.cancellationDetails.trim() || undefined,
        isPetFriendly: formData.isPetFriendly,
        petRules: formData.petRules.trim() || undefined,
        isSmokingAllowed: formData.isSmokingAllowed,
        isPartyAllowed: formData.isPartyAllowed,
        quietHoursStart: formData.quietHoursStart || undefined,
        quietHoursEnd: formData.quietHoursEnd || undefined,
        nearbyPlaces: formData.nearbyPlaces,
        languagesSpoken: formData.languagesSpoken,
        instantBook: formData.instantBook,
        advanceNoticeHours: parseInt(formData.advanceNoticeHours) || 0,
        maxGuestsPerBooking: formData.maxGuestsPerBooking
          ? parseInt(formData.maxGuestsPerBooking)
          : parseInt(formData.maxGuests),
        videoTourUrl: formData.videoTourUrl.trim() || undefined,
        status: "published",
      };

      // Step 1: Create the listing
      const res = await fetch("http://localhost:5000/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to create listing");
      }

      const createdId = json.data.listing._id;
      setListingId(createdId);

      // Step 2: Upload media files if any
      if (mediaFiles.length > 0) {
        const formDataUpload = new FormData();
        mediaFiles.forEach((m, i) => {
          formDataUpload.append("files", m.file);
          if (m.caption) formDataUpload.append("captions", m.caption);
          if (m.isCover) formDataUpload.append("isCover", "true");
        });

        const uploadRes = await fetch(`http://localhost:5000/api/listings/${createdId}/media`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
          body: formDataUpload,
        });

        if (!uploadRes.ok) {
          console.warn("Media upload partially failed — listing saved as draft.");
        }
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render: Field Error ──
  const fieldError = (field: string) =>
    errors[field] ? (
      <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {errors[field]}
      </p>
    ) : null;

  // ── Render: Step Indicator ──
  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 sm:pb-0 gap-2 sm:gap-4">
      {STEPS.map((s) => (
        <button
          key={s.id}
          onClick={() => setStep(s.id)}
          className="flex items-center gap-2 sm:gap-3 shrink-0 group"
        >
          <div
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all border-2",
              step === s.id
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                : step > s.id
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-white border-zinc-100 text-zinc-400 group-hover:border-zinc-200"
            )}
          >
            {step > s.id ? <Check className="w-4 h-4" /> : s.icon}
          </div>
          <span
            className={cn(
              "text-[10px] font-black uppercase tracking-widest hidden md:block",
              step >= s.id ? "text-zinc-900" : "text-zinc-400"
            )}
          >
            {s.name}
          </span>
          {s.id !== totalSteps && (
            <div className={cn("w-4 sm:w-8 h-0.5", step > s.id ? "bg-primary" : "bg-zinc-100")} />
          )}
        </button>
      ))}
    </div>
  );

  // ── Render: Section Header ──
  const renderSectionHeader = (title: string, subtitle: string) => (
    <div className="space-y-1 mb-6">
      <h2 className="text-xl font-bold text-zinc-900">{title}</h2>
      <p className="text-xs text-zinc-500 font-medium italic">{subtitle}</p>
    </div>
  );

  // ── Render: Input Field ──
  const renderInput = (
    label: string,
    field: keyof FormData,
    options?: { type?: string; placeholder?: string; prefix?: string; suffix?: string; className?: string }
  ) => (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
        {label}
      </label>
      <div className="relative">
        {options?.prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
            {options.prefix}
          </span>
        )}
        <Input
          type={options?.type || "text"}
          placeholder={options?.placeholder}
          value={String(formData[field] ?? "")}
          onChange={(e) => update(field, e.target.value)}
          className={cn(
            "h-11 rounded-xl border-zinc-100 bg-zinc-50 text-xs font-medium",
            options?.prefix && "pl-9",
            options?.suffix && "pr-9",
            options?.className,
            errors[field] && "border-red-300 bg-red-50"
          )}
        />
        {options?.suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400">
            {options.suffix}
          </span>
        )}
      </div>
      {fieldError(field)}
    </div>
  );

  // ── Render: Toggle ──
  const renderToggle = (label: string, field: keyof FormData, description?: string) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-100">
      <div className="space-y-0.5">
        <span className="text-xs font-bold text-zinc-900">{label}</span>
        {description && <p className="text-[10px] text-zinc-400">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => update(field, !formData[field])}
        className={cn(
          "w-11 h-6 rounded-full transition-colors relative",
          formData[field] ? "bg-primary" : "bg-zinc-200"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
            formData[field] ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );

  // ── Status Banner ──
  if (submitSuccess) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
        <Navbar />
        <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md mx-auto px-4">
            <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900">Listing Created!</h2>
            <p className="text-sm text-zinc-500">
              Your homestay listing has been saved as a draft. You can publish it from your listings dashboard.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                className="rounded-xl h-11 px-6 text-xs font-bold"
                onClick={() => {
                  setFormData({ ...INITIAL_FORM_DATA });
                  setMediaFiles([]);
                  setStep(1);
                  setSubmitSuccess(false);
                  setListingId("");
                }}
              >
                Add Another
              </Button>
              <Button
                className="rounded-xl h-11 px-6 text-xs font-bold"
                onClick={() => (window.location.href = "/vendor/listings")}
              >
                View My Listings
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-4">
            {renderStepIndicator()}
          </div>

          {/* Quick Fill Button */}
          <div className="flex justify-end mb-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAutoFill}
              className="rounded-xl border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-300 gap-1.5 font-bold text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Quick Fill Sample Data
            </Button>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {/* ── STEP 1: Property Basics ── */}
                {step === 1 && (
                  <div className="space-y-6">
                    {renderSectionHeader("Property Basics", "Tell guests about your homestay.")}

                    {renderInput("Property Name", "name", {
                      placeholder: "e.g. Mountain Whisper Villa",
                    })}

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                        Short Summary
                      </label>
                      <Input
                        placeholder="A cozy 2-bedroom villa with stunning mountain views..."
                        value={formData.summary}
                        onChange={(e) => update("summary", e.target.value)}
                        maxLength={200}
                        className={cn("h-11 rounded-xl border-zinc-100 bg-zinc-50 text-xs font-medium", errors.summary && "border-red-300 bg-red-50")}
                      />
                      <p className="text-[10px] text-zinc-400 ml-1">
                        {formData.summary.length}/200 — Appears on listing cards
                      </p>
                      {fieldError("summary")}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                        Full Description
                      </label>
                      <Textarea
                        placeholder="Describe your space, the neighbourhood, what makes it unique..."
                        value={formData.description}
                        onChange={(e) => update("description", e.target.value)}
                        maxLength={5000}
                        rows={6}
                        className={cn("rounded-xl border-zinc-100 bg-zinc-50 text-xs font-medium resize-none", errors.description && "border-red-300 bg-red-50")}
                      />
                      {fieldError("description")}
                    </div>

                    {/* Property Type */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                        Property Type
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {PROPERTY_TYPES.map((pt) => {
                          const Icon = pt.icon;
                          return (
                            <button
                              key={pt.value}
                              type="button"
                              onClick={() => update("propertyType", pt.value)}
                              className={cn(
                                "flex items-center gap-2 p-3 rounded-xl border transition-all text-left",
                                formData.propertyType === pt.value
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-zinc-100 bg-zinc-50 text-zinc-600 hover:border-zinc-200"
                              )}
                            >
                              <Icon className="w-4 h-4 shrink-0" />
                              <span className="text-[10px] font-bold uppercase tracking-tight">{pt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                      {fieldError("propertyType")}
                    </div>

                    {renderToggle("Entire place to yourself", "isEntirePlace", "Guests get the whole property, not just a room")}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {renderInput("Floor Number", "floorNumber", { type: "number", placeholder: "0 = Ground" })}
                      {renderInput("Total Floors", "totalFloors", { type: "number", placeholder: "1" })}
                      {renderInput("Property Size (sq ft)", "propertySizeSqFt", { type: "number", placeholder: "1200" })}
                      {renderInput("Year Built", "yearBuilt", { type: "number", placeholder: "2020" })}
                    </div>
                  </div>
                )}

                {/* ── STEP 2: Location ── */}
                {step === 2 && (
                  <div className="space-y-6">
                    {renderSectionHeader("Location", "Where is your property located?")}

                    {renderInput("Street Address", "address", { placeholder: "123, Hill Road, Near Mall" })}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {renderInput("City", "city", { placeholder: "Manali" })}
                      {renderInput("State", "state", { placeholder: "Himachal Pradesh" })}
                      {renderInput("Country", "country", { placeholder: "India" })}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {renderInput("ZIP / Postal Code", "zipCode", { placeholder: "175131" })}
                      {renderInput("Landmark", "landmark", { placeholder: "Near Mall Road" })}
                    </div>

                    {/* GPS Coordinates */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                        GPS Coordinates
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400">Lat</span>
                          <Input
                            type="number"
                            step="any"
                            placeholder="32.2396"
                            value={formData.lat}
                            onChange={(e) => update("lat", e.target.value)}
                            className={cn("h-11 pl-14 rounded-xl border-zinc-100 bg-zinc-50 text-xs", errors.coordinates && "border-red-300 bg-red-50")}
                          />
                        </div>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400">Lng</span>
                          <Input
                            type="number"
                            step="any"
                            placeholder="77.1025"
                            value={formData.lng}
                            onChange={(e) => update("lng", e.target.value)}
                            className={cn("h-11 pl-14 rounded-xl border-zinc-100 bg-zinc-50 text-xs", errors.coordinates && "border-red-300 bg-red-50")}
                          />
                        </div>
                      </div>
                      {fieldError("coordinates")}
                    </div>

                    {/* Nearby Places */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                        Nearby Places
                      </label>
                      <div className="bg-zinc-50 rounded-xl border border-zinc-100 p-4 space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <Input
                            placeholder="Place name"
                            value={newNearby.name}
                            onChange={(e) => setNewNearby((p) => ({ ...p, name: e.target.value }))}
                            className="h-9 rounded-lg border-zinc-200 bg-white text-[10px]"
                          />
                          <Input
                            type="number"
                            placeholder="Distance (km)"
                            value={newNearby.distanceKm || ""}
                            onChange={(e) => setNewNearby((p) => ({ ...p, distanceKm: parseFloat(e.target.value) || 0 }))}
                            className="h-9 rounded-lg border-zinc-200 bg-white text-[10px]"
                          />
                          <select
                            value={newNearby.category}
                            onChange={(e) => setNewNearby((p) => ({ ...p, category: e.target.value }))}
                            className="h-9 rounded-lg border border-zinc-200 bg-white text-[10px] font-medium px-2"
                          >
                            {NEARBY_CATEGORIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <Button
                            type="button"
                            onClick={addNearbyPlace}
                            disabled={!newNearby.name.trim() || newNearby.distanceKm <= 0}
                            className="h-9 rounded-lg text-[10px] font-bold"
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add
                          </Button>
                        </div>
                        {formData.nearbyPlaces.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.nearbyPlaces.map((np, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-100 rounded-lg text-[10px] font-bold text-zinc-700"
                              >
                                <Navigation className="w-3 h-3 text-zinc-400" />
                                {np.name} ({np.distanceKm}km) — {np.category}
                                <button onClick={() => removeNearbyPlace(i)} className="ml-1 text-zinc-400 hover:text-red-500">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Capacity & Pricing ── */}
                {step === 3 && (
                  <div className="space-y-6">
                    {renderSectionHeader("Capacity & Pricing", "How many guests and what's the cost?")}

                    {/* Capacity */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                        Guest Capacity
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[
                          { field: "maxGuests" as keyof FormData, label: "Max Guests", icon: Users },
                          { field: "bedrooms" as keyof FormData, label: "Bedrooms", icon: Bed },
                          { field: "beds" as keyof FormData, label: "Beds", icon: Bed },
                          { field: "bathrooms" as keyof FormData, label: "Bathrooms", icon: Bath },
                          { field: "extraMattresses" as keyof FormData, label: "Extra Mattresses", icon: Plus },
                        ].map(({ field, label, icon: Icon }) => (
                          <div key={field} className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase">{label}</label>
                            <div className="relative">
                              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                              <Input
                                type="number"
                                min={field === "extraMattresses" ? 0 : 1}
                                value={String(formData[field] ?? "")}
                                onChange={(e) => update(field, e.target.value)}
                                className={cn("h-10 pl-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs", errors[field] && "border-red-300 bg-red-50")}
                              />
                            </div>
                            {fieldError(field)}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                        Pricing (INR)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          { field: "basePrice" as keyof FormData, label: "Base Price / Night", required: true },
                          { field: "weekendPrice" as keyof FormData, label: "Weekend Price / Night" },
                          { field: "extraGuestPrice" as keyof FormData, label: "Extra Guest / Night" },
                          { field: "cleaningFee" as keyof FormData, label: "Cleaning Fee" },
                          { field: "securityDeposit" as keyof FormData, label: "Security Deposit" },
                          { field: "taxes" as keyof FormData, label: "Taxes (%)" },
                        ].map(({ field, label, required }) => (
                          <div key={field} className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                              {label} {required && <span className="text-red-400">*</span>}
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">₹</span>
                              <Input
                                type="number"
                                min="0"
                                step="any"
                                placeholder="0"
                                value={String(formData[field] ?? "")}
                                onChange={(e) => update(field, e.target.value)}
                                className={cn("h-10 pl-9 rounded-xl border-zinc-100 bg-zinc-50 text-xs", errors[field] && "border-red-300 bg-red-50")}
                              />
                              {field === "taxes" && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400">%</span>}
                            </div>
                            {fieldError(field)}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Seasonal Pricing */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                        Seasonal Pricing
                      </label>
                      <div className="bg-zinc-50 rounded-xl border border-zinc-100 p-4 space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <Input
                            placeholder="Season name"
                            value={newSeason.seasonName}
                            onChange={(e) => setNewSeason((s) => ({ ...s, seasonName: e.target.value }))}
                            className="h-9 rounded-lg border-zinc-200 bg-white text-[10px]"
                          />
                          <Input
                            type="date"
                            value={newSeason.startDate}
                            onChange={(e) => setNewSeason((s) => ({ ...s, startDate: e.target.value }))}
                            className="h-9 rounded-lg border-zinc-200 bg-white text-[10px]"
                          />
                          <Input
                            type="date"
                            value={newSeason.endDate}
                            onChange={(e) => setNewSeason((s) => ({ ...s, endDate: e.target.value }))}
                            className="h-9 rounded-lg border-zinc-200 bg-white text-[10px]"
                          />
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400">₹</span>
                              <Input
                                type="number"
                                placeholder="Price"
                                value={newSeason.pricePerNight || ""}
                                onChange={(e) => setNewSeason((s) => ({ ...s, pricePerNight: parseFloat(e.target.value) || 0 }))}
                                className="h-9 pl-7 rounded-lg border-zinc-200 bg-white text-[10px]"
                              />
                            </div>
                            <Button
                              type="button"
                              onClick={addSeasonalPrice}
                              disabled={!newSeason.seasonName || !newSeason.startDate || !newSeason.endDate || newSeason.pricePerNight <= 0}
                              className="h-9 rounded-lg text-[10px] font-bold"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        {formData.seasonalPrices.length > 0 && (
                          <div className="space-y-1.5">
                            {formData.seasonalPrices.map((sp, i) => (
                              <div key={i} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-zinc-100">
                                <span className="text-[10px] font-bold text-zinc-700">
                                  {sp.seasonName}: {sp.startDate} → {sp.endDate} — ₹{sp.pricePerNight}/night
                                </span>
                                <button onClick={() => removeSeasonalPrice(i)} className="text-zinc-400 hover:text-red-500">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stay Rules */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {renderInput("Min Stay (nights)", "minStay", { type: "number", placeholder: "1" })}
                      {renderInput("Max Stay (nights)", "maxStay", { type: "number", placeholder: "0 = no limit" })}
                      {renderInput("Check-in Time", "checkInTime", { placeholder: "12:00 PM" })}
                      {renderInput("Check-out Time", "checkOutTime", { placeholder: "11:00 AM" })}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {renderToggle("Flexible Check-in", "flexibleCheckIn")}
                      {renderToggle("Flexible Check-out", "flexibleCheckOut")}
                    </div>
                  </div>
                )}

                {/* ── STEP 4: Amenities ── */}
                {step === 4 && (
                  <div className="space-y-6">
                    {renderSectionHeader("Amenities", "What facilities do you offer?")}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {AMENITIES_LIST.map((item) => {
                        const Icon = item.icon;
                        const selected = formData.amenities.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleAmenity(item.id)}
                            className={cn(
                              "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all",
                              selected
                                ? "border-primary bg-primary/5 text-primary shadow-sm"
                                : "border-zinc-100 bg-zinc-50 text-zinc-500 hover:bg-white hover:border-zinc-200"
                            )}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-bold text-center leading-tight">{item.label}</span>
                            {selected && (
                              <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-zinc-400 text-center">
                      {formData.amenities.length} amenity(s) selected
                    </p>
                  </div>
                )}

                {/* ── STEP 5: Food & Dining ── */}
                {step === 5 && (
                  <div className="space-y-6">
                    {renderSectionHeader("Food & Dining", "What meals and kitchen facilities are available?")}

                    {/* Meals */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                        Meal Options
                      </label>
                      <div className="space-y-2">
                        {MEAL_TYPES.map((mealType) => {
                          const meal = formData.meals.find((m) => m.mealType === mealType);
                          const isAdded = !!meal;
                          return (
                            <div
                              key={mealType}
                              className={cn(
                                "rounded-xl border transition-all",
                                isAdded ? "border-primary/30 bg-primary/[0.02]" : "border-zinc-100 bg-zinc-50"
                              )}
                            >
                              <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => toggleMeal(mealType)}
                                    className={cn(
                                      "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                                      isAdded ? "border-primary bg-primary text-white" : "border-zinc-200"
                                    )}
                                  >
                                    {isAdded && <Check className="w-3 h-3" />}
                                  </button>
                                  <span className="text-xs font-bold text-zinc-900">{mealType}</span>
                                </div>
                                {isAdded && (
                                  <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                                      <input
                                        type="checkbox"
                                        checked={meal.included}
                                        onChange={(e) => updateMeal(mealType, "included", e.target.checked)}
                                        className="rounded"
                                      />
                                      Included
                                    </label>
                                    {!meal.included && (
                                      <div className="relative w-24">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400">₹</span>
                                        <Input
                                          type="number"
                                          placeholder="0"
                                          value={meal.extraPrice || ""}
                                          onChange={(e) => updateMeal(mealType, "extraPrice", parseFloat(e.target.value) || 0)}
                                          className="h-8 pl-7 rounded-lg border-zinc-200 bg-white text-[10px]"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Kitchen */}
                    {renderToggle("Kitchen Available", "hasKitchen", "Guests can use the kitchen")}
                    {formData.hasKitchen && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                          Kitchen Details
                        </label>
                        <Textarea
                          placeholder="What equipment is available? (e.g., gas stove, microwave, refrigerator, utensils)"
                          value={formData.kitchenDetails}
                          onChange={(e) => update("kitchenDetails", e.target.value)}
                          maxLength={500}
                          rows={3}
                          className="rounded-xl border-zinc-100 bg-zinc-50 text-xs font-medium resize-none"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* ── STEP 6: Rules & Policies ── */}
                {step === 6 && (
                  <div className="space-y-6">
                    {renderSectionHeader("House Rules & Policies", "Set expectations for your guests.")}

                    {/* House Rules */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                        House Rules
                      </label>
                      <div className="bg-zinc-50 rounded-xl border border-zinc-100 p-4 space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a rule..."
                            value={customRule}
                            onChange={(e) => setCustomRule(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addHouseRule(customRule);
                                setCustomRule("");
                              }
                            }}
                            className="h-9 rounded-lg border-zinc-200 bg-white text-[10px] flex-1"
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              addHouseRule(customRule);
                              setCustomRule("");
                            }}
                            disabled={!customRule.trim()}
                            className="h-9 rounded-lg text-[10px] font-bold"
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add
                          </Button>
                        </div>
                        {/* Common rules suggestions */}
                        <div className="flex flex-wrap gap-1.5">
                          {COMMON_HOUSE_RULES.filter((r) => !formData.houseRules.find((hr) => hr.rule === r)).map((rule) => (
                            <button
                              key={rule}
                              type="button"
                              onClick={() => addHouseRule(rule)}
                              className="text-[10px] px-2.5 py-1 rounded-lg bg-white border border-zinc-100 text-zinc-500 hover:text-primary hover:border-primary/30 transition-colors"
                            >
                              + {rule}
                            </button>
                          ))}
                        </div>
                        {formData.houseRules.length > 0 && (
                          <div className="space-y-1.5">
                            {formData.houseRules.map((rule, i) => (
                              <div key={i} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-zinc-100">
                                <span className="text-[10px] font-bold text-zinc-700">{rule.rule}</span>
                                <button onClick={() => removeHouseRule(i)} className="text-zinc-400 hover:text-red-500">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cancellation Policy */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                        Cancellation Policy
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {CANCELLATION_POLICIES.map((policy) => (
                          <button
                            key={policy.value}
                            type="button"
                            onClick={() => update("cancellationPolicy", policy.value)}
                            className={cn(
                              "p-3 rounded-xl border text-left transition-all",
                              formData.cancellationPolicy === policy.value
                                ? "border-primary bg-primary/5"
                                : "border-zinc-100 bg-zinc-50 hover:border-zinc-200"
                            )}
                          >
                            <div className="text-xs font-bold text-zinc-900">{policy.label}</div>
                            <div className="text-[10px] text-zinc-400 mt-0.5">{policy.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                        Cancellation Details (Optional)
                      </label>
                      <Textarea
                        placeholder="Additional cancellation terms..."
                        value={formData.cancellationDetails}
                        onChange={(e) => update("cancellationDetails", e.target.value)}
                        maxLength={1000}
                        rows={3}
                        className="rounded-xl border-zinc-100 bg-zinc-50 text-xs font-medium resize-none"
                      />
                    </div>

                    {/* Toggles */}
                    <div className="space-y-3">
                      {renderToggle("Pet Friendly", "isPetFriendly")}
                      {formData.isPetFriendly && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                            Pet Rules
                          </label>
                          <Input
                            placeholder="e.g. Only small dogs, must be leashed in common areas"
                            value={formData.petRules}
                            onChange={(e) => update("petRules", e.target.value)}
                            maxLength={300}
                            className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs"
                          />
                        </div>
                      )}
                      {renderToggle("Smoking Allowed", "isSmokingAllowed")}
                      {renderToggle("Parties / Events Allowed", "isPartyAllowed")}
                    </div>

                    {/* Quiet Hours */}
                    <div className="grid grid-cols-2 gap-4">
                      {renderInput("Quiet Hours Start", "quietHoursStart", { placeholder: "10:00 PM" })}
                      {renderInput("Quiet Hours End", "quietHoursEnd", { placeholder: "7:00 AM" })}
                    </div>

                    {/* Languages */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                        Languages Spoken
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {LANGUAGES.map((lang) => {
                          const selected = formData.languagesSpoken.includes(lang);
                          return (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => toggleLanguage(lang)}
                              className={cn(
                                "text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all",
                                selected
                                  ? "border-primary bg-primary text-white"
                                  : "border-zinc-100 bg-white text-zinc-500 hover:border-zinc-200"
                              )}
                            >
                              {lang}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 7: Media & Publish ── */}
                {step === 7 && (
                  <div className="space-y-6">
                    {renderSectionHeader("Media Gallery", "Upload photos and a video tour of your property.")}

                    {/* Photo Upload */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                        Photos ({mediaFiles.length}/15)
                      </label>
                      <div
                        className={cn(
                          "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-zinc-50 hover:bg-zinc-100/50 transition-colors cursor-pointer group",
                          errors.media && "border-red-300 bg-red-50"
                        )}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-zinc-300 group-hover:text-primary shadow-sm">
                          <Camera className="w-7 h-7" />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-zinc-900">Click to upload photos</p>
                          <p className="text-[10px] text-zinc-400 font-medium mt-1">
                            Up to 15 images, max 10 MB each (JPEG, PNG, WebP)
                          </p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={handleMediaSelect}
                          className="hidden"
                        />
                      </div>
                      {fieldError("media")}
                    </div>

                    {/* Media Preview Grid */}
                    {mediaFiles.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {mediaFiles.map((m, i) => (
                          <div
                            key={i}
                            className={cn(
                              "relative group rounded-xl overflow-hidden border-2 transition-all aspect-square",
                              m.isCover ? "border-primary ring-2 ring-primary/20" : "border-zinc-100"
                            )}
                          >
                            <img
                              src={m.preview}
                              alt={`Preview ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex flex-col justify-end p-2">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                                <Input
                                  placeholder="Caption..."
                                  value={m.caption}
                                  onChange={(e) => updateCaption(i, e.target.value)}
                                  className="h-7 rounded-lg text-[10px] bg-white/90 border-0"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex gap-1">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant={m.isCover ? "default" : "outline"}
                                    className="h-6 rounded-lg text-[10px] px-2"
                                    onClick={(e) => { e.stopPropagation(); setCover(i); }}
                                  >
                                    <Star className="w-3 h-3 mr-1" /> Cover
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="h-6 rounded-lg text-[10px] px-2 text-red-500 border-red-200 hover:bg-red-50"
                                    onClick={(e) => { e.stopPropagation(); removeMedia(i); }}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            {m.isCover && (
                              <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">
                                Cover
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Video Tour URL */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                        Video Tour URL (Optional)
                      </label>
                      <div className="relative">
                        <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                          placeholder="https://youtube.com/watch?v=..."
                          value={formData.videoTourUrl}
                          onChange={(e) => update("videoTourUrl", e.target.value)}
                          className="h-11 pl-11 rounded-xl border-zinc-100 bg-zinc-50 text-xs"
                        />
                      </div>
                    </div>

                    {/* Booking Settings */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">
                        Booking Settings
                      </h3>
                      {renderToggle("Instant Book", "instantBook", "Guests can book without host approval")}
                      {renderInput("Advance Notice (hours)", "advanceNoticeHours", {
                        type: "number",
                        placeholder: "0 = same day booking allowed",
                      })}
                      {renderInput("Max Guests Per Booking", "maxGuestsPerBooking", {
                        type: "number",
                        placeholder: `Default: ${formData.maxGuests}`,
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Submit Error */}
            {submitError && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-xs font-bold text-red-600">{submitError}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-6 mt-6 border-t border-zinc-50 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={prev}
                disabled={step === 1}
                className="h-11 px-6 rounded-xl text-xs font-bold gap-2 text-zinc-400"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-400">
                  {step} / {totalSteps}
                </span>
                {step === totalSteps ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="h-11 px-8 rounded-xl text-xs font-bold gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save as Draft
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="h-11 px-8 rounded-xl text-xs font-bold gap-2"
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4" />
                  </Button>
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

// Inline Save icon
function Save({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}
