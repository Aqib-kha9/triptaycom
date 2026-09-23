"use client";

/**
 * ─────────────────────────────────────────────────────────────
 * Triptay — Auth Modal (popup login / OTP / register)
 * ─────────────────────────────────────────────────────────────
 *
 * A compact, on-page alternative to the full-screen /login route.
 *
 * Use this whenever a signed-out user performs a gated action from a
 * public page (Book, Reserve, Wishlist, Message Host). Keeping the user
 * on the page removes the jarring full-page navigation, and — critically
 * — avoids the proxy.ts server redirect that discarded their booking
 * intent (selected dates + guest count).
 *
 * On success the modal does NOT navigate. It calls `onSuccess(user)` and
 * lets the caller decide where to continue (e.g. push to /checkout/...).
 *
 * The full-page /login route still exists for direct visits and for the
 * proxy redirect fallback.
 */

import { Button } from "@/components/ui/button";
import { setCachedUser } from "@/lib/session";
import { Input } from "@/components/ui/input";
import {
    Mail,
    ArrowRight,
    Smartphone,
    RefreshCcw,
    Pencil,
    Loader2,
    User,
    CheckCircle2,
    X,
    Store,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRole } from "@/components/role-provider";
import { setSession } from "@/lib/session";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface AuthModalProps {
    open: boolean;
    onClose: () => void;
    /** Fired once the user is fully authenticated. Parent decides the next route. */
    onSuccess: (user: any) => void;
    title?: string;
    subtitle?: string;
}

/* ── Compact 6-digit OTP input ── */
const CompactOtpInput = ({
    otp,
    setOtp,
    error,
    setError,
}: {
    otp: string;
    setOtp: (val: string) => void;
    error: string;
    setError: (val: string) => void;
}) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value.replace(/[^0-9]/g, "");

        if (!val) {
            const newOtp = otp.split("");
            newOtp[index] = "";
            setOtp(newOtp.join(""));
            return;
        }

        if (val.length > 1) {
            const pastedData = val.slice(0, 6);
            setOtp(pastedData);
            if (error) setError("");
            inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
            return;
        }

        const newOtp = otp.split("");
        newOtp[index] = val;
        setOtp(newOtp.join(""));
        if (error) setError("");
        if (index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            } else {
                const newOtp = otp.split("");
                newOtp[index] = "";
                setOtp(newOtp.join(""));
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
        if (paste) {
            setOtp(paste);
            if (error) setError("");
            inputRefs.current[Math.min(paste.length - 1, 5)]?.focus();
        }
    };

    return (
        <div className="flex justify-between gap-2 w-full">
            {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    autoFocus={index === 0}
                    value={otp[index] || ""}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className={cn(
                        "w-full aspect-[3/4] max-w-[52px] text-center text-xl font-black rounded-xl border-2 transition-all outline-none",
                        error
                            ? "border-rose-300 focus:border-rose-500 bg-rose-50"
                            : "border-zinc-200 bg-zinc-50 focus:bg-white focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10",
                    )}
                />
            ))}
        </div>
    );
};

export function AuthModal({ open, onClose, onSuccess, title, subtitle }: AuthModalProps) {
    const [step, setStep] = useState<"identifier" | "otp" | "register">("identifier");
    const [authMethod, setAuthMethod] = useState<"mobile" | "email">("mobile");
    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [receivedOtp, setReceivedOtp] = useState("");
    const [fullName, setFullName] = useState("");
    const [selectedRole, setSelectedRole] = useState<"guest" | "vendor">("guest");
    const [agreedToTerms, setAgreedToTerms] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(45);
    const [canResend, setCanResend] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const { setIsLoggedIn, setRole, setHasVendorAccess, setActualRole, setKycStatus } = useRole();

    /* ── Countdown ── */
    const stopCountdown = useCallback(() => {
        if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
        }
    }, []);

    const startCountdown = useCallback(() => {
        stopCountdown();
        setCountdown(45);
        setCanResend(false);
        countdownRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    stopCountdown();
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [stopCountdown]);

    useEffect(() => stopCountdown, [stopCountdown]);

    /* ── Reset whenever the modal is (re)opened ── */
    useEffect(() => {
        if (!open) return;
        setStep("identifier");
        setError("");
        setOtp("");
        setPassword("");
        setReceivedOtp("");
        setIsAdmin(false);
        stopCountdown();
    }, [open, stopCountdown]);

    /* ── Escape to close + body scroll lock ── */
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = previousOverflow;
        };
    }, [open, onClose]);

    /* ── Identifier validation helpers ── */
    const isEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const isMobile = (val: string) => /^\d{10}$/.test(val.replace(/[\s\-\+\(\)]/g, ""));
    const isMobileTooLong = (val: string) => /^\d{11,}$/.test(val.replace(/[\s\-\+\(\)]/g, ""));

    const getIdentifierStatus = () => {
        const val = identifier.trim();
        if (!val) return "empty";
        if (isEmail(val)) return "valid-email";
        if (isMobileTooLong(val)) return "mobile-too-long";
        if (isMobile(val)) return "valid-mobile";
        if (val.includes("@")) return "invalid-email";
        const stripped = val.replace(/[\s\-\+\(\)]/g, "");
        if (/^\d+$/.test(stripped) || val.startsWith("+")) return "invalid-mobile";
        return "invalid";
    };

    /* ── Applies role state then hands control back to the caller ── */
    const finishAuth = (user: any) => {
        const resolvedRole: string = (user?.role || "guest").toLowerCase();
        const isVendorOrDual = resolvedRole === "vendor" || resolvedRole === "dual mode";
        const isApproved = user?.kycStatus === "Approved";

        if (isVendorOrDual && isApproved) {
            setRole("vendor");
            setHasVendorAccess(true);
            setActualRole(resolvedRole);
            setKycStatus(user?.kycStatus);
            setCachedUser({ role: "vendor", hasVendorAccess: true, actualRole: resolvedRole, kycStatus: user?.kycStatus });
        } else {
            setRole("guest");
            setHasVendorAccess(false);
            setActualRole(isVendorOrDual ? resolvedRole : "guest");
            setKycStatus(user?.kycStatus);
            setCachedUser({ role: "guest", hasVendorAccess: false, actualRole: isVendorOrDual ? resolvedRole : "guest", kycStatus: user?.kycStatus });
        }
        setIsLoggedIn(true);
        
        if (isVendorOrDual && !isApproved) {
            window.location.href = "/vendor/onboarding";
        } else {
            onSuccess(user);
        }
    };

    const handleResendOtp = async () => {
        if (!canResend || resendLoading) return;
        const cleanId = identifier.trim();
        if (!cleanId) return;
        setResendLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_BASE}/auth/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: cleanId }),
            });
            const data = await res.json();
            if (res.ok) {
                setReceivedOtp(data.devCode || "");
                setOtp("");
                startCountdown();
            } else {
                setError(data.message || "Failed to resend code.");
            }
        } catch {
            setError("Could not connect to the authentication server.");
        } finally {
            setResendLoading(false);
        }
    };

    const handleContinue = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanId = identifier.trim();
        if (!cleanId) return;

        if (authMethod === "mobile") {
            if (cleanId.length !== 10) {
                setError("Mobile number must be exactly 10 digits.");
                return;
            }
        } else {
            if (!isEmail(cleanId)) {
                setError("Please enter a valid email address.");
                return;
            }
        }

        setLoading(true);
        setError("");
        setReceivedOtp("");

        const isSystemAdmin = cleanId.toLowerCase() === "admin@triptay.com";
        setIsAdmin(isSystemAdmin);
        if (isSystemAdmin) {
            setLoading(false);
            setStep("otp");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/auth/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: cleanId }),
            });
            const data = await res.json();
            if (res.ok) {
                setReceivedOtp(data.devCode || "");
                setStep("otp");
                startCountdown();
            } else {
                setError(data.message || "Failed to generate verification code.");
            }
        } catch {
            setError("Could not connect to the authentication server.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanId = identifier.trim();

        if (isAdmin) {
            if (!password) {
                setError("Please enter the admin password.");
                return;
            }
        } else if (otp.length < 6) {
            setError("Please enter the 6-digit verification code.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            if (isAdmin) {
                const res = await fetch(`${API_BASE}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: cleanId, password }),
                });
                const data = await res.json();
                if (res.ok) {
                    setSession(data.token);
                    finishAuth(data.data?.user);
                } else {
                    setError(data.message || "Invalid Admin password.");
                }
            } else {
                const res = await fetch(`${API_BASE}/auth/verify-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ identifier: cleanId, code: otp }),
                });
                const data = await res.json();
                if (res.ok) {
                    if (data.action === "register") {
                        // Brand-new user → collect name + role before creating the account.
                        setStep("register");
                    } else {
                        setSession(data.token);
                        finishAuth(data.data?.user);
                    }
                } else {
                    setError(data.message || "Incorrect verification code.");
                }
            }
        } catch {
            setError("Server connection failed during verification.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim()) return;

        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_BASE}/auth/register-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: fullName,
                    identifier: identifier.trim(),
                    role: selectedRole,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setSession(data.token);
                finishAuth(data.data?.user);
            } else {
                setError(data.message || "Registration failed.");
            }
        } catch {
            setError("Registration server connection failed.");
        } finally {
            setLoading(false);
        }
    };

    const heading =
        step === "otp"
            ? isAdmin
                ? "Enter admin password"
                : "Verify your code"
            : step === "register"
                ? "Complete your profile"
                : title || "Login or register";

    const subheading =
        step === "otp"
            ? isAdmin
                ? "Superadmin identity verification"
                : "Enter the 6-digit code we sent you"
            : step === "register"
                ? "Just your name and we are done"
                : subtitle || "Continue with your email or mobile number";

    const identifierStatus = getIdentifierStatus();

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
                    />

                    {/* Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 320, damping: 30 }}
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-zinc-100 p-6 sm:p-8"
                    >
                        {/* Close */}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute right-4 top-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6 pr-8">
                            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/25">
                                <span className="text-lg font-black italic">T</span>
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-xl font-black text-zinc-900 tracking-tight leading-tight truncate">
                                    {heading}
                                </h2>
                                <p className="text-zinc-500 font-medium text-xs truncate">{subheading}</p>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {/* ── Step 1: identifier ── */}
                            {step === "identifier" && (
                                <motion.form
                                    key="identifier"
                                    initial={{ opacity: 0, x: 12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -12 }}
                                    onSubmit={handleContinue}
                                    className="space-y-5"
                                >
                                    {/* Toggle */}
                                    <div className="flex p-1 bg-zinc-100 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => { setAuthMethod("mobile"); setError(""); setIdentifier(""); }}
                                            className={cn("flex-1 py-2 text-xs font-bold rounded-lg transition-all", authMethod === "mobile" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
                                        >
                                            Mobile Number
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setAuthMethod("email"); setError(""); setIdentifier(""); }}
                                            className={cn("flex-1 py-2 text-xs font-bold rounded-lg transition-all", authMethod === "email" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
                                        >
                                            Email Address
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
                                            {authMethod === "mobile" ? "Mobile Number" : "Email Address"}
                                        </label>
                                        <div className="relative flex items-center">
                                            {authMethod === "mobile" ? (
                                                <div className="absolute left-4 z-10 flex items-center gap-1.5 text-zinc-900 font-bold text-sm select-none border-r border-zinc-200 pr-3">
                                                    🇮🇳 +91
                                                </div>
                                            ) : (
                                                <div className="absolute left-4 z-10 flex items-center text-zinc-400">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                            )}
                                            <Input
                                                required
                                                autoFocus
                                                type={authMethod === "mobile" ? "tel" : "email"}
                                                placeholder={authMethod === "mobile" ? "98765 43210" : "name@example.com"}
                                                value={identifier}
                                                onChange={(e) => {
                                                    let val = e.target.value;
                                                    if (authMethod === "mobile") {
                                                        val = val.replace(/[^\d]/g, "").slice(0, 10);
                                                    }
                                                    setIdentifier(val);
                                                    if (error) setError("");
                                                }}
                                                className={cn(
                                                    "h-14 pr-12 rounded-2xl bg-white transition-all text-sm font-semibold border outline-none w-full",
                                                    authMethod === "mobile" ? "pl-24" : "pl-12",
                                                    error ? "border-rose-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10" : "border-zinc-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                                )}
                                            />
                                            {(authMethod === "email" ? isEmail(identifier) : identifier.length === 10) && (
                                                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                                            )}
                                        </div>
                                        {error && <p className="text-xs font-bold text-rose-500 px-1">{error}</p>}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-13 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 gap-2 group"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Continue
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-[11px] text-center text-zinc-400 font-medium leading-relaxed">
                                        New here? We create your account automatically after verification.
                                    </p>
                                </motion.form>
                            )}

                            {/* ── Step 2: OTP / admin password ── */}
                            {step === "otp" && (
                                <motion.form
                                    key="otp"
                                    initial={{ opacity: 0, x: 12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -12 }}
                                    onSubmit={handleOtpVerify}
                                    className="space-y-5"
                                >
                                    <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-100 rounded-2xl">
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                                Sent to
                                            </span>
                                            <span className="text-sm font-semibold text-zinc-700 truncate">{identifier}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setStep("identifier");
                                                setError("");
                                            }}
                                            className="p-2 text-zinc-400 hover:text-primary transition-colors bg-white rounded-xl border border-zinc-200 shadow-sm shrink-0 ml-2"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {isAdmin ? (
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
                                                Admin Password
                                            </label>
                                            <Input
                                                required
                                                autoFocus
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    if (error) setError("");
                                                }}
                                                className="h-14 px-4 rounded-2xl border border-zinc-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold outline-none"
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
                                                6-digit Code
                                            </label>
                                            <CompactOtpInput otp={otp} setOtp={setOtp} error={error} setError={setError} />
                                        </div>
                                    )}

                                    {/* Dev OTP helper — only rendered when the backend dev-supplies a code */}
                                    {!isAdmin && receivedOtp && (
                                        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-2xl">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
                                                Dev OTP
                                            </span>
                                            <code className="text-base font-black text-amber-800 tracking-[0.3em] ml-auto">
                                                {receivedOtp}
                                            </code>
                                        </div>
                                    )}

                                    {error && <p className="text-xs font-bold text-rose-500 px-1">{error}</p>}

                                    {!isAdmin && (
                                        <div className="flex justify-center">
                                            {canResend ? (
                                                <button
                                                    type="button"
                                                    onClick={handleResendOtp}
                                                    disabled={resendLoading}
                                                    className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-2 transition-colors"
                                                >
                                                    {resendLoading ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <RefreshCcw className="w-3.5 h-3.5" />
                                                    )}
                                                    {resendLoading ? "Resending..." : "Resend Code"}
                                                </button>
                                            ) : (
                                                <span className="text-xs font-bold text-zinc-400 flex items-center gap-2">
                                                    <RefreshCcw className="w-3.5 h-3.5" />
                                                    Resend in 0:{countdown.toString().padStart(2, "0")}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 gap-2 group"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Verify & Continue
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </motion.form>
                            )}

                            {/* ── Step 3: new-user profile ── */}
                            {step === "register" && (
                                <motion.form
                                    key="register"
                                    initial={{ opacity: 0, x: 12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -12 }}
                                    onSubmit={handleRegisterSubmit}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                            <Input
                                                required
                                                autoFocus
                                                type="text"
                                                placeholder="John Doe"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="h-14 pl-12 rounded-2xl border border-zinc-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">
                                            Account Type
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedRole("guest")}
                                                className={cn(
                                                    "flex flex-col items-center gap-1.5 p-3.5 rounded-2xl border text-center transition-all cursor-pointer",
                                                    selectedRole === "guest"
                                                        ? "border-primary bg-primary/5 text-primary"
                                                        : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500",
                                                )}
                                            >
                                                <User className="w-5 h-5" />
                                                <span className="text-xs font-bold">Traveler</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedRole("vendor")}
                                                className={cn(
                                                    "flex flex-col items-center gap-1.5 p-3.5 rounded-2xl border text-center transition-all cursor-pointer",
                                                    selectedRole === "vendor"
                                                        ? "border-primary bg-primary/5 text-primary"
                                                        : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500",
                                                )}
                                            >
                                                <Store className="w-5 h-5" />
                                                <span className="text-xs font-bold">Host</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <input
                                            type="checkbox"
                                            checked={agreedToTerms}
                                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                                            className="mt-0.5 w-3.5 h-3.5 rounded border-zinc-300 text-primary focus:ring-primary cursor-pointer"
                                        />
                                        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                                            I agree to Triptay's{" "}
                                            <Link href="/terms" className="text-primary font-bold hover:underline">
                                                Terms
                                            </Link>{" "}
                                            &{" "}
                                            <Link href="/privacy" className="text-primary font-bold hover:underline">
                                                Privacy Policy
                                            </Link>
                                            .
                                        </p>
                                    </div>

                                    {error && <p className="text-xs font-bold text-rose-500 px-1">{error}</p>}

                                    <Button
                                        type="submit"
                                        disabled={loading || !agreedToTerms}
                                        className="w-full py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 gap-2 group"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Create Account & Continue
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default AuthModal;
