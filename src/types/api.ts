// ─────────────────────────────────────────────────────────────
// Shared TypeScript types for the Triptay frontend (Next.js)
// All types align with the backend Prisma response format (uses `id`, NOT `_id`)
// ─────────────────────────────────────────────────────────────

// ─── API Envelope ───────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  status: "success" | "error";
  message?: string;
  data: T;
  pagination?: PaginationMeta;
  results?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
  pagination: PaginationMeta;
}

// ─── Media ──────────────────────────────────────────────────

export interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  isCover: boolean;
  order: number;
}

// ─── User / Auth ────────────────────────────────────────────

export interface SanitizedUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "Guest" | "Vendor" | "Dual Mode" | "Admin";
  kycStatus: "Pending" | "Approved" | "Rejected" | "Not Submitted";
  walletBalance: number;
  panNumber?: string;
  gstin?: string;
  bankAccount?: string;
  bankIFSC?: string;
  gender?: string;
  bio?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: SanitizedUser;
  token: string;
}

// ─── Listing (Stay) ─────────────────────────────────────────

export interface ListingHost {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isVerified?: boolean;
  responseRate?: number;
  responseTime?: string;
}

export interface ListingItem {
  id: string;
  slug: string;
  name: string;
  summary?: string;
  description?: string;
  propertyType: string;
  city: string;
  state: string;
  country: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  basePrice: number;
  weekendPrice?: number;
  effectiveWeekendPrice?: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  avgRating: number;
  totalReviews: number;
  status: "draft" | "published" | "unlisted" | "rejected";
  isActive: boolean;
  isFeatured?: boolean;
  amenities?: string[];
  houseRules?: string[];
  meals?: { type: string; included: boolean; price?: number }[];
  nearbyPlaces?: { name: string; distance: string; type: string }[];
  seasonalPrices?: { label: string; startDate: string; endDate: string; price: number }[];
  hasKitchen: boolean;
  isPetFriendly: boolean;
  parkingAvailable?: boolean;
  media: MediaItem[];
  host: ListingHost | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListingsResponse {
  listings: ListingItem[];
}

// ─── Activity ───────────────────────────────────────────────

export interface ActivityHost {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface ActivityItem {
  id: string;
  slug: string;
  name: string;
  summary?: string;
  description?: string;
  activityType: string;
  difficulty: string;
  durationHours: number;
  durationDays: number;
  city: string;
  state: string;
  country: string;
  basePrice: number;
  childPrice?: number;
  foreignerPrice?: number;
  effectiveWeekendPrice?: number;
  avgRating: number;
  totalReviews: number;
  status: "draft" | "published" | "unlisted" | "rejected";
  isActive: boolean;
  isFeatured?: boolean;
  maxGroupSize: number;
  minAge: number;
  media: MediaItem[];
  host: ActivityHost | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivitiesResponse {
  activities: ActivityItem[];
}

// ─── Destination ────────────────────────────────────────────

export interface DestinationItem {
  id: string;
  name: string;
  slug: string;
  state: string;
  city: string;
  image: string;
  category: "Nature" | "Adventure" | "Historical" | "Spiritual";
  description?: string;
  coordinates: { lat: number; lng: number };
  listingCount?: number;
  activityCount?: number;
  popularityScore?: number;
  nearbyStaysCount?: number;
}

// ─── Wishlist ───────────────────────────────────────────────

export interface WishlistItem {
  wishlistId: string;
  itemId: string;
  itemType: "listing" | "activity";
  item: {
    id: string;
    slug?: string;
    name: string;
    title: string;
    location: string;
    city: string;
    state: string;
    price: number;
    basePrice: number;
    effectiveWeekendPrice: number;
    avgRating: number;
    image: string;
    media?: Array<{ url: string; isCover?: boolean }>;
    type: "stay" | "activity";
  };
}

// ─── Chat / Messages ───────────────────────────────────────

export interface ChatParticipant {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface BookingContext {
  title: string;
  dateRange: string;
  type: "listing" | "activity";
}

export interface ConversationItem {
  _id: string;
  id?: string;
  otherUser: ChatParticipant | null;
  listingId?: string;
  activityId?: string;
  bookingContext?: BookingContext | null;
  lastMessage?: {
    text: string;
    sender: string;
    sentAt: string;
  } | null;
  unreadCount: number;
  updatedAt: string;
}

export interface MessageItem {
  _id: string;
  conversation: string;
  sender: { _id: string; name: string; email: string };
  type: "text" | "image" | "file" | "system";
  text?: string;
  mediaUrl?: string;
  mediaType?: string;
  fileName?: string;
  fileSize?: number;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

// ─── Notification ──────────────────────────────────────────

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ─── Booking ────────────────────────────────────────────────

export interface BookingItem {
  id: string;
  bookingId: string;
  itemId: string;
  itemType: "listing" | "activity";
  itemName: string;
  itemImage?: string;
  itemSlug?: string;
  location: string;
  checkIn: string;
  checkOut?: string;
  nights?: number;
  activityDate?: string;
  startTime?: string;
  guests: number;
  adults?: number;
  children?: number;
  // Pricing breakdown
  baseAmount?: number;
  cleaningFee?: number;
  securityDeposit?: number;
  extraGuestCharges?: number;
  taxAmount?: number;
  platformFee?: number;
  discountAmount?: number;
  totalAmount: number;
  // Guest details
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  specialRequests?: string;
  // Coupon
  couponCode?: string;
  // Payment
  paymentGateway?: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  paidAt?: string;
  paymentStatus?: string;
  // Status
  status: "Confirmed" | "Paid" | "Completed" | "Cancelled" | "Pending" | "Expired" | "Rejected";
  checkInOtp?: string | null;
  checkInStatus?: string;
  userId: string;
  hostId: string;
  createdAt: string;
}

// ─── Nearby (Explore) ──────────────────────────────────────

export interface NearbyItem {
  id: string;
  name: string;
  type: "listing" | "activity";
  media: MediaItem[];
  city: string;
  state: string;
  effectiveWeekendPrice?: number;
  basePrice?: number;
  price?: number;
  avgRating: number;
  distanceKm: number;
}

// ─── Checkout ───────────────────────────────────────────────

export interface CheckoutItem {
  id: string;
  name: string;
  slug: string;
  type: "listing" | "activity";
  basePrice: number;
  effectiveWeekendPrice?: number;
  media: MediaItem[];
  city: string;
  state: string;
  maxGuests?: number;
  durationHours?: number;
  durationDays?: number;
  taxes?: number;
  host: { id: string; name: string } | null;
}

// ─── Vendor-specific ───────────────────────────────────────

export interface VendorListingCreatePayload {
  name: string;
  propertyType: string;
  summary: string;
  description: string;
  city: string;
  state: string;
  country?: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  basePrice: number;
  weekendPrice?: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities?: string[];
  houseRules?: string[];
  meals?: { type: string; included: boolean; price?: number }[];
  nearbyPlaces?: { name: string; distance: string; type: string }[];
  hasKitchen?: boolean;
  isPetFriendly?: boolean;
  parkingAvailable?: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  seasonalPrices?: { label: string; startDate: string; endDate: string; price: number }[];
  status?: "draft" | "published";
}

export interface VendorActivityCreatePayload {
  name: string;
  activityType: string;
  difficulty: string;
  summary: string;
  description: string;
  city: string;
  state: string;
  country?: string;
  basePrice: number;
  childPrice?: number;
  foreignerPrice?: number;
  durationHours?: number;
  durationDays?: number;
  maxGroupSize: number;
  minAge?: number;
  status?: "draft" | "published";
}

// ─── Availability ──────────────────────────────────────────

export interface VendorItemSummary {
  id: string;
  name: string;
  city: string;
  state: string;
  type: "listing" | "activity";
  coverImage: string | null;
}

export interface AvailabilityDateRange {
  date: string;
  isBlocked: boolean;
  isBooked: boolean;
}

export interface AvailabilityResponse {
  itemId: string;
  itemName: string;
  dates: AvailabilityDateRange[];
}