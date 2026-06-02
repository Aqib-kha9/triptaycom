"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { FeaturesBar } from "@/components/features-bar";
import { ItemCard } from "@/components/cards";
import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import {
    MapPin,
    Star,
    ChevronRight,
    Navigation,
    Mountain,
    Waves,
    Compass,
    Church,
    ArrowLeft,
    Share2,
    Heart,
    Loader2,
    Globe,
    Camera,
    Calendar,
    Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface DestinationDetail {
    _id: string;
    name: string;
    slug: string;
    state: string;
    city: string;
    image: string;
    category: "Nature" | "Adventure" | "Historical" | "Spiritual";
    coordinates: { lat: number; lng: number };
    description: string;
    popularityScore: number;
    nearbyStaysCount: number;
    createdAt: string;
    updatedAt: string;
}

const categoryMeta: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    Nature: { icon: <Mountain className="w-4 h-4" />, label: "Nature", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    Adventure: { icon: <Compass className="w-4 h-4" />, label: "Adventure", color: "bg-orange-50 text-orange-700 border-orange-200" },
    Historical: { icon: <Church className="w-4 h-4" />, label: "Historical", color: "bg-amber-50 text-amber-700 border-amber-200" },
    Spiritual: { icon: <Waves className="w-4 h-4" />, label: "Spiritual", color: "bg-purple-50 text-purple-700 border-purple-200" },
};

export default function DestinationDetailPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const params = use(paramsPromise);
    const [destination, setDestination] = useState<DestinationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [similarDests, setSimilarDests] = useState<DestinationDetail[]>([]);

    useEffect(() => {
        let cancelled = false;

        async function fetchDetail() {
            try {
                const res = await fetch(`${API_BASE}/destinations/${params.slug}`);
                const json = await res.json().catch(() => null);

                if (!cancelled) {
                    if (!res.ok || !json || json.status !== "success") {
                        throw new Error(json?.message || "Destination not found");
                    }
                    setDestination(json.data.destination);
                }
            } catch (err: any) {
                if (!cancelled) setError(err.message || "Something went wrong");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchDetail();
        return () => { cancelled = true; };
    }, [params.slug]);

    // Fetch similar destinations (same category or state)
    useEffect(() => {
        if (!destination) return;
        let cancelled = false;

        async function fetchSimilar() {
            try {
                const params = new URLSearchParams();
                params.set("limit", "4");
                if (destination!.category) params.set("category", destination!.category);

                const res = await fetch(`${API_BASE}/destinations?${params.toString()}`);
                const json = await res.json().catch(() => null);

                if (!cancelled && json?.status === "success") {
                    const filtered = json.data.destinations.filter(
                        (d: any) => d.slug !== destination!.slug
                    );
                    setSimilarDests(filtered);
                }
            } catch {
                // Silent fail for similar destinations
            }
        }

        fetchSimilar();
        return () => { cancelled = true; };
    }, [destination]);

    const catMeta = destination ? (categoryMeta[destination.category] || categoryMeta.Nature) : categoryMeta.Nature;

    // Loading
    if (loading) {
        return (
            <div className="flex min-h-screen flex-col bg-white">
                <Navbar />
                <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-sm font-bold text-zinc-500">Loading destination...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Error / Not Found
    if (error || !destination) {
        return (
            <div className="flex min-h-screen flex-col bg-white">
                <Navbar />
                <main className="flex-grow pt-24 pb-20 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-50 text-red-400 mb-2">
                            <MapPin className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900">
                            {error === "Destination not found" ? "Destination Not Found" : "Something Went Wrong"}
                        </h2>
                        <p className="text-zinc-500 font-medium max-w-md">
                            {error === "Destination not found"
                                ? "The destination you're looking for doesn't exist or has been removed."
                                : error}
                        </p>
                        <Link href="/destinations">
                            <Button variant="outline" className="rounded-xl mt-2 gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Destinations
                            </Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Navbar />

            <main className="flex-grow">
                {/* Back Link */}
                <div className="container mx-auto px-4 pt-24 pb-4">
                    <Link
                        href="/destinations"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        All Destinations
                    </Link>
                </div>

                {/* Hero Banner */}
                <section className="container mx-auto px-4 mb-12">
                    <div className="relative rounded-[40px] overflow-hidden h-[300px] md:h-[500px] group shadow-2xl shadow-zinc-200">
                        <img
                            src={destination.image}
                            alt={destination.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div className="space-y-3 text-white">
                                    <div className="flex items-center gap-3">
                                        <span className={cn("px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border", catMeta.color)}>
                                            {catMeta.label}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs font-bold text-white/80">
                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                            {destination.popularityScore > 0 ? destination.popularityScore : "New"}
                                        </span>
                                    </div>
                                    <h1 className="text-4xl md:text-6xl font-black tracking-tight">{destination.name}</h1>
                                    <div className="flex items-center gap-2 text-white/80">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm font-bold">
                                            {destination.city}, {destination.state}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full gap-2 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Share
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className={cn(
                                            "rounded-full gap-2 backdrop-blur-md transition-all",
                                            isWishlisted
                                                ? "bg-primary/20 border-primary/30 text-white"
                                                : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                                        )}
                                    >
                                        <Heart className={cn("w-4 h-4", isWishlisted && "fill-white")} />
                                        {isWishlisted ? "Saved" : "Save"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Grid */}
                <section className="container mx-auto px-4 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left: Main Content */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Quick Info Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 text-center space-y-1"
                                >
                                    <MapPin className="w-5 h-5 text-primary mx-auto" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">State</p>
                                    <p className="text-sm font-bold text-zinc-900">{destination.state}</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 text-center space-y-1"
                                >
                                    <Tag className="w-5 h-5 text-primary mx-auto" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Category</p>
                                    <p className="text-sm font-bold text-zinc-900">{destination.category}</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 text-center space-y-1"
                                >
                                    <Star className="w-5 h-5 text-primary mx-auto" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Popularity</p>
                                    <p className="text-sm font-bold text-zinc-900">{destination.popularityScore} pts</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 text-center space-y-1"
                                >
                                    <Globe className="w-5 h-5 text-primary mx-auto" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nearby</p>
                                    <p className="text-sm font-bold text-zinc-900">
                                        {destination.nearbyStaysCount > 0 ? `${destination.nearbyStaysCount} stays` : "Coming soon"}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Description */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-zinc-900">About {destination.name}</h2>
                                <p className="text-zinc-600 leading-relaxed text-lg font-medium">
                                    {destination.description || `${destination.name} is a beautiful destination in ${destination.state}, India. Known for its scenic landscapes, rich culture, and warm hospitality, ${destination.name} offers travelers an unforgettable experience. Whether you're seeking adventure, spiritual retreat, or a peaceful getaway, ${destination.name} has something special for everyone.`}
                                </p>
                            </motion.div>

                            {/* Location Map */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                className="space-y-6 pt-8 border-t border-zinc-100"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-zinc-900">Location</h2>
                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                        {destination.coordinates.lat.toFixed(4)}° N, {destination.coordinates.lng.toFixed(4)}° E
                                    </span>
                                </div>
                                <div className="h-[350px] w-full rounded-[32px] bg-zinc-100 overflow-hidden relative border border-zinc-100">
                                    {/* Static map placeholder using coordinates */}
                                    <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center">
                                        <div className="text-center space-y-2">
                                            <div className="bg-primary/20 p-6 rounded-full inline-flex animate-pulse">
                                                <div className="bg-primary p-4 rounded-full text-white shadow-2xl shadow-primary/40">
                                                    <MapPin className="w-8 h-8" />
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold text-zinc-500">
                                                {destination.city}, {destination.state}
                                            </p>
                                            <p className="text-xs text-zinc-400 font-medium">
                                                {destination.coordinates.lat.toFixed(4)}, {destination.coordinates.lng.toFixed(4)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-zinc-100 flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-zinc-900 text-sm">{destination.city}</p>
                                            <p className="text-xs text-zinc-500 font-medium">{destination.state}, India</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="font-bold text-primary gap-1.5"
                                            onClick={() => {
                                                window.open(
                                                    `https://maps.google.com/?q=${destination.coordinates.lat},${destination.coordinates.lng}`,
                                                    "_blank"
                                                );
                                            }}
                                        >
                                            <Navigation className="w-4 h-4" />
                                            Directions
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Explore Nearby */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-6 pt-8 border-t border-zinc-100"
                            >
                                <h2 className="text-2xl font-bold text-zinc-900">Explore Nearby</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Link
                                        href={`/explore?type=stays&location=${encodeURIComponent(destination.city)}`}
                                        className="p-6 rounded-2xl border border-zinc-100 hover:bg-zinc-50 transition-colors group flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                                    <polyline points="9 22 9 12 15 12 15 22" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-bold text-zinc-900 text-sm">Stays in {destination.city}</p>
                                                <p className="text-xs text-zinc-500 font-medium">Find homestays & villas</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </Link>

                                    <Link
                                        href={`/explore?type=activities&location=${encodeURIComponent(destination.city)}`}
                                        className="p-6 rounded-2xl border border-zinc-100 hover:bg-zinc-50 transition-colors group flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                                                <Compass className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-zinc-900 text-sm">Activities in {destination.city}</p>
                                                <p className="text-xs text-zinc-500 font-medium">Trekking, rafting & more</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </Link>

                                    <Link
                                        href={`/explore?type=nearby&lat=${destination.coordinates.lat}&lng=${destination.coordinates.lng}`}
                                        className="p-6 rounded-2xl border border-zinc-100 hover:bg-zinc-50 transition-colors group flex items-center justify-between md:col-span-2"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                                                <Navigation className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-zinc-900 text-sm">Find What's Nearby</p>
                                                <p className="text-xs text-zinc-500 font-medium">Discover stays & activities within 50km of {destination.name}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </Link>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 space-y-6">
                                {/* Booking CTA Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-2xl shadow-zinc-200/50 space-y-6"
                                >
                                    <div className="text-center space-y-2">
                                        <Camera className="w-8 h-8 text-primary mx-auto" />
                                        <h3 className="text-lg font-bold text-zinc-900">Plan Your Trip</h3>
                                        <p className="text-sm text-zinc-500 font-medium">
                                            Find the best stays and activities in {destination.name}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <Link href={`/explore?type=stays&location=${encodeURIComponent(destination.city)}`} className="block">
                                            <Button className="w-full h-14 rounded-2xl text-sm font-bold gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                                    <polyline points="9 22 9 12 15 12 15 22" />
                                                </svg>
                                                Browse Stays
                                            </Button>
                                        </Link>

                                        <Link href={`/explore?type=activities&location=${encodeURIComponent(destination.city)}`} className="block">
                                            <Button variant="outline" className="w-full h-14 rounded-2xl text-sm font-bold gap-2 border-zinc-200 hover:bg-zinc-50">
                                                <Compass className="w-5 h-5" />
                                                Browse Activities
                                            </Button>
                                        </Link>

                                        <Link href={`/explore?type=nearby&lat=${destination.coordinates.lat}&lng=${destination.coordinates.lng}`} className="block">
                                            <Button variant="outline" className="w-full h-14 rounded-2xl text-sm font-bold gap-2 border-zinc-200 hover:bg-zinc-50">
                                                <Navigation className="w-5 h-5" />
                                                Explore Nearby
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>

                                {/* Travel Tip Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-[32px] p-8 border border-primary/10 space-y-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-bold text-zinc-900">Best Time to Visit</h3>
                                    </div>
                                    <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                                        {destination.state === "Himachal Pradesh" || destination.state === "Uttarakhand"
                                            ? "March to June for pleasant weather, or December to February for snow experiences."
                                            : destination.state === "Goa" || destination.state === "Kerala"
                                                ? "October to March offers the best weather with comfortable temperatures and clear skies."
                                                : destination.state === "Rajasthan"
                                                    ? "November to February when temperatures are moderate and festivals are in full swing."
                                                    : "Check local weather patterns for the best travel experience in this region."}
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Similar Destinations */}
                    {similarDests.length > 0 && (
                        <section className="pt-20 mt-20 border-t border-zinc-100 space-y-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-zinc-900">Similar Destinations</h2>
                                    <p className="text-sm text-zinc-500 font-medium mt-1">
                                        More {destination.category.toLowerCase()} destinations to explore
                                    </p>
                                </div>
                                <Link
                                    href={`/destinations?category=${destination.category}`}
                                    className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
                                >
                                    View all <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {similarDests.slice(0, 4).map((d) => (
                                    <motion.div
                                        key={d._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Link href={`/destinations/${d.slug}`} className="block group">
                                            <div className="aspect-[4/5] rounded-2xl overflow-hidden relative mb-3">
                                                <img
                                                    src={d.image}
                                                    alt={d.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                                    <h3 className="text-white font-bold text-sm">{d.name}</h3>
                                                    <p className="text-white/70 text-xs font-medium">{d.state}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}
                </section>

                <FeaturesBar />
            </main>

            <Footer />
        </div>
    );
}