"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ListingSearch } from "@/components/listing-search";
import { ItemCard } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/navigation/back-button";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Zap,
  MapPin,
  Navigation,
  SlidersHorizontal,
  ArrowUpDown,
  SearchIcon,
  Loader2,
  Check,
  ChevronDown,
  Tent,
  Compass
} from "lucide-react";
import { listingsApi, activitiesApi, nearbyApi } from "@/lib/api-client";
import type { ListingItem, ActivityItem, NearbyItem } from "@/types/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FilterParams {
  location?: string;
  propertyType?: string;
  difficulty?: string;
  activityType?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  sort?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
}

interface ResultItem {
  id: string;
  image: string;
  title: string;
  location: string;
  price: string;
  rating: string;
  type: "homestay" | "activity";
  distanceKm?: number;
  slug?: string;
}

const SORT_OPTIONS = [
  { label: "Newest", value: "-createdAt" },
  { label: "Rating: High to Low", value: "-avgRating" },
  { label: "Price: Low to High", value: "basePrice" },
  { label: "Price: High to Low", value: "-basePrice" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mapListingToResult(item: ListingItem): ResultItem {
  return {
    id: item.id,
    slug: item.slug,
    image: item.media?.[0]?.url || "/placeholder.jpg",
    title: item.name,
    location: [item.city, item.state].filter(Boolean).join(", ") || "Unknown",
    price: String(item.effectiveWeekendPrice || item.basePrice || 0),
    rating: item.avgRating ? String(item.avgRating) : "New",
    type: "homestay",
  };
}

function mapActivityToResult(item: ActivityItem): ResultItem {
  return {
    id: item.id,
    slug: item.slug,
    image: item.media?.[0]?.url || "/placeholder.jpg",
    title: item.name,
    location: [item.city, item.state].filter(Boolean).join(", ") || "Unknown",
    price: String(item.effectiveWeekendPrice || item.basePrice || 0),
    rating: item.avgRating ? String(item.avgRating) : "New",
    type: "activity",
  };
}

function mapNearbyToResult(item: NearbyItem): ResultItem {
  return {
    id: item.id,
    slug: item.slug,
    image: item.media?.[0]?.url || "/placeholder.jpg",
    title: item.name,
    location: [item.city, item.state].filter(Boolean).join(", ") || "Unknown",
    price: String(item.effectiveWeekendPrice || item.price || 0),
    rating: item.avgRating ? String(item.avgRating) : "New",
    type: item.type === "activity" ? "activity" : "homestay",
    distanceKm: item.distanceKm,
  };
}

// ---------------------------------------------------------------------------
// Explore Content (uses useSearchParams – must be wrapped in Suspense)
// ---------------------------------------------------------------------------

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const locationParam = searchParams.get("location") || "";
  const typeParam = searchParams.get("type") || "stays";
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const checkInParam = searchParams.get("checkIn") || undefined;
  const checkOutParam = searchParams.get("checkOut") || undefined;
  const guestsParam = searchParams.get("guests") ? parseInt(searchParams.get("guests")!, 10) : undefined;
  const roomsParam = searchParams.get("rooms") ? parseInt(searchParams.get("rooms")!, 10) : undefined;

  const isNearbyMode = typeParam === "nearby" && latParam && lngParam;

  // ---- UI state ----
  const [activeTab, setActiveTab] = useState<"stays" | "activities" | "nearby">(
    isNearbyMode ? "nearby" : typeParam === "activities" ? "activities" : "stays"
  );
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nearbyCenter, setNearbyCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyRadius, setNearbyRadius] = useState<number>(50);

  // ---- Sort ----
  const [sortBy, setSortBy] = useState<string>("-createdAt");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // ---- Geolocation ----
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // ---- Filters ----
  const [filters, setFilters] = useState<FilterParams>({});

  // Click-outside to close sort dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ---- API fetch ----
  const fetchResults = useCallback(
    async (tab: "stays" | "activities" | "nearby", pageNum: number, append: boolean, activeFilters: FilterParams, activeSort: string) => {
      if (pageNum === 1) {
        setLoading(true);
        setError(null);
        if (!append) setResults([]);
      } else {
        setLoadingMore(true);
      }

      try {
        if (tab === "nearby") {
          const lat = latParam ? parseFloat(latParam) : 0;
          const lng = lngParam ? parseFloat(lngParam) : 0;

          if (isNaN(lat) || isNaN(lng)) {
            throw new Error("Invalid coordinates. Please go back and try again.");
          }

          setNearbyCenter({ lat, lng });

          const res = await nearbyApi.browse({ lat, lng, radius: 50, limit: 20 });

          if (!res || res.status !== "success") {
            throw new Error(res?.message || "Failed to fetch nearby results");
          }

          setNearbyRadius(res.data?.radius || 50);
          const rawItems: NearbyItem[] = res.data?.items || [];
          const mapped = rawItems.map(mapNearbyToResult);

          if (append) {
            setResults((prev) => [...prev, ...mapped]);
          } else {
            setResults(mapped);
          }
          setTotalPages(1);
        } else {
          const city = activeFilters.location || locationParam;

          const params: Record<string, string | number | undefined> = {
            city: city || undefined,
            sort: activeSort,
            page: pageNum,
            limit: 20,
          };

          if (tab === "stays") {
            if (activeFilters.propertyType) params.propertyType = activeFilters.propertyType;
            if (activeFilters.amenities && activeFilters.amenities.length > 0) {
              params.amenities = activeFilters.amenities.join(",");
            }
            if (activeFilters.minPrice !== undefined) params.minPrice = activeFilters.minPrice;
            if (activeFilters.maxPrice !== undefined) params.maxPrice = activeFilters.maxPrice;
            if (activeFilters.checkIn) params.checkIn = activeFilters.checkIn;
            if (activeFilters.checkOut) params.checkOut = activeFilters.checkOut;
            if (activeFilters.guests) params.guests = activeFilters.guests;
            if (activeFilters.rooms) params.rooms = activeFilters.rooms;

            const res = await listingsApi.browse(params);

            if (!res || res.status !== "success") {
              throw new Error(res?.message || "Failed to fetch stays");
            }

            const rawItems: ListingItem[] = res.data?.listings || [];
            const mapped = rawItems.map(mapListingToResult);

            if (append) {
              setResults((prev) => [...prev, ...mapped]);
            } else {
              setResults(mapped);
            }
            setTotalPages(res.pagination?.totalPages || 1);
          } else {
            if (activeFilters.difficulty) params.difficulty = activeFilters.difficulty;
            if (activeFilters.activityType) params.activityType = activeFilters.activityType;
            if (activeFilters.minPrice !== undefined) params.minPrice = activeFilters.minPrice;
            if (activeFilters.maxPrice !== undefined) params.maxPrice = activeFilters.maxPrice;

            const res = await activitiesApi.browse(params);

            if (!res || res.status !== "success") {
              throw new Error(res?.message || "Failed to fetch activities");
            }

            const rawItems: ActivityItem[] = res.data?.activities || [];
            const mapped = rawItems.map(mapActivityToResult);

            if (append) {
              setResults((prev) => [...prev, ...mapped]);
            } else {
              setResults(mapped);
            }
            setTotalPages(res.pagination?.totalPages || 1);
          }
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [locationParam, latParam, lngParam]
  );

  // ---- Initial fetch when URL params change ----
  useEffect(() => {
    const tab = isNearbyMode ? "nearby" : typeParam === "activities" ? "activities" : "stays";
    setActiveTab(tab);
    setPage(1);
    fetchResults(tab, 1, false, filters, sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationParam, typeParam, latParam, lngParam, isNearbyMode]);

  // ---- ListingSearch callback ----
  const handleSearch = useCallback(
    (params: FilterParams) => {
      setFilters(params);
      setPage(1);
      fetchResults(activeTab, 1, false, params, sortBy);
    },
    [activeTab, sortBy, fetchResults]
  );

  // ---- Sort change ----
  const handleSortChange = useCallback(
    (value: string) => {
      setSortBy(value);
      setSortOpen(false);
      setPage(1);
      fetchResults(activeTab, 1, false, filters, value);
    },
    [activeTab, filters, fetchResults]
  );

  // ---- Nearby Geolocation ----
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

  // ---- Tab change ----
  const handleTabChange = (tab: "stays" | "activities" | "nearby") => {
    if (tab === activeTab) return;
    
    if (tab === "nearby") {
      // Use cached coordinates if we already have them in this session
      if (nearbyCenter) {
        router.push(`/explore?type=nearby&lat=${nearbyCenter.lat}&lng=${nearbyCenter.lng}`);
        return;
      }
      handleNearbySearch();
      return;
    }
    
    // For stays or activities, update the URL (this triggers the useEffect to fetch)
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", tab);
    params.delete("lat");
    params.delete("lng");
    router.push(`/explore?${params.toString()}`);
  };

  // ---- Load more ----
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchResults(activeTab, nextPage, true, filters, sortBy);
  };

  // ---- Count active filters ----
  const activeFilterCount = [
    filters.propertyType,
    filters.difficulty,
    filters.activityType,
    ...(filters.amenities || []),
    filters.minPrice !== undefined,
    filters.maxPrice !== undefined,
  ].filter(Boolean).length;

  // ---- Derived labels ----
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "Sort";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="h-16" />

      {/* Global Search Bar — hidden in nearby mode */}
      {activeTab !== "nearby" && (
        <div className="sticky top-16 z-40 bg-white pt-2 pb-2">
          <ListingSearch
            mode={activeTab}
            locationParam={locationParam}
            checkInParam={checkInParam}
            checkOutParam={checkOutParam}
            guestsParam={guestsParam}
            roomsParam={roomsParam}
            onSearch={handleSearch}
          />
        </div>
      )}

      <main className="flex-grow">
        <div className="container mx-auto px-4 md:px-8 pt-2 pb-8 md:pt-4 md:pb-12">
          {/* Search Header & Tab Switcher */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 mb-6 md:mb-8">
            <div className="px-1 md:px-2 flex flex-col items-start justify-between md:block">
              <div className="flex w-full items-center justify-between md:block">
                <div>
                  <h1 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tighter mb-2">
                    {activeTab === "nearby" ? (
                      <>
                        <Navigation className="w-8 h-8 md:w-10 md:h-10 inline-block text-primary mr-1 -mt-1" />
                        Explore <span className="text-primary">Nearby</span>
                      </>
                    ) : locationParam || filters.location ? (
                      <>
                        {activeTab === "stays" ? "Stays" : "Activities"} in{" "}
                        <span className="text-primary">
                          {filters.location || locationParam}
                        </span>
                      </>
                    ) : (
                      <>
                        Explore <span className="text-primary">Triptay.</span>
                      </>
                    )}
                  </h1>
                  <p className="text-sm text-zinc-500 font-medium mb-4">
                    {activeTab === "nearby"
                      ? nearbyCenter
                        ? `Stays & activities within ${nearbyRadius} km of your location`
                        : `Discover stays and activities near you`
                      : locationParam || filters.location
                        ? `Discover the best ${activeTab === "stays" ? "homestays" : "activities"} in ${filters.location || locationParam}`
                        : "Discover amazing stays and activities across India"}
                  </p>
                </div>

                {/* Mobile Sort Icon Button */}
                <div ref={sortRef} className="relative md:hidden shrink-0 mt-2">
                  <button
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-zinc-200 text-zinc-900 shadow-sm"
                    onClick={() => setSortOpen((prev) => !prev)}
                  >
                    <ArrowUpDown className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {sortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-zinc-200 shadow-md py-2 z-50 overflow-hidden"
                      >
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleSortChange(opt.value)}
                            className={cn(
                              "w-full text-left px-4 py-3 flex items-center justify-between text-[13px] font-bold transition-colors",
                              sortBy === opt.value
                                ? "text-primary bg-primary/5"
                                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                            )}
                          >
                            {opt.label}
                            {sortBy === opt.value && <Check className="w-4 h-4 text-primary" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 md:gap-4 w-full sm:w-auto max-w-[500px] mb-2 px-0 md:px-0 pb-2 border-b border-zinc-100/50 md:border-none mt-2">
                <button
                  onClick={() => handleTabChange("stays")}
                  className={cn(
                    "w-full text-[12px] md:text-[15px] font-bold transition-all relative flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-2 py-2 md:pb-1 flex-shrink-0 bg-white border border-zinc-200 rounded-xl md:bg-transparent md:border-transparent md:rounded-none",
                    activeTab === "stays" ? "text-primary !border-primary md:!border-transparent" : "text-zinc-500 hover:text-zinc-900"
                  )}
                >
                  <Home className={cn("w-5 h-5 md:w-6 md:h-6 transition-all duration-300", activeTab === "stays" && "fill-primary")} />
                  Homestays
                  {activeTab === "stays" && (
                    <motion.div
                      layoutId="exploreActiveTab"
                      className="hidden md:block absolute -bottom-1 left-0 w-full h-0.5 bg-primary"
                    />
                  )}
                </button>
                <button
                  onClick={() => handleTabChange("activities")}
                  className={cn(
                    "w-full text-[12px] md:text-[15px] font-bold transition-all relative flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-2 py-2 md:pb-1 flex-shrink-0 bg-white border border-zinc-200 rounded-xl md:bg-transparent md:border-transparent md:rounded-none",
                    activeTab === "activities" ? "text-primary !border-primary md:!border-transparent" : "text-zinc-500 hover:text-zinc-900"
                  )}
                >
                  <Tent className={cn("w-5 h-5 md:w-6 md:h-6 transition-all duration-300", activeTab === "activities" && "fill-primary")} />
                  Activities
                  {activeTab === "activities" && (
                    <motion.div
                      layoutId="exploreActiveTab"
                      className="hidden md:block absolute -bottom-1 left-0 w-full h-0.5 bg-primary"
                    />
                  )}
                </button>
                <button
                  onClick={() => handleTabChange("nearby")}
                  className={cn(
                    "w-full text-[12px] md:text-[15px] font-bold transition-all relative flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-2 py-2 md:pb-1 flex-shrink-0 bg-white border border-zinc-200 rounded-xl md:bg-transparent md:border-transparent md:rounded-none",
                    activeTab === "nearby" ? "text-primary !border-primary md:!border-transparent" : "text-zinc-500 hover:text-zinc-900"
                  )}
                >
                  {isLocating ? (
                    <Loader2 className={cn("w-5 h-5 md:w-6 md:h-6 animate-spin", activeTab === "nearby" && "text-primary")} />
                  ) : (
                    <Compass className={cn("w-5 h-5 md:w-6 md:h-6 transition-all duration-300", activeTab === "nearby" && "fill-primary")} />
                  )}
                  {isLocating ? "Locating..." : "Nearby"}
                  {activeTab === "nearby" && (
                    <motion.div
                      layoutId="exploreActiveTab"
                      className="hidden md:block absolute -bottom-1 left-0 w-full h-0.5 bg-primary"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Desktop Sort & Count */}
            <div className="hidden md:flex items-center gap-4 px-2">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest hidden sm:block">
                Showing {results.length} result{results.length !== 1 ? "s" : ""}
              </p>

              {/* ---- Sort Dropdown ---- */}
              <div className="relative">
                <Button
                  variant="outline"
                  className="rounded-xl border-zinc-200 gap-2 h-12 px-6 font-bold text-sm"
                  onClick={() => setSortOpen((prev) => !prev)}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  {sortLabel}
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform",
                      sortOpen && "rotate-180"
                    )}
                  />
                </Button>

                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-zinc-200 shadow-md py-2 z-50 overflow-hidden"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleSortChange(opt.value)}
                          className={cn(
                            "w-full text-left px-4 py-3 flex items-center justify-between text-sm font-bold transition-colors",
                            sortBy === opt.value
                              ? "text-primary bg-primary/5"
                              : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                          )}
                        >
                          {opt.label}
                          {sortBy === opt.value && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ---- Location Error ---- */}
          {locationError && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 mx-2 text-sm font-semibold border border-red-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {locationError}
            </div>
          )}

          {/* ---- Active Filter Chips ---- */}
          {activeFilterCount > 0 && activeTab !== "nearby" && (
            <div className="flex flex-wrap items-center gap-2 mb-8 px-2">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1">
                Filters
              </span>
              {filters.propertyType && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  <Home className="w-3 h-3" />
                  {filters.propertyType}
                </span>
              )}
              {filters.difficulty && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-900/10 text-zinc-900 text-xs font-bold capitalize">
                  <Zap className="w-3 h-3" />
                  {filters.difficulty}
                </span>
              )}
              {filters.activityType && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold capitalize">
                  <Zap className="w-3 h-3" />
                  {filters.activityType}
                </span>
              )}
              {(filters.amenities || []).map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold"
                >
                  <Check className="w-3 h-3" />
                  {a}
                </span>
              ))}
              {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold">
                  ₹{filters.minPrice ?? 0} – ₹{filters.maxPrice ?? "Any"}
                </span>
              )}
              <button
                onClick={() => {
                  setFilters({});
                  setPage(1);
                  fetchResults(activeTab, 1, false, {}, sortBy);
                }}
                className="text-[10px] font-bold text-zinc-400 hover:text-red-500 transition-colors ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-bold text-zinc-500">
                {activeTab === "nearby"
                  ? "Searching for stays & activities near you..."
                  : `Searching for the best ${activeTab === "stays" ? "stays" : "activities"}...`}
              </p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="bg-white rounded-2xl border border-red-100 p-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <SearchIcon className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Something went wrong</h3>
              <p className="text-sm text-zinc-500 max-w-md">{error}</p>
              <Button
                variant="outline"
                className="rounded-xl h-10 text-xs font-bold gap-2"
                onClick={() => fetchResults(activeTab, 1, false, filters, sortBy)}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Results Grid */}
          {!loading && !error && (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab + (filters.location || "") + sortBy}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {results.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-zinc-100 p-16 flex flex-col items-center justify-center text-center space-y-4">
                      <SearchIcon className="w-12 h-12 text-zinc-300" />
                      <h3 className="text-lg font-bold text-zinc-900">
                        {activeTab === "nearby"
                          ? "Nothing nearby"
                          : `No ${activeTab} found`}
                      </h3>
                      <p className="text-sm text-zinc-500 max-w-md">
                        {activeTab === "nearby"
                          ? `We couldn't find any stays or activities within ${nearbyRadius} km of your location. Try expanding your search or check back later.`
                          : locationParam || filters.location
                            ? `We couldn't find any ${activeTab} in "${filters.location || locationParam}". Try adjusting your filters or browse a different location.`
                            : `No ${activeTab} are available right now. Check back soon for new listings.`}
                      </p>
                      <div className="flex gap-3">
                        <BackButton
                          fallback="/"
                          label="Go Back"
                          variant="outline"
                          className="rounded-xl h-10 text-xs font-bold"
                        />
                        {activeFilterCount > 0 && (
                          <Button
                            className="rounded-xl h-10 text-xs font-bold gap-2"
                            onClick={() => {
                              setFilters({});
                              setPage(1);
                              fetchResults(activeTab, 1, false, {}, sortBy);
                            }}
                          >
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                      {results.map((item) => (
                        <ItemCard key={item.id} {...item} />
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Load More — only for non-nearby tabs */}
              {results.length > 0 && page < totalPages && activeTab !== "nearby" && (
                <div className="flex justify-center py-24">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-12 h-14 border-zinc-200 font-bold text-sm hover:bg-zinc-50"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load more results"
                    )}
                  </Button>
                </div>
              )}

              {/* Nearby — show all-results-loaded indicator */}
              {results.length > 0 && activeTab === "nearby" && (
                <div className="flex justify-center py-24">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Showing all {results.length} result{results.length !== 1 ? "s" : ""} within{" "}
                    {nearbyRadius} km
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page export – wrap in Suspense because useSearchParams requires it
// ---------------------------------------------------------------------------

export default function SearchResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-white">
          <Navbar />
          <div className="h-16" />
          <div className="flex flex-col items-center justify-center flex-grow gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm font-bold text-zinc-500">Loading explore page...</p>
          </div>
          <Footer />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
