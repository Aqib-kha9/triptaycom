"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { MapPinOff, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {/* Animated Icon Container */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 md:w-48 md:h-48 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100">
            <MapPinOff className="w-16 h-16 md:w-24 md:h-24 text-zinc-300" />
          </div>
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-4 -right-4 w-12 h-12 md:w-16 md:h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20"
          >
            <span className="text-white font-black text-xl md:text-2xl italic">?</span>
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-md"
        >
          <h1 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tighter mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-4 tracking-tight">Lost in Paradise?</h2>
          <p className="text-zinc-500 font-medium mb-10 leading-relaxed">
            The page you're looking for has moved to another destination or never existed. Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="w-full sm:w-auto">
              <Button size="lg" className="w-full rounded-full px-8 h-14 bg-zinc-900 text-white font-bold gap-2 hover:scale-105 transition-all shadow-xl shadow-zinc-900/20">
                <Home className="w-5 h-5" />
                Go Back Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto rounded-full px-8 h-14 border-zinc-200 font-bold gap-2 hover:bg-zinc-50 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous Page
            </Button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
