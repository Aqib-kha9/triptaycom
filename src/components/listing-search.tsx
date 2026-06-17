"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { 
  MapPin, 
  Users, 
  Calendar, 
  Search, 
  SlidersHorizontal,
  X,
  Check,
  ChevronDown,
  Home,
  Zap,
  Mountain,
  Clock,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const PROPERTY_TYPES = [
  { id: "villa", label: "Villas", icon: <Home className="w-3.5 h-3.5" /> },
  { id: "apartment", label: "Apartments", icon: <Home className="w-3.5 h-3.5" /> },
  { id: "cottage", label: "Cottages", icon: <Home className="w-3.5 h-3.5" /> },
  { id: "farmstay", label: "Farm Stays", icon: <Home className="w-3.5 h-3.5" /> },
  { id: "luxury", label: "Luxury", icon: <Home className="w-3.5 h-3.5" /> },
];

const DIFFICULTY_LEVELS = [
  { id: "easy", label: "Easy", color: "border-emerald-200 hover:border-emerald-400 hover:text-emerald-700" },
  { id: "moderate", label: "Moderate", color: "border-amber-200 hover:border-amber-400 hover:text-amber-700" },
  { id: "hard", label: "Hard", color: "border-orange-200 hover:border-orange-400 hover:text-orange-700" },
  { id: "expert", label: "Expert", color: "border-red-200 hover:border-red-400 hover:text-red-700" },
];

const STAY_AMENITIES = ["WiFi", "Pool", "Parking", "AC", "Kitchen", "Pet Friendly"];
const ACTIVITY_TYPES = ["rafting", "trekking", "paragliding", "camping", "cycling", "safari", "bungee", "skiing"];

interface FilterParams {
  location?: string;
  propertyType?: string;
  difficulty?: string;
  activityType?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  sort?: string;
}

interface ListingSearchProps {
  mode?: "stays" | "activities";
  locationParam?: string;
  onSearch?: (params: FilterParams) => void;
}

export function ListingSearch({ mode = "stays", locationParam, onSearch }: ListingSearchProps) {
  const [mounted, setMounted] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Location
  const [location, setLocation] = useState(locationParam || "");
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isFetchingLocations, setIsFetchingLocations] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Filters
  const [selectedPropertyType, setSelectedPropertyType] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedActivityType, setSelectedActivityType] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  // Sync locationParam from parent
  useEffect(() => {
    if (locationParam) setLocation(locationParam);
  }, [locationParam]);

  // Location autocomplete
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

  // Click-outside for location suggestions
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelectSuggestion = (city: string) => {
    setLocation(city);
    setShowLocationSuggestions(false);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const buildFilterParams = useCallback((): FilterParams => {
    const params: FilterParams = {};
    if (location.trim()) params.location = location.trim();
    if (selectedPropertyType) params.propertyType = selectedPropertyType;
    if (selectedDifficulty) params.difficulty = selectedDifficulty;
    if (selectedActivityType) params.activityType = selectedActivityType;
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;
    if (selectedAmenities.length > 0) params.amenities = selectedAmenities;
    return params;
  }, [location, selectedPropertyType, selectedDifficulty, selectedActivityType, minPrice, maxPrice, selectedAmenities]);

  const handleApplyFilters = () => {
    const params = buildFilterParams();
    onSearch?.(params);
    setIsFilterOpen(false);
  };

  const handleResetAll = () => {
    setLocation("");
    setSelectedPropertyType(null);
    setSelectedDifficulty(null);
    setSelectedActivityType(null);
    setSelectedAmenities([]);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    onSearch?.({});
    setIsFilterOpen(false);
  };

  const handleLocationSubmit = () => {
    const params = buildFilterParams();
    onSearch?.(params);
  };

  const locationSummary = location.trim() || "Where to?";

  return (
    <div className="w-full bg-white relative z-30">
      <div className="container mx-auto px-4">
        
        {/* Mobile Compact Search Bar */}
        <div className="lg:hidden flex items-center gap-3">
          <button 
            onClick={() => setIsSearchExpanded(true)}
            className="flex-1 flex items-center gap-3 bg-white border border-zinc-200 rounded-full px-5 h-12 active:scale-[0.98] transition-all"
          >
            <Search className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="text-xs font-bold text-zinc-900 truncate max-w-[200px]">
                {locationSummary}
              </p>
              <p className="text-[10px] text-zinc-400 font-medium">
                {mode === "stays" ? "Find homestays" : "Find activities"}
              </p>
            </div>
          </button>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-full transition-all border",
              isFilterOpen ? "bg-primary text-white border-primary" : "bg-white border-zinc-200 text-zinc-900"
            )}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Full Search Bar */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex-1 flex items-center bg-white border border-zinc-200 rounded-2xl p-1 transition-all">
            {/* Location with Autocomplete */}
            <div ref={locationRef} className="relative flex-1 flex items-center gap-3 px-3 py-1.5 border-r border-zinc-100 cursor-pointer hover:bg-white rounded-xl transition-all group">
              <div className="w-9 h-9 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Location</p>
                <input
                  type="text"
                  placeholder="Search destinations"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => { if (location.trim() && locationSuggestions.length > 0) setShowLocationSuggestions(true); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { setShowLocationSuggestions(false); handleLocationSubmit(); } }}
                  className="bg-transparent border-none outline-none text-sm font-bold text-zinc-900 w-full placeholder:text-zinc-300"
                />
              </div>

              {/* Location Suggestions Dropdown */}
              <AnimatePresence>
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-zinc-200 shadow-md py-1 z-50 overflow-hidden"
                  >
                    {isFetchingLocations && locationSuggestions.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-zinc-400 font-medium flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Searching…
                      </div>
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

            {/* Current Filters Summary */}
            <div className="w-44 flex items-center gap-3 px-3 py-1.5 cursor-default group">
              <div className="w-9 h-9 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 transition-colors">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Filters</p>
                <p className="text-sm font-bold text-zinc-500">
                  {mode === "stays" 
                    ? (selectedPropertyType || selectedAmenities.length > 0 ? "Active" : "None")
                    : (selectedDifficulty || selectedActivityType ? "Active" : "None")
                  }
                </p>
              </div>
            </div>

            {/* Search Button */}
            <Button onClick={handleLocationSubmit} className="h-12 w-12 rounded-xl flex-shrink-0">
              <Search className="w-6 h-6" />
            </Button>
          </div>

          {/* Filter Toggle Button */}
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "flex items-center gap-3 px-5 h-14 rounded-2xl font-bold text-sm transition-all border",
              isFilterOpen 
                ? "bg-primary text-white border-primary" 
                : "bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown className={cn("w-4 h-4 transition-transform", isFilterOpen && "rotate-180")} />
          </button>
        </div>

        {/* Inline Expanding Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="overflow-hidden"
            >
              <div className="pt-8 pb-4">
                <div className="bg-zinc-50/50 rounded-[32px] border border-zinc-100 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    
                    {/* Filter 1: Price Range */}
                    <div className="space-y-6">
                      <h3 className="font-bold text-zinc-900 uppercase tracking-widest text-[10px]">
                        {mode === "stays" ? "Price Range" : "Budget per person"}
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Min ₹</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={minPrice ?? ""}
                              onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) : undefined)}
                              className="w-full mt-1 px-3 py-2 rounded-xl border border-zinc-200 text-sm font-bold outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Max ₹</label>
                            <input
                              type="number"
                              placeholder="Any"
                              value={maxPrice ?? ""}
                              onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : undefined)}
                              className="w-full mt-1 px-3 py-2 rounded-xl border border-zinc-200 text-sm font-bold outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Filter 2: Property Type / Difficulty */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-zinc-900 uppercase tracking-widest text-[10px]">
                        {mode === "stays" ? "Property Type" : "Difficulty Level"}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {mode === "stays" ? (
                          PROPERTY_TYPES.map((pt) => (
                            <button
                              key={pt.id}
                              onClick={() => setSelectedPropertyType((prev) => prev === pt.id ? null : pt.id)}
                              className={cn(
                                "px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5",
                                selectedPropertyType === pt.id
                                  ? "bg-primary text-white border-primary"
                                  : "bg-white border-zinc-200 text-zinc-600 hover:border-primary hover:text-primary"
                              )}
                            >
                              {pt.icon}
                              {pt.label}
                            </button>
                          ))
                        ) : (
                          DIFFICULTY_LEVELS.map((d) => (
                            <button
                              key={d.id}
                              onClick={() => setSelectedDifficulty((prev) => prev === d.id ? null : d.id)}
                              className={cn(
                                "px-4 py-2 rounded-xl border text-xs font-bold transition-all capitalize",
                                selectedDifficulty === d.id
                                  ? "bg-zinc-900 text-white border-zinc-900"
                                  : `bg-white ${d.color} text-zinc-600`
                              )}
                            >
                              {d.label}
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Filter 3: Amenities / Activity Type */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-zinc-900 uppercase tracking-widest text-[10px]">
                        {mode === "stays" ? "Amenities" : "Activity Type"}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {mode === "stays" ? (
                          STAY_AMENITIES.map((amenity) => (
                            <button
                              key={amenity}
                              onClick={() => toggleAmenity(amenity)}
                              className={cn(
                                "px-4 py-2 rounded-xl border text-xs font-bold transition-all",
                                selectedAmenities.includes(amenity)
                                  ? "bg-primary text-white border-primary"
                                  : "bg-white border-zinc-200 text-zinc-600 hover:border-primary hover:text-primary"
                              )}
                            >
                              {amenity}
                            </button>
                          ))
                        ) : (
                          ACTIVITY_TYPES.map((at) => (
                            <button
                              key={at}
                              onClick={() => setSelectedActivityType((prev) => prev === at ? null : at)}
                              className={cn(
                                "px-4 py-2 rounded-xl border text-xs font-bold transition-all capitalize",
                                selectedActivityType === at
                                  ? "bg-primary text-white border-primary"
                                  : "bg-white border-zinc-200 text-zinc-600 hover:border-primary hover:text-primary"
                              )}
                            >
                              {at}
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-col justify-end gap-3">
                      <Button onClick={handleApplyFilters} className="w-full h-12 rounded-xl font-bold">
                        Show {mode === "stays" ? "stays" : "activities"}
                      </Button>
                      <button
                        onClick={handleResetAll}
                        className="flex items-center justify-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-all"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset All
                      </button>
                    </div>

                  </div>
                </div>
                {/* Extra padding to ensure scrollable content isn't hidden by Mobile Bottom Nav */}
                <div className="h-24 lg:hidden" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Search Overlay - Bottom Sheet (Portaled to body to escape z-index context) */}
      {mounted && createPortal(
        <AnimatePresence>
          {isSearchExpanded && (
            <motion.div key="mobile-overlay" className="block lg:hidden">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSearchExpanded(false)}
                className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[9990]"
              />
              
              {/* Bottom Sheet Modal */}
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 max-h-[90vh] bg-white z-[9995] rounded-t-[32px] overflow-hidden flex flex-col shadow-2xl"
              >
                {/* Drag Handle Area */}
                <div 
                  className="w-full flex justify-center pt-4 pb-2 bg-white sticky top-0 z-[9999]"
                  onClick={() => setIsSearchExpanded(false)}
                >
                  <div className="w-12 h-1.5 rounded-full bg-zinc-200" />
                </div>

                {/* Scrollable Content */}
                <div className="p-6 pt-2 overflow-y-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-50">
                    <div>
                      <h2 className="text-2xl font-black text-zinc-900">{mode === "stays" ? "Where to?" : "What to do?"}</h2>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Plan your next adventure</p>
                    </div>
                    <button 
                      onClick={() => setIsSearchExpanded(false)}
                      className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center active:scale-90 transition-all hover:bg-zinc-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Location */}
                    <div ref={locationRef} className="space-y-2 relative">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Location</label>
                      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-zinc-200">
                        <MapPin className="w-5 h-5 text-primary shrink-0" />
                        <input
                          type="text"
                          placeholder="Search destination"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          onFocus={() => { if (location.trim() && locationSuggestions.length > 0) setShowLocationSuggestions(true); }}
                          className="bg-transparent outline-none text-sm font-bold w-full"
                        />
                      </div>
                      <AnimatePresence>
                        {showLocationSuggestions && locationSuggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl border border-zinc-200 shadow-2xl py-1 z-50"
                          >
                            {locationSuggestions.map((city) => (
                              <button
                                key={city}
                                onClick={() => handleSelectSuggestion(city)}
                                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-zinc-50"
                              >
                                <MapPin className="w-4 h-4 text-zinc-300" />
                                <span className="text-sm font-bold text-zinc-700">{city}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Budget per person</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-zinc-200">
                          <span className="text-[10px] font-bold text-zinc-400">₹</span>
                          <input
                            type="number"
                            placeholder="Min"
                            value={minPrice ?? ""}
                            onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) : undefined)}
                            className="bg-transparent outline-none text-sm font-bold w-full"
                          />
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-zinc-200">
                          <span className="text-[10px] font-bold text-zinc-400">₹</span>
                          <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice ?? ""}
                            onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : undefined)}
                            className="bg-transparent outline-none text-sm font-bold w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Property Type / Difficulty */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        {mode === "stays" ? "Property Type" : "Difficulty Level"}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {mode === "stays" ? (
                          PROPERTY_TYPES.map((pt) => (
                            <button
                              key={pt.id}
                              onClick={() => setSelectedPropertyType((prev) => prev === pt.id ? null : pt.id)}
                              className={cn(
                                "px-4 py-2.5 rounded-xl border text-xs font-bold transition-all",
                                selectedPropertyType === pt.id
                                  ? "bg-primary text-white border-primary"
                                  : "bg-white border-zinc-200 text-zinc-600"
                              )}
                            >
                              {pt.label}
                            </button>
                          ))
                        ) : (
                          DIFFICULTY_LEVELS.map((d) => (
                            <button
                              key={d.id}
                              onClick={() => setSelectedDifficulty((prev) => prev === d.id ? null : d.id)}
                              className={cn(
                                "px-4 py-2.5 rounded-xl border text-xs font-bold transition-all capitalize",
                                selectedDifficulty === d.id
                                  ? "bg-zinc-900 text-white border-zinc-900"
                                  : "bg-white border-zinc-200 text-zinc-600"
                              )}
                            >
                              {d.label}
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Amenities / Activity Type */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        {mode === "stays" ? "Amenities" : "Activity Type"}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {mode === "stays" ? (
                          STAY_AMENITIES.map((amenity) => (
                            <button
                              key={amenity}
                              onClick={() => toggleAmenity(amenity)}
                              className={cn(
                                "px-4 py-2.5 rounded-xl border text-xs font-bold transition-all",
                                selectedAmenities.includes(amenity)
                                  ? "bg-primary text-white border-primary"
                                  : "bg-white border-zinc-200 text-zinc-600"
                              )}
                            >
                              {amenity}
                            </button>
                          ))
                        ) : (
                          ACTIVITY_TYPES.map((at) => (
                            <button
                              key={at}
                              onClick={() => setSelectedActivityType((prev) => prev === at ? null : at)}
                              className={cn(
                                "px-4 py-2.5 rounded-xl border text-xs font-bold transition-all capitalize",
                                selectedActivityType === at
                                  ? "bg-primary text-white border-primary"
                                  : "bg-white border-zinc-200 text-zinc-600"
                              )}
                            >
                              {at}
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 pb-8">
                      <button 
                        onClick={handleResetAll}
                        className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-zinc-200 font-bold text-sm text-zinc-500 hover:bg-zinc-50 transition-all flex-1"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </button>
                      <button 
                        onClick={() => { handleApplyFilters(); setIsSearchExpanded(false); }}
                        className="bg-primary text-white font-black py-4 rounded-2xl active:scale-95 transition-all flex-1"
                      >
                        Search {mode === "stays" ? "Stays" : "Activities"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
