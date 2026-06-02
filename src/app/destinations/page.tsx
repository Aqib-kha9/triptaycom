"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DestinationCard } from "@/components/cards";
import { FeaturesBar } from "@/components/features-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Nature", value: "Nature" },
  { label: "Adventure", value: "Adventure" },
  { label: "Historical", value: "Historical" },
  { label: "Spiritual", value: "Spiritual" },
];

const STATES = [
  "All States",
  "Himachal Pradesh",
  "Uttarakhand",
  "Goa",
  "Rajasthan",
  "Kerala",
  "Sikkim",
  "Ladakh",
  "Meghalaya",
  "Karnataka",
  "Tamil Nadu",
];

interface Destination {
  _id: string;
  name: string;
  slug: string;
  state: string;
  city: string;
  image: string;
  category: string;
  description: string;
  popularityScore: number;
  nearbyStaysCount: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("All States");
  const [showFilters, setShowFilters] = useState(false);

  const fetchDestinations = useCallback(async (page: number, searchTerm: string, category: string) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "12");
      if (searchTerm.trim()) params.set("search", searchTerm.trim());
      if (category) params.set("category", category);

      const res = await fetch(`${API_BASE}/destinations?${params.toString()}`);
      const json = await res.json().catch(() => null);

      if (!res.ok || !json || json.status !== "success") {
        throw new Error(json?.message || "Failed to fetch destinations");
      }

      setDestinations(json.data.destinations);
      setPagination(json.data.pagination);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestinations(1, search, categoryFilter);
  }, [categoryFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    fetchDestinations(1, search, categoryFilter);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handlePageChange = (page: number) => {
    fetchDestinations(page, search, categoryFilter);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter by state on client side (since API doesn't support state filter)
  const filteredDestinations = stateFilter === "All States"
    ? destinations
    : destinations.filter(d => d.state === stateFilter);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* Hero Header */}
        <section className="bg-gradient-to-b from-zinc-50 to-white">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl mx-auto space-y-4"
            >
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-zinc-900">
                Explore <span className="text-primary">Destinations</span>
              </h1>
              <p className="text-zinc-500 text-lg font-medium">
                Discover handpicked destinations across India — from snow-capped mountains to sun-kissed beaches.
              </p>
            </motion.div>

            {/* Search & Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-10 max-w-3xl mx-auto"
            >
              <div className="flex items-center gap-3 bg-white border border-zinc-200 rounded-2xl p-2 shadow-sm">
                <div className="flex-1 flex items-center gap-2 pl-3">
                  <Search className="w-5 h-5 text-zinc-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search destinations..."
                    className="border-0 shadow-none h-12 text-sm font-medium focus-visible:ring-0 placeholder:text-zinc-400"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-12 px-6 rounded-xl font-bold text-sm"
                >
                  Search
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "h-12 w-12 rounded-xl border-zinc-200 p-0",
                    showFilters && "border-primary bg-primary/5 text-primary"
                  )}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Expandable Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 p-5 bg-white border border-zinc-100 rounded-2xl flex flex-wrap gap-6">
                      {/* Category Filter */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                          Category
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {CATEGORIES.map((cat) => (
                            <button
                              key={cat.value}
                              onClick={() => setCategoryFilter(cat.value)}
                              className={cn(
                                "px-4 py-2 text-xs font-bold rounded-xl border transition-all",
                                categoryFilter === cat.value
                                  ? "border-primary bg-primary text-white"
                                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300 bg-white"
                              )}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* State Filter */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                          State
                        </label>
                        <select
                          value={stateFilter}
                          onChange={(e) => setStateFilter(e.target.value)}
                          className="w-full border border-zinc-200 rounded-xl px-4 py-2 text-xs font-bold bg-white text-zinc-700 focus:outline-none focus:border-primary"
                        >
                          {STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Results */}
        <section className="container mx-auto px-4 py-8">
          {/* Stats */}
          {!loading && !error && (
            <div className="flex items-center gap-2 mb-8">
              <MapPin className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-bold text-zinc-500">
                {pagination.total} destination{pagination.total !== 1 ? "s" : ""} found
              </span>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-2xl bg-zinc-100 animate-pulse" />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 text-red-500 mb-4">
                <Loader2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Failed to load destinations</h3>
              <p className="text-sm text-zinc-500 mb-6">{error}</p>
              <Button
                variant="outline"
                onClick={() => fetchDestinations(1, search, categoryFilter)}
                className="rounded-xl"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredDestinations.length === 0 && (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-50 text-zinc-300 mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">No destinations found</h3>
              <p className="text-sm text-zinc-500 mb-6">
                {search || categoryFilter || stateFilter !== "All States"
                  ? "Try adjusting your search or filters."
                  : "No destinations have been added yet. Check back soon!"}
              </p>
              {(search || categoryFilter || stateFilter !== "All States") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("");
                    setStateFilter("All States");
                    fetchDestinations(1, "", "");
                  }}
                  className="rounded-xl"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Grid */}
          {!loading && !error && filteredDestinations.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredDestinations.map((dest, i) => (
                    <motion.div
                      key={dest._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <DestinationCard
                        id={dest.slug}
                        name={dest.name}
                        province={dest.state}
                        image={dest.image}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    disabled={pagination.page <= 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className="h-10 w-10 rounded-xl border-zinc-200 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(p => {
                      // Show first, last, and pages around current
                      if (p === 1 || p === pagination.totalPages) return true;
                      if (Math.abs(p - pagination.page) <= 1) return true;
                      return false;
                    })
                    .map((p, idx, arr) => {
                      // Add ellipsis where there are gaps
                      const showEllipsisBefore = idx > 0 && p - arr[idx - 1] > 1;
                      return (
                        <span key={p} className="flex items-center gap-2">
                          {showEllipsisBefore && (
                            <span className="text-zinc-300 font-bold px-1">…</span>
                          )}
                          <Button
                            variant={p === pagination.page ? "default" : "outline"}
                            onClick={() => handlePageChange(p)}
                            className={cn(
                              "h-10 w-10 rounded-xl p-0 font-bold text-sm",
                              p === pagination.page
                                ? "bg-primary text-white"
                                : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                            )}
                          >
                            {p}
                          </Button>
                        </span>
                      );
                    })}

                  <Button
                    variant="outline"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className="h-10 w-10 rounded-xl border-zinc-200 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

        <FeaturesBar />
      </main>

      <Footer />
    </div>
  );
}