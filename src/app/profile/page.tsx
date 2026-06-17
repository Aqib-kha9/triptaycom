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
  Check
} from "lucide-react";
import { useState } from "react";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000);
  };

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
                <Button onClick={handleSave} className="rounded-xl px-6 h-10 font-bold gap-1.5 text-xs">
                  {isSaving ? <span className="animate-pulse">Saving...</span> : <><Check className="w-3.5 h-3.5" /> Save Changes</>}
                </Button>
              </div>

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
                        <Input defaultValue="Aqib Ahmed" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Email Address</label>
                        <Input defaultValue="aqib@example.com" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Phone Number</label>
                        <Input defaultValue="+91 98765 43210" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Gender</label>
                        <Input defaultValue="Male" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Bio</label>
                      <Textarea defaultValue="Passionate traveler and adventure seeker. Love exploring hidden gems in India." className="min-h-[100px] rounded-xl border-zinc-100 bg-zinc-50 text-xs p-4 focus:outline-none" />
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
                        <Input type="password" placeholder="••••••••" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">New Password</label>
                          <Input type="password" placeholder="••••••••" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Confirm New Password</label>
                          <Input type="password" placeholder="••••••••" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                        </div>
                      </div>
                      <Button variant="outline" className="rounded-xl font-bold border-rose-100 text-rose-600 hover:bg-rose-50 h-9 px-4 text-xs mt-2">Update Password</Button>
                    </div>
                  </div>

                </div>

                {/* Right Column: Preferences & Image */}
                <div className="space-y-6">
                  
                  {/* Profile Image Section */}
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-100 text-center space-y-5">
                    <div className="relative inline-block">
                      <div className="w-24 h-24 rounded-2xl bg-zinc-100 overflow-hidden border-2 border-white shadow-sm">
                        <img src="https://i.pravatar.cc/300?u=aqib" alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900">Profile Picture</h3>
                      <p className="text-[10px] text-zinc-400 font-medium">PNG or JPG up to 5MB</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 rounded-xl font-bold text-xs h-9 border-zinc-100">Remove</Button>
                      <Button className="flex-1 rounded-xl font-bold text-xs h-9">Change</Button>
                    </div>
                  </div>

                  {/* Preferences Card */}
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-100 space-y-6">
                    <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2 uppercase tracking-widest">
                      <Globe className="w-4 h-4 text-indigo-500" />
                      Preferences
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                        <div className="flex items-center gap-2">
                          <Bell className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="text-xs font-bold text-zinc-600">Notifications</span>
                        </div>
                        <div className="w-8 h-4 bg-primary rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" /></div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="text-xs font-bold text-zinc-600">Two-Factor Auth</span>
                        </div>
                        <div className="w-8 h-4 bg-zinc-200 rounded-full relative"><div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full" /></div>
                      </div>
                      <div className="space-y-1.5 pt-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Currency</label>
                        <Input defaultValue="INR (₹)" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs font-bold" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Language</label>
                        <Input defaultValue="English (US)" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs font-bold" />
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
    </div>
  );
}
