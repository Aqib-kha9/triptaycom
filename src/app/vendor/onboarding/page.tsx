"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Upload,
  Building2,
  CreditCard,
  FileText,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Clock,
  Loader2,
  X,
  Image as ImageIcon
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 1, title: "Business", icon: <Building2 className="w-4 h-4" /> },
  { id: 2, title: "KYC", icon: <UserCheck className="w-4 h-4" /> },
  { id: 3, title: "Payout", icon: <CreditCard className="w-4 h-4" /> },
  { id: 4, title: "Review", icon: <CheckCircle2 className="w-4 h-4" /> },
];

type DocType = "aadharFront" | "aadharBack" | "panCardImage";

interface UploadState {
  file: File | null;
  uploading: boolean;
  url: string;
  preview: string;
}

export default function VendorOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [panNumber, setPanNumber] = useState("");
  const [gstin, setGstin] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankIFSC, setBankIFSC] = useState("");

  // Document upload state
  const [aadharFront, setAadharFront] = useState<UploadState>({ file: null, uploading: false, url: "", preview: "" });
  const [aadharBack, setAadharBack] = useState<UploadState>({ file: null, uploading: false, url: "", preview: "" });
  const [panCard, setPanCard] = useState<UploadState>({ file: null, uploading: false, url: "", preview: "" });

  // Hidden file input refs
  const aadharFrontRef = useRef<HTMLInputElement>(null);
  const aadharBackRef = useRef<HTMLInputElement>(null);
  const panCardRef = useRef<HTMLInputElement>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // On mount, check if the user already submitted KYC (kycStatus = Pending).
  // If so, auto-show the "Application Under Review" screen instead of the empty form.
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    const checkExistingKyc = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setPageLoading(false); return; }
        const res = await fetch(`${apiUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { setPageLoading(false); return; }
        const payload = await res.json();
        const kyc = payload?.data?.user?.kycStatus;
        if (kyc === "Pending" || kyc === "Approved") {
          setIsSubmitted(true);
        }
      } catch {
        // ignore — show the form
      } finally {
        setPageLoading(false);
      }
    };
    checkExistingKyc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadFileToCloudinary = async (file: File, docType: DocType): Promise<string> => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", docType);

    const res = await fetch(`${apiUrl}/upload/document`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || `Upload failed for ${docType}`);
    }

    const data = await res.json();
    return data.data.url;
  };

  const handleFileSelect = async (docType: DocType, file: File) => {
    const preview = URL.createObjectURL(file);
    const setter = docType === "aadharFront" ? setAadharFront : docType === "aadharBack" ? setAadharBack : setPanCard;

    setter(prev => ({ ...prev, file, uploading: true, preview }));

    try {
      const url = await uploadFileToCloudinary(file, docType);
      setter(prev => ({ ...prev, uploading: false, url }));
    } catch (err: any) {
      setError(err.message || `Failed to upload ${docType}. Please try again.`);
      setter(prev => ({ ...prev, uploading: false }));
    }
  };

  const removeFile = (docType: DocType) => {
    const setter = docType === "aadharFront" ? setAadharFront : docType === "aadharBack" ? setAadharBack : setPanCard;
    setter({ file: null, uploading: false, url: "", preview: "" });

    // Reset file input
    const ref = docType === "aadharFront" ? aadharFrontRef : docType === "aadharBack" ? aadharBackRef : panCardRef;
    if (ref.current) ref.current.value = "";
  };

  const nextStep = () => {
    if (step === 1 && (!panNumber.trim() || !gstin.trim())) {
      setError("Please fill in both PAN and GST Number.");
      return;
    }
    if (step === 3 && (!bankAccount.trim() || !bankIFSC.trim())) {
      setError("Please fill in Account Number and IFSC Code.");
      return;
    }
    setError("");
    setStep(prev => Math.min(prev + 1, STEPS.length));
  };

  const prevStep = () => {
    setError("");
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${apiUrl}/auth/kyc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          panNumber: panNumber.trim(),
          gstin: gstin.trim(),
          bankAccount: bankAccount.trim(),
          bankIFSC: bankIFSC.trim(),
          aadharFront: aadharFront.url || undefined,
          aadharBack: aadharBack.url || undefined,
          panCardImage: panCard.url || undefined,
        })
      });

      const data = await res.json();

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        setError(data.message || "KYC submission failed. Please try again.");
      }
    } catch (err) {
      console.error("KYC submission error:", err);
      setError("Could not connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderUploadRow = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    state: UploadState,
    docType: DocType,
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    const isUploaded = !!state.url;

    return (
      <div
        className={cn(
          "p-4 rounded-xl border transition-all",
          isUploaded
            ? "border-emerald-200 bg-emerald-50/50"
            : state.uploading
              ? "border-primary/30 bg-primary/5"
              : "border-zinc-100 bg-zinc-50 hover:border-primary/20"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center shadow-sm",
              isUploaded ? "bg-emerald-500 text-white" : "bg-white text-primary"
            )}>
              {isUploaded ? <CheckCircle2 className="w-5 h-5" /> : icon}
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 text-xs">{title}</h4>
              <p className="text-[9px] text-zinc-400 font-medium">
                {isUploaded ? "✓ Uploaded" : state.uploading ? "Uploading..." : subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {state.preview && (
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-zinc-100">
                <img src={state.preview} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}

            {isUploaded ? (
              <Button
                variant="ghost"
                size="icon"
                className="text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                onClick={() => removeFile(docType)}
              >
                <X className="w-4 h-4" />
              </Button>
            ) : state.uploading ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-primary"
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(docType, file);
          }}
        />
      </div>
    );
  };

  const docCount = [aadharFront.url, aadharBack.url, panCard.url].filter(Boolean).length;

  // Show a full-page spinner while checking existing KYC status on mount
  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcfcfc] flex-col gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-bold text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">

          {/* Header */}
          <div className="text-center mb-10 space-y-2">
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Vendor Onboarding</h1>
            <p className="text-xs text-zinc-500 font-medium italic">Complete your KYC profile to start hosting.</p>
          </div>

          {/* Stepper */}
          <div className="relative mb-12 px-4">
            <div className="relative z-10 flex justify-between items-center max-w-sm mx-auto">
              {STEPS.map((s) => (
                <div key={s.id} className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all border",
                    step === s.id ? "bg-primary border-primary text-white scale-110" :
                      step > s.id ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-zinc-100 text-zinc-400"
                  )}>
                    {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.icon}
                  </div>
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-widest",
                    step >= s.id ? "text-zinc-900" : "text-zinc-400"
                  )}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
            <div className="p-6 sm:p-10">
              <AnimatePresence mode="wait">

                {isSubmitted ? (
                  <motion.div
                    key="submitted"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6 py-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-lg shadow-amber-100/50">
                      <Clock className="w-8 h-8 animate-pulse" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-xl font-bold text-zinc-900">Application Under Review</h2>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed max-w-md mx-auto">
                        Thank you for your application! Your KYC documents (PAN, GST, Bank details) have been successfully submitted and are currently pending admin review.
                      </p>
                    </div>

                    <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 text-left max-w-md mx-auto space-y-3.5">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                        <div>
                          <p className="text-xs font-bold text-zinc-700">Verification in Progress</p>
                          <p className="text-[10px] text-zinc-400 font-medium">Admin is reviewing your PAN and GST information.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                        <div>
                          <p className="text-xs font-bold text-zinc-700">Timeline: 24 - 48 Hours</p>
                          <p className="text-[10px] text-zinc-400 font-medium">Approval usually takes between 1 to 2 business days.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                        <div>
                          <p className="text-xs font-bold text-zinc-700">Notification Alert</p>
                          <p className="text-[10px] text-zinc-400 font-medium">You will get notified once your KYC is approved. Only then you can access your vendor dashboard.</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
                      <Link href="/dashboard">
                        <Button className="rounded-xl h-11 px-8 text-xs font-bold gap-2">
                          Go to Guest Dashboard
                        </Button>
                      </Link>
                      <Link href="/">
                        <Button variant="outline" className="rounded-xl h-11 px-8 text-xs font-bold border-zinc-200 hover:bg-zinc-50 text-zinc-600">
                          Back to Home
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {step === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                        <div className="space-y-1">
                          <h2 className="text-lg font-bold text-zinc-900">Business Details</h2>
                          <p className="text-xs text-zinc-500 font-medium italic">PAN and GST registration info.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">PAN Number</label>
                            <Input
                              placeholder="ABCDE1234F"
                              value={panNumber}
                              onChange={(e) => { setPanNumber(e.target.value); setError(""); }}
                              className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs uppercase"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">GST Number</label>
                            <Input
                              placeholder="22AAAAA0000A1Z5"
                              value={gstin}
                              onChange={(e) => { setGstin(e.target.value); setError(""); }}
                              className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs uppercase"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                        <div className="space-y-1">
                          <h2 className="text-lg font-bold text-zinc-900">KYC Verification</h2>
                          <p className="text-xs text-zinc-500 font-medium italic">Upload identity verification documents.</p>
                        </div>
                        <div className="space-y-4">
                          {renderUploadRow(
                            <FileText className="w-5 h-5" />,
                            "Aadhar Card (Front)",
                            "Upload scanned front image",
                            aadharFront,
                            "aadharFront",
                            aadharFrontRef
                          )}
                          {renderUploadRow(
                            <FileText className="w-5 h-5" />,
                            "Aadhar Card (Back)",
                            "Upload scanned back image",
                            aadharBack,
                            "aadharBack",
                            aadharBackRef
                          )}
                          {renderUploadRow(
                            <ShieldCheck className="w-5 h-5" />,
                            "PAN Card",
                            "Upload scanned PAN card image",
                            panCard,
                            "panCardImage",
                            panCardRef
                          )}

                          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 text-amber-900 text-[10px] font-medium leading-relaxed italic">
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                            Document upload is optional but recommended for faster verification. Your PAN and GST numbers entered in Step 1 will be verified by the admin team.
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                        <div className="space-y-1">
                          <h2 className="text-lg font-bold text-zinc-900">Payout Settings</h2>
                          <p className="text-xs text-zinc-500 font-medium italic">Where should we send your earnings?</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Account Number</label>
                            <Input
                              placeholder="0000 0000 0000 0000"
                              value={bankAccount}
                              onChange={(e) => { setBankAccount(e.target.value); setError(""); }}
                              className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">IFSC Code</label>
                            <Input
                              placeholder="HDFC0001234"
                              value={bankIFSC}
                              onChange={(e) => { setBankIFSC(e.target.value); setError(""); }}
                              className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs uppercase"
                            />
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 text-amber-900 text-[10px] font-medium leading-relaxed italic">
                          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                          Please ensure bank details are correct to avoid payment delays.
                        </div>
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 py-6">
                        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20"><ShieldCheck className="w-8 h-8" /></div>
                        <div className="space-y-2">
                          <h2 className="text-xl font-bold text-zinc-900">Ready to Submit?</h2>
                          <p className="text-xs text-zinc-500 font-medium italic max-w-xs mx-auto">Your KYC documents will be reviewed by the admin team. This typically takes 24 hours.</p>
                        </div>
                        <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 text-left max-w-sm mx-auto space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-400 font-medium">PAN</span>
                            <span className="text-zinc-900 font-bold">{panNumber || "—"}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-400 font-medium">GST</span>
                            <span className="text-zinc-900 font-bold">{gstin || "—"}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-400 font-medium">Account</span>
                            <span className="text-zinc-900 font-bold">{bankAccount || "—"}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-400 font-medium">IFSC</span>
                            <span className="text-zinc-900 font-bold">{bankIFSC || "—"}</span>
                          </div>
                          <div className="border-t border-zinc-100 pt-2 mt-2 flex justify-between text-xs">
                            <span className="text-zinc-400 font-medium">Documents</span>
                            <span className={cn("font-bold", docCount > 0 ? "text-emerald-600" : "text-zinc-400")}>
                              {docCount > 0 ? `${docCount}/3 uploaded` : "None uploaded"}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

              </AnimatePresence>

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold text-center">
                  {error}
                </div>
              )}

              {!isSubmitted && (
                <div className="mt-12 pt-6 border-t border-zinc-50 flex items-center justify-between">
                  <Button onClick={prevStep} variant="ghost" disabled={step === 1 || isSubmitting} className="rounded-xl h-10 px-6 text-xs font-bold text-zinc-400 gap-1.5"><ChevronLeft className="w-3.5 h-3.5" /> Back</Button>
                  <Button
                    onClick={step < 4 ? nextStep : handleSubmit}
                    className={cn(
                      "rounded-xl h-10 px-8 text-xs font-bold gap-1.5",
                      step === 4 && "bg-emerald-600 hover:bg-emerald-700"
                    )}
                    disabled={isSubmitting || aadharFront.uploading || aadharBack.uploading || panCard.uploading}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Submitting...
                      </>
                    ) : step === 4 ? (
                      "Submit KYC"
                    ) : (
                      "Continue"
                    )}
                    {!isSubmitting && <ChevronRight className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-8">Having trouble? <Link href="/support" className="text-primary hover:underline">Support</Link></p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
