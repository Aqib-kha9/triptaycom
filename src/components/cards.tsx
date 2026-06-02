"use client";

import Link from "next/link";
import { Star, MapPin, Heart, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";

interface CardProps {
  id?: string;
  image: string;
  title: string;
  location: string;
  price: string;
  rating: string;
  type?: "homestay" | "activity";
  distanceKm?: number;
}

export function ItemCard({ id = "1", image, title, location, price, rating, type = "homestay", distanceKm }: CardProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlistType = type === "homestay" ? "stay" : "activity";
  const liked = isWishlisted(id, wishlistType as "stay" | "activity");
  const href = type === "homestay" ? `/stays/${id}` : `/activities/${id}`;

  const handleHeartClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleWishlist(id, wishlistType as "stay" | "activity");
    },
    [id, wishlistType, toggleWishlist]
  );

  return (
    <Link href={href} className="block">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group flex flex-col gap-3"
      >
        {/* Compact Image Area */}
        <div className="relative aspect-[1.5/1] w-full overflow-hidden rounded-xl bg-zinc-100">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <button
            onClick={handleHeartClick}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
          >
            <Heart className={cn("h-4 w-4 transition-colors", liked ? "fill-red-500 text-red-500" : "text-zinc-400")} />
          </button>
          {/* Distance badge */}
          {distanceKm !== undefined && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold shadow-sm">
              <Navigation className="w-2.5 h-2.5" />
              {distanceKm < 1 ? `${(distanceKm * 1000).toFixed(0)}m` : `${distanceKm} km`}
            </div>
          )}
        </div>

        {/* Balanced Information Section */}
        <div className="space-y-1.5 px-1">
          {/* Row 1: Title and Rating */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base text-zinc-900 line-clamp-1 flex-1">{title}</h3>
            <div className="flex items-center gap-1 shrink-0 bg-zinc-50 px-1.5 py-0.5 rounded-md border border-zinc-100">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold text-zinc-900">{rating}</span>
            </div>
          </div>

          {/* Row 2: Location and Price */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1 text-zinc-500 overflow-hidden">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="text-[11px] font-medium truncate">{location}</span>
            </div>
            <div className="flex items-baseline gap-1 shrink-0 text-right">
              <span className="text-sm font-bold text-zinc-900">₹{price}</span>
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter">/ {type === "homestay" ? "night" : "person"}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export function DestinationCard({ id = "1", image, name, province }: { id?: string, image: string, name: string, province: string }) {
  return (
    <Link href={`/destinations/${id}`} className="block">
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
          <h4 className="text-[22px] font-bold tracking-tight leading-none mb-1">{name}</h4>
          <p className="text-[13px] font-medium opacity-80">{province}</p>
        </div>
      </motion.div>
    </Link>
  );
}
