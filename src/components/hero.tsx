"use client";

import { motion } from "framer-motion";
import { SearchForm } from "./search-form";

export function Hero() {
  return (
    <section className="relative pt-24 pb-10 overflow-hidden bg-white w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start justify-between w-full gap-4 lg:gap-12">
          
          {/* Left: Content Section */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:flex-[1.2] flex flex-col items-center lg:items-start z-10 w-full"
          >
            <h1 className="text-[48px] md:text-[68px] lg:text-[84px] font-bold tracking-[-0.04em] leading-[0.95] text-zinc-900 mb-12">
              <span className="block whitespace-nowrap">Travel Beyond Your</span>
              <span className="text-primary italic font-serif tracking-tight block mt-2">Imagination.</span>
            </h1>

            {/* Search Bar: Stretched and Overlapping */}
            <div className="w-full lg:w-[140%] relative z-20">
              <SearchForm />
            </div>
          </motion.div>

          {/* Right: Integrated Image (Bottom-Left Clipping) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:flex-[1] flex justify-center lg:justify-end lg:mt-3"
          >
            <div className="w-full max-w-[450px] md:max-w-[650px] lg:max-w-[900px]">
              <img 
                src="/hero_image.png" 
                alt="Travel Memories" 
                className="w-full h-auto object-contain pointer-events-none"
                style={{ 
                  // Cropping only the bottom-left corner where the black line starts
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 32% 100%, 6% 92%, 0% 92%)'
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
