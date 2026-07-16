"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Lock, 
  Camera, 
  ShieldCheck, 
  Globe, 
  Bell, 
  Check,
  AlertCircle
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { authApi } from "@/lib/api-client";

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Profile data state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isPhoneIdentifier, setIsPhoneIdentifier] = useState(false);
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        const response = await authApi.getProfile();
        if (response.data?.user) {
          const user = response.data.user;
          setName(user.name || "");
          
          const isPhoneAsEmail = user.email && !user.email.includes("@");
          setIsPhoneIdentifier(!!isPhoneAsEmail);
          
          if (isPhoneAsEmail) {
            setEmail("");
            setPhone(user.email || "");
          } else {
            setEmail(user.email || "");
            setPhone(user.phone || "");
          }
          
          setGender(user.gender || "");
          setBio(user.bio || "");
          setAvatar(user.avatar || "");
        }
      } catch (err: any) {
        console.error("Failed to load profile:", err);
        setError("Could not load profile. Please check if you are logged in.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await authApi.updateProfile({
        name,
        phone,
        gender,
        bio,
        avatar,
      });
      if (response.status === "success") {
        setSuccess("Profile settings updated successfully!");
        if (response.data?.user) {
          const user = response.data.user;
          setName(user.name || "");
          setPhone(user.phone || "");
          setGender(user.gender || "");
          setBio(user.bio || "");
          setAvatar(user.avatar || "");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update profile settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await authApi.uploadAvatar(file);
      if (res.data?.url) {
        setAvatar(res.data.url);
        setSuccess("Avatar uploaded successfully! Make sure to save changes.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload avatar image.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar("");
    setSuccess("Avatar removed. Make sure to save changes.");
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("Please fill out all password fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setIsUpdatingPassword(true);
    setError(null);
    setSuccess(null);
    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
      });
      setSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update password. Please check your current password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-20">
          <div className="text-zinc-500 font-medium animate-pulse">Loading profile settings...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-28 lg:pb-12">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col lg:flex-row gap-6">
            
            <DashboardSidebar />

            {/* Profile Content */}
            <div className="flex-grow space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">Profile Settings</h1>
                  <p className="text-xs text-zinc-500 font-medium italic">Update your personal information.</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="rounded-xl px-6 h-10 font-bold gap-1.5 text-xs">
                  {isSaving ? <span className="animate-pulse">Saving...</span> : <><Check className="w-3.5 h-3.5" /> Save Changes</>}
                </Button>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-center gap-2.5 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-2.5 text-emerald-700 text-xs">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Left Column: Forms */}
                <div className="xl:col-span-2 space-y-6">
                  
                  {/* Basic Info Card */}
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-100 space-y-6">
                    <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2 uppercase tracking-widest">
                      <User className="w-4 h-4 text-primary" />
                      Basic Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Full Name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Email Address</label>
                        <Input value={email || (isPhoneIdentifier ? "Not Provided" : "")} disabled className="h-10 rounded-xl border-zinc-100 bg-zinc-100 text-xs text-zinc-500 cursor-not-allowed" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Phone Number</label>
                        <Input 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                          disabled={isPhoneIdentifier} 
                          className={`h-10 rounded-xl border-zinc-100 text-xs ${
                            isPhoneIdentifier 
                              ? "bg-zinc-100 text-zinc-500 cursor-not-allowed" 
                              : "bg-zinc-50"
                          }`} 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Gender</label>
                        <Input value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Male / Female / Other" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Bio</label>
                      <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="min-h-[100px] rounded-xl border-zinc-100 bg-zinc-50 text-xs p-4 focus:outline-none" />
                    </div>
                  </div>

                  {/* Security Card */}
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-100 space-y-6">
                    <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2 uppercase tracking-widest">
                      <Lock className="w-4 h-4 text-rose-500" />
                      Security & Password
                    </h2>
                    
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Current Password</label>
                        <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">New Password</label>
                          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Confirm New Password</label>
                          <Input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="••••••••" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                        </div>
                      </div>
                      <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword} variant="outline" className="rounded-xl font-bold border-rose-100 text-rose-600 hover:bg-rose-50 h-9 px-4 text-xs mt-2">
                        {isUpdatingPassword ? "Updating..." : "Update Password"}
                      </Button>
                    </div>
                  </div>

                </div>

                {/* Right Column: Preferences & Image */}
                <div className="space-y-6">
                  
                  {/* Profile Image Section */}
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-100 text-center space-y-5">
                    <div className="relative inline-block">
                      <div className="w-24 h-24 rounded-2xl bg-zinc-100 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
                        {avatar ? (
                          <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-zinc-300 font-bold text-2xl uppercase">{name ? name.slice(0, 2) : "TR"}</span>
                        )}
                      </div>
                      <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform">
                        <Camera className="w-4 h-4" />
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleAvatarChange} 
                        className="hidden" 
                        accept="image/jpeg,image/png,image/webp" 
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900">Profile Picture</h3>
                      <p className="text-[10px] text-zinc-400 font-medium">PNG, JPG or WEBP up to 5MB</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleRemoveAvatar} variant="outline" className="flex-1 rounded-xl font-bold text-xs h-9 border-zinc-100">Remove</Button>
                      <Button onClick={() => fileInputRef.current?.click()} className="flex-1 rounded-xl font-bold text-xs h-9">Change</Button>
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
