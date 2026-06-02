"use client";

import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { DestinationCard, ItemCard } from "@/components/cards";
import { FeaturesBar } from "@/components/features-bar";
import { OffersSection } from "@/components/offers-section";
import { TrustBar } from "@/components/trust-bar";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";
import { HowItWorks } from "@/components/how-it-works";
import { FaqSection } from "@/components/faq-section";
import { NearbyAttractions } from "@/components/nearby-attractions";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ApiDestination {
  _id: string;
  name: string;
  slug: string;
  state: string;
  city: string;
  image: string;
  category: "Nature" | "Adventure" | "Historical" | "Spiritual";
}


export default function Home() {
  const [destinations, setDestinations] = useState<ApiDestination[] | null>(null);
  const [destLoading, setDestLoading] = useState(true);

  const [featuredListings, setFeaturedListings] = useState<any[] | null>(null);
  const [staysLoading, setStaysLoading] = useState(true);

  const [topActivities, setTopActivities] = useState<any[] | null>(null);
  const [actLoading, setActLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchDestinations() {
      try {
        const res = await fetch(`${API_BASE}/destinations?limit=8`);
        const json = await res.json().catch(() => null);

        if (!cancelled && json?.status === "success" && Array.isArray(json.data?.destinations)) {
          setDestinations(json.data.destinations);
        } else if (!cancelled) {
          setDestinations([]);
        }
      } catch {
        if (!cancelled) setDestinations([]);
      } finally {
        if (!cancelled) setDestLoading(false);
      }
    }

    async function fetchFeaturedStays() {
      try {
        const res = await fetch(`${API_BASE}/listings/browse?limit=4&sort=-avgRating`);
        const json = await res.json().catch(() => null);

        if (!cancelled && json?.status === "success" && Array.isArray(json.data?.listings)) {
          setFeaturedListings(json.data.listings);
        } else if (!cancelled) {
          setFeaturedListings([]);
        }
      } catch {
        if (!cancelled) setFeaturedListings([]);
      } finally {
        if (!cancelled) setStaysLoading(false);
      }
    }

    async function fetchTopActivities() {
      try {
        const res = await fetch(`${API_BASE}/activities/browse?limit=4&sort=-avgRating`);
        const json = await res.json().catch(() => null);

        if (!cancelled && json?.status === "success" && Array.isArray(json.data?.activities)) {
          setTopActivities(json.data.activities);
        } else if (!cancelled) {
          setTopActivities([]);
        }
      } catch {
        if (!cancelled) setTopActivities([]);
      } finally {
        if (!cancelled) setActLoading(false);
      }
    }

    fetchDestinations();
    fetchFeaturedStays();
    fetchTopActivities();
    return () => { cancelled = true; };
  }, []);

  // Map API destinations to card props — split into two rows of 4
  const mappedDests1 = destinations && destinations.length > 0
    ? destinations.slice(0, 4).map(d => ({ id: d.slug, name: d.name, province: d.state, image: d.image }))
    : null;

  const mappedDests2 = destinations && destinations.length >= 5
    ? destinations.slice(4, 8).map(d => ({ id: d.slug, name: d.name, province: d.state, image: d.image }))
    : null;

  const hasDests1 = mappedDests1 && mappedDests1.length > 0;
  const hasDests2 = mappedDests2 && mappedDests2.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="flex-grow">
        <Hero />
        <TrustBar />

        {/* ── Popular Destinations — Row 1 (first 4) ── */}
        <Section title="Popular Destinations" viewAll="/destinations">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {destLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[1.5/1] rounded-[2rem] bg-zinc-100 animate-pulse" />
              ))
            ) : hasDests1 ? (
              mappedDests1!.map(d => (
                <DestinationCard key={d.id} id={d.id} name={d.name} province={d.province} image={d.image} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <p className="text-zinc-400 text-sm font-medium">No destinations available yet.</p>
                <p className="text-zinc-300 text-xs mt-1">Check back soon for exciting places to explore.</p>
              </div>
            )}
          </div>
        </Section>

        <OffersSection />


        {/* Featured Homestays */}
        <Section title="Featured Homestays" viewAll="/stays">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {staysLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-[2rem] bg-zinc-100 animate-pulse" />
              ))
            ) : featuredListings && featuredListings.length > 0 ? (
              featuredListings.map((l: any) => (
                <ItemCard
                  key={l._id}
                  id={l.slug || l._id}
                  title={l.name}
                  location={`${l.city}, ${l.state}`}
                  price={l.basePrice.toLocaleString("en-IN")}
                  rating={l.avgRating ? String(l.avgRating) : "New"}
                  image={l.media?.[0]?.url || ""}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <p className="text-zinc-400 text-sm font-medium">No stays available yet.</p>
                <p className="text-zinc-300 text-xs mt-1">Check back soon for exciting places to stay.</p>
              </div>
            )}
          </div>
        </Section>

        {/* Top Activities */}
        <Section title="Top Activities" viewAll="/activities">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {actLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl bg-zinc-100 animate-pulse" />
              ))
            ) : topActivities && topActivities.length > 0 ? (
              topActivities.map((a: any) => (
                <ItemCard
                  key={a._id}
                  type="activity"
                  id={a.slug || a._id}
                  title={a.name}
                  location={`${a.city}, ${a.state}`}
                  price={a.basePrice?.toLocaleString("en-IN") || String(a.basePrice)}
                  rating={a.avgRating ? String(a.avgRating) : "New"}
                  image={a.media?.[0]?.url || ""}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <p className="text-zinc-400 text-sm font-medium">No activities available yet.</p>
                <p className="text-zinc-300 text-xs mt-1">Exciting adventures coming soon.</p>
              </div>
            )}
          </div>
        </Section>

        {/* ── Popular Destinations — Row 2 (next 4) ── */}
        {hasDests2 && (
          <Section title="More Destinations" viewAll="/destinations">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {mappedDests2!.map(d => (
                <DestinationCard key={d.id} id={d.id} name={d.name} province={d.province} image={d.image} />
              ))}
            </div>
          </Section>
        )}

        {/* ── What They Say ── */}
        <Testimonials />

        <FaqSection />

        <FeaturesBar />
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children, viewAll }: { title: string, children: React.ReactNode, viewAll: string }) {
  return (
    <section className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>
        </div>
        <Link href={viewAll} className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      {children}
    </section>
  );
}
