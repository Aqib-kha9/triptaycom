"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ──────────────────────── Types ────────────────────────

type ActivityType =
  | "Rafting" | "Trekking" | "Paragliding" | "Camping" | "Bungee Jumping"
  | "Skiing" | "Scuba Diving" | "Safari" | "Cycling" | "Kayaking"
  | "Rock Climbing" | "Zip Lining" | "Hot Air Balloon" | "Wildlife Safari"
  | "Cultural Tour" | "Photography Tour" | "Fishing" | "Surfing" | "Caving" | "Other";

type Difficulty = "Easy" | "Moderate" | "Challenging" | "Extreme";
type Availability = "Daily" | "Weekdays" | "Weekends" | "Custom";
type CancellationPolicy = "Flexible" | "Moderate" | "Strict" | "Non-Refundable";

interface NearbyPlace {
  name: string;
  distanceKm: number;
  category: "Restaurant" | "Cafe" | "Market" | "Hospital" | "Pharmacy" | "ATM" | "Bus Stop" | "Railway Station" | "Airport" | "Tourist Spot" | "Trek" | "Lake" | "Temple" | "Other";
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
  pricePerPerson: number;
}

interface FormData {
  name: string;
  summary: string;
  description: string;
  activityType: ActivityType;
  difficulty: Difficulty;
  languagesSpoken: string[];

  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  lat: string;
  lng: string;
  landmark: string;
  meetingPoint: string;
  nearbyPlaces: NearbyPlace[];

  durationHours: string;
  durationDays: string;
  startTimes: string[];
  availability: Availability;
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
  restrictions: string;

  included: string[];
  excluded: string[];
  houseRules: HouseRule[];
  cancellationPolicy: CancellationPolicy;
  cancellationDetails: string;
  isPetFriendly: boolean;
  petRules: string;

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

const ACTIVITY_TYPES: ActivityType[] = [
  "Rafting", "Trekking", "Paragliding", "Camping", "Bungee Jumping",
  "Skiing", "Scuba Diving", "Safari", "Cycling", "Kayaking",
  "Rock Climbing", "Zip Lining", "Hot Air Balloon", "Wildlife Safari",
  "Cultural Tour", "Photography Tour", "Fishing", "Surfing", "Caving", "Other",
];

const DIFFICULTY_LEVELS: { value: Difficulty; label: string; color: string }[] = [
  { value: "Easy", label: "Easy", color: "bg-green-100 text-green-700 border-green-300" },
  { value: "Moderate", label: "Moderate", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  { value: "Challenging", label: "Challenging", color: "bg-orange-100 text-orange-700 border-orange-300" },
  { value: "Extreme", label: "Extreme", color: "bg-red-100 text-red-700 border-red-300" },
];

const AVAILABILITY_OPTIONS: { value: Availability; label: string }[] = [
  { value: "Daily", label: "Daily" },
  { value: "Weekdays", label: "Weekdays" },
  { value: "Weekends", label: "Weekends" },
  { value: "Custom", label: "Custom" },
];

const CANCELLATION_POLICIES: { value: CancellationPolicy; label: string; desc: string }[] = [
  { value: "Flexible", label: "Flexible", desc: "Full refund 24 hours before" },
  { value: "Moderate", label: "Moderate", desc: "Full refund 3 days before" },
  { value: "Strict", label: "Strict", desc: "50% refund 7 days before" },
  { value: "Non-Refundable", label: "Non-Refundable", desc: "No refunds" },
];

const LANGUAGES = [
  "English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati",
  "Kannada", "Malayalam", "Punjabi", "Urdu", "French", "German", "Spanish",
  "Japanese", "Chinese", "Russian", "Arabic", "Portuguese",
];

const COMMON_HOUSE_RULES = [
  "Follow guide instructions at all times",
  "No littering — carry your trash back",
  "No smoking during the activity",
  "Consumption of alcohol strictly prohibited",
  "Punctuality is mandatory — late arrivals may be denied",
  "Respect local customs and traditions",
  "Wear appropriate clothing and footwear",
  "Inform guide of any medical conditions beforehand",
];

const NEARBY_CATEGORIES = [
  "Restaurant", "Cafe", "Market", "Hospital", "Pharmacy",
  "ATM", "Bus Stop", "Railway Station", "Airport",
  "Tourist Spot", "Trek", "Lake", "Temple", "Other",
] as const;

const STEPS = [
  "Basics", "Location", "Duration & Pricing", "Safety & Equipment",
  "Inclusions & Rules", "Booking Settings", "Media & Publish",
];

const FILLER_DATA: FormData = {
  name: "Ganga River Rafting Adventure",
  summary: "Thrilling 16km white-water rafting on the Ganges with expert guides.",
  description: "Embark on an unforgettable rafting journey down the mighty Ganges River. Starting from Shivpuri and ending at Rishikesh, this 16km stretch offers Grade 3 and 4 rapids that will get your adrenaline pumping. Our certified guides ensure a safe yet exhilarating experience suitable for beginners and experienced rafters alike. The trip includes all safety equipment, a comprehensive briefing, and a riverside snack break. Duration is approximately 3-4 hours depending on water flow. Best experienced between September and June.",
  activityType: "Rafting",
  difficulty: "Moderate",
  languagesSpoken: ["English", "Hindi"],

  address: "Shivpuri Rafting Point, Badrinath Road",
  city: "Rishikesh",
  state: "Uttarakhand",
  country: "India",
  zipCode: "249192",
  lat: "30.1283",
  lng: "78.3268",
  landmark: "Near Shivpuri Bridge",
  meetingPoint: "Shivpuri Rafting Office, Main Road",
  nearbyPlaces: [
    { name: "Laxman Jhula", distanceKm: 8, category: "Tourist Spot", description: "Iconic suspension bridge" },
    { name: "Triveni Ghat", distanceKm: 12, category: "Temple" },
    { name: "GMVN Tourist Rest House", distanceKm: 5, category: "Restaurant" },
  ],

  durationHours: "4",
  durationDays: "0",
  startTimes: ["6:00 AM", "10:00 AM", "2:00 PM"],
  availability: "Daily",
  availabilityNotes: "Subject to weather and water conditions",
  minAge: "14",
  maxGroupSize: "20",
  minGroupSize: "2",

  basePrice: "999",
  weekendPrice: "1299",
  childPrice: "599",
  foreignerPrice: "1999",
  seasonalPrices: [
    { seasonName: "Monsoon", startDate: "2026-07-01", endDate: "2026-09-15", pricePerPerson: 1499 },
  ],
  taxes: "5",
  securityDeposit: "0",

  equipmentProvided: ["Life Jacket", "Helmet", "Paddle", "Rafting Boat", "Dry Bag"],
  equipmentRequired: ["Swimwear", "Quick-dry shorts", "Water shoes", "Sunscreen"],
  safetyGuidelines: "1. Always wear your life jacket and helmet throughout the activity.\n2. Listen carefully to the pre-rafting safety briefing.\n3. Hold the paddle correctly — grip the T-handle with one hand on top.\n4. In case you fall overboard, float on your back with feet downstream.\n5. Follow the guide's commands immediately. Do not panic.\n6. Pregnant women and individuals with heart conditions should not participate.\n7. Avoid consuming heavy meals 1 hour before the activity.",
  hasInsurance: true,
  certifiedGuides: true,
  guideRatio: "1:5",
  restrictions: "Minimum age 14 years. Not suitable for pregnant women, individuals with heart conditions, or severe back problems. Maximum weight 120kg.",

  included: ["All safety equipment", "Certified river guide", "16km rafting stretch", "Life jacket and helmet", "Hot tea/coffee after activity"],
  excluded: ["Personal expenses", "Camera/GoPro footage", "Transportation to base camp", "Personal medication", "Tipping for guides"],
  houseRules: [
    { rule: "Follow guide instructions at all times" },
    { rule: "No littering — carry your trash back" },
    { rule: "No smoking during the activity" },
    { rule: "Consumption of alcohol strictly prohibited" },
  ],
  cancellationPolicy: "Moderate",
  cancellationDetails: "Full refund if cancelled 3 days prior. 50% refund if cancelled 1 day prior. No refund for same-day cancellations.",
  isPetFriendly: false,
  petRules: "",

  instantBook: true,
  advanceNoticeHours: "2",
  maxGuestsPerBooking: "10",
  videoTourUrl: "",
};

// ──────────────────────── Component ────────────────────────

export default function AddActivityPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = STEPS.length;

  const [formData, setFormData] = useState<FormData>({
    name: "", summary: "", description: "", activityType: "Rafting", difficulty: "Moderate",
    languagesSpoken: [],
    address: "", city: "", state: "", country: "India", zipCode: "",
    lat: "", lng: "", landmark: "", meetingPoint: "",
    nearbyPlaces: [],
    durationHours: "", durationDays: "0", startTimes: [], availability: "Daily",
    availabilityNotes: "", minAge: "", maxGroupSize: "", minGroupSize: "1",
    basePrice: "", weekendPrice: "", childPrice: "", foreignerPrice: "",
    seasonalPrices: [], taxes: "0", securityDeposit: "0",
    equipmentProvided: [], equipmentRequired: [], safetyGuidelines: "",
    hasInsurance: false, certifiedGuides: false, guideRatio: "", restrictions: "",
    included: [], excluded: [], houseRules: [],
    cancellationPolicy: "Moderate", cancellationDetails: "",
    isPetFriendly: false, petRules: "",
    instantBook: true, advanceNoticeHours: "0", maxGuestsPerBooking: "", videoTourUrl: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mediaFiles, setMediaFiles] = useState<MediaPreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdActivityId, setCreatedActivityId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Helpers ──

  const handleAutoFill = () => setFormData(FILLER_DATA);

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
    const trimmed = time.trim();
    if (trimmed && !formData.startTimes.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, startTimes: [...prev.startTimes, trimmed] }));
    }
  };

  const removeStartTime = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      startTimes: prev.startTimes.filter((_, i) => i !== index),
    }));
  };

  const addNearbyPlace = () => {
    setFormData((prev) => ({
      ...prev,
      nearbyPlaces: [...prev.nearbyPlaces, { name: "", distanceKm: 0, category: "Other" }],
    }));
  };

  const removeNearbyPlace = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      nearbyPlaces: prev.nearbyPlaces.filter((_, i) => i !== index),
    }));
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
      seasonalPrices: [...prev.seasonalPrices, { seasonName: "", startDate: "", endDate: "", pricePerPerson: 0 }],
    }));
  };

  const removeSeasonalPrice = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      seasonalPrices: prev.seasonalPrices.filter((_, i) => i !== index),
    }));
  };

  const updateSeasonal = (index: number, field: keyof SeasonalPrice, value: any) => {
    setFormData((prev) => ({
      ...prev,
      seasonalPrices: prev.seasonalPrices.map((sp, i) => (i === index ? { ...sp, [field]: value } : sp)),
    }));
  };

  const addListItem = (field: "equipmentProvided" | "equipmentRequired" | "included" | "excluded", value: string) => {
    const trimmed = value.trim();
    if (trimmed && !formData[field].includes(trimmed)) {
      setFormData((prev) => ({ ...prev, [field]: [...prev[field], trimmed] }));
    }
  };

  const removeListItem = (field: "equipmentProvided" | "equipmentRequired" | "included" | "excluded", index: number) => {
    setFormData((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const addHouseRule = (rule: string) => {
    const trimmed = rule.trim();
    if (trimmed && !formData.houseRules.find((hr) => hr.rule === trimmed)) {
      setFormData((prev) => ({ ...prev, houseRules: [...prev.houseRules, { rule: trimmed }] }));
    }
  };

  const removeHouseRule = (index: number) => {
    setFormData((prev) => ({ ...prev, houseRules: prev.houseRules.filter((_, i) => i !== index) }));
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles: MediaPreview[] = Array.from(files).map((f) => {
      const isFirst = mediaFiles.length === 0;
      return { file: f, preview: URL.createObjectURL(f), caption: "", isCover: isFirst };
    });
    setMediaFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (prev[index]?.isCover && updated.length > 0) updated[0].isCover = true;
      return updated;
    });
  };

  const setCover = (index: number) => {
    setMediaFiles((prev) => prev.map((m, i) => ({ ...m, isCover: i === index })));
  };

  const updateCaption = (index: number, caption: string) => {
    setMediaFiles((prev) => prev.map((m, i) => (i === index ? { ...m, caption } : m)));
  };

  // ── Validation ──

  const validateStep = (): boolean => {
    const errs: Record<string, string> = {};
    const d = formData;

    if (step === 1) {
      if (!d.name.trim()) errs.name = "Activity name is required";
      if (!d.summary.trim()) errs.summary = "Summary is required";
      else if (d.summary.length > 200) errs.summary = "Summary must be under 200 characters";
      if (!d.description.trim()) errs.description = "Description is required";
      else if (d.description.length < 50) errs.description = "Description must be at least 50 characters";
      if (!d.activityType) errs.activityType = "Activity type is required";
      if (!d.difficulty) errs.difficulty = "Difficulty is required";
    }

    if (step === 2) {
      if (!d.address.trim()) errs.address = "Address is required";
      if (!d.city.trim()) errs.city = "City is required";
      if (!d.state.trim()) errs.state = "State is required";
      if (!d.zipCode.trim()) errs.zipCode = "Zip code is required";
      if (!d.lat.trim() || isNaN(Number(d.lat))) errs.lat = "Valid latitude is required";
      if (!d.lng.trim() || isNaN(Number(d.lng))) errs.lng = "Valid longitude is required";
    }

    if (step === 3) {
      if (!d.durationHours || Number(d.durationHours) <= 0) errs.durationHours = "Duration in hours is required";
      if (!d.maxGroupSize || Number(d.maxGroupSize) < 1) errs.maxGroupSize = "Max group size must be at least 1";
      if (!d.basePrice || Number(d.basePrice) <= 0) errs.basePrice = "Base price per person is required";
      if (d.startTimes.length === 0) errs.startTimes = "At least one start time is required";
    }

    if (step === 4) {
      if (!d.safetyGuidelines.trim()) errs.safetyGuidelines = "Safety guidelines are required";
    }

    if (step === 5) {
      if (d.included.length === 0) errs.included = "At least one inclusion is required";
      if (!d.cancellationPolicy) errs.cancellationPolicy = "Cancellation policy is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, totalSteps));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  // ── Submit ──

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: formData.name.trim(),
        summary: formData.summary.trim(),
        description: formData.description.trim(),
        activityType: formData.activityType,
        difficulty: formData.difficulty,
        languagesSpoken: formData.languagesSpoken,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim(),
        zipCode: formData.zipCode.trim(),
        coordinates: { lat: Number(formData.lat), lng: Number(formData.lng) },
        landmark: formData.landmark.trim() || undefined,
        meetingPoint: formData.meetingPoint.trim() || undefined,
        nearbyPlaces: formData.nearbyPlaces.filter((n) => n.name.trim()),
        durationHours: Number(formData.durationHours),
        durationDays: Number(formData.durationDays) || 0,
        startTimes: formData.startTimes,
        availability: formData.availability,
        availabilityNotes: formData.availabilityNotes.trim() || undefined,
        minAge: Number(formData.minAge) || 0,
        maxGroupSize: Number(formData.maxGroupSize),
        minGroupSize: Number(formData.minGroupSize) || 1,
        basePrice: Number(formData.basePrice),
        weekendPrice: formData.weekendPrice ? Number(formData.weekendPrice) : undefined,
        childPrice: formData.childPrice ? Number(formData.childPrice) : undefined,
        foreignerPrice: formData.foreignerPrice ? Number(formData.foreignerPrice) : undefined,
        seasonalPrices: formData.seasonalPrices.filter((s) => s.seasonName.trim()),
        taxes: Number(formData.taxes) || 0,
        securityDeposit: Number(formData.securityDeposit) || 0,
        equipmentProvided: formData.equipmentProvided,
        equipmentRequired: formData.equipmentRequired,
        safetyGuidelines: formData.safetyGuidelines.trim(),
        hasInsurance: formData.hasInsurance,
        certifiedGuides: formData.certifiedGuides,
        guideRatio: formData.guideRatio.trim() || undefined,
        restrictions: formData.restrictions.trim() || undefined,
        included: formData.included,
        excluded: formData.excluded,
        houseRules: formData.houseRules,
        cancellationPolicy: formData.cancellationPolicy,
        cancellationDetails: formData.cancellationDetails.trim() || undefined,
        isPetFriendly: formData.isPetFriendly,
        petRules: formData.petRules.trim() || undefined,
        videoTourUrl: formData.videoTourUrl.trim() || undefined,
        instantBook: formData.instantBook,
        advanceNoticeHours: Number(formData.advanceNoticeHours) || 0,
        maxGuestsPerBooking: formData.maxGuestsPerBooking ? Number(formData.maxGuestsPerBooking) : Number(formData.maxGroupSize),
        status: "published",
      };

      const res = await fetch(`${API_BASE}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to create activity");

      const activityId = json.data.activity._id;
      setCreatedActivityId(activityId);

      // Upload media if any
      if (mediaFiles.length > 0) {
        const formDataMedia = new FormData();
        mediaFiles.forEach((m, i) => {
          formDataMedia.append("files", m.file);
          if (m.isCover) formDataMedia.append("isCover", "true");
          if (m.caption) formDataMedia.append("caption", m.caption);
        });

        const mediaRes = await fetch(`${API_BASE}/activities/${activityId}/media`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataMedia,
        });

        const mediaJson = await mediaRes.json();
        if (!mediaRes.ok) console.warn("Media upload warning:", mediaJson.message);
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrors({ submit: err.message || "Something went wrong" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render helpers ──

  const fieldError = (field: string) =>
    errors[field] ? (
      <p className="text-[11px] font-bold text-red-500 mt-1">{errors[field]}</p>
    ) : null;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black transition-all",
              i + 1 === step
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110"
                : i + 1 < step
                  ? "bg-primary/20 text-primary"
                  : "bg-zinc-100 text-zinc-400"
            )}
          >
            {i + 1 < step ? "✓" : i + 1}
          </div>
          <span
            className={cn(
              "text-[10px] font-bold hidden sm:inline",
              i + 1 === step ? "text-primary" : "text-zinc-400"
            )}
          >
            {s}
          </span>
          {i < STEPS.length - 1 && (
            <div className={cn("w-6 h-0.5 hidden sm:block", i + 1 < step ? "bg-primary" : "bg-zinc-200")} />
          )}
        </div>
      ))}
    </div>
  );

  const renderSectionHeader = (title: string, subtitle: string) => (
    <div className="mb-6">
      <h2 className="text-xl font-black text-zinc-900">{title}</h2>
      <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
    </div>
  );

  const renderInput = (
    label: string,
    field: keyof FormData,
    placeholder: string,
    type = "text",
    required = false,
    extraContent?: React.ReactNode
  ) => (
    <div className="space-y-1.5">
      <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Input
          type={type}
          value={(formData[field] as string) || ""}
          onChange={(e) => update(field, e.target.value)}
          placeholder={placeholder}
          className={cn("h-12 rounded-xl text-sm", errors[field] && "border-red-500 focus:ring-red-500")}
        />
      </div>
      {fieldError(field)}
      {extraContent}
    </div>
  );

  const renderToggle = (label: string, field: keyof FormData, description?: string) => (
    <div className="flex items-center justify-between py-3 border-b border-zinc-50">
      <div>
        <p className="text-sm font-bold text-zinc-800">{label}</p>
        {description && <p className="text-[11px] text-zinc-500">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => update(field, !formData[field])}
        className={cn(
          "w-12 h-7 rounded-full transition-colors relative",
          formData[field] ? "bg-primary" : "bg-zinc-200"
        )}
      >
        <div
          className={cn(
            "w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow",
            formData[field] ? "left-6" : "left-1"
          )}
        />
      </button>
    </div>
  );

  // ── Success State ──

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
        <Navbar />
        <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center text-center space-y-6 max-w-sm">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900">Activity Created!</h2>
              <p className="text-sm text-zinc-500 mt-1">Your activity has been published successfully.</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => {
                  setIsSuccess(false);
                  setCreatedActivityId(null);
                  setFormData({
                    name: "", summary: "", description: "", activityType: "Rafting", difficulty: "Moderate",
                    languagesSpoken: [],
                    address: "", city: "", state: "", country: "India", zipCode: "",
                    lat: "", lng: "", landmark: "", meetingPoint: "",
                    nearbyPlaces: [],
                    durationHours: "", durationDays: "0", startTimes: [], availability: "Daily",
                    availabilityNotes: "", minAge: "", maxGroupSize: "", minGroupSize: "1",
                    basePrice: "", weekendPrice: "", childPrice: "", foreignerPrice: "",
                    seasonalPrices: [], taxes: "0", securityDeposit: "0",
                    equipmentProvided: [], equipmentRequired: [], safetyGuidelines: "",
                    hasInsurance: false, certifiedGuides: false, guideRatio: "", restrictions: "",
                    included: [], excluded: [], houseRules: [],
                    cancellationPolicy: "Moderate", cancellationDetails: "",
                    isPetFriendly: false, petRules: "",
                    instantBook: true, advanceNoticeHours: "0", maxGuestsPerBooking: "", videoTourUrl: "",
                  });
                  setMediaFiles([]);
                  setStep(1);
                  setErrors({});
                }}
                className="rounded-xl px-5 h-10 text-xs font-bold gap-2"
                variant="outline"
              >
                Add Another
              </Button>
              <Button
                onClick={() => router.push(`/vendor/activities/${createdActivityId}`)}
                className="rounded-xl px-5 h-10 text-xs font-bold gap-2"
              >
                View Activity
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // ── Main Form ──

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-100 z-30">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }} />
      </div>

      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Auto Fill */}
          <div className="flex justify-end mb-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleAutoFill}
              className="text-[10px] font-bold text-zinc-400 hover:text-primary"
            >
              ✨ Auto-fill sample data
            </Button>
          </div>

          {renderStepIndicator()}

          <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                {/* ── Step 1: Basics ── */}
                {step === 1 && (
                  <>
                    {renderSectionHeader("Activity Basics", "Name and describe your experience.")}
                    <div className="space-y-4">
                      {renderInput("Activity Name", "name", "e.g. Ganga River Rafting", "text", true)}
                      {renderInput("Summary", "summary", "Short one-liner (max 200 characters)", "text", true)}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => update("description", e.target.value)}
                          placeholder="Describe the thrill, what to expect, highlights..."
                          className={cn("min-h-[120px] rounded-xl text-sm", errors.description && "border-red-500")}
                        />
                        {fieldError("description")}
                      </div>

                      {/* Activity Type */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                          Activity Type <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {ACTIVITY_TYPES.map((at) => (
                            <button
                              type="button"
                              key={at}
                              onClick={() => update("activityType", at)}
                              className={cn(
                                "px-3 py-2 rounded-xl text-[11px] font-bold border transition-all text-left",
                                formData.activityType === at
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                              )}
                            >
                              {at}
                            </button>
                          ))}
                        </div>
                        {fieldError("activityType")}
                      </div>

                      {/* Difficulty */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                          Difficulty Level <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {DIFFICULTY_LEVELS.map((dl) => (
                            <button
                              type="button"
                              key={dl.value}
                              onClick={() => update("difficulty", dl.value)}
                              className={cn(
                                "px-3 py-2 rounded-xl text-[11px] font-bold border transition-all text-center",
                                formData.difficulty === dl.value
                                  ? dl.color + " border-2"
                                  : "border-zinc-200 text-zinc-500"
                              )}
                            >
                              {dl.label}
                            </button>
                          ))}
                        </div>
                        {fieldError("difficulty")}
                      </div>

                      {/* Languages */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                          Languages Spoken by Guides
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {LANGUAGES.map((lang) => {
                            const active = formData.languagesSpoken.includes(lang);
                            return (
                              <button
                                type="button"
                                key={lang}
                                onClick={() => toggleLanguage(lang)}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all",
                                  active
                                    ? "bg-primary text-white border-primary"
                                    : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-zinc-300"
                                )}
                              >
                                {lang}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ── Step 2: Location ── */}
                {step === 2 && (
                  <>
                    {renderSectionHeader("Location", "Where does this activity take place?")}
                    <div className="space-y-4">
                      {renderInput("Address", "address", "Street address or area", "text", true)}
                      <div className="grid grid-cols-2 gap-3">
                        {renderInput("City", "city", "City", "text", true)}
                        {renderInput("State", "state", "State", "text", true)}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {renderInput("Country", "country", "Country", "text", false)}
                        {renderInput("Zip Code", "zipCode", "Zip/Postal code", "text", true)}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {renderInput("Latitude", "lat", "e.g. 30.1283", "text", true)}
                        {renderInput("Longitude", "lng", "e.g. 78.3268", "text", true)}
                      </div>
                      {renderInput("Landmark", "landmark", "Nearest landmark (optional)", "text")}
                      {renderInput("Meeting Point", "meetingPoint", "Where guests should arrive", "text")}

                      {/* Nearby Places */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                          Nearby Places
                        </label>
                        {formData.nearbyPlaces.map((np, i) => (
                          <div key={i} className="flex gap-2 items-start">
                            <div className="flex-1 grid grid-cols-3 gap-2">
                              <Input
                                value={np.name}
                                onChange={(e) => updateNearby(i, "name", e.target.value)}
                                placeholder="Name"
                                className="h-10 rounded-xl text-xs"
                              />
                              <Input
                                type="number"
                                value={np.distanceKm || ""}
                                onChange={(e) => updateNearby(i, "distanceKm", Number(e.target.value))}
                                placeholder="KM"
                                className="h-10 rounded-xl text-xs"
                              />
                              <select
                                value={np.category}
                                onChange={(e) => updateNearby(i, "category", e.target.value)}
                                className="h-10 rounded-xl text-xs border border-zinc-200 bg-white px-2"
                              >
                                {NEARBY_CATEGORIES.map((c) => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeNearbyPlace(i)}
                              className="h-10 w-10 text-red-400 hover:text-red-600"
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addNearbyPlace}
                          className="rounded-xl h-9 text-[10px] font-bold"
                        >
                          + Add Nearby Place
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {/* ── Step 3: Duration & Pricing ── */}
                {step === 3 && (
                  <>
                    {renderSectionHeader("Duration & Pricing", "Set the schedule and cost per person.")}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {renderInput("Duration (Hours)", "durationHours", "e.g. 4", "number", true)}
                        {renderInput("Duration (Days)", "durationDays", "e.g. 0 for single day", "number")}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {renderInput("Min Age", "minAge", "e.g. 14", "number")}
                        {renderInput("Max Group Size", "maxGroupSize", "e.g. 20", "number", true)}
                        {renderInput("Min Group Size", "minGroupSize", "e.g. 2", "number")}
                      </div>

                      {/* Start Times */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                          Start Times <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="e.g. 6:00 AM"
                            className="h-10 rounded-xl text-sm flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                addStartTime((e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = "";
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const input = document.querySelector<HTMLInputElement>('input[placeholder="e.g. 6:00 AM"]');
                              if (input?.value) { addStartTime(input.value); input.value = ""; }
                            }}
                            className="rounded-xl h-10 text-xs font-bold"
                          >
                            Add
                          </Button>
                        </div>
                        {fieldError("startTimes")}
                        {formData.startTimes.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {formData.startTimes.map((t, i) => (
                              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 text-[11px] font-bold text-zinc-700">
                                {t}
                                <button onClick={() => removeStartTime(i)} className="text-zinc-400 hover:text-red-500">✕</button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Availability */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">Availability</label>
                        <div className="grid grid-cols-4 gap-2">
                          {AVAILABILITY_OPTIONS.map((opt) => (
                            <button
                              type="button"
                              key={opt.value}
                              onClick={() => update("availability", opt.value)}
                              className={cn(
                                "px-3 py-2 rounded-xl text-[11px] font-bold border transition-all text-center",
                                formData.availability === opt.value
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-zinc-200 text-zinc-500"
                              )}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      {renderInput("Availability Notes", "availabilityNotes", "e.g. Subject to weather conditions", "text")}

                      {/* Pricing */}
                      <div className="grid grid-cols-2 gap-3">
                        {renderInput("Base Price (₹/person)", "basePrice", "e.g. 999", "number", true)}
                        {renderInput("Weekend Price (₹/person)", "weekendPrice", "e.g. 1299", "number")}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {renderInput("Child Price (₹)", "childPrice", "e.g. 599", "number")}
                        {renderInput("Foreigner Price (₹)", "foreignerPrice", "e.g. 1999", "number")}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {renderInput("Taxes (%)", "taxes", "e.g. 5", "number")}
                        {renderInput("Security Deposit (₹)", "securityDeposit", "e.g. 0", "number")}
                      </div>

                      {/* Seasonal Prices */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                          Seasonal Pricing
                        </label>
                        {formData.seasonalPrices.map((sp, i) => (
                          <div key={i} className="flex gap-2 items-start">
                            <div className="flex-1 grid grid-cols-4 gap-2">
                              <Input
                                value={sp.seasonName}
                                onChange={(e) => updateSeasonal(i, "seasonName", e.target.value)}
                                placeholder="Season"
                                className="h-10 rounded-xl text-xs"
                              />
                              <Input
                                type="date"
                                value={sp.startDate}
                                onChange={(e) => updateSeasonal(i, "startDate", e.target.value)}
                                className="h-10 rounded-xl text-xs"
                              />
                              <Input
                                type="date"
                                value={sp.endDate}
                                onChange={(e) => updateSeasonal(i, "endDate", e.target.value)}
                                className="h-10 rounded-xl text-xs"
                              />
                              <Input
                                type="number"
                                value={sp.pricePerPerson || ""}
                                onChange={(e) => updateSeasonal(i, "pricePerPerson", Number(e.target.value))}
                                placeholder="₹"
                                className="h-10 rounded-xl text-xs"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSeasonalPrice(i)}
                              className="h-10 w-10 text-red-400 hover:text-red-600"
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addSeasonalPrice}
                          className="rounded-xl h-9 text-[10px] font-bold"
                        >
                          + Add Seasonal Price
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {/* ── Step 4: Safety & Equipment ── */}
                {step === 4 && (
                  <>
                    {renderSectionHeader("Safety & Equipment", "What gear is provided and what should guests bring?")}
                    <div className="space-y-4">
                      {/* Equipment Provided */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                          Equipment Provided
                        </label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="e.g. Life Jacket"
                            className="h-10 rounded-xl text-sm flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                addListItem("equipmentProvided", (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = "";
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const input = document.querySelector<HTMLInputElement>('input[placeholder="e.g. Life Jacket"]');
                              if (input?.value) { addListItem("equipmentProvided", input.value); input.value = ""; }
                            }}
                            className="rounded-xl h-10 text-xs font-bold"
                          >
                            Add
                          </Button>
                        </div>
                        {formData.equipmentProvided.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {formData.equipmentProvided.map((item, i) => (
                              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 text-[11px] font-bold text-green-700 border border-green-200">
                                {item}
                                <button onClick={() => removeListItem("equipmentProvided", i)} className="text-green-400 hover:text-red-500">✕</button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Equipment Required */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                          What Guests Should Bring
                        </label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="e.g. Swimwear"
                            className="h-10 rounded-xl text-sm flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                addListItem("equipmentRequired", (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = "";
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const input = document.querySelector<HTMLInputElement>('input[placeholder="e.g. Swimwear"]');
                              if (input?.value) { addListItem("equipmentRequired", input.value); input.value = ""; }
                            }}
                            className="rounded-xl h-10 text-xs font-bold"
                          >
                            Add
                          </Button>
                        </div>
                        {formData.equipmentRequired.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {formData.equipmentRequired.map((item, i) => (
                              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-[11px] font-bold text-orange-700 border border-orange-200">
                                {item}
                                <button onClick={() => removeListItem("equipmentRequired", i)} className="text-orange-400 hover:text-red-500">✕</button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Safety Guidelines */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                          Safety Guidelines <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          value={formData.safetyGuidelines}
                          onChange={(e) => update("safetyGuidelines", e.target.value)}
                          placeholder="List safety rules, one per line..."
                          className={cn("min-h-[120px] rounded-xl text-sm", errors.safetyGuidelines && "border-red-500")}
                        />
                        {fieldError("safetyGuidelines")}
                      </div>

                      {renderToggle("Insurance Included", "hasInsurance", "Activity is covered by insurance")}
                      {renderToggle("Certified Guides", "certifiedGuides", "Guides are professionally certified")}
                      {renderInput("Guide Ratio", "guideRatio", "e.g. 1:5 (one guide per 5 guests)", "text")}
                      {renderInput("Restrictions", "restrictions", "Medical, age, weight, or other restrictions", "text")}
                    </div>
                  </>
                )}

                {/* ── Step 5: Inclusions & Rules ── */}
                {step === 5 && (
                  <>
                    {renderSectionHeader("Inclusions & Rules", "What's included, what's not, and the rules.")}
                    <div className="space-y-4">
                      {/* Included */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                          What's Included <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="e.g. All safety equipment"
                            className="h-10 rounded-xl text-sm flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                addListItem("included", (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = "";
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const input = document.querySelector<HTMLInputElement>('input[placeholder="e.g. All safety equipment"]');
                              if (input?.value) { addListItem("included", input.value); input.value = ""; }
                            }}
                            className="rounded-xl h-10 text-xs font-bold"
                          >
                            Add
                          </Button>
                        </div>
                        {fieldError("included")}
                        {formData.included.length > 0 && (
                          <div className="flex flex-col gap-1 mt-2">
                            {formData.included.map((item, i) => (
                              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-green-50 border border-green-100">
                                <span className="text-[11px] font-bold text-green-700">✓ {item}</span>
                                <button onClick={() => removeListItem("included", i)} className="text-green-400 hover:text-red-500 text-xs">✕</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Excluded */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                          What's Excluded
                        </label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="e.g. Transportation"
                            className="h-10 rounded-xl text-sm flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                addListItem("excluded", (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = "";
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const input = document.querySelector<HTMLInputElement>('input[placeholder="e.g. Transportation"]');
                              if (input?.value) { addListItem("excluded", input.value); input.value = ""; }
                            }}
                            className="rounded-xl h-10 text-xs font-bold"
                          >
                            Add
                          </Button>
                        </div>
                        {formData.excluded.length > 0 && (
                          <div className="flex flex-col gap-1 mt-2">
                            {formData.excluded.map((item, i) => (
                              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-red-50 border border-red-100">
                                <span className="text-[11px] font-bold text-red-600">✗ {item}</span>
                                <button onClick={() => removeListItem("excluded", i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* House Rules */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                          House Rules
                        </label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a rule..."
                            className="h-10 rounded-xl text-sm flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                addHouseRule((e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = "";
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const input = document.querySelector<HTMLInputElement>('input[placeholder="Add a rule..."]');
                              if (input?.value) { addHouseRule(input.value); input.value = ""; }
                            }}
                            className="rounded-xl h-10 text-xs font-bold"
                          >
                            Add
                          </Button>
                        </div>
                        {/* Suggested rules */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {COMMON_HOUSE_RULES.filter((r) => !formData.houseRules.find((hr) => hr.rule === r)).map((rule) => (
                            <button
                              type="button"
                              key={rule}
                              onClick={() => addHouseRule(rule)}
                              className="px-2.5 py-1 rounded-lg bg-zinc-50 text-[10px] font-bold text-zinc-500 border border-zinc-200 hover:border-primary hover:text-primary transition-all"
                            >
                              + {rule.length > 40 ? rule.slice(0, 40) + "..." : rule}
                            </button>
                          ))}
                        </div>
                        {formData.houseRules.length > 0 && (
                          <div className="flex flex-col gap-1 mt-2">
                            {formData.houseRules.map((rule, i) => (
                              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-100">
                                <span className="text-[11px] font-bold text-zinc-700">{rule.rule}</span>
                                <button onClick={() => removeHouseRule(i)} className="text-zinc-400 hover:text-red-500 text-xs">✕</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Cancellation Policy */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                          Cancellation Policy <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {CANCELLATION_POLICIES.map((policy) => (
                            <button
                              type="button"
                              key={policy.value}
                              onClick={() => update("cancellationPolicy", policy.value)}
                              className={cn(
                                "px-3 py-3 rounded-xl text-[10px] font-bold border transition-all text-center",
                                formData.cancellationPolicy === policy.value
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-zinc-200 text-zinc-500"
                              )}
                            >
                              <div>{policy.label}</div>
                              <div className="text-[9px] font-medium mt-0.5 opacity-70">{policy.desc}</div>
                            </button>
                          ))}
                        </div>
                        {fieldError("cancellationPolicy")}
                      </div>
                      {renderInput("Cancellation Details", "cancellationDetails", "Additional cancellation terms", "text")}

                      {renderToggle("Pet Friendly", "isPetFriendly", "Guests can bring pets")}
                      {formData.isPetFriendly && renderInput("Pet Rules", "petRules", "Any special rules for pets", "text")}
                    </div>
                  </>
                )}

                {/* ── Step 6: Booking Settings ── */}
                {step === 6 && (
                  <>
                    {renderSectionHeader("Booking Settings", "Control how guests book this activity.")}
                    <div className="space-y-4">
                      {renderToggle("Instant Book", "instantBook", "Guests can book without host approval")}
                      {renderInput("Advance Notice (Hours)", "advanceNoticeHours", "e.g. 2 hours minimum notice", "number")}
                      {renderInput("Max Guests Per Booking", "maxGuestsPerBooking", "e.g. 10", "number")}
                      {renderInput("Video Tour URL", "videoTourUrl", "YouTube or Vimeo link (optional)", "text")}
                    </div>
                  </>
                )}

                {/* ── Step 7: Media & Publish ── */}
                {step === 7 && (
                  <>
                    {renderSectionHeader("Media & Publish", "Upload photos and publish your activity.")}
                    <div className="space-y-4">
                      {/* Media Upload */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                          Photos (Max 15)
                        </label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={handleMediaSelect}
                          className="hidden"
                        />
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                          {mediaFiles.map((m, i) => (
                            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-zinc-200">
                              <img src={m.preview} alt="" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col justify-between p-2">
                                <div className="flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setCover(i)}
                                    className={cn(
                                      "h-7 w-7 rounded-full text-[9px] font-black",
                                      m.isCover
                                        ? "bg-primary text-white"
                                        : "bg-white/80 text-zinc-600"
                                    )}
                                  >
                                    {m.isCover ? "★" : "☆"}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeMedia(i)}
                                    className="h-7 w-7 rounded-full bg-white/80 text-red-500 hover:bg-red-500 hover:text-white"
                                  >
                                    ✕
                                  </Button>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Input
                                    value={m.caption}
                                    onChange={(e) => updateCaption(i, e.target.value)}
                                    placeholder="Caption..."
                                    className="h-7 rounded-lg text-[10px] bg-white/90"
                                  />
                                </div>
                              </div>
                              {m.isCover && (
                                <span className="absolute bottom-0 inset-x-0 bg-primary/90 text-white text-[8px] font-black text-center py-0.5 truncate">
                                  COVER
                                </span>
                              )}
                            </div>
                          ))}
                          {mediaFiles.length < 15 && (
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="aspect-square rounded-xl border-2 border-dashed border-zinc-300 flex flex-col items-center justify-center gap-1 text-zinc-400 hover:border-primary hover:text-primary transition-colors"
                            >
                              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                              <span className="text-[9px] font-bold">Add Photo</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {errors.submit && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <p className="text-xs font-bold text-red-600">{errors.submit}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="pt-6 mt-6 border-t border-zinc-50 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prev}
                disabled={step === 1 || isSubmitting}
                className="rounded-xl h-10 text-xs font-bold"
              >
                ← Back
              </Button>
              <span className="text-[10px] font-bold text-zinc-400">
                Step {step} of {totalSteps}
              </span>
              {step === totalSteps ? (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="rounded-xl h-10 text-xs font-bold gap-2 bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    <>Publish Activity</>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={next}
                  className="rounded-xl h-10 text-xs font-bold gap-2"
                >
                  Next →
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
