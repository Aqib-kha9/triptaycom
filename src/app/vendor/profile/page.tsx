"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Edit3, 
  Camera,
  Globe,
  Briefcase,
  CreditCard,
  DollarSign
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { VendorSidebar } from "@/components/navigation/vendor-sidebar";

export default function VendorProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <VendorSidebar />

            <div className="flex-grow space-y-6">
              
              {/* Header */}
              <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
                <div className="h-20 bg-zinc-900" />
                <div className="px-6 pb-6">
                  <div className="relative -mt-10 mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-end gap-4">
                      <div className="relative group shrink-0">
                        <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <button className="absolute bottom-1 right-1 w-6 h-6 rounded-lg bg-zinc-900 text-white flex items-center justify-center shadow-sm"><Camera className="w-3 h-3" /></button>
                      </div>
                      <div className="pb-1 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h1 className="text-xl font-bold text-zinc-900">Elite Stays India</h1>
                          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                            <ShieldCheck className="w-2.5 h-2.5" /> Verified
                          </div>
                        </div>
                        <p className="text-zinc-500 font-bold text-[10px] flex items-center gap-1.5 uppercase tracking-widest">
                          <MapPin className="w-3.5 h-3.5" /> Rishikesh, Uttarakhand
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => setIsEditing(!isEditing)} className="rounded-xl h-10 px-5 text-xs font-bold gap-2">
                      <Edit3 className="w-3.5 h-3.5" />
                      {isEditing ? "Save" : "Edit Profile"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Briefcase className="w-4.5 h-4.5" /></div>
                      <h2 className="text-lg font-bold text-zinc-900">Business Info</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Legal Name</label>
                        <Input disabled={!isEditing} defaultValue="Elite Stays Pvt Ltd" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">GST Number</label>
                        <Input disabled={!isEditing} defaultValue="22AAAAA0000A1Z5" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Website</label>
                        <Input disabled={!isEditing} defaultValue="elitestays.in" className="h-10 rounded-xl border-zinc-100 bg-zinc-50 text-xs" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><DollarSign className="w-4.5 h-4.5" /></div>
                      <h2 className="text-lg font-bold text-zinc-900">Payout Details</h2>
                    </div>
                    <div className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-zinc-400 shadow-sm"><CreditCard className="w-5 h-5" /></div>
                        <div>
                          <h4 className="font-bold text-zinc-900 text-sm">HDFC Bank • • • • 8812</h4>
                          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Primary Account</p>
                        </div>
                      </div>
                      <Button variant="outline" className="rounded-lg h-8 text-[10px] font-bold border-zinc-200">Change</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-zinc-100 p-6 sm:p-8 space-y-6">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Support</h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400"><Mail className="w-4 h-4" /></div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Email</p>
                          <p className="text-xs font-bold text-zinc-900">support@elitestays.in</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400"><Phone className="w-4 h-4" /></div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Phone</p>
                          <p className="text-xs font-bold text-zinc-900">+91 99887 76655</p>
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
    </div>
  );
}
