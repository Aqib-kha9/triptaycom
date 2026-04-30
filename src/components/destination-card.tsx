"use client";

import { motion } from "framer-motion";

interface DestinationCardProps {
  name: string;
  location: string;
  image: string;
}

export function DestinationCard({ name, location, image }: DestinationCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative aspect-[3/4] md:aspect-[4/5] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg"
    >
      {/* Background Image */}
      <img 
        src={image} 
        alt={name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Content */}
      <div className="absolute bottom-6 left-6 text-white">
        <h3 className="text-2xl font-black tracking-tight mb-0.5">{name}</h3>
        <p className="text-sm font-medium text-white/70">{location}</p>
      </div>
    </motion.div>
  );
}
