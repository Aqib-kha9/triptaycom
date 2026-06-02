"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VendorSidebar } from "@/components/navigation/vendor-sidebar";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Clock,
  Edit3,
  Camera,
  Globe,
  Briefcase,
  CreditCard,
  DollarSign,
  FileText,
  Upload,
  X,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Save,
  User,
  BadgeCheck,
  ImagePlus,
} from "lucide-react";

// ──────────────────────── Types ────────────────────────

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  website: string;
  role: string;
  status: string;
  kycStatus: "Pending" | "Approved" | "Rejected" | "Not Submitted";
  balanceCoins: number;
  panNumber: string;
  gstin: string;
  bankAccount: string;
  bankIFSC: string;
  aadharFront: string;
  aadharBack: string;
  panCardImage: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  name: string;
  phone: string;
  website: string;
  gstin: string;
  panNumber: string;
  bankAccount: string;
  bankIFSC: string;
}

interface ToastState {
  message: string;
  type: "success" | "error";
}

// ──────────────────────── Helpers ────────────────────────

const API_BASE = "http://localhost:5000/api";

function getToken(): string | null {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

function maskBankAccount(account: string): string {
  if (!account || account.length < 4) return "••••";
  return "••••" + account.slice(-4);
}

const KYC_STATUS_CONFIG: Record<string, { icon: typeof ShieldCheck; color: string; bg: string; label: string }> = {
  Approved: { icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", label: "Verified" },
  Pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-100", label: "Pending Review" },
  Rejected: { icon: ShieldAlert, color: "text-rose-600", bg: "bg-rose-50 border-rose-100", label: "Rejected" },
  "Not Submitted": { icon: ShieldOff, color: "text-zinc-400", bg: "bg-zinc-50 border-zinc-100", label: "Not Submitted" },
};

// ──────────────────────── Component ────────────────────────

export default function VendorProfilePage() {
  // Core state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Edit modes per section
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    website: "",
    gstin: "",
    panNumber: "",
    bankAccount: "",
    bankIFSC: "",
  });

  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Avatar upload
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // KYC document preview
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  // ──────────────────────── Toast ────────────────────────

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ──────────────────────── Fetch Profile ────────────────────────

  const fetchProfile = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setError("Authentication required. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Session expired. Please log in again.");
        throw new Error("Failed to load profile.");
      }

      const json = await res.json();
      const user: UserProfile = json.data.user;

      setProfile(user);
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        website: user.website || "",
        gstin: user.gstin || "",
        panNumber: user.panNumber || "",
        bankAccount: user.bankAccount || "",
        bankIFSC: user.bankIFSC || "",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ──────────────────────── Save Section ────────────────────────

  const handleSave = async (section: string) => {
    const token = getToken();
    if (!token) return;

    setSaving(true);
    try {
      const body: Record<string, string> = {};

      switch (section) {
        case "personal":
          body.name = formData.name;
          body.phone = formData.phone;
          body.website = formData.website;
          break;
        case "business":
          body.gstin = formData.gstin;
          body.panNumber = formData.panNumber;
          break;
        case "payout":
          body.bankAccount = formData.bankAccount;
          body.bankIFSC = formData.bankIFSC;
          break;
      }

      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to save changes.");
      }

      const json = await res.json();
      setProfile(json.data.user);
      setEditingSection(null);
      showToast("success", `${section.charAt(0).toUpperCase() + section.slice(1)} details updated successfully.`);
    } catch (err: any) {
      showToast("error", err.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        website: profile.website || "",
        gstin: profile.gstin || "",
        panNumber: profile.panNumber || "",
        bankAccount: profile.bankAccount || "",
        bankIFSC: profile.bankIFSC || "",
      });
    }
    setEditingSection(null);
  };

  // ──────────────────────── Avatar Upload ────────────────────────

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = getToken();
    if (!token) return;

    setUploadingAvatar(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${API_BASE}/upload/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Upload failed.");
      }

      const json = await res.json();

      // Update profile via PATCH
      const updateRes = await fetch(`${API_BASE}/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: json.data.url }),
      });

      if (!updateRes.ok) throw new Error("Failed to save avatar URL.");

      const updateJson = await updateRes.json();
      setProfile(updateJson.data.user);
      showToast("success", "Profile photo updated.");
    } catch (err: any) {
      showToast("error", err.message || "Avatar upload failed.");
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  // ──────────────────────── Password Change ────────────────────────

  const handleChangePassword = async () => {
    const { current, new: newPw, confirm } = passwordData;

    if (!current || !newPw || !confirm) {
      setPasswordError("All fields are required.");
      return;
    }

    if (newPw.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPw !== confirm) {
      setPasswordError("New passwords do not match.");
      return;
    }

    const token = getToken();
    if (!token) return;

    setChangingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: current, newPassword: newPw }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Password change failed.");
      }

      setPasswordSuccess("Password changed successfully.");
      setPasswordData({ current: "", new: "", confirm: "" });
      setShowPasswords({ current: false, new: false, confirm: false });
      showToast("success", "Password updated.");
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  // ──────────────────────── Form Update ────────────────────────

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ──────────────────────── Loading Skeleton ────────────────────────

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
        <Navbar />
        <main className="flex-grow pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6">
              <VendorSidebar />
              <div className="flex-grow space-y-6">
                {/* Skeleton Banner */}
                <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden animate-pulse">
                  <div className="h-20 bg-zinc-200" />
                  <div className="px-6 pb-6">
                    <div className="flex items-end justify-between gap-4 -mt-10 mb-4">
                      <div className="flex items-end gap-4">
                        <div className="w-24 h-24 rounded-2xl bg-zinc-200 border-4 border-white" />
                        <div className="pb-1 space-y-2">
                          <div className="h-5 w-40 bg-zinc-200 rounded-lg" />
                          <div className="h-3 w-32 bg-zinc-100 rounded-lg" />
                        </div>
                      </div>
                      <div className="h-10 w-28 bg-zinc-200 rounded-xl" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2 space-y-6">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-white rounded-2xl border border-zinc-100 p-6 space-y-4 animate-pulse">
                        <div className="h-5 w-32 bg-zinc-200 rounded-lg" />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-10 bg-zinc-100 rounded-xl" />
                          <div className="h-10 bg-zinc-100 rounded-xl" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-6 animate-pulse">
                    <div className="bg-white rounded-2xl border border-zinc-100 p-6 space-y-4">
                      <div className="h-4 w-20 bg-zinc-200 rounded-lg" />
                      <div className="space-y-3">
                        {[1, 2].map((i) => (
                          <div key={i} className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-200" />
                            <div className="space-y-1.5">
                              <div className="h-2 w-10 bg-zinc-100 rounded" />
                              <div className="h-3 w-32 bg-zinc-200 rounded-lg" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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

  // ──────────────────────── Error State ────────────────────────

  if (error || !profile) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
        <Navbar />
        <main className="flex-grow pt-20 pb-12 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center text-center space-y-4 max-w-sm"
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
            <h2 className="text-lg font-bold text-zinc-900">Failed to load profile</h2>
            <p className="text-xs text-zinc-500">{error || "Something went wrong."}</p>
            <Button onClick={fetchProfile} className="rounded-xl h-10 px-5 text-xs font-bold gap-2">
              Try Again
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // ──────────────────────── Derived ────────────────────────

  const kycConfig = KYC_STATUS_CONFIG[profile.kycStatus] || KYC_STATUS_CONFIG["Not Submitted"];
  const KYCStatusIcon = kycConfig.icon;

  // ──────────────────────── Render ────────────────────────

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed top-24 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-xl text-xs font-bold shadow-lg border flex items-center gap-2",
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            )}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <VendorSidebar />

            <div className="flex-grow space-y-6">
              {/* ──────────────── Banner + Avatar ──────────────── */}
              <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900" />
                <div className="px-6 pb-6">
                  <div className="relative -mt-10 mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-end gap-4">
                      {/* Avatar */}
                      <div className="relative group shrink-0">
                        <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
                          {profile.avatar ? (
                            <img
                              src={profile.avatar}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                              <User className="w-10 h-10 text-zinc-300" />
                            </div>
                          )}
                        </div>
                        <label className="absolute bottom-1 right-1 w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center shadow-sm cursor-pointer hover:bg-zinc-700 transition-colors">
                          {uploadingAvatar ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Camera className="w-3.5 h-3.5" />
                          )}
                          <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarUpload}
                            disabled={uploadingAvatar}
                          />
                        </label>
                      </div>

                      {/* Name + Badge */}
                      <div className="pb-1 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h1 className="text-xl font-bold text-zinc-900">
                            {profile.name || "Vendor"}
                          </h1>
                          <div
                            className={cn(
                              "flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
                              kycConfig.bg,
                              kycConfig.color
                            )}
                          >
                            <KYCStatusIcon className="w-2.5 h-2.5" />
                            {kycConfig.label}
                          </div>
                        </div>
                        <p className="text-zinc-500 font-bold text-[10px] flex items-center gap-1.5 uppercase tracking-widest">
                          <MapPin className="w-3.5 h-3.5" /> India
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* ──────────── Left Column (2/3) ──────────── */}
                <div className="xl:col-span-2 space-y-6">
                  {/* ── Personal Info ── */}
                  <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <User className="w-4.5 h-4.5" />
                        </div>
                        <h2 className="text-lg font-bold text-zinc-900">Personal Information</h2>
                      </div>
                      {editingSection === "personal" ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="rounded-lg h-8 text-[10px] font-bold border-zinc-200"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleSave("personal")}
                            disabled={saving}
                            className="rounded-lg h-8 text-[10px] font-bold gap-1.5"
                          >
                            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                            Save
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setEditingSection("personal")}
                          variant="outline"
                          className="rounded-xl h-9 px-4 text-[10px] font-bold gap-1.5 border-zinc-200"
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                          Legal / Display Name
                        </label>
                        <Input
                          disabled={editingSection !== "personal"}
                          value={formData.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          className={cn(
                            "h-10 rounded-xl border-zinc-100 text-xs font-medium",
                            editingSection === "personal" ? "bg-white" : "bg-zinc-50"
                          )}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                          Email Address
                        </label>
                        <Input
                          disabled
                          value={profile.email}
                          className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs font-medium text-zinc-400"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                          Phone Number
                        </label>
                        <Input
                          disabled={editingSection !== "personal"}
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          placeholder="+91 00000 00000"
                          className={cn(
                            "h-10 rounded-xl border-zinc-100 text-xs font-medium",
                            editingSection === "personal" ? "bg-white" : "bg-zinc-50"
                          )}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                          Website
                        </label>
                        <Input
                          disabled={editingSection !== "personal"}
                          value={formData.website}
                          onChange={(e) => updateField("website", e.target.value)}
                          placeholder="yourbusiness.com"
                          className={cn(
                            "h-10 rounded-xl border-zinc-100 text-xs font-medium",
                            editingSection === "personal" ? "bg-white" : "bg-zinc-50"
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── Business Info ── */}
                  <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                          <Briefcase className="w-4.5 h-4.5" />
                        </div>
                        <h2 className="text-lg font-bold text-zinc-900">Business & Tax Info</h2>
                      </div>
                      {editingSection === "business" ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="rounded-lg h-8 text-[10px] font-bold border-zinc-200"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleSave("business")}
                            disabled={saving}
                            className="rounded-lg h-8 text-[10px] font-bold gap-1.5"
                          >
                            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                            Save
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setEditingSection("business")}
                          variant="outline"
                          className="rounded-xl h-9 px-4 text-[10px] font-bold gap-1.5 border-zinc-200"
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                          GST Number
                        </label>
                        <Input
                          disabled={editingSection !== "business"}
                          value={formData.gstin}
                          onChange={(e) => updateField("gstin", e.target.value)}
                          placeholder="22AAAAA0000A1Z5"
                          className={cn(
                            "h-10 rounded-xl border-zinc-100 text-xs font-medium uppercase",
                            editingSection === "business" ? "bg-white" : "bg-zinc-50"
                          )}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                          PAN Number
                        </label>
                        <Input
                          disabled={editingSection !== "business"}
                          value={formData.panNumber}
                          onChange={(e) => updateField("panNumber", e.target.value)}
                          placeholder="AAAAA0000A"
                          className={cn(
                            "h-10 rounded-xl border-zinc-100 text-xs font-medium uppercase",
                            editingSection === "business" ? "bg-white" : "bg-zinc-50"
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── Payout Details ── */}
                  <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <DollarSign className="w-4.5 h-4.5" />
                        </div>
                        <h2 className="text-lg font-bold text-zinc-900">Payout Details</h2>
                      </div>
                      {editingSection === "payout" ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="rounded-lg h-8 text-[10px] font-bold border-zinc-200"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleSave("payout")}
                            disabled={saving}
                            className="rounded-lg h-8 text-[10px] font-bold gap-1.5"
                          >
                            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                            Save
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setEditingSection("payout")}
                          variant="outline"
                          className="rounded-xl h-9 px-4 text-[10px] font-bold gap-1.5 border-zinc-200"
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit
                        </Button>
                      )}
                    </div>

                    {editingSection === "payout" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                            Bank Account Number
                          </label>
                          <Input
                            value={formData.bankAccount}
                            onChange={(e) => updateField("bankAccount", e.target.value)}
                            placeholder="Enter account number"
                            className="h-10 rounded-xl border-zinc-100 text-xs font-medium bg-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                            IFSC Code
                          </label>
                          <Input
                            value={formData.bankIFSC}
                            onChange={(e) => updateField("bankIFSC", e.target.value)}
                            placeholder="HDFC0001234"
                            className="h-10 rounded-xl border-zinc-100 text-xs font-medium uppercase bg-white"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-zinc-400 shadow-sm">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-zinc-900 text-sm">
                              {profile.bankAccount
                                ? `•••• ${maskBankAccount(profile.bankAccount)}`
                                : "No account added"}
                            </h4>
                            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                              {profile.bankIFSC
                                ? `IFSC: ${profile.bankIFSC}`
                                : "Add your bank details"}
                            </p>
                          </div>
                        </div>
                        {!profile.bankAccount && (
                          <Button
                            variant="outline"
                            onClick={() => setEditingSection("payout")}
                            className="rounded-lg h-8 text-[10px] font-bold border-zinc-200"
                          >
                            Add
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ── KYC Documents ── */}
                  <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <h2 className="text-lg font-bold text-zinc-900">KYC Documents</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* PAN Card */}
                      <div
                        className={cn(
                          "rounded-2xl border p-4 space-y-3 cursor-pointer hover:border-zinc-300 transition-colors",
                          profile.panCardImage ? "border-zinc-100" : "border-dashed border-zinc-200"
                        )}
                        onClick={() => profile.panCardImage && setPreviewDoc(profile.panCardImage)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">PAN Card</span>
                          {profile.panCardImage ? (
                            <BadgeCheck className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Upload className="w-4 h-4 text-zinc-300" />
                          )}
                        </div>
                        {profile.panCardImage ? (
                          <div className="aspect-[1.6/1] rounded-xl bg-zinc-100 overflow-hidden">
                            <img
                              src={profile.panCardImage}
                              alt="PAN Card"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[1.6/1] rounded-xl bg-zinc-50 flex items-center justify-center">
                            <ImagePlus className="w-6 h-6 text-zinc-300" />
                          </div>
                        )}
                      </div>

                      {/* Aadhar Front */}
                      <div
                        className={cn(
                          "rounded-2xl border p-4 space-y-3 cursor-pointer hover:border-zinc-300 transition-colors",
                          profile.aadharFront ? "border-zinc-100" : "border-dashed border-zinc-200"
                        )}
                        onClick={() => profile.aadharFront && setPreviewDoc(profile.aadharFront)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Aadhar Front</span>
                          {profile.aadharFront ? (
                            <BadgeCheck className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Upload className="w-4 h-4 text-zinc-300" />
                          )}
                        </div>
                        {profile.aadharFront ? (
                          <div className="aspect-[1.6/1] rounded-xl bg-zinc-100 overflow-hidden">
                            <img
                              src={profile.aadharFront}
                              alt="Aadhar Front"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[1.6/1] rounded-xl bg-zinc-50 flex items-center justify-center">
                            <ImagePlus className="w-6 h-6 text-zinc-300" />
                          </div>
                        )}
                      </div>

                      {/* Aadhar Back */}
                      <div
                        className={cn(
                          "rounded-2xl border p-4 space-y-3 cursor-pointer hover:border-zinc-300 transition-colors",
                          profile.aadharBack ? "border-zinc-100" : "border-dashed border-zinc-200"
                        )}
                        onClick={() => profile.aadharBack && setPreviewDoc(profile.aadharBack)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Aadhar Back</span>
                          {profile.aadharBack ? (
                            <BadgeCheck className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Upload className="w-4 h-4 text-zinc-300" />
                          )}
                        </div>
                        {profile.aadharBack ? (
                          <div className="aspect-[1.6/1] rounded-xl bg-zinc-100 overflow-hidden">
                            <img
                              src={profile.aadharBack}
                              alt="Aadhar Back"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[1.6/1] rounded-xl bg-zinc-50 flex items-center justify-center">
                            <ImagePlus className="w-6 h-6 text-zinc-300" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Password Change ── */}
                  <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600">
                          <Lock className="w-4.5 h-4.5" />
                        </div>
                        <h2 className="text-lg font-bold text-zinc-900">Password & Security</h2>
                      </div>
                      <Button
                        onClick={() => {
                          setShowPasswordSection(!showPasswordSection);
                          setPasswordError(null);
                          setPasswordSuccess(null);
                          setPasswordData({ current: "", new: "", confirm: "" });
                        }}
                        variant="outline"
                        className="rounded-xl h-9 px-4 text-[10px] font-bold gap-1.5 border-zinc-200"
                      >
                        <Lock className="w-3 h-3" />
                        {showPasswordSection ? "Cancel" : "Change Password"}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {showPasswordSection && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-4 pt-2">
                            {passwordError && (
                              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-100 text-[10px] font-bold text-rose-600">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                {passwordError}
                              </div>
                            )}
                            {passwordSuccess && (
                              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                {passwordSuccess}
                              </div>
                            )}

                            {(["current", "new", "confirm"] as const).map((field) => (
                              <div key={field} className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                                  {field === "current"
                                    ? "Current Password"
                                    : field === "new"
                                      ? "New Password"
                                      : "Confirm New Password"}
                                </label>
                                <div className="relative">
                                  <Input
                                    type={showPasswords[field] ? "text" : "password"}
                                    value={passwordData[field]}
                                    onChange={(e) =>
                                      setPasswordData((prev) => ({ ...prev, [field]: e.target.value }))
                                    }
                                    placeholder="••••••••"
                                    className="h-10 rounded-xl border-zinc-100 text-xs font-medium bg-white pr-10"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                                  >
                                    {showPasswords[field] ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            ))}

                            <Button
                              onClick={handleChangePassword}
                              disabled={changingPassword}
                              className="rounded-xl h-10 px-5 text-xs font-bold gap-2 w-full sm:w-auto"
                            >
                              {changingPassword ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Lock className="w-3.5 h-3.5" />
                              )}
                              Update Password
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* ──────────── Right Column (1/3) ──────────── */}
                <div className="space-y-6">
                  {/* Account Summary */}
                  <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8 space-y-5">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Account</h3>

                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <BadgeCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Role</p>
                          <p className="text-xs font-bold text-zinc-900">{profile.role}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            kycConfig.bg,
                            kycConfig.color
                          )}
                        >
                          <KYCStatusIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">KYC Status</p>
                          <p className="text-xs font-bold text-zinc-900">{kycConfig.label}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Wallet Balance</p>
                          <p className="text-xs font-bold text-zinc-900">
                            ₹{(profile.balanceCoins || 0).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Member Since</p>
                          <p className="text-xs font-bold text-zinc-900">
                            {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Support */}
                  <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8 space-y-5">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Support</h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Email</p>
                          <p className="text-xs font-bold text-zinc-900">{profile.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Phone</p>
                          <p className="text-xs font-bold text-zinc-900">{profile.phone || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ── Document Preview Modal ── */}
      <AnimatePresence>
        {previewDoc && (
          <div
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setPreviewDoc(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewDoc(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <img src={previewDoc} alt="Document Preview" className="w-full h-auto max-h-[80vh] object-contain" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
