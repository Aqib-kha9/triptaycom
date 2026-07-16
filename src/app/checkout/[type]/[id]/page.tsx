"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  ChevronLeft,
  Zap,
  CheckCircle2,
  Info,
  Plus,
  Tag,
  ShieldCheck,
  MapPin,
  Calendar,
  Users,
  ChevronRight,
  ArrowRight,
  Wallet,
  Building2,
  Smartphone,
  X,
  Inbox,
  Loader2,
  AlertCircle,
  Lock,
  Sparkles,
  User,
  Mail,
  Phone,
  MessageSquare
} from "lucide-react";
import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { checkoutApi, bookingsApi, authApi, listingsApi, activitiesApi, couponsApi, ApiError } from "@/lib/api-client";
import type { CheckoutItem } from "@/types/api";

export default function CheckoutPage({ params: paramsPromise }: { params: Promise<{ type: string, id: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const itemType = params.type === "activity" ? "activity" : "stay";
  const [selectedAddons] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const [item, setItem] = useState<CheckoutItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Guest details
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);

  // Additional travelers/guests (for activities)
  const [additionalGuests, setAdditionalGuests] = useState<string[]>([]);

  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const getDayAfterTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  };

  const searchParams = useSearchParams();
  const queryCheckIn = searchParams ? searchParams.get("checkIn") : null;
  const queryCheckOut = searchParams ? searchParams.get("checkOut") : null;
  const queryGuests = searchParams ? searchParams.get("guests") : null;
  const queryStartTime = searchParams ? searchParams.get("startTime") : null;
  const queryActivityDate = searchParams ? searchParams.get("activityDate") : null;
  const queryCoupon = searchParams ? searchParams.get("coupon") : null;
  const querySpecialRequests = searchParams ? searchParams.get("specialRequests") : null;

  const [checkIn, setCheckIn] = useState(queryCheckIn || (params.type === "stay" ? getTomorrow() : ""));
  const [checkOut, setCheckOut] = useState(queryCheckOut || (params.type === "stay" ? getDayAfterTomorrow() : ""));
  const [activityDate, setActivityDate] = useState(queryActivityDate || (params.type === "activity" ? getTomorrow() : ""));
  const [guests, setGuests] = useState(queryGuests ? parseInt(queryGuests, 10) : 1);
  const [startTime] = useState(queryStartTime || "");

  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>({});
  const [validationError, setValidationError] = useState("");

  // Auto-apply coupon code from URL
  useEffect(() => {
    if (queryCoupon && item) {
      couponsApi.validate({
        code: queryCoupon.toUpperCase().trim(),
        itemId: item.id,
        itemType: itemType === "stay" ? "listing" : "activity",
        checkIn: checkIn ? new Date(checkIn).toISOString() : undefined,
        checkOut: checkOut ? new Date(checkOut).toISOString() : undefined,
        activityDate: activityDate ? new Date(activityDate).toISOString() : undefined,
        guests,
      }).then(res => {
        if (res.status === "success") {
          setCoupon(queryCoupon.toUpperCase().trim());
          setCouponApplied(true);
          setCouponSuccess(`Coupon applied! You saved ₹${res.data.discountAmount.toLocaleString()}`);
        }
      }).catch(err => {
        console.error("Auto-apply coupon failed:", err);
      });
    }
  }, [queryCoupon, item]);

  // Parse co-travelers and clean special requests from URL
  useEffect(() => {
    if (querySpecialRequests) {
      const parts = querySpecialRequests.split("Additional Guest Details:");
      const cleanSpecialRequests = parts[0].trim();
      setSpecialRequests(cleanSpecialRequests);

      if (parts.length > 1) {
        const lines = parts[1].split("\n");
        const names: string[] = [];
        lines.forEach(line => {
          if (line.includes("Co-traveler")) {
            const namePart = line.split(":")[2] || line.split(":")[1];
            if (namePart) {
              names.push(namePart.trim());
            }
          }
        });
        if (names.length > 0) {
          setAdditionalGuests(names);
        }
      }
    }
  }, [querySpecialRequests]);

  // Fetch listing or activity availability details
  useEffect(() => {
    if (!item) return;
    (async () => {
      try {
        if (itemType === "stay") {
          const res = await listingsApi.getListingAvailability(item.id);
          if (res.status === "success" && res.data) {
            setBlockedDates(res.data.blockedDates || []);
            setBookedDates(res.data.bookedDates || []);
          }
        } else {
          const res = await activitiesApi.getActivityAvailability(item.id);
          if (res.status === "success" && res.data) {
            setBlockedDates(res.data.blockedDates || []);
            setBookedSlots(res.data.bookedSlots || {});
          }
        }
      } catch (err) {
        console.error("Failed to load availability details:", err);
      }
    })();
  }, [item, itemType]);

  // Run dynamic validation checks matching the details page rules
  useEffect(() => {
    setValidationError("");
    if (!item) return;

    if (itemType === "stay") {
      if (!checkIn || !checkOut) return;
      
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        setValidationError("Check-in date cannot be in the past.");
        return;
      }
      if (checkOutDate <= checkInDate) {
        setValidationError("Check-out date must be after check-in date.");
        return;
      }

      const maxGuests = item.maxGuests || 10;
      if (guests > maxGuests) {
        setValidationError(`This property allows a maximum of ${maxGuests} guests.`);
        return;
      }

      let current = new Date(checkInDate);
      while (current < checkOutDate) {
        const dateStr = current.toISOString().split("T")[0];
        if (blockedDates.includes(dateStr)) {
          setValidationError(`Selected range includes a blocked date: ${dateStr}.`);
          return;
        }
        if (bookedDates.includes(dateStr)) {
          setValidationError(`Selected range includes an already booked date: ${dateStr}.`);
          return;
        }
        current.setDate(current.getDate() + 1);
      }
    } else {
      if (!activityDate) return;
      
      const actDateObj = new Date(activityDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (actDateObj < today) {
        setValidationError("Activity date cannot be in the past.");
        return;
      }

      const dateStr = activityDate;
      if (blockedDates.includes(dateStr)) {
        setValidationError("The selected date is blocked by the host.");
        return;
      }

      const minGroup = (item as any).minGroupSize || 1;
      const maxGroup = (item as any).maxGroupSize || item.maxGuests || 20;

      if (guests < minGroup) {
        setValidationError(`Minimum participants required for this activity is ${minGroup}.`);
        return;
      }
      if (guests > maxGroup) {
        setValidationError(`Maximum participants allowed for this activity is ${maxGroup}.`);
        return;
      }
    }
  }, [item, itemType, checkIn, checkOut, activityDate, guests, blockedDates, bookedDates]);

  // Dynamic booking preview pricing
  const [previewData, setPreviewData] = useState<{
    baseAmount: number;
    cleaningFee: number;
    securityDeposit: number;
    extraGuestCharges: number;
    taxAmount: number;
    platformFee: number;
    discountAmount: number;
    totalAmount: number;
    nights: number;
  } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Fetch User Profile on mount to autofill guest details & get wallet balance
  useEffect(() => {
    (async () => {
      try {
        const res = await authApi.getMe();
        if (res?.data?.user) {
          setUserProfile(res.data.user);
          setGuestName(res.data.user.name || "");
          const emailVal = res.data.user.email || "";
          if (emailVal && !emailVal.endsWith("@triptay.com")) {
            setGuestEmail(emailVal);
          } else {
            setGuestEmail("");
          }
          setGuestPhone(res.data.user.phone || "");
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    })();
  }, []);

  // Sync additionalGuests size with guests count for activities
  useEffect(() => {
    if (itemType === "activity" && guests > 1) {
      setAdditionalGuests((prev) => {
        const needed = guests - 1;
        const copy = [...prev];
        if (copy.length < needed) {
          while (copy.length < needed) copy.push("");
        } else if (copy.length > needed) {
          copy.splice(needed);
        }
        return copy;
      });
    } else {
      setAdditionalGuests([]);
    }
  }, [guests, itemType]);

  useEffect(() => {
    if (!item) return;
    if (itemType === "stay" && (!checkIn || !checkOut)) return;
    if (itemType === "activity" && !activityDate) return;

    let active = true;
    (async () => {
      setPreviewLoading(true);
      try {
        const res = await bookingsApi.getBookingPreview({
          itemId: item.id,
          itemType: itemType === "stay" ? "listing" : "activity",
          checkIn: checkIn ? new Date(checkIn).toISOString() : undefined,
          checkOut: checkOut ? new Date(checkOut).toISOString() : undefined,
          activityDate: activityDate ? new Date(activityDate).toISOString() : undefined,
          guests,
          couponCode: couponApplied && coupon ? coupon : undefined,
        });
        if (!active) return;
        if (res.status === "success" && res.data?.pricing) {
          setPreviewData(res.data.pricing);
        }
      } catch (err) {
        console.error("Failed to load booking preview:", err);
      } finally {
        if (active) setPreviewLoading(false);
      }
    })();
    return () => { active = false; };
  }, [item, itemType, checkIn, checkOut, activityDate, guests, couponApplied, coupon]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await checkoutApi.getItem(itemType as "stay" | "activity", params.id);
        if (!active) return;
        const data = res.data?.listing || res.data?.activity;
        if (data) {
          setItem(data);
        } else {
          setError("Item not found.");
        }
      } catch (err: any) {
        if (!active) return;
        setError(err instanceof ApiError ? err.message : "Failed to load item details.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [itemType, params.id]);

  const basePrice = item?.basePrice || 0;
  const addonTotal = 0; // addons not yet supported by backend
  const gst = Math.round((basePrice + addonTotal) * 0.12);
  const total = basePrice + addonTotal + gst - discount;

  const currentTotalAmount = previewData ? previewData.totalAmount : total;
  const isWalletInsufficient = userProfile ? (userProfile.walletBalance || 0) < currentTotalAmount : true;

  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const getSubtotalBeforeDiscount = () => {
    if (previewData) {
      return (
        previewData.baseAmount +
        (previewData.cleaningFee || 0) +
        (previewData.extraGuestCharges || 0) +
        (previewData.taxAmount || 0) +
        (previewData.securityDeposit || 0) +
        (previewData.platformFee || 0)
      );
    }
    return total;
  };

  const handleApplyCoupon = async () => {
    if (!coupon) return;
    setCouponError("");
    setCouponSuccess("");
    setError("");

    try {
      const orderValue = getSubtotalBeforeDiscount();
      const res = await couponsApi.validate({
        code: coupon.toUpperCase().trim(),
        orderValue,
        itemType: itemType === "stay" ? "listing" : "activity",
        itemId: item?.id,
      });

      if (res.status === "success" && res.data) {
        setDiscount(res.data.discountAmount);
        setCouponApplied(true);
        setCouponSuccess(`Coupon applied! You saved ₹${res.data.discountAmount.toLocaleString()}`);
      } else {
        setCouponError("Failed to validate coupon code.");
      }
    } catch (err: any) {
      console.error("Coupon validation failed:", err);
      setCouponError(err instanceof ApiError ? err.message : "Invalid coupon code.");
      setDiscount(0);
      setCouponApplied(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon("");
    setCouponApplied(false);
    setDiscount(0);
    setCouponError("");
    setCouponSuccess("");
  };

  const handlePay = async () => {
    setError("");
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!item) return;
    if (itemType === "stay" && (!checkIn || !checkOut)) {
      setError("Please select check-in and check-out dates.");
      return;
    }
    if (itemType === "activity" && !activityDate) {
      setError("Please select an activity date.");
      return;
    }
    if (!guestName.trim()) {
      setError("Please enter primary guest name.");
      return;
    }
    if (!guestEmail.trim()) {
      setError("Please enter primary guest email.");
      return;
    }
    if (!guestPhone.trim()) {
      setError("Please enter primary guest phone number.");
      return;
    }

    if (paymentMethod === "wallet" && isWalletInsufficient) {
      setError("Insufficient wallet balance. Please add funds or select another payment gateway.");
      return;
    }

    setSubmitting(true);

    // Save guest details to database profile if they have changed or were placeholders
    if (userProfile) {
      const isPlaceholder = userProfile.email?.endsWith("@triptay.com");
      const isModified = guestEmail.trim().toLowerCase() !== userProfile.email?.trim().toLowerCase() ||
                         guestPhone.trim() !== (userProfile.phone || "").trim() ||
                         guestName.trim() !== (userProfile.name || "").trim();

      if (isPlaceholder || isModified) {
        try {
          await authApi.updateProfile({
            email: guestEmail.trim().toLowerCase(),
            phone: guestPhone.trim(),
            name: guestName.trim(),
          });
        } catch (updateErr) {
          console.error("Failed to update user profile with guest details:", updateErr);
        }
      }
    }

    // Format final special requests to append additional guest details
    let finalSpecialRequests = specialRequests;
    if (itemType === "activity" && additionalGuests.length > 0) {
      const guestDetails = additionalGuests
        .map((name, index) => `Co-traveler ${index + 2}: ${name.trim() || "Not Specified"}`)
        .join("\n");
      finalSpecialRequests = finalSpecialRequests
        ? `${finalSpecialRequests}\n\nAdditional Guest Details:\n${guestDetails}`
        : `Additional Guest Details:\n${guestDetails}`;
    }

    try {
      const bookingRes = await bookingsApi.createBooking({
        itemId: item.id,
        itemType: itemType === "stay" ? "listing" : "activity",
        checkIn: checkIn ? new Date(checkIn).toISOString() : undefined,
        checkOut: checkOut ? new Date(checkOut).toISOString() : undefined,
        activityDate: activityDate ? new Date(activityDate).toISOString() : undefined,
        startTime: startTime || undefined,
        guests,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests: finalSpecialRequests,
        couponCode: couponApplied ? coupon : undefined,
        bookingType: "instant",
      });
      const booking = bookingRes.data?.booking;
      if (!booking) throw new Error("Booking creation failed.");
      // Store booking id for processing page, then navigate
      sessionStorage.setItem("pendingBookingId", booking.id);
      sessionStorage.setItem("pendingBookingType", paymentMethod);
      router.push("/checkout/processing");
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : "Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const paymentMethods = [
    {
      id: "razorpay",
      name: "Razorpay Secure Gateway",
      subName: "UPI / Cards / Netbanking",
      icon: <CreditCard className="w-5 h-5 text-indigo-600" />,
      badge: "Popular"
    },
    {
      id: "payu",
      name: "PayU Wallet & EMI",
      subName: "UPI / Netbanking / PayLater",
      icon: <Smartphone className="w-5 h-5 text-amber-600" />,
    },
    {
      id: "wallet",
      name: "Triptay Wallet",
      subName: userProfile ? `Balance: ₹${userProfile.walletBalance?.toLocaleString()}` : "Loading balance...",
      icon: <Wallet className="w-5 h-5 text-emerald-600" />,
      badge: userProfile && !isWalletInsufficient ? "Instant Checkout" : undefined,
      disabled: userProfile && isWalletInsufficient
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50/50">
        <Navbar />
        <main className="flex-grow pt-24 pb-20">
          <div className="container mx-auto px-4 flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-zinc-500 font-medium text-sm animate-pulse">Setting up your checkout dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !item) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50/50">
        <Navbar />
        <main className="flex-grow pt-24 pb-20">
          <div className="container mx-auto px-4 flex flex-col items-center justify-center py-32 space-y-4">
            <div className="p-4 bg-rose-50 rounded-full">
              <AlertCircle className="w-10 h-10 text-rose-500" />
            </div>
            <p className="text-sm font-bold text-zinc-800">{error}</p>
            <Link href="/explore">
              <Button className="rounded-2xl px-6 h-12 font-bold text-xs bg-primary hover:bg-primary/95 text-white shadow-xl shadow-primary/20">Back to Explore</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFC]">
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Link
                href={`/${params.type}s/${params.id}`}
                className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-semibold text-sm mb-2 group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to {params.type} details
              </Link>
              <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2.5">
                Confirm & Pay
                <Sparkles className="w-6 h-6 text-primary fill-primary/10 hidden md:block" />
              </h1>
            </div>
            
            {/* Quick trust tag */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              256-bit SSL Secure Checkout
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Columns: Forms */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">
              
              {/* Trip details preview card */}
              <section className="bg-white rounded-3xl border border-zinc-100 p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-50 pb-5 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900">Trip Schedule</h2>
                      <p className="text-xs text-zinc-400 font-medium">Verify your booking schedule</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {itemType === "stay" ? (
                    <>
                      <div className="space-y-1.5 relative">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Check-in</label>
                        <div className="relative">
                          <Input
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="h-12 pl-4 rounded-xl border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white text-zinc-800 font-semibold focus:ring-1 focus:ring-primary/20 transition-all text-xs"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Check-out</label>
                        <Input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="h-12 pl-4 rounded-xl border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white text-zinc-800 font-semibold focus:ring-1 focus:ring-primary/20 transition-all text-xs"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Activity Date</label>
                      <Input
                        type="date"
                        value={activityDate}
                        onChange={(e) => setActivityDate(e.target.value)}
                        className="h-12 pl-4 rounded-xl border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white text-zinc-800 font-semibold focus:ring-1 focus:ring-primary/20 transition-all text-xs"
                      />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Guests Count</label>
                    <Input
                      type="number"
                      min={1}
                      value={guests}
                      onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                      className="h-12 pl-4 rounded-xl border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white text-zinc-800 font-bold focus:ring-1 focus:ring-primary/20 transition-all text-xs"
                    />
                </div>
              </div>

              {validationError && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-2.5 text-xs font-semibold text-rose-600"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{validationError}</span>
                  </motion.div>
                )}
              </section>

              {/* Guest Details Form */}
              <section className="bg-white rounded-3xl border border-zinc-100 p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-50 pb-5 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900">Lead Guest Details</h2>
                      <p className="text-xs text-zinc-400 font-medium">Autofilled from profile for fast verification</p>
                    </div>
                  </div>
                  {userProfile && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Verified Profile
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <Input
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Enter primary guest full name"
                        className="h-12 pl-10 rounded-xl border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white text-sm font-semibold transition-all focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <Input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="h-12 pl-10 rounded-xl border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white text-sm font-semibold transition-all focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <Input
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+91 99999 99999"
                        className="h-12 pl-10 rounded-xl border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white text-sm font-semibold transition-all focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Special Requests (Optional)</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <Input
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Dietary requests, special timing, etc."
                        className="h-12 pl-10 rounded-xl border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white text-sm font-semibold transition-all focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic Additional Guests details for Activities */}
                {itemType === "activity" && additionalGuests.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-zinc-50 space-y-4"
                  >
                    <h3 className="text-sm font-bold text-zinc-800 tracking-tight flex items-center gap-1.5">
                      Co-Travelers details
                      <span className="text-[10px] font-medium text-zinc-400">(Required for Activity Permits)</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {additionalGuests.map((name, index) => (
                        <div key={index} className="space-y-1 relative">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 ml-1">
                            Guest {index + 2} Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                            <Input
                              value={name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setAdditionalGuests((prev) => {
                                  const copy = [...prev];
                                  copy[index] = val;
                                  return copy;
                                });
                              }}
                              placeholder={`Enter guest ${index + 2} full name`}
                              className="h-11 pl-9 rounded-xl border-zinc-200 bg-zinc-50/10 hover:bg-zinc-50/50 focus:bg-white text-xs font-semibold focus:ring-1 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </section>

              {/* Payment Methods Selection */}
              <section className="bg-white rounded-3xl border border-zinc-100 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 border-b border-zinc-50 pb-5 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900">Choose Gateway</h2>
                    <p className="text-xs text-zinc-400 font-medium">Safe & fully encrypted secure channels</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => {
                    const isDisabled = method.disabled;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setPaymentMethod(method.id)}
                        className={cn(
                          "relative p-5 rounded-2xl border text-left flex flex-col justify-between transition-all h-[120px] select-none cursor-pointer",
                          isDisabled
                            ? "bg-zinc-50/50 border-zinc-100 opacity-60 cursor-not-allowed"
                            : paymentMethod === method.id
                            ? "border-primary bg-primary/[0.02] shadow-sm ring-[1.5px] ring-primary"
                            : "border-zinc-200 bg-white hover:border-zinc-300"
                        )}
                      >
                        <div className="flex items-start justify-between w-full">
                          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
                            {method.icon}
                          </div>
                          {method.badge && (
                            <span className="text-[8px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              {method.badge}
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="font-bold text-zinc-800 text-xs leading-tight">{method.name}</h4>
                          <p className="text-[10px] text-zinc-400 mt-1 font-semibold truncate leading-none">
                            {method.subName}
                          </p>
                        </div>

                        {/* Disabled label */}
                        {isDisabled && (
                          <div className="absolute inset-0 bg-white/70 backdrop-blur-[0.5px] rounded-2xl flex flex-col items-center justify-center p-3 text-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
                              Insufficient
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {paymentMethod === "wallet" && (
                  <div className="mt-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs font-semibold text-emerald-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">Instant Wallet Checkout Activated</p>
                      <p className="text-[10px] text-emerald-700/80 mt-0.5 font-medium">
                        Amount will be directly debited from your secure Triptay Wallet balance. No card details required.
                      </p>
                    </div>
                  </div>
                )}
              </section>

            </div>

            {/* Right Column: Order Summary (Sticky card) */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28">
              <div className="bg-white rounded-[32px] border border-zinc-100 shadow-xl shadow-zinc-200/40 overflow-hidden">
                
                {/* Summary Header */}
                <div className="p-6 md:p-8 pb-5 border-b border-zinc-50 space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-50 border border-zinc-100">
                      {item?.media?.[0]?.url ? (
                        <img src={item.media[0].url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-300">
                          <MapPin className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="inline-flex px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest mb-1.5">
                        {itemType === "activity" ? "Activity" : "Stay"}
                      </div>
                      <h3 className="font-bold text-zinc-800 text-sm leading-snug truncate">{item?.name || "Loading..."}</h3>
                      <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-semibold mt-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">{item ? `${item.city}, ${item.state}` : ""}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-6 md:p-8 pt-5 space-y-5">
                  <div className={cn("space-y-3.5", previewLoading && "opacity-40 transition-opacity")}>
                    {previewData ? (
                      <>
                        <div className="flex justify-between text-zinc-500 font-semibold text-xs">
                          <span>
                            {itemType === "stay"
                              ? `Base price (${previewData.nights} night${previewData.nights !== 1 ? "s" : ""})`
                              : `Base price (${guests} guest${guests !== 1 ? "s" : ""})`
                            }
                          </span>
                          <span className="text-zinc-800 font-bold">₹{previewData.baseAmount.toLocaleString()}</span>
                        </div>
                        {previewData.extraGuestCharges > 0 && (
                          <div className="flex justify-between text-zinc-500 font-semibold text-xs">
                            <span>Extra guest charges</span>
                            <span className="text-zinc-800 font-bold">₹{previewData.extraGuestCharges.toLocaleString()}</span>
                          </div>
                        )}
                        {previewData.cleaningFee > 0 && (
                          <div className="flex justify-between text-zinc-500 font-semibold text-xs">
                            <span>Cleaning fee</span>
                            <span className="text-zinc-800 font-bold">₹{previewData.cleaningFee.toLocaleString()}</span>
                          </div>
                        )}
                        {previewData.securityDeposit > 0 && (
                          <div className="flex justify-between text-zinc-500 font-semibold text-xs">
                            <span>Security deposit</span>
                            <span className="text-zinc-800 font-bold">₹{previewData.securityDeposit.toLocaleString()}</span>
                          </div>
                        )}
                        {previewData.platformFee > 0 && (
                          <div className="flex justify-between text-zinc-500 font-semibold text-xs">
                            <span>Platform fee</span>
                            <span className="text-zinc-800 font-bold">₹{previewData.platformFee.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-zinc-500 font-semibold text-xs">
                          <span>GST / Taxes ({item?.taxes || 0}%)</span>
                          <span className="text-zinc-800 font-bold">₹{previewData.taxAmount.toLocaleString()}</span>
                        </div>
                        {previewData.discountAmount > 0 && (
                          <div className="flex justify-between text-emerald-600 font-bold text-xs bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                            <span>Coupon Discount</span>
                            <span>-₹{previewData.discountAmount.toLocaleString()}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between text-zinc-500 font-semibold text-xs">
                          <span>Base price</span>
                          <span className="text-zinc-800 font-bold">₹{basePrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-zinc-500 font-semibold text-xs">
                          <span>GST (12%)</span>
                          <span className="text-zinc-800 font-bold">₹{gst.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Coupon Input */}
                  <div className="pt-2">
                    {!couponApplied ? (
                      <div>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input
                              placeholder="COUPON CODE"
                              className="h-11 pl-10 rounded-xl border-zinc-200 bg-zinc-50/60 focus:bg-white text-[11px] font-extrabold uppercase tracking-widest placeholder:text-zinc-400 placeholder:font-bold"
                              value={coupon}
                              onChange={(e) => {
                                setCoupon(e.target.value.toUpperCase());
                                setCouponError("");
                                setCouponSuccess("");
                              }}
                            />
                          </div>
                          <Button
                            onClick={handleApplyCoupon}
                            className="rounded-xl h-11 px-5 text-xs font-bold bg-zinc-950 text-white hover:bg-zinc-900 shadow-sm"
                            disabled={!coupon}
                          >
                            Apply
                          </Button>
                        </div>
                        {couponError && (
                          <motion.p
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] font-bold text-rose-500 mt-1.5 ml-1"
                          >
                            {couponError}
                          </motion.p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="bg-emerald-50/80 text-emerald-700 border border-emerald-100 p-3 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-black uppercase tracking-widest">{coupon} APPLIED</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="text-emerald-800 hover:scale-110 transition-transform p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {couponSuccess && (
                          <motion.p
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] font-bold text-emerald-600 mt-1.5 ml-1"
                          >
                            {couponSuccess}
                          </motion.p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="pt-5 border-t border-zinc-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Amount</p>
                      <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Tax & GST Inclusive</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-primary font-mono tracking-tight">
                        ₹{(previewData ? previewData.totalAmount : total).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-semibold text-rose-600 bg-rose-50 rounded-2xl px-4 py-3.5 flex items-start gap-2.5 border border-rose-100"
                    >
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <Button
                    onClick={handlePay}
                    disabled={submitting}
                    className="w-full h-14 rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/95 text-white mt-4 gap-2.5 group transition-all cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Gateway...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay & Confirm Booking</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </Button>

                  <p className="text-[10px] text-zinc-400 text-center font-medium leading-normal mt-3">
                    By clicking Pay & Confirm, you agree to our{" "}
                    <Link href="/terms" className="underline hover:text-zinc-600">Terms of Service</Link> and{" "}
                    <Link href="/privacy" className="underline hover:text-zinc-600">Cancellation Policy</Link>.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
