"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ListingSearch } from "@/components/listing-search";
import { ItemCard } from "@/components/cards";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback, useRef } from "react";
import { 
  Home, ArrowUpDown, SearchIcon, Loader2, Inbox, Check, ChevronDown, X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

interface StayItem {
  id: string;
  image: string;
  title: string;
  location: string;
  price: string;
  rating: string;
}

const SORT_OPTIONS = [
  { label: "Newest", value: "-createdAt" },
  { label: "Rating: High to Low", value: "-avgRating" },
  { label: "Price: Low to High", value: "basePrice" },
  { label: "Price: High to Low", value: "-basePrice" },
];

// ---------------------------------------------------------------------------
// Stays Page
// ---------------------------------------------------------------------------

export default function StaysPage() {
  // ---- Data ----
  const [stays, setStays] = useState<StayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // ---- Filters ----
  const [filters, setFilters] = useState<FilterParams>({});

  // ---- Sort ----
  const [sortBy, setSortBy] = useState<string>("-createdAt");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Click-outside for sort dropdown
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
  const fetchStays = useCallback(
    async (pageNum: number, append: boolean, activeFilters: FilterParams, activeSort: string) => {
      if (pageNum === 1) {
        setLoading(true);
        setError(null);
        if (!append) setStays([]);
      } else {
        setLoadingMore(true);
      }

      try {
        const params = new URLSearchParams();

        if (activeFilters.location) params.set("city", activeFilters.location);
        if (activeFilters.propertyType) params.set("propertyType", activeFilters.propertyType);
        if (activeFilters.minPrice !== undefined) params.set("minPrice", String(activeFilters.minPrice));
        if (activeFilters.maxPrice !== undefined) params.set("maxPrice", String(activeFilters.maxPrice));
        if (activeFilters.amenities && activeFilters.amenities.length > 0) {
          params.set("amenities", activeFilters.amenities.join(","));
        }
        params.set("sort", activeSort);
        params.set("page", String(pageNum));
        params.set("limit", "20");

        const res = await fetch(`${API_BASE}/listings/browse?${params.toString()}`);
        const json = await res.json().catch(() => null);

        if (!res.ok || !json) {
          throw new Error(json?.message || "Failed to fetch stays");
        }

        const rawItems: any[] = json.data?.listings || [];

        const mapped: StayItem[] = rawItems.map((item: any) => ({
          id: item._id,
          image: item.media?.[0]?.url || "/placeholder.jpg",
          title: item.name,
          location: [item.city, item.state].filter(Boolean).join(", ") || "Unknown",
          price: String(item.effectiveWeekendPrice || item.basePrice || 0),
          rating: item.avgRating ? String(item.avgRating) : "New",
        }));

        if (append) {
          setStays((prev) => [...prev, ...mapped]);
        } else {
          setStays(mapped);
        }
        setTotalPages(json.totalPages || 1);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // ---- Initial fetch ----
  useEffect(() => {
    fetchStays(1, false, filters, sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- ListingSearch callback ----
  const handleSearch = useCallback(
    (params: FilterParams) => {
      setFilters(params);
      setPage(1);
      fetchStays(1, false, params, sortBy);
    },
    [sortBy, fetchStays]
  );

  // ---- Sort change ----
  const handleSortChange = useCallback(
    (value: string) => {
      setSortBy(value);
      setSortOpen(false);
      setPage(1);
      fetchStays(1, false, filters, value);
    },
    [filters, fetchStays]
  );

  // ---- Load more ----
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchStays(nextPage, true, filters, sortBy);
  };

  // ---- Count active filters ----
  const activeFilterCount = [
    filters.propertyType,
    ...(filters.amenities || []),
    filters.minPrice !== undefined,
    filters.maxPrice !== undefined,
  ].filter(Boolean).length;

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "Sort";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="h-16" />

      {/* Sticky Search Bar */}
      <div className="sticky top-16 z-40 bg-white max-h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar pt-2 pb-2">
        <ListingSearch mode="stays" onSearch={handleSearch} />
      </div>

      <main className="relative">
        <div className="container mx-auto px-4 md:px-8 pt-4 pb-24 md:pb-12 md:pt-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 mb-6 md:mb-8">
            <div className="px-1 md:px-2 flex items-center justify-between md:block">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-zinc-900 tracking-tighter mb-1 md:mb-2">
                  {filters.location ? (
                    <>Stays in <span className="text-primary">{filters.location}</span></>
                  ) : (
                    <>Explore <span className="text-primary">Stays</span></>
                  )}
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-zinc-500 font-medium hidden md:block">
                  {filters.location
                    ? `Discover the best homestays in ${filters.location}`
                    : "Discover amazing homestays across India"}
                </p>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest md:hidden mt-0.5">
                  {stays.length} stay{stays.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Mobile Sort Icon Button */}
              <div ref={sortRef} className="relative md:hidden">
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
                {stays.length} stay{stays.length !== 1 ? "s" : ""}
              </p>

              <div className="relative">
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

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-nowrap md:flex-wrap overflow-x-auto no-scrollbar items-center gap-2 mb-6 md:mb-8 px-1 md:px-2 pb-2">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-1 shrink-0">
                Filters
              </span>
              {filters.propertyType && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                  <Home className="w-3 h-3" />
                  {filters.propertyType}
                </span>
              )}
              {(filters.amenities || []).map((a) => (
                <span key={a} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold shrink-0">
                  <Check className="w-3 h-3" />{a}
                </span>
              ))}
              {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold shrink-0">
                  ₹{filters.minPrice ?? 0} – ₹{filters.maxPrice ?? "Any"}
                </span>
              )}
              <button
                onClick={() => {
                  setFilters({});
                  setPage(1);
                  fetchStays(1, false, {}, sortBy);
                }}
                className="text-[10px] font-bold text-zinc-400 hover:text-red-500 transition-colors ml-2 shrink-0 whitespace-nowrap"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-bold text-zinc-500">Searching for the best stays...</p>
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
                onClick={() => fetchStays(1, false, filters, sortBy)}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Results */}
          {!loading && !error && (
            <>
              {stays.length === 0 ? (
                <div className="bg-white rounded-2xl border border-zinc-100 p-8 md:p-16 flex flex-col items-center justify-center text-center space-y-4 mx-1">
                  <Inbox className="w-12 h-12 text-zinc-300" />
                  <h3 className="text-lg font-bold text-zinc-900">No stays found</h3>
                  <p className="text-sm text-zinc-500 max-w-md">
                    {filters.location
                      ? `We couldn't find any stays in "${filters.location}". Try a different location or adjust your filters.`
                      : "There are no available stays matching your search at the moment. Try adjusting your filters or check back later."}
                  </p>
                  {activeFilterCount > 0 && (
                    <Button
                      className="rounded-xl h-10 text-xs font-bold gap-2"
                      onClick={() => {
                        setFilters({});
                        setPage(1);
                        fetchStays(1, false, {}, sortBy);
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-6 md:gap-y-12">
                    {stays.map((stay) => (
                      <ItemCard key={stay.id} {...stay} />
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
                          "Load more stays"
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
