"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ItemCard } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { ListingSearch } from "@/components/listing-search";
import { cn } from "@/lib/utils";
import { activitiesApi } from "@/lib/api-client";
import type { ActivityItem } from "@/types/api";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Mountain, Compass, Waves, Camera, SlidersHorizontal,
  Inbox, ArrowUpDown, SearchIcon, Loader2, Check, ChevronDown,
} from "lucide-react";

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
}

interface ActivityCardItem {
  id: string;
  image: string;
  title: string;
  location: string;
  price: string;
  rating: string;
}

// Category → activityType mapping
const ACTIVITY_CATEGORIES = [
  { id: "all", label: "All", icon: <SlidersHorizontal className="w-4 h-4" />, filter: null },
  { id: "adventure", label: "Adventure", icon: <Zap className="w-4 h-4" />, filter: "rafting" },
  { id: "trekking", label: "Trekking", icon: <Mountain className="w-4 h-4" />, filter: "trekking" },
  { id: "paragliding", label: "Paragliding", icon: <Compass className="w-4 h-4" />, filter: "paragliding" },
  { id: "camping", label: "Camping", icon: <Waves className="w-4 h-4" />, filter: "camping" },
  { id: "safari", label: "Safari", icon: <Camera className="w-4 h-4" />, filter: "safari" },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "-createdAt" },
  { label: "Rating: High to Low", value: "-avgRating" },
  { label: "Price: Low to High", value: "basePrice" },
  { label: "Price: High to Low", value: "-basePrice" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mapApiActivity(item: ActivityItem): ActivityCardItem {
  return {
    id: item.id,
    image: item.media?.[0]?.url || "/placeholder.jpg",
    title: item.name,
    location: [item.city, item.state].filter(Boolean).join(", ") || "Unknown",
    price: String(item.basePrice || item.effectiveWeekendPrice || 0),
    rating: item.avgRating ? String(item.avgRating) : "New",
  };
}

// ---------------------------------------------------------------------------
// Activities Page
// ---------------------------------------------------------------------------

export default function ActivitiesPage() {
  // ---- Data ----
  const [activities, setActivities] = useState<ActivityCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // ---- Category ----
  const [activeCategory, setActiveCategory] = useState("all");

  // ---- Filters (from ListingSearch) ----
  const [searchFilters, setSearchFilters] = useState<FilterParams>({});

  // ---- Sort ----
  const [sortBy, setSortBy] = useState<string>("-createdAt");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Click-outside for sort dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (sortRef.current && !sortRef.current.contains(target) && !target.closest(".sort-container")) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ---- Build merged filters ----
  const buildMergedFilters = useCallback(
    (category: string, sf: FilterParams): FilterParams => {
      const cat = ACTIVITY_CATEGORIES.find((c) => c.id === category);
      const merged: FilterParams = { ...sf };
      // If a category is selected and it has a filter, use it (unless search already set one)
      if (cat?.filter && !sf.activityType) {
        merged.activityType = cat.filter;
      }
      return merged;
    },
    []
  );

  // ---- API fetch ----
  const fetchActivities = useCallback(
    async (pageNum: number, append: boolean, activeFilters: FilterParams, activeSort: string) => {
      if (pageNum === 1) {
        setLoading(true);
        setError(null);
        if (!append) setActivities([]);
      } else {
        setLoadingMore(true);
      }

      try {
        const params: Record<string, string | number | undefined> = {
          city: activeFilters.location,
          activityType: activeFilters.activityType,
          difficulty: activeFilters.difficulty,
          minPrice: activeFilters.minPrice,
          maxPrice: activeFilters.maxPrice,
          sort: activeSort,
          page: pageNum,
          limit: 20,
        };

        const res = await activitiesApi.browse(params);

        const rawItems: ActivityItem[] = res.data?.activities || [];
        const mapped: ActivityCardItem[] = rawItems.map(mapApiActivity);

        if (append) {
          setActivities((prev) => [...prev, ...mapped]);
        } else {
          setActivities(mapped);
        }
        setTotalPages(res.pagination?.totalPages || 1);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch activities");
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // ---- Initial fetch ----
  useEffect(() => {
    const merged = buildMergedFilters(activeCategory, searchFilters);
    fetchActivities(1, false, merged, sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Re-fetch when category changes ----
  const handleCategoryChange = useCallback(
    (catId: string) => {
      if (catId === activeCategory) return;
      setActiveCategory(catId);
      setPage(1);
      const merged = buildMergedFilters(catId, searchFilters);
      fetchActivities(1, false, merged, sortBy);
    },
    [activeCategory, searchFilters, sortBy, buildMergedFilters, fetchActivities]
  );

  // ---- ListingSearch callback ----
  const handleSearch = useCallback(
    (params: FilterParams) => {
      setSearchFilters(params);
      setPage(1);
      const merged = buildMergedFilters(activeCategory, params);
      fetchActivities(1, false, merged, sortBy);
    },
    [activeCategory, sortBy, buildMergedFilters, fetchActivities]
  );

  // ---- Sort change ----
  const handleSortChange = useCallback(
    (value: string) => {
      setSortBy(value);
      setSortOpen(false);
      setPage(1);
      const merged = buildMergedFilters(activeCategory, searchFilters);
      fetchActivities(1, false, merged, value);
    },
    [activeCategory, searchFilters, buildMergedFilters, fetchActivities]
  );

  // ---- Load more ----
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    const merged = buildMergedFilters(activeCategory, searchFilters);
    fetchActivities(nextPage, true, merged, sortBy);
  };

  // ---- Derived ----
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "Sort";
  const activeCat = ACTIVITY_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="h-16" />

      {/* Sticky Search Bar */}
      <div className="sticky top-16 z-40 bg-white max-h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar pt-2 pb-2">
        <ListingSearch mode="activities" onSearch={handleSearch} />
      </div>

      <main className="flex-grow">
        <div className="container mx-auto px-4 md:px-8 pt-4 pb-24 md:pb-12 md:pt-12">
          {/* Header & Categories */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 mb-6 md:mb-8">
            <div className="px-1 md:px-2 flex items-center justify-between md:block">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-zinc-900 tracking-tighter mb-1 md:mb-2">
                  {searchFilters.location ? (
                    <>Activities in <span className="text-primary">{searchFilters.location}</span></>
                  ) : (
                    <>Adventure <span className="text-primary">Activities</span></>
                  )}
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-zinc-500 font-medium hidden md:block">
                  {searchFilters.location
                    ? `Discover the best adventure experiences in ${searchFilters.location}`
                    : activeCategory !== "all"
                      ? `Showing ${activeCat?.label} experiences across India`
                      : "Discover thrilling adventure experiences across India"}
                </p>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest md:hidden mt-0.5">
                  {activities.length} experience{activities.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Mobile Sort Icon Button */}
              <div ref={sortRef} className="relative md:hidden sort-container">
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-zinc-200 text-zinc-900"
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

            {/* Desktop Sort & Count */}
            <div className="hidden md:flex items-center gap-4 px-2">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest hidden sm:block">
                {activities.length} experience{activities.length !== 1 ? "s" : ""}
              </p>

              <div className="relative sort-container">
                <Button
                  variant="outline"
                  className="rounded-xl border-zinc-200 gap-2 h-12 px-6 font-bold text-sm"
                  onClick={() => setSortOpen((prev) => !prev)}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  {sortLabel}
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", sortOpen && "rotate-180")} />
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
                          {sortBy === opt.value && <Check className="w-4 h-4 text-primary" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Category Switcher */}
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar border-b border-zinc-100 mb-8 px-2">
            {ACTIVITY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={cn(
                  "flex items-center gap-2 pb-4 transition-all duration-300 whitespace-nowrap border-b-2 font-bold text-sm group relative",
                  activeCategory === cat.id
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-400 hover:text-zinc-600 hover:border-zinc-200"
                )}
              >
                <div
                  className={cn(
                    "transition-transform duration-300 group-hover:scale-110",
                    activeCategory === cat.id ? "text-zinc-900" : "text-zinc-400"
                  )}
                >
                  {cat.icon}
                </div>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-bold text-zinc-500">Searching for the best activities...</p>
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
                onClick={() => {
                  const merged = buildMergedFilters(activeCategory, searchFilters);
                  fetchActivities(1, false, merged, sortBy);
                }}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Results */}
          {!loading && !error && (
            <>
              {activities.length === 0 ? (
                <div className="bg-white rounded-2xl border border-zinc-100 p-16 flex flex-col items-center justify-center text-center space-y-4">
                  <Inbox className="w-12 h-12 text-zinc-300" />
                  <h3 className="text-lg font-bold text-zinc-900">No activities found</h3>
                  <p className="text-sm text-zinc-500 max-w-md">
                    {searchFilters.location
                      ? `We couldn't find any activities in "${searchFilters.location}". Try a different location or adjust your filters.`
                      : activeCategory !== "all"
                        ? `No ${activeCat?.label} experiences are available right now. Check back soon or browse all activities.`
                        : "There are no available activities matching your search at the moment. Try adjusting your filters or check back later."}
                  </p>
                  {activeCategory !== "all" && (
                    <Button
                      variant="outline"
                      className="rounded-xl h-10 text-xs font-bold gap-2"
                      onClick={() => handleCategoryChange("all")}
                    >
                      Show All Activities
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                    {activities.map((activity) => (
                      <ItemCard key={activity.id} type="activity" {...activity} />
                    ))}
                  </div>

                  {/* Load More */}
                  {page < totalPages && (
                    <div className="flex justify-center py-16 md:py-24">
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
                          "Load more activities"
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
