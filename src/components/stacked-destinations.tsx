"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { DestinationCard } from "./cards";

export function StackedDestinations({ destinations }: { destinations: any[] }) {
  const [cards, setCards] = useState(destinations);
  const controls = useAnimation();
  const constraintsRef = useRef(null);

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 70;
    if (info.offset.x > swipeThreshold) {
      // Swiped right
      swipeCard("right");
    } else if (info.offset.x < -swipeThreshold) {
      // Swiped left
      swipeCard("left");
    } else {
      // Return to center
      controls.start({ x: 0, opacity: 1 });
    }
  };

  const swipeCard = (direction: "left" | "right") => {
    controls.start({
      x: direction === "right" ? 200 : -200,
      opacity: 0,
      transition: { duration: 0.2 }
    }).then(() => {
      setCards((prev) => {
        const newCards = [...prev];
        const movedCard = newCards.shift();
        if (movedCard) newCards.push(movedCard);
        return newCards;
      });
      controls.set({ x: 0, opacity: 1 });
    });
  };

  if (!cards || cards.length === 0) return null;

  return (
    <div className="relative w-full h-[400px] sm:h-[440px] flex justify-center items-start pt-2 pb-12" ref={constraintsRef}>
      <AnimatePresence>
        {cards.slice(0, 3).reverse().map((dest, idx) => {
          // Since we reversed, the last item in the map is actually index 0 in the visible stack
          const visibleIndex = 2 - idx; 
          const isTop = visibleIndex === 0;

          return (
            <motion.div
              key={dest.id || dest.slug}
              className="absolute w-[92vw] max-w-[380px] aspect-[1.1/1] sm:aspect-[5/4] rounded-3xl overflow-hidden shadow-sm border border-zinc-200 bg-white"
              initial={{ scale: 0.8, y: 40, opacity: 0, rotate: 0 }}
              animate={isTop ? controls : {
                scale: 1 - visibleIndex * 0.05,
                y: visibleIndex * 22,
                opacity: 1 - visibleIndex * 0.1,
                zIndex: 10 - visibleIndex,
                rotate: visibleIndex === 0 ? 0 : (visibleIndex % 2 === 0 ? -2 : 2),
              }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={isTop ? { duration: 0.2 } : { duration: 0.3, ease: "easeOut" }}
              drag={isTop ? "x" : false}
              dragConstraints={constraintsRef}
              onDragEnd={isTop ? handleDragEnd : undefined}
              whileDrag={{ cursor: "grabbing" }}
              dragElastic={0.2}
              style={{
                zIndex: 10 - visibleIndex,
                ...(isTop && { x: 0 }) // default x for controls
              }}
            >
              <div className="w-full h-full pointer-events-none">
                <DestinationCard id={dest.slug || dest.id} name={dest.name} province={dest.province || dest.state} image={dest.image} />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
