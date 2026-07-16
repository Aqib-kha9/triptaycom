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
import { useRouter } from "next/navigation";
import { paymentsApi, bookingsApi, ApiError } from "@/lib/api-client";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const STEPS_RAZORPAY = [
  { id: 1, text: "Verifying your details...", icon: <ShieldCheck className="w-5 h-5" /> },
  { id: 2, text: "Securing connection to bank...", icon: <Lock className="w-5 h-5" /> },
  { id: 3, text: "Processing payment via Razorpay...", icon: <CreditCard className="w-5 h-5" /> },
  { id: 4, text: "Finalizing your reservation...", icon: <RefreshCcw className="w-5 h-5" /> },
];

const STEPS_PAYU = [
  { id: 1, text: "Verifying your details...", icon: <ShieldCheck className="w-5 h-5" /> },
  { id: 2, text: "Securing connection to bank...", icon: <Lock className="w-5 h-5" /> },
  { id: 3, text: "Redirecting to PayU payment page...", icon: <CreditCard className="w-5 h-5" /> },
  { id: 4, text: "Finalizing your reservation...", icon: <RefreshCcw className="w-5 h-5" /> },
];

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentProcessingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const router = useRouter();

  const STEPS = paymentMethod === "payu" ? STEPS_PAYU : STEPS_RAZORPAY;

  useEffect(() => {
    let cancelled = false;
    let rzpInstance: any = null;

    const run = async () => {
      const bookingId = sessionStorage.getItem("pendingBookingId");
      const method = sessionStorage.getItem("pendingBookingType") || "razorpay";
      setPaymentMethod(method);

      if (!bookingId) {
        router.replace("/explore");
        return;
      }

      try {
        // Step 1: verify details
        setCurrentStep(0);
        await new Promise((r) => setTimeout(r, 800));
        if (cancelled) return;

        // Step 2: secure connection
        setCurrentStep(1);
        await new Promise((r) => setTimeout(r, 800));
        if (cancelled) return;

        // Step 3: create order & process payment
        setCurrentStep(2);

        if (method === "payu") {
          // ── PayU Flow: create order, then redirect via form POST to PayU hosted checkout ──
          const orderRes = await paymentsApi.createPayuOrder(bookingId);
          const payuData = orderRes.data;
          if (!payuData) throw new Error("Could not create PayU payment order.");

          if (cancelled) return;

          // Create a hidden form and submit it to PayU's action URL
          // PayU uses HTTP POST with all the payment parameters
          const form = document.createElement("form");
          form.method = "POST";
          form.action = payuData.actionUrl;
          form.style.display = "none";

          // Add all PayU parameters as hidden inputs
          const fields: Record<string, string> = {
            key: payuData.key,
            txnid: payuData.txnid,
            amount: payuData.amount,
            productinfo: payuData.productinfo,
            firstname: payuData.firstname,
            email: payuData.email,
            phone: payuData.phone,
            surl: payuData.surl,
            furl: payuData.furl,
            hash: payuData.hash,
            udf1: payuData.udf1,
            udf2: payuData.udf2,
            udf3: payuData.udf3,
            udf4: payuData.udf4,
            udf5: payuData.udf5,
          };

          for (const [key, value] of Object.entries(fields)) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value;
            form.appendChild(input);
          }

          document.body.appendChild(form);
          // Store booking ID so the success/failure callback page can verify the payment
          sessionStorage.setItem("payuBookingId", bookingId);
          form.submit();
          // The page will redirect to PayU — no further code runs here
          return;
        }

        // ── Razorpay Flow (default) ──
        const orderRes = await paymentsApi.createRazorpayOrder(bookingId);
        const order = orderRes.data;
        if (!order) throw new Error("Could not create payment order.");

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded || !window.Razorpay) {
          throw new Error("Failed to load payment gateway. Please try again.");
        }
        if (cancelled) return;

        await new Promise<void>((resolve, reject) => {
          const options = {
            key: order.keyId,
            amount: order.amount,
            currency: order.currency,
            order_id: order.orderId,
            name: "Triptay",
            description: "Booking Payment",
            handler: async (response: any) => {
              try {
                setCurrentStep(3);
                await paymentsApi.verifyRazorpayPayment({
                  bookingId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                });
                sessionStorage.setItem("lastBookingId", bookingId);
                sessionStorage.removeItem("pendingBookingId");
                sessionStorage.removeItem("pendingBookingType");
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            modal: {
              ondismiss: () => {
                reject(new Error("Payment cancelled by user."));
              },
            },
            theme: { color: "#6366f1" },
          };
          const rzp = new window.Razorpay(options);
          rzpInstance = rzp;
          rzp.on("payment.failed", (resp: any) => {
            try {
              rzp.close();
            } catch (e) {
              console.error("Error closing Razorpay on payment.failed:", e);
            }
            reject(new Error(resp?.error?.description || "Payment failed."));
          });
          rzp.open();
        });

        if (cancelled) return;

        // Step 4: finalize
        setCurrentStep(4);
        await new Promise((r) => setTimeout(r, 1000));
        if (cancelled) return;

        router.replace(`/checkout/success?booking=${encodeURIComponent(bookingId)}`);
      } catch (err) {
        if (cancelled) return;
        if (rzpInstance) {
          try {
            rzpInstance.close();
          } catch (e) {
            console.error("Error closing Razorpay:", e);
          }
        }
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Payment failed. Please try again.";
        setError(message);
        // Release the blocked dates so other guests can book them (Airbnb/Amazon pattern)
        bookingsApi.expireBooking(bookingId, message).catch(() => { });
        sessionStorage.setItem("lastBookingId", bookingId);
        setTimeout(() => router.replace("/checkout/failure"), 2500);
      }
    };

    run();

    return () => {
      cancelled = true;
      if (rzpInstance) {
        try {
          rzpInstance.close();
        } catch (e) {
          console.error("Error closing Razorpay on cleanup:", e);
        }
      }
    };
  }, [router]);

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
            {error ? "Payment Failed" : "Processing Payment"}
          </h1>
          <p className="text-zinc-500 font-medium leading-relaxed">
            {error
              ? error
              : "Please do not refresh the page or click back. We are securing your booking."}
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
            <span className="text-[10px] font-black uppercase tracking-widest">
              {paymentMethod === "payu" ? "PayU" : "Razorpay"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
