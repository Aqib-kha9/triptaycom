"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronLeft, ChevronRight, Minus, Plus, X, CalendarDays, Users, MapPin, Loader2, Navigation, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* ──────────────── Calendar Helpers ──────────────── */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function startDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay(); // 0 = Sunday
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(day: Date, start: Date, end: Date): boolean {
  return day >= start && day <= end;
}

function formatDateShort(d: Date): string {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function formatDateFull(d: Date): string {
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

/* ──────────────── DatePicker Component ──────────────── */

function DatePicker({
  checkIn,
  checkOut,
  onSelect,
  onClose,
}: {
  checkIn: Date | null;
  checkOut: Date | null;
  onSelect: (checkIn: Date, checkOut: Date | null) => void;
  onClose: () => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState(
    checkIn ? checkIn.getMonth() : today.getMonth()
  );
  const [viewYear, setViewYear] = useState(
    checkIn ? checkIn.getFullYear() : today.getFullYear()
  );

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const clicked = new Date(viewYear, viewMonth, day);
    clicked.setHours(0, 0, 0, 0);

    // If no check-in or both already set, start fresh
    if (!checkIn || (checkIn && checkOut)) {
      onSelect(clicked, null);
      return;
    }

    // If clicked day is before check-in, swap
    if (clicked < checkIn) {
      onSelect(clicked, null);
      return;
    }

    // Same day as check-in — ignore
    if (isSameDay(clicked, checkIn)) return;

    // Set check-out
    onSelect(checkIn, clicked);
  };

  const totalDays = daysInMonth(viewYear, viewMonth);
  const startDay = startDayOfMonth(viewYear, viewMonth);
  const daysArray: (number | null)[] = Array.from({ length: startDay }, () => null);
  for (let d = 1; d <= totalDays; d++) daysArray.push(d);

  const isPrevDisabled = viewYear === today.getFullYear() && viewMonth <= today.getMonth();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-zinc-200 shadow-2xl shadow-zinc-200/50 p-5 z-50 min-w-[320px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          disabled={isPrevDisabled}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 text-zinc-700" />
        </button>
        <span className="text-sm font-black text-zinc-900 tracking-tight">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={goToNextMonth}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-zinc-700" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-[10px] font-black text-zinc-400 uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysArray.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;

          const date = new Date(viewYear, viewMonth, day);
          date.setHours(0, 0, 0, 0);
          const isPast = date < today;
          const isCheckIn = checkIn && isSameDay(date, checkIn);
          const isCheckOut = checkOut && isSameDay(date, checkOut);
          const isBetween = checkIn && checkOut && isInRange(date, checkIn, checkOut) && !isCheckIn && !isCheckOut;
          const isToday = isSameDay(date, today);

          return (
            <button
              key={day}
              onClick={() => !isPast && handleDayClick(day)}
              disabled={isPast}
              className={cn(
                "relative h-10 w-full rounded-xl text-sm font-bold transition-all flex items-center justify-center",
                isPast && "text-zinc-200 cursor-not-allowed",
                !isPast && !isCheckIn && !isCheckOut && !isBetween && "text-zinc-700 hover:bg-zinc-100",
                isCheckIn && "bg-zinc-900 text-white rounded-r-none rounded-l-xl",
                isCheckOut && "bg-zinc-900 text-white rounded-l-none rounded-r-xl",
                isBetween && "bg-zinc-100 text-zinc-700 rounded-none",
                isToday && !isCheckIn && !isCheckOut && "ring-2 ring-zinc-900 ring-inset"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100">
        <button
          onClick={() => {
            onSelect(today, null);
          }}
          className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          Today
        </button>
        {checkIn && (
          <button
            onClick={() => onSelect(checkIn, null)}
            className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
          >
            Clear dates
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ──────────────── GuestSelector Component ──────────────── */

interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

const GUEST_CATEGORIES: { key: keyof GuestCounts; label: string; description: string; max: number }[] = [
  { key: "adults", label: "Adults", description: "Ages 13 or above", max: 16 },
  { key: "children", label: "Children", description: "Ages 2–12", max: 10 },
  { key: "infants", label: "Infants", description: "Under 2", max: 5 },
  { key: "pets", label: "Pets", description: "Bringing a pet?", max: 5 },
];

function GuestSelector({
  guests,
  onChange,
  onClose,
}: {
  guests: GuestCounts;
  onChange: (g: GuestCounts) => void;
  onClose: () => void;
}) {
  const totalGuests = guests.adults + guests.children;

  const adjust = (key: keyof GuestCounts, delta: number) => {
    const cat = GUEST_CATEGORIES.find((c) => c.key === key)!;
    const next = Math.max(0, Math.min(cat.max, guests[key] + delta));
    // Adults minimum is 0 now — can be cleared
    onChange({ ...guests, [key]: next });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-full right-0 mt-2 bg-white rounded-2xl border border-zinc-200 shadow-2xl shadow-zinc-200/50 p-5 z-50 min-w-[300px]"
    >
      {GUEST_CATEGORIES.map((cat) => (
        <div
          key={cat.key}
          className="flex items-center justify-between py-3 first:pt-0 last:pb-0 border-b border-zinc-50 last:border-none"
        >
          <div>
            <p className="text-sm font-bold text-zinc-900">{cat.label}</p>
            <p className="text-[11px] text-zinc-400 font-medium">{cat.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => adjust(cat.key, -1)}
              disabled={guests[cat.key] === 0}
              className={cn(
                "w-8 h-8 rounded-full border flex items-center justify-center transition-all",
                guests[cat.key] === 0
                  ? "border-zinc-100 text-zinc-300 cursor-not-allowed"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
              )}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-sm font-bold text-zinc-900 tabular-nums">
              {guests[cat.key]}
            </span>
            <button
              onClick={() => adjust(cat.key, 1)}
              disabled={guests[cat.key] >= cat.max}
              className={cn(
                "w-8 h-8 rounded-full border flex items-center justify-center transition-all",
                guests[cat.key] >= cat.max
                  ? "border-zinc-100 text-zinc-300 cursor-not-allowed"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
              )}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}

      {totalGuests > 0 && (
        <button
          onClick={() => onChange({ adults: 0, children: 0, infants: 0, pets: 0 })}
          className="mt-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
        >
          Clear all
        </button>
      )}
    </motion.div>
  );
}

/* ──────────────── SearchForm (Main) ──────────────── */

export function SearchForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"homestays" | "activities" | "nearby">("homestays");
  const [location, setLocation] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Location autocomplete
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isFetchingLocations, setIsFetchingLocations] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Date state
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Guest state
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [guests, setGuests] = useState<GuestCounts>({ adults: 0, children: 0, infants: 0, pets: 0 });

  // Refs for click-outside
  const dateRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  // Click-outside listeners
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
        setShowGuestPicker(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced location fetch
  useEffect(() => {
    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);

    if (!location.trim() || location.trim().length < 1) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }

    fetchTimeoutRef.current = setTimeout(async () => {
      setIsFetchingLocations(true);
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${API_BASE}/locations/suggest?q=${encodeURIComponent(location.trim())}`);
        const body = await res.json().catch(() => ({}));
        if (res.ok && body.data?.suggestions) {
          setLocationSuggestions(body.data.suggestions);
          setShowLocationSuggestions(body.data.suggestions.length > 0);
        } else {
          setLocationSuggestions([]);
          setShowLocationSuggestions(false);
        }
      } catch {
        setLocationSuggestions([]);
        setShowLocationSuggestions(false);
      } finally {
        setIsFetchingLocations(false);
      }
    }, 250);

    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, [location]);

  const handleSelectSuggestion = (city: string) => {
    setLocation(city);
    setShowLocationSuggestions(false);
  };

  const handleDateSelect = (ci: Date, co: Date | null) => {
    setCheckIn(ci);
    setCheckOut(co);
    if (ci && co) {
      // Both selected — close after short delay so user sees the range
      setTimeout(() => setShowDatePicker(false), 300);
    }
  };

  const totalGuests = guests.adults + guests.children;

  const handleNearbySearch = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported by your browser.");
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        router.push(`/explore?type=nearby&lat=${latitude}&lng=${longitude}`);
      },
      (err) => {
        setIsLocating(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError("Location access denied. Enable it in your browser settings.");
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError("Location unavailable. Try again later.");
            break;
          case err.TIMEOUT:
            setLocationError("Location request timed out. Try again.");
            break;
          default:
            setLocationError("Could not get your location. Try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const handleSearch = () => {
    if (activeTab === "nearby") {
      handleNearbySearch();
      return;
    }
    const type =
      activeTab === "homestays" ? "stays" : activeTab === "activities" ? "activities" : "nearby";
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    params.set("type", type);
    if (checkIn) params.set("checkIn", checkIn.toISOString().split("T")[0]);
    if (checkOut) params.set("checkOut", checkOut.toISOString().split("T")[0]);
    if (totalGuests > 0) params.set("guests", String(totalGuests));
    router.push(`/explore?${params.toString()}`);
  };

  const dateSummary =
    checkIn && checkOut
      ? `${formatDateShort(checkIn)} – ${formatDateShort(checkOut)}`
      : checkIn
        ? `${formatDateShort(checkIn)} – Select checkout`
        : "Add dates";

  const guestSummary =
    totalGuests > 0
      ? `${totalGuests} guest${totalGuests !== 1 ? "s" : ""}`
      : "Add guests";

  return (
    <div className="w-full max-w-[850px]">
      {/* Left-Aligned Minimal Tabs - Scrollable on Mobile */}
      <div className="flex gap-6 md:gap-10 mb-4 ml-2 md:ml-6 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setActiveTab("homestays")}
          className={cn(
            "text-[14px] md:text-[15px] font-bold transition-all relative flex items-center gap-3 pb-1 flex-shrink-0",
            activeTab === "homestays" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
          )}
        >
          <img
            src="/icons/stays-3d.png"
            alt="Homestays"
            className={cn(
              "h-8 w-8 object-contain transition-all duration-300",
              activeTab === "homestays" ? "scale-110 filter-none" : "opacity-40 grayscale hover:opacity-80 hover:grayscale-[30%]"
            )}
          />
          Homestays
          {activeTab === "homestays" && (
            <motion.div
              layoutId="activeTab"
              className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("activities")}
          className={cn(
            "text-[14px] md:text-[15px] font-bold transition-all relative flex items-center gap-3 pb-1 flex-shrink-0",
            activeTab === "activities" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
          )}
        >
          <img
            src="/icons/activities-3d.png"
            alt="Activities"
            className={cn(
              "h-8 w-8 object-contain transition-all duration-300",
              activeTab === "activities" ? "scale-110 filter-none" : "opacity-40 grayscale hover:opacity-80 hover:grayscale-[30%]"
            )}
          />
          Activities
          {activeTab === "activities" && (
            <motion.div
              layoutId="activeTab"
              className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("nearby")}
          className={cn(
            "text-[14px] md:text-[15px] font-bold transition-all relative flex items-center gap-3 pb-1 flex-shrink-0",
            activeTab === "nearby" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
          )}
        >
          <img
            src="/icons/nearby-3d.png"
            alt="Find Nearby"
            className={cn(
              "h-8 w-8 object-contain transition-all duration-300",
              activeTab === "nearby" ? "scale-110 filter-none" : "opacity-40 grayscale hover:opacity-80 hover:grayscale-[30%]"
            )}
          />
          Find Nearby
          {activeTab === "nearby" && (
            <motion.div
              layoutId="activeTab"
              className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"
            />
          )}
        </button>
      </div>

      {/* Modern Pill Search Bar */}
      <div className="bg-white border border-zinc-200 rounded-[24px] p-1 md:rounded-full flex flex-col md:flex-row items-stretch md:items-center hover:border-zinc-300 transition-all shadow-xl shadow-zinc-200/50 md:shadow-none">

        {/* Where */}
        <div ref={locationRef} className="relative flex-1 py-3 md:py-2 px-6 md:pl-8 md:pr-4 border-b md:border-b-0 md:border-r border-zinc-100">
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-zinc-900">Location</p>
          {activeTab === "nearby" ? (
            <div className="flex items-center gap-2 mt-0.5">
              {isLocating ? (
                <>
                  <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                  <span className="text-[14px] md:text-[15px] text-primary font-semibold">Detecting your location…</span>
                </>
              ) : locationError ? (
                <>
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-[14px] md:text-[15px] text-red-500 font-medium truncate">{locationError}</span>
                  <button
                    onClick={() => { setLocationError(null); handleNearbySearch(); }}
                    className="ml-auto text-[11px] font-bold text-primary hover:underline whitespace-nowrap shrink-0"
                  >
                    Retry
                  </button>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-[14px] md:text-[15px] text-primary font-semibold">Current Location</span>
                </>
              )}
            </div>
          ) : (
            <input
              type="text"
              placeholder="Search destinations"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => { if (location.trim() && locationSuggestions.length > 0) setShowLocationSuggestions(true); }}
              onKeyDown={(e) => { if (e.key === "Enter") { setShowLocationSuggestions(false); handleSearch(); } }}
              className="bg-transparent border-none outline-none text-[14px] md:text-[15px] placeholder:text-zinc-300 text-zinc-500 w-full mt-0.5"
            />
          )}

          {/* Location Suggestions Dropdown */}
          <AnimatePresence>
            {showLocationSuggestions && locationSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-zinc-200 shadow-2xl shadow-zinc-200/50 py-1 z-50 overflow-hidden"
              >
                {isFetchingLocations && locationSuggestions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-zinc-400 font-medium">Searching…</div>
                ) : (
                  locationSuggestions.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleSelectSuggestion(city)}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-zinc-50 transition-colors group"
                    >
                      <MapPin className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 shrink-0" />
                      <span className="text-sm font-bold text-zinc-700 group-hover:text-zinc-900">{city}</span>
                    </button>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* When — Date Picker */}
        <div ref={dateRef} className="relative flex-1 border-b md:border-b-0 md:border-r border-zinc-100">
          <button
            onClick={() => {
              setShowDatePicker((v) => !v);
              setShowGuestPicker(false);
            }}
            className="w-full text-left py-3 md:py-2 px-6 md:px-4 cursor-pointer"
          >
            <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-zinc-900">Date</p>
            <p
              className={cn(
                "text-[14px] md:text-[15px] mt-0.5 font-medium",
                checkIn ? "text-zinc-700" : "text-zinc-300"
              )}
            >
              {dateSummary}
            </p>
          </button>

          <AnimatePresence>
            {showDatePicker && (
              <DatePicker
                checkIn={checkIn}
                checkOut={checkOut}
                onSelect={handleDateSelect}
                onClose={() => setShowDatePicker(false)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Who — Guest Selector */}
        <div ref={guestRef} className="relative flex-1 cursor-pointer py-3 md:py-2 px-6 md:px-4 flex items-center justify-between pr-4">
          <button
            onClick={() => {
              setShowGuestPicker((v) => !v);
              setShowDatePicker(false);
            }}
            className="flex-1 text-left flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-zinc-900">Guests</p>
              <p
                className={cn(
                  "text-[14px] md:text-[15px] mt-0.5 font-medium",
                  totalGuests > 0 ? "text-zinc-700" : "text-zinc-300"
                )}
              >
                {guestSummary}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-zinc-300" />
          </button>

          <AnimatePresence>
            {showGuestPicker && (
              <GuestSelector
                guests={guests}
                onChange={setGuests}
                onClose={() => setShowGuestPicker(false)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Circular Search Button */}
        <button
          onClick={handleSearch}
          disabled={activeTab === "nearby" && isLocating}
          title={activeTab === "nearby" ? "Search Nearby" : "Search"}
          className="bg-primary hover:bg-primary/90 text-white h-14 md:h-auto p-4 md:p-4 rounded-xl md:rounded-full transition-all flex items-center justify-center active:scale-95 mt-2 md:mt-0 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {activeTab === "nearby" && isLocating ? (
            <Loader2 className="h-5 w-5 md:h-5 md:w-5 stroke-[3] animate-spin" />
          ) : (
            <>
              <Search className="h-5 w-5 md:h-5 md:w-5 stroke-[3]" />
              <span className="md:hidden ml-2 font-bold uppercase tracking-wider text-sm">
                {activeTab === "nearby" ? "Nearby" : "Search"}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
