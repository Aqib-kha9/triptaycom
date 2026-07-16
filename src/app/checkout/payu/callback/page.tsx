"use client";

import { motion } from "framer-motion";
import {
    ShieldCheck,
    Lock,
    CreditCard,
    RefreshCcw,
    CheckCircle2,
    Building2,
    AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { paymentsApi, bookingsApi, ApiError } from "@/lib/api-client";

const STEPS = [
    { id: 1, text: "Receiving PayU response...", icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 2, text: "Verifying payment signature...", icon: <Lock className="w-5 h-5" /> },
    { id: 3, text: "Confirming your booking...", icon: <CreditCard className="w-5 h-5" /> },
    { id: 4, text: "Finalizing your reservation...", icon: <RefreshCcw className="w-5 h-5" /> },
];

export default function PayuCallbackPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get("status") || "success";

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            const bookingId = sessionStorage.getItem("payuBookingId");

            if (!bookingId) {
                router.replace("/explore");
                return;
            }

            try {
                // Step 1: Read PayU response from cookie
                setCurrentStep(0);
                await new Promise((r) => setTimeout(r, 600));
                if (cancelled) return;

                // Get the PayU response from the cookie set by the route handler
                const cookies = document.cookie.split(";");
                const payuCookie = cookies.find((c) => c.trim().startsWith("payu_response="));
                if (!payuCookie) {
                    throw new Error("PayU response not found. Please contact support if you were charged.");
                }
                const payuResponse = JSON.parse(
                    decodeURIComponent(payuCookie.split("=").slice(1).join("="))
                );

                // Clear the cookie
                document.cookie = "payu_response=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                if (cancelled) return;

                // Step 2: Verify payment signature with backend
                setCurrentStep(1);
                await new Promise((r) => setTimeout(r, 600));
                if (cancelled) return;

                // Step 3: Call backend verify endpoint
                setCurrentStep(2);
                await paymentsApi.verifyPayuPayment({
                    bookingId,
                    ...payuResponse,
                });

                if (cancelled) return;

                // Step 4: Finalize
                setCurrentStep(3);
                sessionStorage.setItem("lastBookingId", bookingId);
                sessionStorage.removeItem("payuBookingId");
                sessionStorage.removeItem("pendingBookingId");
                sessionStorage.removeItem("pendingBookingType");
                await new Promise((r) => setTimeout(r, 800));
                if (cancelled) return;

                router.replace(`/checkout/success?booking=${encodeURIComponent(bookingId)}`);
            } catch (err) {
                if (cancelled) return;
                const message =
                    err instanceof ApiError
                        ? err.message
                        : err instanceof Error
                            ? err.message
                            : "Payment verification failed. Please contact support if you were charged.";
                setError(message);
                // Release the blocked dates so other guests can book them (Airbnb/Amazon pattern)
                bookingsApi.expireBooking(bookingId, message).catch(() => { });
                sessionStorage.setItem("lastBookingId", bookingId);
                sessionStorage.removeItem("payuBookingId");
                setTimeout(() => router.replace("/checkout/failure"), 3000);
            }
        };

        run();

        return () => {
            cancelled = true;
        };
    }, [router]);

    // If the PayU redirect indicated failure, show error immediately
    useEffect(() => {
        if (status === "failure") {
            setError("Payment was declined or cancelled. Please try again with a different payment method.");
            const bookingId = sessionStorage.getItem("payuBookingId");
            if (bookingId) {
                // Release the blocked dates so other guests can book them (Airbnb/Amazon pattern)
                bookingsApi.expireBooking(bookingId, "PayU payment declined or cancelled").catch(() => { });
                sessionStorage.setItem("lastBookingId", bookingId);
                sessionStorage.removeItem("payuBookingId");
            }
            setTimeout(() => router.replace("/checkout/failure"), 3000);
        }
    }, [status, router]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-sm w-full space-y-12">
                {/* Animated Loader */}
                <div className="relative w-32 h-32 mx-auto">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-zinc-100 border-t-primary rounded-full"
                    />
                    <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-xl">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                        >
                            {error ? (
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            ) : (
                                <CreditCard className="w-8 h-8 text-primary" />
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
                        {error ? "Payment Failed" : "Verifying Payment"}
                    </h1>
                    <p className="text-zinc-500 font-medium leading-relaxed">
                        {error
                            ? error
                            : "Please do not refresh the page. We are verifying your PayU payment and securing your booking."}
                    </p>
                </div>

                {/* Step-by-Step Progress */}
                {!error && (
                    <div className="space-y-4 text-left bg-zinc-50/50 p-8 rounded-[32px] border border-zinc-100 shadow-inner">
                        {STEPS.map((step, index) => (
                            <div
                                key={step.id}
                                className={cn(
                                    "flex items-center gap-4 transition-all duration-500",
                                    index === currentStep
                                        ? "text-zinc-900 opacity-100 translate-x-2"
                                        : index < currentStep
                                            ? "text-emerald-500 opacity-60"
                                            : "text-zinc-300 opacity-40"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                                        index === currentStep
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : index < currentStep
                                                ? "bg-emerald-100 text-emerald-600"
                                                : "bg-zinc-100 text-zinc-400"
                                    )}
                                >
                                    {index < currentStep ? <CheckCircle2 className="w-4 h-4" /> : step.icon}
                                </div>
                                <span className="text-sm font-bold">{step.text}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Security Badges */}
                <div className="pt-8 flex items-center justify-center gap-8 opacity-40">
                    <div className="flex items-center gap-2 grayscale">
                        <Building2 className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">PCI-DSS Secure</span>
                    </div>
                    <div className="flex items-center gap-2 grayscale">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">PayU</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
