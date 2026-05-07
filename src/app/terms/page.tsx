"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, AlertCircle, Scale, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const TERMS = [
  { id: "account", title: "User Accounts", content: "To use certain features of the platform, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account." },
  { id: "booking", title: "Booking and Payments", content: "All bookings are subject to availability and the vendor's approval. Prices are inclusive of applicable taxes and fees. Payments are processed securely through our authorized payment gateways." },
  { id: "conduct", title: "User Conduct", content: "You agree not to use the platform for any unlawful purpose or in any way that interrupts, damages, or impairs the service. Respectful interaction with vendors and other guests is mandatory." },
  { id: "liability", title: "Limitation of Liability", content: "Triptay is a marketplace that connects guests with vendors. We are not responsible for the actual properties or activities, but we facilitate dispute resolution and safety standards." },
];

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <div className="max-w-4xl mx-auto mb-20 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-8">
              <FileText className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tight">Terms of Service</h1>
            <p className="text-lg text-zinc-500 font-medium italic">Last updated: May 07, 2024</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-zinc-50 rounded-[40px] p-12 md:p-20 border border-zinc-100 shadow-2xl shadow-zinc-200/50">
              <div className="space-y-16">
                
                <section className="p-8 rounded-3xl bg-amber-50 border border-amber-100 flex gap-6">
                  <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
                  <p className="text-amber-900 font-medium leading-relaxed">
                    Please read these terms carefully before using Triptay. By accessing or using any part of the platform, you agree to become bound by these terms and conditions.
                  </p>
                </section>

                <section className="space-y-6">
                  <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-3">
                    <div className="w-2 h-8 bg-primary rounded-full" />
                    Agreement to Terms
                  </h2>
                  <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                    These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity, and Triptay, concerning your access to and use of our website and services.
                  </p>
                </section>

                {TERMS.map((term) => (
                  <section key={term.id} className="space-y-6 pt-12 border-t border-zinc-200/60">
                    <h2 className="text-2xl font-bold text-zinc-900">{term.title}</h2>
                    <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                      {term.content}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {["Standard practice for " + term.title.toLowerCase(), "Compliance requirement", "User responsibility"].slice(0, 2).map((item, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white border border-zinc-100 flex items-center gap-3 text-sm font-bold text-zinc-500">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}

                <section className="pt-12 border-t border-zinc-200/60">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 rounded-[32px] bg-zinc-900 text-white">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Scale className="w-6 h-6 text-primary" />
                        Governing Law
                      </h3>
                      <p className="text-zinc-400 font-medium">
                        These terms are governed by the laws of India.
                      </p>
                    </div>
                    <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white hover:text-zinc-900 px-8 font-bold">
                      Print Terms
                    </Button>
                  </div>
                </section>

              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
