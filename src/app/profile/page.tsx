"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Settings, 
  Heart, 
  ShoppingBag, 
  Bell, 
  CreditCard, 
  ChevronRight,
  LogOut,
  MapPin,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const SIDEBAR_ITEMS = [
  { icon: <User className="w-5 h-5" />, label: "Personal Info", active: true },
  { icon: <ShoppingBag className="w-5 h-5" />, label: "My Bookings" },
  { icon: <Heart className="w-5 h-5" />, label: "Wishlist" },
  { icon: <Bell className="w-5 h-5" />, label: "Notifications" },
  { icon: <CreditCard className="w-5 h-5" />, label: "Payments" },
  { icon: <Settings className="w-5 h-5" />, label: "Account Settings" },
];

const RECENT_BOOKINGS = [
  {
    id: "TRP-1024",
    title: "The Creek Villa",
    location: "Manali, HP",
    date: "15 May - 20 May",
    status: "Confirmed",
    amount: "₹26,250",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: "TRP-1025",
    title: "River Rafting Trip",
    location: "Rishikesh",
    date: "22 May 2024",
    status: "Completed",
    amount: "₹2,520",
    image: "https://images.unsplash.com/photo-1530866495547-084969f682ba?auto=format&fit=crop&q=80&w=100",
  }
];

export default function ProfilePage() {
  const [activeItem, setActiveItem] = useState("Personal Info");

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-3xl border border-zinc-100 p-8 shadow-xl shadow-zinc-200/50 space-y-8">
                {/* User Info */}
                <div className="flex flex-col items-center text-center pb-8 border-b border-zinc-50">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 relative ring-4 ring-zinc-50">
                    <User className="w-10 h-10" />
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border border-zinc-100 flex items-center justify-center text-zinc-900 shadow-sm">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900">Aryan Singh</h2>
                  <p className="text-zinc-500 text-sm">aryan.singh@example.com</p>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2">
                  {SIDEBAR_ITEMS.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setActiveItem(item.label)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all font-bold",
                        activeItem === item.label 
                          ? "bg-primary/10 text-primary shadow-sm" 
                          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                      </div>
                      {activeItem === item.label && <ChevronRight className="w-4 h-4" />}
                    </button>
                  ))}
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold mt-8">
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm">Log Out</span>
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow space-y-10">
              
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 mb-2">Welcome back, Aryan!</h1>
                <p className="text-zinc-500 font-medium">Manage your bookings, settings, and profile information.</p>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex items-center gap-5 group hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-zinc-900">12</p>
                    <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Total Bookings</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex items-center gap-5 group hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-zinc-900">24</p>
                    <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Saved Items</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex items-center gap-5 group hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-zinc-900">₹85K</p>
                    <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Total Spent</p>
                  </div>
                </div>
              </div>

              {/* Recent Bookings Section */}
              <div className="bg-white rounded-[40px] border border-zinc-100 p-8 shadow-xl shadow-zinc-200/40">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-zinc-900">Recent Bookings</h2>
                  <Button variant="ghost" className="text-primary font-bold">View All</Button>
                </div>

                <div className="space-y-4">
                  {RECENT_BOOKINGS.map((booking) => (
                    <div 
                      key={booking.id} 
                      className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-3xl border border-zinc-50 hover:bg-zinc-50/50 transition-all group"
                    >
                      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={booking.image} alt="Property" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      
                      <div className="flex-1 space-y-1 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase text-zinc-400">{booking.id}</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-300" />
                          <span className={cn(
                            "text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm",
                            booking.status === "Confirmed" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                          )}>
                            {booking.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900">{booking.title}</h3>
                        <div className="flex items-center justify-center sm:justify-start gap-3 text-zinc-500 text-xs font-medium">
                          <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {booking.location}</div>
                          <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {booking.date}</div>
                        </div>
                      </div>

                      <div className="text-center sm:text-right flex flex-col items-center sm:items-end gap-3">
                        <p className="text-xl font-bold text-zinc-900">{booking.amount}</p>
                        <Button size="sm" className="rounded-full px-6 font-bold">Details</Button>
                      </div>
                    </div>
                  ))}
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
