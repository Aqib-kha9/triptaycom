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
import { StackedDestinations } from "@/components/stacked-destinations";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { listingsApi, activitiesApi, destinationsApi } from "@/lib/api-client";
import type { DestinationItem, ListingItem, ActivityItem } from "@/types/api";

export default function Home() {
  const [destinations, setDestinations] = useState<DestinationItem[] | null>(null);
  const [destLoading, setDestLoading] = useState(true);

  const [featuredListings, setFeaturedListings] = useState<ListingItem[] | null>(null);
  const [staysLoading, setStaysLoading] = useState(true);

  const [topActivities, setTopActivities] = useState<ActivityItem[] | null>(null);
  const [actLoading, setActLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

        async function fetchDestinations() {
      try {
        const res = await destinationsApi.getAll({ limit: 4 });
        if (!cancelled && res?.status === "success" && Array.isArray(res.data?.destinations)) {
          setDestinations(res.data.destinations);
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
        const res = await listingsApi.browse({ limit: 4, sort: "-avgRating" });
        if (!cancelled && res?.status === "success" && Array.isArray(res.data?.listings)) {
          setFeaturedListings(res.data.listings);
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
        const res = await activitiesApi.browse({ limit: 4, sort: "-avgRating" });
        if (!cancelled && res?.status === "success" && Array.isArray(res.data?.activities)) {
          setTopActivities(res.data.activities);
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

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="flex-grow">
        <Hero />
        <TrustBar />

        {/* Popular Destinations */}
        <Section title="Popular Destinations" viewAll="/destinations">
          {destLoading ? (
            <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 gap-3 sm:gap-6 sm:grid sm:grid-cols-2 md:grid-cols-4 pb-2 sm:pb-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[65vw] sm:w-auto min-w-[200px] shrink-0 snap-center aspect-[4/5] sm:aspect-[1.5/1] rounded-3xl sm:rounded-[2rem] bg-zinc-100 animate-pulse" />
              ))}
            </div>
          ) : destinations && destinations.length > 0 ? (
            <>
              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-6">
                {destinations.map(d => (
                  <div key={d.slug} className="aspect-[4/3] w-full">
                    <DestinationCard id={d.slug} name={d.name} province={d.state} image={d.image} />
                  </div>
                ))}
              </div>

              {/* Mobile Stacked Swipe */}
              <div className="block md:hidden -mx-4">
                <StackedDestinations destinations={destinations} />
              </div>
            </>
          ) : (
            <div className="col-span-full w-full flex flex-col items-center justify-center py-16 text-center">
              <p className="text-zinc-400 text-sm font-medium">No destinations available yet.</p>
              <p className="text-zinc-300 text-xs mt-1">Check back soon for exciting places to explore.</p>
            </div>
          )}
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
              featuredListings.map((l) => (
                <ItemCard
                  key={l.id}
                  id={l.slug || l.id}
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
              topActivities.map((a) => (
                <ItemCard
                  key={a.id}
                  type="activity"
                  id={a.slug || a.id}
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
    <section className="container mx-auto px-4 py-4 sm:py-6">
      <div className="flex items-center justify-between mb-4 sm:mb-8">
        <h2 className="text-lg sm:text-2xl font-black text-zinc-900 uppercase tracking-widest leading-tight">
          {title}
        </h2>
        <Link
          href={viewAll}
          className="flex items-center gap-0.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors shrink-0"
        >
          View all <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Link>
      </div>
      {children}
    </section>
  );
}
