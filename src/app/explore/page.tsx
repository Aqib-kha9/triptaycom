"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ListingSearch } from "@/components/listing-search";
import { ItemCard } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Zap, MapPin, Navigation, SlidersHorizontal, ArrowUpDown, SearchIcon, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ResultItem {
  id: string;
  image: string;
  title: string;
  location: string;
  price: string;
  rating: string;
  type: "homestay" | "activity";
  distanceKm?: number;
}

function ExploreContent() {
  const searchParams = useSearchParams();

  const locationParam = searchParams.get("location") || "";
  const typeParam = searchParams.get("type") || "stays";
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");

  const isNearbyMode = typeParam === "nearby" && latParam && lngParam;

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

  const fetchResults = useCallback(async (tab: "stays" | "activities" | "nearby", pageNum: number, append: boolean) => {
    if (pageNum === 1) {
      setLoading(true);
      setError(null);
      setResults([]);
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

        const params = new URLSearchParams();
        params.set("lat", String(lat));
        params.set("lng", String(lng));
        params.set("radius", "50");
        params.set("limit", "20");

        const res = await fetch(`${API_BASE}/nearby/browse?${params.toString()}`);
        const json = await res.json().catch(() => null);

        if (!res.ok || !json) {
          throw new Error(json?.message || "Failed to fetch nearby results");
        }

        setNearbyRadius(json.radius || 50);
        const rawItems: any[] = json.data?.items || [];

        const mapped: ResultItem[] = rawItems.map((item: any) => ({
          id: item._id,
          image: item.media?.[0]?.url || "/placeholder.jpg",
          title: item.name,
          location: [item.city, item.state].filter(Boolean).join(", ") || "Unknown",
          price: String(item.effectiveWeekendPrice || item.price || 0),
          rating: item.avgRating ? String(item.avgRating) : "New",
          type: item.type === "activity" ? "activity" : "homestay",
          distanceKm: item.distanceKm,
        }));

        if (append) {
          setResults((prev) => [...prev, ...mapped]);
        } else {
          setResults(mapped);
        }
        setTotalPages(1); // nearby endpoint doesn't paginate — all results at once
      } else {
        const endpoint = tab === "stays" ? "listings/browse" : "activities/browse";
        const params = new URLSearchParams();
        if (locationParam) params.set("city", locationParam);
        params.set("page", String(pageNum));
        params.set("limit", "20");
        params.set("sort", "-updatedAt");

        const res = await fetch(`${API_BASE}/${endpoint}?${params.toString()}`);
        const json = await res.json().catch(() => null);

        if (!res.ok || !json) {
          throw new Error(json?.message || `Failed to fetch ${tab}`);
        }

        const rawItems: any[] =
          tab === "stays"
            ? json.data?.listings || []
            : json.data?.activities || [];

        const mapped: ResultItem[] = rawItems.map((item: any) => ({
          id: item._id,
          image: item.media?.[0]?.url || "/placeholder.jpg",
          title: item.name,
          location: [item.city, item.state].filter(Boolean).join(", ") || "Unknown",
          price: String(
            item.effectiveWeekendPrice || item.basePrice || 0
          ),
          rating: item.avgRating ? String(item.avgRating) : "New",
          type: tab === "stays" ? "homestay" : "activity",
        }));

        if (append) {
          setResults((prev) => [...prev, ...mapped]);
        } else {
          setResults(mapped);
        }
        setTotalPages(json.totalPages || 1);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [locationParam, latParam, lngParam]);

  // Initial fetch when params change
  useEffect(() => {
    const tab = isNearbyMode ? "nearby" : typeParam === "activities" ? "activities" : "stays";
    setActiveTab(tab);
    setPage(1);
    fetchResults(tab, 1, false);
  }, [locationParam, typeParam, latParam, lngParam, isNearbyMode, fetchResults]);

  const handleTabChange = (tab: "stays" | "activities" | "nearby") => {
    if (tab === activeTab) return;
    if (tab === "nearby") {
      // The nearby tab in explore page acts as a prompt — user needs to go back to home
      window.history.back();
      return;
    }
    setActiveTab(tab);
    setPage(1);
    fetchResults(tab, 1, false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchResults(activeTab, nextPage, true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="h-16" />

      {/* Global Search Bar — hidden in nearby mode */}
      {activeTab !== "nearby" && (
        <div className="sticky top-16 z-40 bg-white shadow-sm">
          <ListingSearch mode={activeTab} />
        </div>
      )}

      <main className="flex-grow">
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">

          {/* Search Header & Tab Switcher */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="px-2">
              <h1 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tighter mb-2">
                {activeTab === "nearby" ? (
                  <>
                    <Navigation className="w-8 h-8 md:w-10 md:h-10 inline-block text-primary mr-1 -mt-1" />
                    Explore <span className="text-primary">Nearby</span>
                  </>
                ) : locationParam ? (
                  <>
                    {activeTab === "stays" ? "Stays" : "Activities"} in{" "}
                    <span className="text-primary">{locationParam}</span>
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
                  : locationParam
                    ? `Discover the best ${activeTab === "stays" ? "homestays" : "activities"} in ${locationParam}`
                    : "Discover amazing stays and activities across India"}
              </p>
              <div className="flex items-center p-1.5 bg-zinc-100 rounded-2xl w-fit">
                <button
                  onClick={() => handleTabChange("stays")}
                  className={cn(
                    "flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                    activeTab === "stays" ? "bg-white text-zinc-900 shadow-md" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  <Home className="w-4 h-4" />
                  Stays
                </button>
                <button
                  onClick={() => handleTabChange("activities")}
                  className={cn(
                    "flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                    activeTab === "activities" ? "bg-white text-zinc-900 shadow-md" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  <Zap className="w-4 h-4" />
                  Activities
                </button>
                {nearbyCenter && (
                  <button
                    onClick={() => handleTabChange("nearby")}
                    className={cn(
                      "flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                      activeTab === "nearby" ? "bg-white text-zinc-900 shadow-md" : "text-zinc-500 hover:text-zinc-700"
                    )}
                  >
                    <Navigation className="w-4 h-4" />
                    Nearby
                  </button>
                )}
              </div>
            </div>

            {/* Sort & Quick Info */}
            <div className="flex items-center gap-4 px-2">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest hidden sm:block">
                Showing {results.length} result{results.length !== 1 ? "s" : ""}
              </p>
              <Button variant="outline" className="rounded-xl border-zinc-200 gap-2 h-12 px-6 font-bold text-sm">
                <ArrowUpDown className="w-4 h-4" />
                Sort By
              </Button>
            </div>
          </div>

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
                onClick={() => fetchResults(activeTab, 1, false)}
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
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {results.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-zinc-100 p-16 flex flex-col items-center justify-center text-center space-y-4">
                      <SearchIcon className="w-12 h-12 text-zinc-300" />
                      <h3 className="text-lg font-bold text-zinc-900">
                        {activeTab === "nearby" ? "Nothing nearby" : `No ${activeTab} found`}
                      </h3>
                      <p className="text-sm text-zinc-500 max-w-md">
                        {activeTab === "nearby"
                          ? `We couldn't find any stays or activities within ${nearbyRadius} km of your location. Try expanding your search or check back later.`
                          : locationParam
                            ? `We couldn't find any ${activeTab} in "${locationParam}". Try a different location or browse all.`
                            : `No ${activeTab} are available right now. Check back soon for new listings.`}
                      </p>
                      <Button
                        variant="outline"
                        className="rounded-xl h-10 text-xs font-bold gap-2"
                        onClick={() => window.history.back()}
                      >
                        Go Back
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                      {results.map((item, i) => (
                        <ItemCard key={item.id} {...item} />
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Load More — only for non-nearby tabs (nearby returns all results at once) */}
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
                    Showing all {results.length} result{results.length !== 1 ? "s" : ""} within {nearbyRadius} km
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
