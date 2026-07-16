// ─────────────────────────────────────────────────────────────
// Triptay Frontend API Client (Next.js)
// Centralized, typed HTTP client replacing all raw fetch calls
// ─────────────────────────────────────────────────────────────

import type {
  ApiResponse,
  PaginatedResponse,
  SanitizedUser,
  AuthResponse,
  ListingItem,
  ListingsResponse,
  ActivityItem,
  ActivitiesResponse,
  DestinationItem,
  WishlistItem,
  ConversationItem,
  MessageItem,
  NotificationItem,
  BookingItem,
  NearbyItem,
  CheckoutItem,
  VendorListingCreatePayload,
  VendorActivityCreatePayload,
  VendorItemSummary,
  AvailabilityResponse,
  MediaItem,
  PaginationMeta,
} from "@/types/api";

// ─── Configuration ──────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ─── Error Classes ──────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class NetworkError extends Error {
  constructor(message = "Could not connect to server. Please check your internet.") {
    super(message);
    this.name = "NetworkError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Session expired. Please login again.") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

// ─── Token Management ───────────────────────────────────────

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
}

function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
}

// ─── Core Request Function ──────────────────────────────────

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | undefined>;
  auth?: boolean;
  timeout?: number;
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, params, auth = true, timeout = 30000, ...fetchOptions } = options;

  // Build URL with query params
  let url = `${API_BASE}${path}`;
  if (params) {
    const filtered = Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== ""
    );
    if (filtered.length > 0) {
      const qs = new URLSearchParams(
        filtered.map(([k, v]) => [k, String(v)])
      ).toString();
      url += `?${qs}`;
    }
  }

  // Headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // Don't set Content-Type for FormData (browser will set with boundary)
  if (body instanceof FormData) {
    delete headers["Content-Type"];
  }

  // AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    // Handle 204 No Content
    if (res.status === 204) {
      return undefined as T;
    }

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401) {
        throw new UnauthorizedError(json.message);
      }
      throw new ApiError(
        json.message || `Request failed with status ${res.status}`,
        res.status,
        json.code,
        json.details
      );
    }

    return json as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) throw err;

    if (err instanceof DOMException && err.name === "AbortError") {
      throw new NetworkError("Request timed out. Please try again.");
    }

    if (err instanceof TypeError && err.message === "Failed to fetch") {
      throw new NetworkError();
    }

    throw new NetworkError(
      err instanceof Error ? err.message : "An unexpected error occurred"
    );
  }
}

// ─── Auth API ───────────────────────────────────────────────

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await request<ApiResponse<AuthResponse>>("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    });
    if (res.data.token) setToken(res.data.token);
    return res.data;
  },

  signup: async (data: { name: string; email: string; password: string; phone?: string }) => {
    const res = await request<ApiResponse<AuthResponse>>("/auth/signup", {
      method: "POST",
      body: data,
      auth: false,
    });
    if (res.data.token) setToken(res.data.token);
    return res.data;
  },

  logout: async () => {
    try {
      await request("/auth/logout", { method: "POST" });
    } finally {
      clearToken();
    }
  },

  getMe: () => request<ApiResponse<{ user: SanitizedUser }>>("/auth/me"),

  sendOtp: (email: string) =>
    request<ApiResponse<{ message: string }>>("/auth/send-otp", {
      method: "POST",
      body: { email },
      auth: false,
    }),

  verifyOtp: (email: string, code: string) =>
    request<ApiResponse<{ success: boolean }>>("/auth/verify-otp", {
      method: "POST",
      body: { email, code },
      auth: false,
    }),

  registerOtp: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    code: string;
  }) => {
    return request<ApiResponse<AuthResponse>>("/auth/register-otp", {
      method: "POST",
      body: data,
      auth: false,
    }).then((res) => {
      if (res.data.token) setToken(res.data.token);
      return res.data;
    });
  },

  googleLogin: (email: string, name: string) => {
    return request<ApiResponse<AuthResponse>>("/auth/google", {
      method: "POST",
      body: { email, name },
      auth: false,
    }).then((res) => {
      if (res.data.token) setToken(res.data.token);
      return res.data;
    });
  },

  getProfile: () => request<ApiResponse<{ user: SanitizedUser }>>("/auth/profile"),

  updateProfile: (data: { name?: string; email?: string; phone?: string; avatar?: string; gender?: string; bio?: string }) =>
    request<ApiResponse<{ user: SanitizedUser }>>("/auth/profile", {
      method: "PATCH",
      body: data,
    }),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<ApiResponse<{ url: string; path: string }>>("/upload/avatar", {
      method: "POST",
      body: formData,
    });
  },

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<ApiResponse<{ message: string }>>("/auth/change-password", {
      method: "PATCH",
      body: data,
    }),

  submitKyc: (data: Record<string, unknown>) =>
    request<ApiResponse<{ message: string }>>("/auth/kyc", {
      method: "POST",
      body: data,
    }),

  forgotPassword: (email: string) =>
    request<ApiResponse<{ message: string }>>("/auth/forgot-password", {
      method: "POST",
      body: { email },
      auth: false,
    }),

  resetPassword: (data: { token: string; password: string }) =>
    request<ApiResponse<{ message: string }>>("/auth/reset-password", {
      method: "POST",
      body: data,
      auth: false,
    }),
};

// ─── Listings API ───────────────────────────────────────────

export const listingsApi = {
  browse: (params?: {
    city?: string;
    state?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) =>
    request<PaginatedResponse<ListingsResponse>>("/listings/browse", {
      params: { ...params } as Record<string, string | number | undefined>,
      auth: false,
    }),

  getPublic: (slug: string) =>
    request<ApiResponse<{ listing: ListingItem }>>(`/public/listing/${slug}`, {
      auth: false,
    }),

  getListingAvailability: (id: string) =>
    request<ApiResponse<{ blockedDates: string[]; bookedDates: string[] }>>(`/public/listings/${id}/availability`, {
      auth: false,
    }),

  getById: (id: string) =>
    request<ApiResponse<{ listing: ListingItem }>>(`/listings/${id}`),

  create: (data: VendorListingCreatePayload) =>
    request<ApiResponse<{ listing: ListingItem }>>("/listings", {
      method: "POST",
      body: data,
    }),

  update: (id: string, data: Partial<VendorListingCreatePayload>) =>
    request<ApiResponse<{ listing: ListingItem }>>(`/listings/${id}`, {
      method: "PUT",
      body: data,
    }),

  delete: (id: string) =>
    request<ApiResponse<{ message: string }>>(`/listings/${id}`, {
      method: "DELETE",
    }),

  getMyListings: (params?: { status?: string; page?: number; limit?: number }) =>
    request<ApiResponse<{ listings: ListingItem[] }>>("/listings", {
      params: { ...params } as Record<string, string | number | undefined>,
    }),

  uploadMedia: (id: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    return request<ApiResponse<{ media: MediaItem[] }>>(`/listings/${id}/media`, {
      method: "POST",
      body: formData,
    });
  },

  deleteMedia: (id: string, mediaId: string) =>
    request<ApiResponse<{ message: string }>>(`/listings/${id}/media/${mediaId}`, {
      method: "DELETE",
    }),

  locationSuggestions: (query: string) =>
    request<ApiResponse<{ suggestions: string[] }>>("/public/listings/locations", {
      params: { query },
      auth: false,
    }),
};

// ─── Activities API ─────────────────────────────────────────

export const activitiesApi = {
  browse: (params?: {
    city?: string;
    state?: string;
    activityType?: string;
    difficulty?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
  }) =>
    request<PaginatedResponse<ActivitiesResponse>>("/activities/browse", {
      params: { ...params } as Record<string, string | number | undefined>,
      auth: false,
    }),

  getPublic: (slug: string) =>
    request<ApiResponse<{ activity: ActivityItem }>>(`/public/activity/${slug}`, {
      auth: false,
    }),

  getById: (id: string) =>
    request<ApiResponse<{ activity: ActivityItem }>>(`/activities/${id}`),

  create: (data: VendorActivityCreatePayload) =>
    request<ApiResponse<{ activity: ActivityItem }>>("/activities", {
      method: "POST",
      body: data,
    }),

  update: (id: string, data: Partial<VendorActivityCreatePayload>) =>
    request<ApiResponse<{ activity: ActivityItem }>>(`/activities/${id}`, {
      method: "PUT",
      body: data,
    }),

  delete: (id: string) =>
    request<ApiResponse<{ message: string }>>(`/activities/${id}`, {
      method: "DELETE",
    }),

  getMyActivities: (params?: { status?: string; page?: number; limit?: number }) =>
    request<ApiResponse<{ activities: ActivityItem[] }>>("/activities", {
      params: { ...params } as Record<string, string | number | undefined>,
    }),

  uploadMedia: (id: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    return request<ApiResponse<{ media: MediaItem[] }>>(`/activities/${id}/media`, {
      method: "POST",
      body: formData,
    });
  },

  deleteMedia: (id: string, mediaId: string) =>
    request<ApiResponse<{ message: string }>>(`/activities/${id}/media/${mediaId}`, {
      method: "DELETE",
    }),

  getActivityAvailability: (id: string) =>
    request<ApiResponse<{ blockedDates: string[]; bookedSlots: Record<string, string[]> }>>(`/public/activities/${id}/availability`, {
      auth: false,
    }),
};

// ─── Coupons API ───────────────────────────────────────────

export const couponsApi = {
  validate: (data: { code: string; orderValue: number; itemType: "listing" | "activity"; itemId?: string }) =>
    request<ApiResponse<{ coupon: any; discountAmount: number; finalAmount: number }>>("/coupons/validate", {
      method: "POST",
      body: data,
    }),
};

// ─── Destinations API ───────────────────────────────────────

export const destinationsApi = {
  getAll: (params?: { category?: string; page?: number; limit?: number }) =>
    request<ApiResponse<{ destinations: DestinationItem[] }>>("/destinations", {
      params: { ...params } as Record<string, string | number | undefined>,
      auth: false,
    }),

  getBySlug: (slug: string) =>
    request<ApiResponse<{ destination: DestinationItem }>>(`/destinations/${slug}`, {
      auth: false,
    }),
};

// ─── Wishlist API ───────────────────────────────────────────

export const wishlistApi = {
  getAll: () =>
    request<ApiResponse<{ wishlist: Array<{ _id: string; id: string; type: string; item: Record<string, unknown> | null; createdAt: string }> }>>("/wishlist"),

  toggle: (itemId: string, itemType: "listing" | "activity") =>
    request<ApiResponse<{ action: "added" | "removed"; item: Record<string, unknown> }>>("/wishlist/toggle", {
      method: "POST",
      body: { itemId, itemType },
    }),

  check: (itemIds: string[]) =>
    request<ApiResponse<{ wishlist: Array<{ _id: string; isWishlisted: boolean }> }>>(
      "/wishlist/check",
      {
        method: "POST",
        body: { itemIds },
      }
    ),

  remove: (itemId: string) =>
    request<ApiResponse<{ message: string }>>(`/wishlist/${itemId}`, {
      method: "DELETE",
    }),
};

// ─── Chat API ───────────────────────────────────────────────

export const chatApi = {
  getConversations: () =>
    request<ApiResponse<{ conversations: ConversationItem[] }>>("/chat/conversations"),

  getOrCreateConversation: (params: {
    participantId: string;
    listingId?: string;
    activityId?: string;
    bookingContext?: { title: string; dateRange: string; type: string };
  }) =>
    request<ApiResponse<{ conversation: ConversationItem }>>("/chat/conversations", {
      method: "POST",
      body: params,
    }),

  getMessages: (conversationId: string, params?: { page?: number; limit?: number }) =>
    request<ApiResponse<{ messages: MessageItem[]; pagination: PaginationMeta }>>(
      `/chat/conversations/${conversationId}/messages`,
      { params: { ...params } as Record<string, string | number | undefined> }
    ),

  sendMessage: (conversationId: string, text: string) =>
    request<ApiResponse<{ message: MessageItem }>>(
      `/chat/conversations/${conversationId}/messages`,
      { method: "POST", body: { text } }
    ),

  markRead: (conversationId: string) =>
    request<ApiResponse<{ message: string }>>(
      `/chat/conversations/${conversationId}/read`,
      { method: "POST" }
    ),

  getUnreadCount: () =>
    request<ApiResponse<{ count: number }>>("/chat/unread-count"),
};

// ─── Notifications API ─────────────────────────────────────

export const notificationsApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    request<ApiResponse<{ notifications: NotificationItem[]; pagination: PaginationMeta }>>(
      "/notifications",
      { params: { ...params } as Record<string, string | number | undefined> }
    ),

  getUnreadCount: () =>
    request<ApiResponse<{ count: number }>>("/notifications/unread"),

  markAsRead: (id: string) =>
    request<ApiResponse<{ message: string }>>(`/notifications/${id}/read`, {
      method: "PATCH",
    }),

  markAllAsRead: () =>
    request<ApiResponse<{ message: string }>>("/notifications/read-all", {
      method: "PATCH",
    }),

  delete: (id: string) =>
    request<ApiResponse<{ message: string }>>(`/notifications/${id}`, {
      method: "DELETE",
    }),

  deleteAll: () =>
    request<ApiResponse<{ message: string }>>("/notifications", {
      method: "DELETE",
    }),
};

// ─── Nearby API ─────────────────────────────────────────────

export const nearbyApi = {
  browse: (params: { lat: number; lng: number; radius?: number; limit?: number }) =>
    request<ApiResponse<{ items: NearbyItem[]; radius: number }>>("/nearby/browse", {
      params: { ...params } as Record<string, string | number | undefined>,
      auth: false,
    }),
};

// ─── Bookings API ───────────────────────────────────────────

export const bookingsApi = {
  getMyBookings: (params?: { status?: string; page?: number; limit?: number; role?: string }) =>
    request<ApiResponse<{ bookings: BookingItem[]; pagination: PaginationMeta }>>(
      "/bookings",
      { params: { ...params } as Record<string, string | number | undefined> }
    ),

  getBookingById: (id: string) =>
    request<ApiResponse<{ booking: BookingItem }>>(`/bookings/${id}`),

  createBooking: (data: {
    itemId: string;
    itemType: "listing" | "activity";
    checkIn?: string;
    checkOut?: string;
    activityDate?: string;
    startTime?: string;
    guests: number;
    adults?: number;
    children?: number;
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
    specialRequests?: string;
    couponCode?: string;
    bookingType?: "instant" | "request";
  }) =>
    request<ApiResponse<{ booking: BookingItem }>>("/bookings", {
      method: "POST",
      body: data,
    }),

  getBookingPreview: (data: {
    itemId: string;
    itemType: "listing" | "activity";
    checkIn?: string;
    checkOut?: string;
    activityDate?: string;
    guests: number;
    couponCode?: string;
  }) =>
    request<ApiResponse<{
      item: { id: string; name: string; slug: string };
      pricing: {
        baseAmount: number;
        cleaningFee: number;
        securityDeposit: number;
        extraGuestCharges: number;
        taxAmount: number;
        platformFee: number;
        discountAmount: number;
        commissionAmount: number;
        hostPayoutAmount: number;
        totalAmount: number;
        nights: number;
      };
    }>>("/bookings/preview", {
      method: "POST",
      body: data,
    }),

  getCancelPreview: (id: string) =>
    request<ApiResponse<{
      bookingId: string;
      bookingRef: string;
      itemName: string;
      status: string;
      paymentStatus: string;
      totalAmount: number;
      refundAmount: number;
      refundPercentage: number;
      penaltyAmount: number;
      cancellationPolicy: string;
      policyDetails: string | null;
      policyText: string;
      daysUntilCheck: number;
      hoursUntilCheck: number;
      checkIn: string | null;
      isPaid: boolean;
      canCancel: boolean;
    }>>(`/bookings/${id}/cancel-preview`),

  cancelBooking: (id: string, reason?: string) =>
    request<ApiResponse<{ message: string; data: { booking: BookingItem } }>>(`/bookings/${id}/cancel`, {
      method: "POST",
      body: reason ? { reason } : undefined,
    }),

  // Expire a pending booking — releases the blocked dates so other guests can book them.
  // Called on payment failure/abandonment (Razorpay modal dismiss, PayU decline, etc.)
  expireBooking: (id: string, reason?: string) =>
    request<ApiResponse<{ message: string; data: { booking: BookingItem } }>>(`/bookings/${id}/expire`, {
      method: "POST",
      body: reason ? { reason } : undefined,
    }),

  confirmBooking: (id: string) =>
    request<ApiResponse<{ message: string; data: { booking: BookingItem } }>>(`/bookings/${id}/confirm`, {
      method: "POST",
    }),

  rejectBooking: (id: string, reason?: string) =>
    request<ApiResponse<{ message: string; data: { booking: BookingItem } }>>(`/bookings/${id}/reject`, {
      method: "POST",
      body: reason ? { reason } : undefined,
    }),

  verifyBookingOtp: (id: string, otp: string) =>
    request<ApiResponse<{ message: string; data: { booking: BookingItem } }>>(`/bookings/${id}/verify-otp`, {
      method: "POST",
      body: { otp },
    }),
};

// ─── Payments API ───────────────────────────────────────────

export const paymentsApi = {
  createRazorpayOrder: (bookingId: string) =>
    request<ApiResponse<{ orderId: string; amount: number; currency: string; keyId: string; bookingId: string; paymentId: string }>>(
      "/payments/razorpay/order",
      { method: "POST", body: { bookingId } }
    ),

  verifyRazorpayPayment: (data: {
    bookingId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) =>
    request<ApiResponse<{ message: string; booking: BookingItem }>>(
      "/payments/razorpay/verify",
      { method: "POST", body: data }
    ),

  createPayuOrder: (bookingId: string) =>
    request<ApiResponse<{
      txnid: string;
      amount: string;
      productinfo: string;
      firstname: string;
      email: string;
      phone: string;
      surl: string;
      furl: string;
      hash: string;
      key: string;
      actionUrl: string;
      udf1: string;
      udf2: string;
      udf3: string;
      udf4: string;
      udf5: string;
    }>>(
      "/payments/payu/order",
      { method: "POST", body: { bookingId } }
    ),

  verifyPayuPayment: (data: {
    bookingId: string;
    txnid: string;
    mihpayid: string;
    hash: string;
    status: string;
    mode?: string;
    amount?: string;
    error?: string;
    error_Message?: string;
    bank_ref_num?: string;
    bankcode?: string;
    cardnum?: string;
    udf1?: string;
    udf2?: string;
    udf3?: string;
    udf4?: string;
    udf5?: string;
    [key: string]: string | undefined;
  }) =>
    request<ApiResponse<{ message: string; booking: BookingItem }>>(
      "/payments/payu/verify",
      { method: "POST", body: data }
    ),

  getPayment: (bookingId: string) =>
    request<ApiResponse<{ payment: any }>>(`/payments/${bookingId}`),
};

// ─── Checkout API ───────────────────────────────────────────

export const checkoutApi = {
  getItem: (type: "stay" | "activity", id: string) => {
    // Map "stay" → "listing" for backend
    const endpoint =
      type === "stay"
        ? `/public/listing/${id}`
        : `/public/activity/${id}`;
    return request<ApiResponse<{ listing?: CheckoutItem; activity?: CheckoutItem }>>(
      endpoint,
      { auth: false }
    );
  },
};

// ─── Availability API ───────────────────────────────────────

export const availabilityApi = {
  getVendorItems: () =>
    request<ApiResponse<{ items: VendorItemSummary[] }>>("/availability/items"),

  getAvailability: (itemId: string, itemType: "listing" | "activity", month: string) =>
    request<ApiResponse<AvailabilityResponse>>(
      `/availability/${itemType}/${itemId}`,
      { params: { month } }
    ),

  blockDates: (itemId: string, itemType: "listing" | "activity", dates: string[]) =>
    request<ApiResponse<{ message: string }>>(`/availability/${itemType}/${itemId}/block`, {
      method: "POST",
      body: { dates },
    }),

  unblockDates: (itemId: string, itemType: "listing" | "activity", dates: string[]) =>
    request<ApiResponse<{ message: string }>>(
      `/availability/${itemType}/${itemId}/unblock`,
      { method: "POST", body: { dates } }
    ),

  bulkBlock: (
    itemId: string,
    itemType: "listing" | "activity",
    data: {
      action: string;
      month?: number;
      year?: number;
      startDate?: string;
      endDate?: string;
    }
  ) =>
    request<ApiResponse<AvailabilityResponse>>(
      `/availability/${itemType}/${itemId}/bulk-block`,
      {
        method: "POST",
        body: data,
      }
    ),

  clearBlockedDates: (itemId: string, itemType: "listing" | "activity") =>
    request<ApiResponse<{ message: string }>>(
      `/availability/${itemType}/${itemId}/clear`,
      { method: "DELETE" }
    ),
};

// ─── Upload API ─────────────────────────────────────────────

export const uploadApi = {
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<ApiResponse<{ url: string }>>("/upload/avatar", {
      method: "POST",
      body: formData,
    });
  },

  uploadDocument: (file: File, documentType?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (documentType) formData.append("documentType", documentType);
    return request<ApiResponse<{ url: string }>>("/upload/document", {
      method: "POST",
      body: formData,
    });
  },
};

// ─── Commission API ─────────────────────────────────────────

export const commissionApi = {
  getHostLedger: (params?: { page?: number; limit?: number; startDate?: string; endDate?: string }) =>
    request<ApiResponse<{ ledger: any[]; summary: { totalCommission: number; totalPayout: number; pendingPayout: number; count: number } }>>("/commission/ledger", {
      params: { ...params } as Record<string, string | number | undefined>,
    }),

  getHostPayouts: (params?: { page?: number; limit?: number; status?: string }) =>
    request<ApiResponse<{ payouts: any[]; pagination: PaginationMeta }>>("/commission/payouts", {
      params: { ...params } as Record<string, string | number | undefined>,
    }),
};

// ─── Public API ─────────────────────────────────────────────

export const publicApi = {
  getConfigurations: () =>
    request<ApiResponse<{ configuration: Record<string, any> }>>("/public/configurations", { auth: false }),
};

// ─── Reviews API ────────────────────────────────────────────

export const reviewsApi = {
  getMyReviews: () =>
    request<ApiResponse<{ reviews: any[] }>>("/reviews/mine"),

  getItemReviews: (itemType: "listing" | "activity", itemId: string) =>
    request<ApiResponse<{ reviews: any[] }>>(`/reviews/${itemType}/${itemId}`, { auth: false }),

  createReview: (data: { bookingId: string; rating: number; title?: string; comment?: string }) =>
    request<ApiResponse<{ review: any }>>("/reviews", {
      method: "POST",
      body: data,
    }),

  updateReview: (reviewId: string, data: { rating: number; title?: string; comment?: string }) =>
    request<ApiResponse<{ review: any }>>(`/reviews/${reviewId}`, {
      method: "PATCH",
      body: data,
    }),

  deleteReview: (reviewId: string) =>
    request<ApiResponse<{ message: string }>>(`/reviews/${reviewId}`, {
      method: "DELETE",
    }),
};

// ─── Utility exports ────────────────────────────────────────

export { getToken, setToken, clearToken, API_BASE };