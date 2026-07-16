"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    AlertTriangle,
    Loader2,
    ShieldCheck,
    Clock,
    TrendingDown,
    CheckCircle2,
    XCircle,
    Calendar,
    Receipt,
    Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { bookingsApi } from "@/lib/api-client";
import type { BookingItem } from "@/types/api";

interface CancelBookingModalProps {
    open: boolean;
    onClose: () => void;
    booking: BookingItem | null;
    onCancelled?: (bookingId: string) => void;
}

// ── Cancellation reasons (Airbnb / OYO style preset list) ──
const CANCEL_REASONS = [
    "My travel plans changed",
    "Dates no longer work for me",
    "Found a better option elsewhere",
    "Emergency / personal reasons",
    "Weather or natural disaster",
    "Booking made by mistake",
    "Other",
] as const;

// ── Preview shape returned by GET /bookings/:id/cancel-preview ──
interface CancelPreview {
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
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount);
}

function formatDate(iso?: string | null): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

// ── Policy badge colour helper ──
function policyBadgeClass(policy: string): string {
    switch (policy) {
        case "Flexible":
            return "bg-emerald-50 text-emerald-600 border-emerald-100";
        case "Moderate":
            return "bg-amber-50 text-amber-600 border-amber-100";
        case "Strict":
            return "bg-orange-50 text-orange-600 border-orange-100";
        default:
            return "bg-rose-50 text-rose-600 border-rose-100";
    }
}

export function CancelBookingModal({ open, onClose, booking, onCancelled }: CancelBookingModalProps) {
    const [preview, setPreview] = useState<CancelPreview | null>(null);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [previewError, setPreviewError] = useState("");

    const [selectedReason, setSelectedReason] = useState<string>("");
    const [customReason, setCustomReason] = useState("");
    const [acknowledged, setAcknowledged] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [cancelError, setCancelError] = useState("");
    const [cancelled, setCancelled] = useState(false);

    // ── Fetch the cancellation preview whenever the modal opens ──
    const fetchPreview = useCallback(async () => {
        if (!booking) return;
        setLoadingPreview(true);
        setPreviewError("");
        setPreview(null);
        setCancelled(false);
        setCancelError("");
        setAcknowledged(false);
        setSelectedReason("");
        setCustomReason("");
        try {
            const res = await bookingsApi.getCancelPreview(booking.id);
            setPreview(res.data);
        } catch (err) {
            setPreviewError(
                err instanceof Error ? err.message : "Failed to load cancellation details. Please try again."
            );
        } finally {
            setLoadingPreview(false);
        }
    }, [booking]);

    useEffect(() => {
        if (open && booking) {
            fetchPreview();
        }
    }, [open, booking, fetchPreview]);

    // Lock body scroll while modal is open
    useEffect(() => {
        if (!open) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !cancelling) onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, cancelling, onClose]);

    const finalReason =
        selectedReason === "Other" ? customReason.trim() : selectedReason;

    const canSubmit =
        !cancelling &&
        !cancelled &&
        !!preview?.canCancel &&
        selectedReason.length > 0 &&
        (selectedReason !== "Other" || customReason.trim().length > 0) &&
        acknowledged;

    // ── Actually cancel the booking ──
    const handleConfirmCancel = async () => {
        if (!booking || !canSubmit) return;
        setCancelling(true);
        setCancelError("");
        try {
            await bookingsApi.cancelBooking(booking.id, finalReason || undefined);
            setCancelled(true);
            onCancelled?.(booking.id);
        } catch (err) {
            setCancelError(
                err instanceof Error ? err.message : "Failed to cancel booking. Please try again."
            );
        } finally {
            setCancelling(false);
        }
    };

    const handleClose = () => {
        if (cancelling) return;
        onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
                        onClick={handleClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal panel */}
                    <motion.div
                        className="relative bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar"
                        initial={{ y: 60, opacity: 0, scale: 0.98 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 40, opacity: 0, scale: 0.98 }}
                        transition={{ type: "spring", damping: 28, stiffness: 320 }}
                    >
                        {/* ── Header ── */}
                        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-zinc-100 bg-white/95 backdrop-blur-sm rounded-t-3xl">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                                    <AlertTriangle className="w-4.5 h-4.5 text-rose-500" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-zinc-900 leading-tight">
                                        {cancelled ? "Booking Cancelled" : "Cancel Booking"}
                                    </h2>
                                    <p className="text-[10px] text-zinc-500 font-medium">
                                        {booking?.bookingId || "—"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                disabled={cancelling}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors disabled:opacity-40"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* ── Body ── */}
                        <div className="px-6 py-5 space-y-5">
                            {/* Loading state */}
                            {loadingPreview && (
                                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                                    <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
                                    <p className="text-xs text-zinc-500 font-medium">
                                        Calculating refund details…
                                    </p>
                                </div>
                            )}

                            {/* Preview error */}
                            {!loadingPreview && previewError && (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                                    <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
                                        <XCircle className="w-6 h-6 text-rose-400" />
                                    </div>
                                    <p className="text-xs text-rose-500 font-medium max-w-xs">{previewError}</p>
                                    <Button
                                        variant="outline"
                                        className="rounded-xl font-bold text-xs h-9 px-5"
                                        onClick={fetchPreview}
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            )}

                            {/* ── Success state ── */}
                            {!loadingPreview && !previewError && cancelled && preview && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-5"
                                >
                                    <div className="flex flex-col items-center text-center py-6 space-y-3">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", damping: 14, stiffness: 300, delay: 0.1 }}
                                            className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center"
                                        >
                                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                        </motion.div>
                                        <h3 className="text-base font-black text-zinc-900">Cancellation Confirmed</h3>
                                        <p className="text-xs text-zinc-500 font-medium max-w-xs">
                                            Your booking has been cancelled successfully.
                                            {preview.isPaid && preview.refundAmount > 0
                                                ? ` A refund of ${formatCurrency(preview.refundAmount)} will be processed to your original payment method within 5-7 business days.`
                                                : preview.isPaid
                                                    ? " As per the cancellation policy, no refund is applicable."
                                                    : " No payment was charged for this booking."}
                                        </p>
                                    </div>

                                    {preview.isPaid && preview.refundAmount > 0 && (
                                        <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-zinc-600">Refund Amount</span>
                                                <span className="text-sm font-black text-emerald-600">
                                                    {formatCurrency(preview.refundAmount)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-zinc-600">Refund Method</span>
                                                <span className="text-[11px] font-bold text-zinc-900">Original payment method</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-zinc-600">Expected Time</span>
                                                <span className="text-[11px] font-bold text-zinc-900">5-7 business days</span>
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        className="w-full rounded-xl font-bold h-11 text-sm"
                                        onClick={handleClose}
                                    >
                                        Done
                                    </Button>
                                </motion.div>
                            )}

                            {/* ── Main cancellation flow ── */}
                            {!loadingPreview && !previewError && !cancelled && preview && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-5"
                                >
                                    {/* Booking summary */}
                                    <div className="rounded-2xl border border-zinc-100 p-4 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                                                {booking?.itemImage ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={booking.itemImage}
                                                        alt={preview.itemName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Calendar className="w-5 h-5 text-zinc-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-black text-zinc-900 leading-tight truncate">
                                                    {preview.itemName}
                                                </h3>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <Calendar className="w-3 h-3 text-zinc-400" />
                                                    <span className="text-[10px] text-zinc-500 font-medium">
                                                        {formatDate(preview.checkIn)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timing banner */}
                                    <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 border border-zinc-100 p-3.5">
                                        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
                                            <Clock className="w-4 h-4 text-zinc-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[11px] font-bold text-zinc-900">
                                                {preview.daysUntilCheck > 0
                                                    ? `${preview.daysUntilCheck} day${preview.daysUntilCheck !== 1 ? "s" : ""} until check-in`
                                                    : preview.hoursUntilCheck > 0
                                                        ? `${Math.round(preview.hoursUntilCheck)} hour${Math.round(preview.hoursUntilCheck) !== 1 ? "s" : ""} until check-in`
                                                        : "Check-in time has passed"}
                                            </p>
                                            <p className="text-[10px] text-zinc-500 font-medium">
                                                Cancellation policy applies based on this timing.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Cancellation policy */}
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                                            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
                                                Cancellation Policy
                                            </span>
                                            <span
                                                className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${policyBadgeClass(
                                                    preview.cancellationPolicy
                                                )}`}
                                            >
                                                {preview.cancellationPolicy}
                                            </span>
                                        </div>
                                        <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4">
                                            <p className="text-[11px] text-zinc-700 font-medium leading-relaxed">
                                                {preview.policyText}
                                            </p>
                                            {preview.policyDetails && (
                                                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed mt-2 pt-2 border-t border-zinc-100">
                                                    {preview.policyDetails}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Refund breakdown */}
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2">
                                            <Receipt className="w-3.5 h-3.5 text-zinc-400" />
                                            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
                                                Refund Summary
                                            </span>
                                        </div>
                                        <div className="rounded-2xl border border-zinc-100 overflow-hidden">
                                            {/* Total paid */}
                                            <div className="flex items-center justify-between px-4 py-3 bg-zinc-50/50">
                                                <span className="text-[11px] font-bold text-zinc-600">Total Amount</span>
                                                <span className="text-sm font-black text-zinc-900">
                                                    {formatCurrency(preview.totalAmount)}
                                                </span>
                                            </div>

                                            {preview.isPaid ? (
                                                <>
                                                    {/* Refund amount */}
                                                    <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                                                                <TrendingDown className="w-3 h-3 text-emerald-500" />
                                                            </div>
                                                            <span className="text-[11px] font-bold text-zinc-600">
                                                                Refund ({preview.refundPercentage}%)
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-black text-emerald-600">
                                                            {formatCurrency(preview.refundAmount)}
                                                        </span>
                                                    </div>

                                                    {/* Penalty / forfeited */}
                                                    {preview.penaltyAmount > 0 && (
                                                        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-md bg-rose-50 flex items-center justify-center">
                                                                    <XCircle className="w-3 h-3 text-rose-400" />
                                                                </div>
                                                                <span className="text-[11px] font-bold text-zinc-600">
                                                                    Cancellation Fee
                                                                </span>
                                                            </div>
                                                            <span className="text-sm font-black text-rose-500">
                                                                -{formatCurrency(preview.penaltyAmount)}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Net refund */}
                                                    <div className="flex items-center justify-between px-4 py-3.5 border-t border-zinc-100 bg-emerald-50/40">
                                                        <span className="text-[11px] font-black text-zinc-700">
                                                            You'll Receive
                                                        </span>
                                                        <span className="text-base font-black text-emerald-600">
                                                            {formatCurrency(preview.refundAmount)}
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex items-center justify-between px-4 py-3.5 border-t border-zinc-100 bg-amber-50/40">
                                                    <div className="flex items-center gap-2">
                                                        <Info className="w-3.5 h-3.5 text-amber-500" />
                                                        <span className="text-[11px] font-bold text-zinc-600">
                                                            Payment was not completed
                                                        </span>
                                                    </div>
                                                    <span className="text-[11px] font-bold text-amber-600">
                                                        No charge
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {preview.isPaid && preview.refundAmount > 0 && (
                                            <p className="text-[10px] text-zinc-400 font-medium leading-relaxed px-1">
                                                💡 The refund will be processed to your original payment method and
                                                typically takes 5-7 business days to reflect, depending on your bank.
                                            </p>
                                        )}
                                    </div>

                                    {/* Reason selection */}
                                    <div className="space-y-2.5">
                                        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
                                            Reason for Cancellation
                                        </span>
                                        <div className="space-y-2">
                                            {CANCEL_REASONS.map((reason) => (
                                                <button
                                                    key={reason}
                                                    onClick={() => setSelectedReason(reason)}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${selectedReason === reason
                                                            ? "border-rose-200 bg-rose-50/50"
                                                            : "border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/50"
                                                        }`}
                                                >
                                                    <div
                                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selectedReason === reason
                                                                ? "border-rose-500"
                                                                : "border-zinc-300"
                                                            }`}
                                                    >
                                                        {selectedReason === reason && (
                                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] font-bold text-zinc-700">{reason}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Custom reason input */}
                                        <AnimatePresence>
                                            {selectedReason === "Other" && (
                                                <motion.textarea
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    value={customReason}
                                                    onChange={(e) => setCustomReason(e.target.value)}
                                                    placeholder="Please tell us why you're cancelling…"
                                                    rows={3}
                                                    className="w-full rounded-xl border border-zinc-100 px-4 py-3 text-[11px] font-medium text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-rose-200 resize-none transition-colors"
                                                />
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Acknowledgement checkbox */}
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative shrink-0 mt-0.5">
                                            <input
                                                type="checkbox"
                                                checked={acknowledged}
                                                onChange={(e) => setAcknowledged(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-5 h-5 rounded-md border-2 border-zinc-200 peer-checked:border-rose-500 peer-checked:bg-rose-500 transition-colors flex items-center justify-center">
                                                {acknowledged && (
                                                    <motion.svg
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        viewBox="0 0 24 24"
                                                        className="w-3 h-3 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </motion.svg>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                                            I understand that this action is{" "}
                                            <span className="font-black text-zinc-700">irreversible</span>
                                            {preview.isPaid && preview.refundAmount > 0
                                                ? ` and a refund of ${formatCurrency(preview.refundAmount)} will be processed as per the ${preview.cancellationPolicy} policy.`
                                                : preview.isPaid
                                                    ? " and no refund is applicable as per the cancellation policy."
                                                    : " and the booking will be cancelled immediately."}
                                        </span>
                                    </label>

                                    {/* Cancel error */}
                                    {cancelError && (
                                        <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 px-4 py-3">
                                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                                            <p className="text-[11px] text-rose-500 font-medium">{cancelError}</p>
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div className="flex gap-3 pt-1">
                                        <Button
                                            variant="outline"
                                            className="flex-1 rounded-xl font-bold h-11 text-xs border-zinc-200"
                                            onClick={handleClose}
                                            disabled={cancelling}
                                        >
                                            Keep Booking
                                        </Button>
                                        <Button
                                            className="flex-1 rounded-xl font-bold h-11 text-xs bg-rose-500 hover:bg-rose-600 text-white gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={handleConfirmCancel}
                                            disabled={!canSubmit}
                                        >
                                            {cancelling ? (
                                                <>
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    Cancelling…
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    Confirm Cancellation
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
