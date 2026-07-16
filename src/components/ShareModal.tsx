"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Check, Sparkles, Calendar, MapPin, Users, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BookingItem } from "@/types/api";

interface ShareModalProps {
    open: boolean;
    onClose: () => void;
    booking: BookingItem | null;
}

function formatDate(iso?: string): string {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatCurrency(amount?: number): string {
    if (amount === undefined || amount === null) return "";
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function ShareModal({ open, onClose, booking }: ShareModalProps) {
    const [shared, setShared] = useState(false);
    const [canNativeShare, setCanNativeShare] = useState(false);

    // Detect native share support at runtime (TS DOM types always define navigator.share)
    useEffect(() => {
        setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
    }, []);

    // The success page URL already carries the booking id (?booking=<cuid>),
    // so we reuse the current URL to guarantee a valid, non-empty share link.
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    // ─── Build a professional, detailed share message (Airbnb/Amazon style) ───
    const buildShareText = (): string => {
        if (!booking) {
            return `I just booked my next adventure on TripTay! 🎉\nDiscover unique stays & experiences — book yours at TripTay.`;
        }

        const lines: string[] = [];

        // Headline
        lines.push(`🎉 Booking Confirmed on TripTay!`);
        lines.push("");

        // Item / experience name
        lines.push(`📍 ${booking.itemName}`);

        // Location
        if (booking.location) {
            lines.push(`   ${booking.location}`);
        }

        lines.push("");

        // Trip details section
        lines.push(`📅 Trip Details:`);

        if (booking.itemType === "activity") {
            if (booking.activityDate) {
                lines.push(`   • Date: ${formatDate(booking.activityDate)}`);
            }
            if (booking.startTime) {
                lines.push(`   • Time: ${booking.startTime}`);
            }
        } else {
            if (booking.checkIn && booking.checkOut) {
                lines.push(`   • Check-in: ${formatDate(booking.checkIn)}`);
                lines.push(`   • Check-out: ${formatDate(booking.checkOut)}`);
                if (booking.nights) {
                    lines.push(`   • Duration: ${booking.nights} night${booking.nights > 1 ? "s" : ""}`);
                }
            } else if (booking.checkIn) {
                lines.push(`   • Date: ${formatDate(booking.checkIn)}`);
            }
        }

        // Guests
        const guestParts: string[] = [];
        if (booking.guests) guestParts.push(`${booking.guests} guest${booking.guests > 1 ? "s" : ""}`);
        if (booking.adults) guestParts.push(`${booking.adults} adult${booking.adults > 1 ? "s" : ""}`);
        if (booking.children) guestParts.push(`${booking.children} child${booking.children > 1 ? "ren" : ""}`);
        if (guestParts.length > 0) {
            lines.push(`   • Guests: ${guestParts.join(", ")}`);
        }

        lines.push("");

        // Booking reference
        if (booking.bookingId) {
            lines.push(`🎫 Booking ID: ${booking.bookingId}`);
        }

        // Total amount
        if (booking.totalAmount) {
            lines.push(`💰 Total Paid: ${formatCurrency(booking.totalAmount)}`);
        }

        // Payment status
        if (booking.paymentStatus) {
            lines.push(`✅ Payment: ${booking.paymentStatus}`);
        }

        lines.push("");

        // Call to action
        lines.push(`Plan your own getaway with TripTay — unique stays & unforgettable experiences await! 🌴`);
        lines.push("");
        lines.push(`View my booking details here 👇`);

        return lines.join("\n");
    };

    const shareTitle = booking
        ? `My TripTay Booking — ${booking.itemName}`
        : "My TripTay Booking is Confirmed! 🎉";
    const shareText = buildShareText();

    // Lock body scroll
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (open) window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onClose]);

    // Reset states when modal closes
    useEffect(() => {
        if (!open) {
            setShared(false);
        }
    }, [open]);

    const handleNativeShare = async () => {
        if (canNativeShare) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                });
                setShared(true);
                setTimeout(() => setShared(false), 2500);
            } catch {
                /* user cancelled - ignore */
            }
        } else {
            // Fallback: copy the full message + link to clipboard
            try {
                await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
                setShared(true);
                setTimeout(() => setShared(false), 2500);
            } catch {
                const textArea = document.createElement("textarea");
                textArea.value = `${shareText}\n${shareUrl}`;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand("copy");
                    setShared(true);
                    setTimeout(() => setShared(false), 2500);
                } catch {
                    /* ignore */
                }
                document.body.removeChild(textArea);
            }
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Share2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-black text-zinc-900 text-lg leading-tight">Share Your Booking</h2>
                                    <p className="text-xs text-zinc-400 font-medium">Let your friends know about your trip!</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="rounded-xl"
                                onClick={onClose}
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-5">
                            {/* Preview card — shows what will be shared */}
                            {booking && (
                                <div className="rounded-2xl border border-zinc-100 overflow-hidden">
                                    {/* Image banner */}
                                    <div className="relative h-32 bg-gradient-to-br from-primary/20 to-primary/5">
                                        {booking.itemImage ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={booking.itemImage}
                                                alt={booking.itemName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Sparkles className="w-10 h-10 text-primary/40" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-wider text-primary">
                                            {booking.itemType === "activity" ? "Experience" : "Stay"}
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="p-4 space-y-3">
                                        <div>
                                            <p className="font-black text-zinc-900 text-base leading-tight">{booking.itemName}</p>
                                            {booking.location && (
                                                <p className="text-xs text-zinc-400 font-medium flex items-center gap-1 mt-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {booking.location}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            {/* Dates */}
                                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50">
                                                <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-black uppercase tracking-wider text-zinc-400">
                                                        {booking.itemType === "activity" ? "Date" : "Check-in"}
                                                    </p>
                                                    <p className="text-xs font-bold text-zinc-700 truncate">
                                                        {booking.itemType === "activity"
                                                            ? booking.activityDate
                                                                ? formatDate(booking.activityDate)
                                                                : "—"
                                                            : booking.checkIn
                                                                ? formatDate(booking.checkIn)
                                                                : "—"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Guests */}
                                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50">
                                                <Users className="w-4 h-4 text-zinc-400 shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Guests</p>
                                                    <p className="text-xs font-bold text-zinc-700 truncate">
                                                        {booking.guests ? `${booking.guests} guest${booking.guests > 1 ? "s" : ""}` : "—"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Booking ID + Total */}
                                        <div className="flex items-center justify-between pt-1">
                                            <div className="flex items-center gap-1.5">
                                                <Ticket className="w-3.5 h-3.5 text-zinc-400" />
                                                <span className="text-[11px] font-bold text-zinc-500">
                                                    {booking.bookingId || "—"}
                                                </span>
                                            </div>
                                            {booking.totalAmount ? (
                                                <span className="text-sm font-black text-zinc-900">
                                                    {formatCurrency(booking.totalAmount)}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Share via Device button */}
                            <button
                                onClick={handleNativeShare}
                                className="w-full flex items-center justify-center gap-2.5 h-14 rounded-2xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
                            >
                                {shared ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        {canNativeShare ? "Shared!" : "Copied to Clipboard!"}
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="w-5 h-5" />
                                        {canNativeShare ? "Share via Device" : "Copy Share Message"}
                                    </>
                                )}
                            </button>

                            {/* Helper text */}
                            <p className="text-center text-xs text-zinc-400 font-medium leading-relaxed">
                                {canNativeShare
                                    ? "Tap above to share your booking details with friends & family via any app on your device."
                                    : "Your device doesn't support direct sharing — tap above to copy the full booking summary and link."}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
                            <p className="text-center text-xs text-zinc-400 font-medium">
                                🔒 Your personal details are never shared — only the booking summary & link.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
