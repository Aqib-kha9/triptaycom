"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Star,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { VendorSidebar } from "@/components/navigation/vendor-sidebar";

const MY_STAYS = [
  {
    id: "LST-001",
    title: "Mountain Whisper Villa",
    type: "Stay",
    price: "₹4,500",
    status: "Active",
    views: "1.2k",
    bookings: 12,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "LST-003",
    title: "The Creek Villa",
    type: "Stay",
    price: "₹6,200",
    status: "Under Review",
    views: "120",
    bookings: 0,
    rating: 0,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=300"
  }
];

export default function VendorStaysPage() {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = MY_STAYS.filter(l => l.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <VendorSidebar />

            <div className="flex-grow space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">My Homestays</h1>
                  <p className="text-xs text-zinc-500 font-medium italic">Manage your property portfolio.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <Input 
                      placeholder="Search stays..." 
                      className="h-10 pl-9 rounded-xl border-zinc-100 bg-white w-48 text-xs"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Link href="/vendor/listings/new">
                    <Button className="rounded-xl px-5 h-10 text-xs font-bold gap-2">
                      <Plus className="w-3.5 h-3.5" />
                      Add Stay
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden divide-y divide-zinc-50">
                {filtered.map((listing) => (
                  <div key={listing.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-zinc-50/50 transition-colors group">
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500">
                        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                            listing.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                          )}>
                            {listing.status}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-zinc-900 leading-tight">{listing.title}</h3>
                        <p className="text-xs font-black text-zinc-400 italic">{listing.price}<span className="text-[10px] not-italic ml-1">/night</span></p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:gap-10">
                      <div className="flex gap-6">
                        <div className="text-center">
                          <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Views</p>
                          <p className="font-bold text-zinc-900 text-xs">{listing.views}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Bookings</p>
                          <p className="font-bold text-zinc-900 text-xs">{listing.bookings}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link href={`/vendor/listings/edit/${listing.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/5">
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setDeleteId(listing.id)}
                          className="h-8 w-8 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteId(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-sm bg-white rounded-2xl p-8 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto"><AlertCircle className="w-6 h-6" /></div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-zinc-900">Delete Stay?</h3>
                <p className="text-xs text-zinc-500 font-medium">This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1 h-11 rounded-xl text-xs font-bold">Cancel</Button>
                <Button onClick={() => setDeleteId(null)} className="flex-1 h-11 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600">Delete</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
