"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, ChevronRight, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const BOOKINGS = [
  {
    id: "TRP-1024",
    title: "The Creek Villa",
    location: "Manali, HP",
    date: "15 May - 20 May, 2024",
    guests: "2 Adults, 1 Child",
    status: "Confirmed",
    amount: "₹26,250",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=300",
    type: "Stay"
  },
  {
    id: "TRP-1025",
    title: "River Rafting Trip",
    location: "Rishikesh, UK",
    date: "22 May 2024",
    guests: "2 Persons",
    status: "Completed",
    amount: "₹2,520",
    image: "https://images.unsplash.com/photo-1530866495547-084969f682ba?auto=format&fit=crop&q=80&w=300",
    type: "Activity"
  },
  {
    id: "TRP-1012",
    title: "Skyline Apartment",
    location: "Gurgaon, HR",
    date: "10 April - 12 April, 2024",
    guests: "1 Adult",
    status: "Cancelled",
    amount: "₹12,400",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=300",
    type: "Stay"
  }
];

export default function BookingsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold text-zinc-900 mb-2">My Bookings</h1>
              <p className="text-zinc-500 font-medium">Keep track of your stays and adventures.</p>
            </div>
            
            <div className="flex items-center bg-white border border-zinc-100 p-1 rounded-2xl shadow-sm">
              {["All", "Stays", "Activities"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                    activeFilter === filter ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-zinc-400 hover:text-zinc-900"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {BOOKINGS.filter(b => activeFilter === "All" || b.type === activeFilter.replace('s', '')).map((booking) => (
              <div 
                key={booking.id} 
                className="bg-white rounded-[32px] border border-zinc-100 p-6 shadow-xl shadow-zinc-200/40 hover:shadow-2xl hover:shadow-zinc-200/60 transition-all group overflow-hidden relative"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Image Section */}
                  <div className="lg:w-72 h-48 lg:h-auto rounded-2xl overflow-hidden relative flex-shrink-0">
                    <img src={booking.image} alt={booking.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase text-zinc-900 shadow-xl">
                      {booking.type}
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{booking.id}</span>
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            booking.status === "Confirmed" ? "bg-emerald-500" : booking.status === "Completed" ? "bg-blue-500" : "bg-red-500"
                          )} />
                          <span className={cn(
                            "text-xs font-bold",
                            booking.status === "Confirmed" ? "text-emerald-600" : booking.status === "Completed" ? "text-blue-600" : "text-red-600"
                          )}>
                            {booking.status}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 group-hover:text-primary transition-colors">{booking.title}</h2>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-zinc-900">{booking.amount}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Total Paid</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                      <div className="flex items-center gap-3 text-zinc-600">
                        <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400"><MapPin className="w-4 h-4" /></div>
                        <span className="text-sm font-medium">{booking.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-600">
                        <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400"><Calendar className="w-4 h-4" /></div>
                        <span className="text-sm font-medium">{booking.date}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-zinc-50">
                      <div className="flex items-center gap-4">
                        <Button className="rounded-full px-8 font-bold shadow-lg shadow-primary/10">View Voucher</Button>
                        <Button variant="ghost" className="rounded-full px-8 font-bold text-zinc-500 hover:text-zinc-900">Need Help?</Button>
                      </div>
                      
                      {booking.status === "Confirmed" && (
                        <button className="text-red-500 text-sm font-bold hover:underline">Cancel Booking</button>
                      )}
                      {booking.status === "Completed" && (
                        <button className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                          Rate Experience <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
