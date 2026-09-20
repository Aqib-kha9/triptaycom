"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { wishlistApi, getToken, UnauthorizedError } from "@/lib/api-client";
import { buildLoginHref } from "@/lib/navigation";
import { AuthModal } from "@/components/auth-modal";

// ──────────────────────── Local Types ────────────────────────

interface WishlistItem {
  _id: string;
  id: string;
  slug?: string;
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

// ──────────────────────── Helpers ────────────────────────

function makeKey(itemId: string, itemType: string): string {
  return `${itemType}:${itemId}`;
}

/**
 * Map a raw backend wishlist item's nested `item` object into the local
 * WishlistItem shape the UI expects.
 */
function mapNestedItem(raw: Record<string, unknown> | null): WishlistItem | null {
  if (!raw) return null;
  const r = raw as Record<string, unknown>;

  return {
    _id: (r._id as string) || (r.id as string) || "",
    id: (r.id as string) || (r._id as string) || "",
    slug: (r.slug as string) || "",
    title: (r.name as string) || (r.title as string) || "Untitled",
    location: [r.city as string, r.state as string].filter(Boolean).join(", ") || "Unknown",
    city: (r.city as string) || "",
    price: (r.effectiveWeekendPrice as number) || (r.basePrice as number) || 0,
    avgRating: (r.avgRating as number) || 0,
    image: (r.media as Array<{ url?: string }>)?.[0]?.url || (r.image as string) || "/placeholder.jpg",
  };
}

// ──────────────────────── Context ────────────────────────

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
  const [stays, setStays] = useState<WishlistEntry[]>([]);
  const [activities, setActivities] = useState<WishlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingWishlistAction, setPendingWishlistAction] = useState<{ itemId: string, itemType: "stay" | "activity" } | null>(null);

  const fetchWishlist = useCallback(async () => {
    // Guests never have a wishlist to load. Skipping the call here avoids a
    // guaranteed 401 (and the resulting session-expiry redirect) on every
    // public page, and lets the skeletons clear immediately.
    if (!getToken()) {
      setStays([]);
      setActivities([]);
      setWishlistedIds(new Set());
      setLoading(false);
      return;
    }
    try {
      const res = await wishlistApi.getAll();

      if (res?.status === "success" && res.data?.wishlist) {
        const rawList = res.data.wishlist as Array<{
          _id: string;
          id: string;
          type: string;
          item: Record<string, unknown> | null;
          createdAt: string;
        }>;

        const s: WishlistEntry[] = [];
        const a: WishlistEntry[] = [];
        const ids = new Set<string>();

        for (const entry of rawList) {
          const mappedItem = mapNestedItem(entry.item);
          if (!mappedItem) continue;

          const wishlistEntry: WishlistEntry = {
            wishlistId: entry._id || entry.id,
            itemType: entry.type === "activity" ? "activity" : "stay",
            item: mappedItem,
          };

          if (entry.type === "activity") {
            a.push(wishlistEntry);
          } else {
            s.push(wishlistEntry);
          }

          ids.add(makeKey(mappedItem.id || mappedItem._id, wishlistEntry.itemType));
        }

        setStays(s);
        setActivities(a);
        setWishlistedIds(ids);
      }
    } catch {
      // silently ignore — the token may have expired between render and fetch
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
    [wishlistedIds],
  );

  const toggleWishlist = useCallback(
    async (itemId: string, itemType: "stay" | "activity"): Promise<boolean> => {
      const token = getToken();
      if (!token) {
        setPendingWishlistAction({ itemId, itemType });
        setAuthModalOpen(true);
        return false;
      }
      try {
        // Map frontend "stay"/"activity" to backend "listing"/"activity"
        const backendType = itemType === "stay" ? "listing" : "activity";
        const res = await wishlistApi.toggle(itemId, backendType);

        if (res?.status === "success" && res.data) {
          const isNowWishlisted = res.data.action === "added";

          setWishlistedIds((prev) => {
            const next = new Set(prev);
            const key = makeKey(itemId, itemType);
            if (isNowWishlisted) {
              next.add(key);
            } else {
              next.delete(key);
            }
            return next;
          });

          // Refresh the full wishlist to keep stays/activities arrays in sync
          fetchWishlist();

          return isNowWishlisted;
        }
      } catch (err) {
        // A rejected token means the session expired mid-action: send the user
        // through the SPA login flow instead of a full page reload.
        if (err instanceof UnauthorizedError) {
          setAuthModalOpen(true);
        }
      }
      return false;
    },
    [fetchWishlist, router],
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
      <AuthModal
        open={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingWishlistAction(null);
        }}
        onSuccess={() => {
          setAuthModalOpen(false);
          if (pendingWishlistAction) {
            toggleWishlist(pendingWishlistAction.itemId, pendingWishlistAction.itemType);
            setPendingWishlistAction(null);
          } else {
            fetchWishlist();
          }
        }}
        title="Login to Wishlist"
        subtitle="Save your favorite stays and activities."
      />
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
