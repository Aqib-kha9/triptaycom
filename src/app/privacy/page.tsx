"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Shield, Lock, Eye, FileText, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "collection", title: "Information We Collect", content: "We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us." },
  { id: "usage", title: "How We Use Information", content: "We use the information we collect to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request (and send related information), and develop new features." },
  { id: "sharing", title: "Sharing of Information", content: "We may share the information we collect about you as described in this statement or at the time of collection or sharing, including through our services at your request or when you choose to share your experience." },
  { id: "security", title: "Security of Information", content: "We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction." },
];

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <div className="max-w-4xl mx-auto mb-20 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-8">
              <Shield className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tight">Privacy Policy</h1>
            <p className="text-lg text-zinc-500 font-medium italic">Last updated: May 07, 2024</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-zinc-50 rounded-[40px] p-12 md:p-20 border border-zinc-100 shadow-2xl shadow-zinc-200/50">
              <div className="space-y-16">
                
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-3">
                    <div className="w-2 h-8 bg-primary rounded-full" />
                    Introduction
                  </h2>
                  <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                    At Triptay, we take your privacy seriously. This policy describes how we collect, use, and share your personal information when you use our platform to book homestays or adventure activities. By using Triptay, you agree to the terms described in this policy.
                  </p>
                </section>

                {SECTIONS.map((section) => (
                  <section key={section.id} className="space-y-6 pt-12 border-t border-zinc-200/60">
                    <h2 className="text-2xl font-bold text-zinc-900">{section.title}</h2>
                    <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                      {section.content}
                    </p>
                    <ul className="space-y-4">
                      {["Specific data point collected", "Example of how it is used", "Legal basis for processing"].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-zinc-500 font-medium">
                          <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{item} related to {section.title.toLowerCase()}.</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}

                <section className="p-10 rounded-[32px] bg-primary text-white space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Lock className="w-6 h-6" />
                    Contact Our Privacy Team
                  </h3>
                  <p className="text-white/80 font-medium">
                    If you have any questions about this Privacy Policy, please contact us at privacy@triptay.com. We will respond to your request within 30 days.
                  </p>
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
