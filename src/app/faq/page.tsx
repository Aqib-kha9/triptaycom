"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ChevronDown, 
  HelpCircle, 
  CreditCard, 
  UserCheck, 
  Calendar,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

const FAQ_CATEGORIES = [
  { id: "booking", label: "Booking", icon: <Calendar className="w-5 h-5" /> },
  { id: "refund", label: "Refunds", icon: <CreditCard className="w-5 h-5" /> },
  { id: "vendor", label: "Vendors", icon: <UserCheck className="w-5 h-5" /> },
];

const FAQS = {
  booking: [
    { q: "How do I book a stay or activity?", a: "To book, simply search for your desired stay or activity, select your dates/slots, and follow the checkout process. You'll receive a confirmation email immediately." },
    { q: "Can I modify my booking dates?", a: "Yes, you can request a date change through your profile dashboard, subject to the vendor's availability and cancellation policy." },
    { q: "Are there any additional fees?", a: "The price you see includes the base price, GST, and platform fees. There are no hidden charges." },
  ],
  refund: [
    { q: "What is the cancellation policy?", a: "Cancellation policies vary by property and activity. You can find the specific policy on the listing page before you book." },
    { q: "How long does a refund take?", a: "Refunds are usually processed within 5-7 business days back to your original payment method." },
    { q: "Can I get a full refund for last-minute cancellations?", a: "Full refunds are typically only available if you cancel within the vendor's specified 'free cancellation' window." },
  ],
  vendor: [
    { q: "How do I become a vendor?", a: "Click on 'Become a Host' in the navbar, complete your profile, and follow the KYC verification process to start listing." },
    { q: "How are vendor payouts handled?", a: "Payouts are currently handled manually by the admin team. You can track your earnings in your vendor dashboard." },
    { q: "Can I list both stays and activities?", a: "Yes! Triptay supports dual-listing. You can manage both homestays and experiences from a single vendor account." },
  ],
};

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState("booking");
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4">
          
          {/* Header & Search */}
          <div className="max-w-3xl mx-auto text-center space-y-8 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
              <HelpCircle className="w-4 h-4" />
              Help Center
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tight">How can we help?</h1>
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search for questions..." 
                className="h-16 pl-14 pr-8 rounded-[24px] border-zinc-100 bg-white shadow-xl shadow-zinc-200/50 focus:ring-primary transition-all text-lg font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Sidebar Categories */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="sticky top-32 space-y-2">
                {FAQ_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveTab(cat.id);
                      setOpenItems([]);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold",
                      activeTab === cat.id 
                        ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" 
                        : "text-zinc-500 hover:bg-white hover:text-zinc-900"
                    )}
                  >
                    <div className={cn(
                      "transition-colors",
                      activeTab === cat.id ? "text-primary" : "text-zinc-400"
                    )}>
                      {cat.icon}
                    </div>
                    {cat.label}
                  </button>
                ))}
              </div>
            </aside>

            {/* Accordion Content */}
            <div className="flex-grow max-w-3xl">
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {(FAQS[activeTab as keyof typeof FAQS] || []).map((faq, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "bg-white border border-zinc-100 rounded-[32px] overflow-hidden transition-all duration-300",
                          openItems.includes(i) ? "shadow-xl shadow-zinc-200/50 border-primary/20" : "hover:border-zinc-200"
                        )}
                      >
                        <button 
                          onClick={() => toggleItem(i)}
                          className="w-full flex items-center justify-between px-8 py-7 text-left group"
                        >
                          <span className="text-lg font-bold text-zinc-900 group-hover:text-primary transition-colors">{faq.q}</span>
                          <div className={cn(
                            "w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center transition-all",
                            openItems.includes(i) ? "bg-primary text-white rotate-180" : "group-hover:bg-zinc-100"
                          )}>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </button>
                        <AnimatePresence>
                          {openItems.includes(i) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-8 pb-8 text-zinc-500 font-medium leading-relaxed">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Help CTA */}
              <div className="mt-20 p-10 rounded-[40px] bg-primary text-white text-center space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-110" />
                <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold">Still have questions?</h3>
                <p className="text-white/80 font-medium">If you couldn't find what you were looking for, our support team is just a message away.</p>
                <Link href="/contact" className="inline-block">
                  <Button className="rounded-full px-10 h-14 bg-white text-primary hover:bg-zinc-50 font-bold transition-all shadow-2xl">
                    Get in touch
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
