"use client";

import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface CardProps {
  image: string;
  title: string;
  location: string;
  price: string;
  rating: string;
  type?: "homestay" | "activity";
}

export function ItemCard({ image, title, location, price, rating, type = "homestay" }: CardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col gap-3 rounded-3xl overflow-hidden"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-muted">
        <img 
          src={image} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-black border-none px-2 py-1 flex items-center gap-1 font-bold shadow-sm">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {rating}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col px-1">
        <h3 className="font-bold text-lg leading-tight line-clamp-1">{title}</h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
          <MapPin className="h-3 w-3" />
          <span>{location}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-bold text-lg">₹{price}</span>
          <span className="text-muted-foreground text-sm">/ {type === "homestay" ? "night" : "person"}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function DestinationCard({ image, name, province }: { image: string, name: string, province: string }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="relative aspect-[1.5/1] rounded-[2rem] overflow-hidden cursor-pointer group shadow-sm"
    >
      <img 
        src={image} 
        alt={name}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      <div className="absolute bottom-6 left-6 text-white">
        <h4 className="text-[22px] font-black tracking-tight leading-none mb-1">{name}</h4>
        <p className="text-[13px] font-medium opacity-80">{province}</p>
      </div>
    </motion.div>
  );
}
