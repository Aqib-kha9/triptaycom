"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface WishlistItem {
  _id: string;
  title: string;
  location: string;
  city: string;
  price: number;
  avgRating: number;
  image: string;
}

interface WishlistEntry {
  wishlistId: string;
  itemType: "stay" | "activity";
  item: WishlistItem;
}

interface WishlistContextType {
  wishlistedIds: Set<string>;
  stays: WishlistEntry[];
  activities: WishlistEntry[];
  loading: boolean;
  isWishlisted: (itemId: string, itemType: "stay" | "activity") => boolean;
  toggleWishlist: (itemId: string, itemType: "stay" | "activity") => Promise<boolean>;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function makeKey(itemId: string, itemType: string): string {
  return `${itemType}:${itemId}`;
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
  const [stays, setStays] = useState<WishlistEntry[]>([]);
  const [activities, setActivities] = useState<WishlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setWishlistedIds(new Set());
      setStays([]);
      setActivities([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json().catch(() => null);

      if (json?.status === "success" && json.data) {
        const s: WishlistEntry[] = json.data.stays || [];
        const a: WishlistEntry[] = json.data.activities || [];
        setStays(s);
        setActivities(a);

        const ids = new Set<string>();
        s.forEach((e: WishlistEntry) => ids.add(makeKey(e.item._id, e.itemType)));
        a.forEach((e: WishlistEntry) => ids.add(makeKey(e.item._id, e.itemType)));
        setWishlistedIds(ids);
      }
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  }, []);

  // Load wishlist on mount
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isWishlisted = useCallback(
    (itemId: string, itemType: "stay" | "activity"): boolean => {
      return wishlistedIds.has(makeKey(itemId, itemType));
    },
    [wishlistedIds]
  );

  const toggleWishlist = useCallback(
    async (itemId: string, itemType: "stay" | "activity"): Promise<boolean> => {
      const token = getToken();
      if (!token) return false;

      try {
        const res = await fetch(`${API_BASE}/wishlist/toggle`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itemId, itemType }),
        });
        const json = await res.json().catch(() => null);

        if (json?.status === "success") {
          const newState = json.data.isWishlisted;

          setWishlistedIds((prev) => {
            const next = new Set(prev);
            const key = makeKey(itemId, itemType);
            if (newState) {
              next.add(key);
            } else {
              next.delete(key);
            }
            return next;
          });

          return newState;
        }
      } catch {
        // silently ignore
      }
      return false;
    },
    []
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistedIds,
        stays,
        activities,
        loading,
        isWishlisted,
        toggleWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}