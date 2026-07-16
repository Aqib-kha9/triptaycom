"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BookingItem } from "@/types/api";

interface InvoiceModalProps {
    open: boolean;
    onClose: () => void;
    booking: BookingItem | null;
}

const BRAND = {
    name: "TripTay",
    tagline: "Stay • Explore • Experience",
    email: "support@triptay.com",
    phone: "+91 00000 00000",
    website: "www.triptay.com",
    address: "TripTay Travel Pvt. Ltd., India",
    gstin: "29ABCDE1234F1Z5",
};

function formatCurrency(amount?: number): string {
    if (amount === undefined || amount === null || isNaN(amount)) return "₹0";
    return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function formatDate(iso?: string): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatDateTime(iso?: string): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getGatewayLabel(gw?: string): string {
    if (!gw) return "—";
    const map: Record<string, string> = {
        razorpay: "Razorpay",
        payu: "PayU",
        wallet: "Wallet",
    };
    return map[gw.toLowerCase()] ?? gw;
}

export function InvoiceModal({ open, onClose, booking }: InvoiceModalProps) {
    const invoiceRef = useRef<HTMLDivElement>(null);

    // Lock body scroll when modal is open
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

    const handlePrint = () => {
        const printContents = invoiceRef.current?.innerHTML;
        if (!printContents) return;

        const printWindow = window.open("", "_blank", "width=900,height=700");
        if (!printWindow) return;

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Invoice - ${booking?.bookingId ?? ""}</title>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
              <script src="https://cdn.tailwindcss.com"></script>
              <script>
                tailwind.config = {
                  theme: {
                    extend: {
                      colors: {
                        primary: '#f95738',
                      }
                    }
                  }
                }
              </script>
              <style>
                body {
                  font-family: 'Inter', sans-serif;
                  background: white !important;
                  color: black !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                @page {
                  size: A4;
                  margin: 10mm 15mm;
                }
                @media print {
                  .no-print { display: none !important; }
                  body { padding: 0 !important; margin: 0 !important; }
                  #invoice-container { padding: 0 !important; width: 100% !important; max-width: 100% !important; }
                  /* Compress vertical spacing and fonts for printing */
                  .pb-8 { padding-bottom: 12px !important; }
                  .py-8 { padding-top: 12px !important; padding-bottom: 12px !important; }
                  .mb-8 { margin-bottom: 12px !important; }
                  .gap-8 { gap: 12px !important; }
                  .p-8, .md\\:p-10 { padding: 12px !important; }
                  .p-6 { padding: 12px !important; }
                  .rounded-2xl { border-radius: 12px !important; }
                  .rounded-3xl { border-radius: 16px !important; }
                  td, th { padding-top: 6px !important; padding-bottom: 6px !important; padding-left: 12px !important; padding-right: 12px !important; }
                  tr.bg-zinc-50.border-t-2 { border-top-width: 1px !important; }
                  .text-2xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
                  .text-xl { font-size: 1.125rem !important; line-height: 1.5rem !important; }
                  .text-lg { font-size: 1rem !important; line-height: 1.5rem !important; }
                  .text-base { font-size: 0.875rem !important; line-height: 1.25rem !important; }
                  .text-sm { font-size: 0.75rem !important; line-height: 1rem !important; }
                  .text-xs { font-size: 0.7rem !important; line-height: 0.9rem !important; }
                  .text-\\[10px\\] { font-size: 0.65rem !important; }
                }
              </style>
            </head>
            <body class="bg-white">
              <div id="invoice-container" class="max-w-3xl mx-auto p-6">
                ${printContents}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
        }, 800);
    };

    // Build pricing line items
    const pricingLines: { label: string; amount: number }[] = [];
    if (booking?.baseAmount) pricingLines.push({ label: "Base Amount", amount: booking.baseAmount });
    if (booking?.cleaningFee) pricingLines.push({ label: "Cleaning Fee", amount: booking.cleaningFee });
    if (booking?.extraGuestCharges) pricingLines.push({ label: "Extra Guest Charges", amount: booking.extraGuestCharges });
    if (booking?.securityDeposit) pricingLines.push({ label: "Security Deposit (Refundable)", amount: booking.securityDeposit });
    if (booking?.platformFee) pricingLines.push({ label: "Platform Fee", amount: booking.platformFee });
    if (booking?.taxAmount) pricingLines.push({ label: "Taxes & GST", amount: booking.taxAmount });
    if (booking?.discountAmount) pricingLines.push({ label: "Discount", amount: -booking.discountAmount });

    const subtotal =
        (booking?.baseAmount ?? 0) +
        (booking?.cleaningFee ?? 0) +
        (booking?.extraGuestCharges ?? 0) +
        (booking?.securityDeposit ?? 0) +
        (booking?.platformFee ?? 0) +
        (booking?.taxAmount ?? 0) -
        (booking?.discountAmount ?? 0);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header bar (not printed) */}
                        <div className="no-print sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white/95 backdrop-blur">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-black text-zinc-900 text-lg leading-tight">Tax Invoice</h2>
                                    <p className="text-xs text-zinc-400 font-medium">{booking?.bookingId ?? ""}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl font-bold gap-2 h-9"
                                    onClick={handlePrint}
                                >
                                    <Printer className="w-4 h-4" />
                                    <span className="hidden sm:inline">Print / PDF</span>
                                </Button>
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
                        </div>

                        {/* Invoice content (printed) */}
                        <div className="w-full overflow-x-auto">
                            <div ref={invoiceRef} id="invoice-print-area" className="p-8 md:p-10 bg-white min-w-[760px]">
                                {/* Brand header */}
                                <div className="flex items-start justify-between gap-6 pb-8 border-b-2 border-zinc-900">
                                    <div className="flex items-center gap-3">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/30">
                                            T
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">{BRAND.name}</h1>
                                            <p className="text-xs text-zinc-500 font-medium">{BRAND.tagline}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="inline-block px-3 py-1 rounded-lg bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest mb-2">
                                            Invoice
                                        </div>
                                        <p className="text-xs text-zinc-400 font-medium">{BRAND.address}</p>
                                        <p className="text-xs text-zinc-400 font-medium">{BRAND.email} • {BRAND.phone}</p>
                                        <p className="text-xs text-zinc-400 font-medium">GSTIN: {BRAND.gstin}</p>
                                    </div>
                                </div>

                                {/* Invoice meta + billed-to */}
                                <div className="grid grid-cols-2 gap-8 py-8">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Billed To</p>
                                    <p className="font-bold text-zinc-900 text-base">{booking?.guestName || "Guest"}</p>
                                    {booking?.guestEmail && (
                                        <p className="text-sm text-zinc-500 font-medium">{booking.guestEmail}</p>
                                    )}
                                    {booking?.guestPhone && (
                                        <p className="text-sm text-zinc-500 font-medium">{booking.guestPhone}</p>
                                    )}
                                    {booking?.specialRequests && (
                                        <p className="text-xs text-zinc-400 font-medium mt-2 italic">
                                            Note: {booking.specialRequests}
                                        </p>
                                    )}
                                </div>
                                <div className="md:text-right">
                                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                                        <span className="text-zinc-400 font-medium">Invoice No.</span>
                                        <span className="text-zinc-900 font-bold text-right">{booking?.bookingId || "—"}</span>
                                        <span className="text-zinc-400 font-medium">Invoice Date</span>
                                        <span className="text-zinc-900 font-bold text-right">{formatDate(booking?.createdAt)}</span>
                                        <span className="text-zinc-400 font-medium">Payment Date</span>
                                        <span className="text-zinc-900 font-bold text-right">{formatDate(booking?.paidAt)}</span>
                                        <span className="text-zinc-400 font-medium">Payment Method</span>
                                        <span className="text-zinc-900 font-bold text-right">{getGatewayLabel(booking?.paymentGateway)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Booking details */}
                            <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-6 mb-8">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Booking Details</p>
                                <div className="grid grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Item</p>
                                        <p className="text-sm font-bold text-zinc-900 leading-tight mt-1">{booking?.itemName || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Type</p>
                                        <p className="text-sm font-bold text-zinc-900 capitalize mt-1">{booking?.itemType || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                                            {booking?.itemType === "activity" ? "Activity Date" : "Check-In"}
                                        </p>
                                        <p className="text-sm font-bold text-zinc-900 mt-1">
                                            {booking?.itemType === "activity"
                                                ? formatDate(booking?.activityDate)
                                                : formatDate(booking?.checkIn)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                                            {booking?.itemType === "activity" ? "Time" : "Check-Out"}
                                        </p>
                                        <p className="text-sm font-bold text-zinc-900 mt-1">
                                            {booking?.itemType === "activity"
                                                ? booking?.startTime || "—"
                                                : formatDate(booking?.checkOut)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Guests</p>
                                        <p className="text-sm font-bold text-zinc-900 mt-1">
                                            {booking?.guests || 1}
                                            {booking?.adults !== undefined && booking?.children !== undefined && (
                                                <span className="text-zinc-400 font-medium"> ({booking.adults}A, {booking.children}C)</span>
                                            )}
                                        </p>
                                    </div>
                                    {booking?.itemType !== "activity" && (
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Nights</p>
                                            <p className="text-sm font-bold text-zinc-900 mt-1">{booking?.nights || 1}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Location</p>
                                        <p className="text-sm font-bold text-zinc-900 mt-1">{booking?.location || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Status</p>
                                        <p className="text-sm font-bold text-emerald-600 mt-1">{booking?.status || "Confirmed"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing table */}
                            <div className="mb-8">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Payment Summary</p>
                                <div className="rounded-2xl border border-zinc-200 overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-zinc-900 text-white">
                                                <th className="text-left px-5 py-3 font-bold text-xs uppercase tracking-wide">Description</th>
                                                <th className="text-right px-5 py-3 font-bold text-xs uppercase tracking-wide">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pricingLines.length > 0 ? (
                                                pricingLines.map((line, i) => (
                                                    <tr key={i} className="border-b border-zinc-100 last:border-0">
                                                        <td className="px-5 py-3 text-zinc-700 font-medium">{line.label}</td>
                                                        <td className={`px-5 py-3 text-right font-bold ${line.amount < 0 ? "text-emerald-600" : "text-zinc-900"}`}>
                                                            {formatCurrency(line.amount)}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr className="border-b border-zinc-100 last:border-0">
                                                    <td className="px-5 py-3 text-zinc-700 font-medium">Total Amount</td>
                                                    <td className="px-5 py-3 text-right font-bold text-zinc-900">
                                                        {formatCurrency(booking?.totalAmount)}
                                                    </td>
                                                </tr>
                                            )}
                                            {booking?.couponCode && (
                                                <tr className="bg-emerald-50">
                                                    <td className="px-5 py-3 text-emerald-700 font-bold">
                                                        Coupon Applied: <span className="uppercase">{booking.couponCode}</span>
                                                    </td>
                                                    <td className="px-5 py-3 text-right text-emerald-600 font-bold">
                                                        -{formatCurrency(booking.discountAmount)}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-zinc-50 border-t-2 border-zinc-900">
                                                <td className="px-5 py-4 font-black text-zinc-900 text-base">Total Paid</td>
                                                <td className="px-5 py-4 text-right font-black text-zinc-900 text-xl">
                                                    {formatCurrency(booking?.totalAmount)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Payment info */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="rounded-2xl border border-zinc-100 p-5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Payment Information</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400 font-medium">Gateway</span>
                                            <span className="text-zinc-900 font-bold">{getGatewayLabel(booking?.paymentGateway)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400 font-medium">Status</span>
                                            <span className="text-emerald-600 font-bold uppercase">{booking?.paymentStatus || "Paid"}</span>
                                        </div>
                                        {booking?.gatewayPaymentId && (
                                            <div className="flex justify-between gap-4">
                                                <span className="text-zinc-400 font-medium shrink-0">Transaction ID</span>
                                                <span className="text-zinc-900 font-bold text-right break-all">{booking.gatewayPaymentId}</span>
                                            </div>
                                        )}
                                        {booking?.gatewayOrderId && (
                                            <div className="flex justify-between gap-4">
                                                <span className="text-zinc-400 font-medium shrink-0">Order ID</span>
                                                <span className="text-zinc-900 font-bold text-right break-all">{booking.gatewayOrderId}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-zinc-100 p-5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Booking Reference</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400 font-medium">Booking ID</span>
                                            <span className="text-zinc-900 font-bold">{booking?.bookingId || "—"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400 font-medium">Booked On</span>
                                            <span className="text-zinc-900 font-bold">{formatDateTime(booking?.createdAt)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400 font-medium">Type</span>
                                            <span className="text-zinc-900 font-bold capitalize">{booking?.itemType || "—"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-6 border-t border-zinc-100 text-center">
                                <p className="text-sm font-bold text-zinc-900 mb-1">Thank you for choosing {BRAND.name}!</p>
                                <p className="text-xs text-zinc-400 font-medium mb-4">
                                    This is a computer-generated invoice and does not require a physical signature.
                                </p>
                                <div className="flex items-center justify-center gap-4 text-xs text-zinc-400 font-medium">
                                    <span>{BRAND.website}</span>
                                    <span>•</span>
                                    <span>{BRAND.email}</span>
                                    <span>•</span>
                                    <span>{BRAND.phone}</span>
                                </div>
                                <p className="text-[10px] text-zinc-300 font-medium mt-4">
                                    For cancellations & refunds, please refer to our cancellation policy. GST applicable as per government regulations.
                                </p>
                            </div>
                        </div>
                    </div>

                        {/* Footer actions (not printed) */}
                        <div className="no-print sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100 bg-white">
                            <Button variant="outline" className="rounded-xl font-bold gap-2 h-10" onClick={onClose}>
                                Close
                            </Button>
                            <Button className="rounded-xl font-bold gap-2 h-10" onClick={handlePrint}>
                                <Download className="w-4 h-4" />
                                Download PDF
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
