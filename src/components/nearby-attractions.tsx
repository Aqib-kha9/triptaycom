"use client";

import { motion } from "framer-motion";
import { MapPin, ArrowRight, Compass, Home, Map, Bed, Mountain, Trees } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function NearbyAttractions() {
  return (
    <section className="py-24 bg-zinc-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Left: Interactive Map Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:flex-1 relative"
          >
            <div className="relative w-full aspect-square max-w-[500px] bg-white rounded-[40px] shadow-2xl border border-zinc-100 overflow-hidden group">
              {/* Fake Map Background */}
              <div className="absolute inset-0 bg-[#f8f9fa]">
                <div className="absolute inset-0 opacity-40 bg-[url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i13!2i4683!3i2986!2m3!1e0!2sm!3i605151543!3m17!2sen!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m3!1e12!2m1!1s1!4e0!5m1!5f2!23i1301875')] bg-cover" />
              </div>

              {/* Pulsing Dot (Current Location) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-16 h-16 bg-primary/20 rounded-full animate-ping" />
                  <div className="relative w-6 h-6 bg-primary border-[3px] border-white rounded-full shadow-2xl" />
                </div>
              </div>

              {/* Floating Cards (Nearby Items) */}
              <motion.div
                animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-12 right-8 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-3 w-52"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex-shrink-0 bg-[url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=100')] bg-cover" />
                <div>
                  <p className="text-[11px] font-bold text-zinc-900 leading-tight">Luxury Creek Villa</p>
                  <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-primary" /> 2.4 km away
                  </p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-16 left-8 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-3 w-52"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex-shrink-0 bg-[url('https://images.unsplash.com/photo-1530866495547-084969f682ba?auto=format&fit=crop&q=80&w=100')] bg-cover" />
                <div>
                  <p className="text-[11px] font-bold text-zinc-900 leading-tight">River Rafting Trip</p>
                  <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-primary" /> 0.8 km away
                  </p>
                </div>
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 -top-12 -left-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -z-10 -bottom-12 -right-12 w-56 h-56 bg-primary/15 rounded-full blur-3xl" />
          </motion.div>

          {/* Right: Content */}
          <div className="lg:flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                <Compass className="w-3.5 h-3.5" />
                Discover Nearby
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-zinc-900 mb-8 leading-[1.1]">
                Find hidden gems <br />
                <span className="text-primary  ">right next to you.</span>
              </h2>
              <p className="text-lg text-zinc-500 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Turn on your location to explore the best homestays, thrilling activities,
                and must-visit attractions in your immediate vicinity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                <div className="group flex items-center gap-5 p-5 rounded-[24px] bg-white border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Bed className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 text-lg">Nearby Stays</p>
                    <p className="text-sm text-zinc-400">Homestays & Villas</p>
                  </div>
                </div>
                <div className="group flex items-center gap-5 p-5 rounded-[24px] bg-white border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Mountain className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 text-lg">Local Activities</p>
                    <p className="text-sm text-zinc-400">Trekking & Rafting</p>
                  </div>
                </div>
              </div>

              <Link href="/nearby">
                <Button size="lg" className="rounded-full px-10 h-16 text-lg font-bold shadow-2xl shadow-primary/30 group bg-primary hover:bg-zinc-900 transition-all">
                  Search Nearby Attractions
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

