"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Clock, 
  Send,
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow pt-24">
        
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center overflow-hidden bg-zinc-950 text-white">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=2000" 
              alt="Contact Hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight"
              >
                Let's start a <span className="text-primary italic">conversation.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-zinc-200 font-medium leading-relaxed"
              >
                Whether you have a question about our properties, need help with a booking, or just want to say hello—we're here to help.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Contact Info Grid */}
        <section className="py-20 -mt-16 container mx-auto px-4 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/50 space-y-6 group hover:translate-y-[-5px] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-primary group-hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900">Email Us</h3>
                <p className="text-zinc-500 font-medium">For general inquiries and support.</p>
              </div>
              <p className="text-lg font-bold text-zinc-900">hello@triptay.com</p>
            </div>
            
            <div className="bg-white p-10 rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/50 space-y-6 group hover:translate-y-[-5px] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-primary group-hover:text-white transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900">Call Us</h3>
                <p className="text-zinc-500 font-medium">Mon-Sat from 9am to 6pm.</p>
              </div>
              <p className="text-lg font-bold text-zinc-900">+91 98765 43210</p>
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/50 space-y-6 group hover:translate-y-[-5px] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-primary group-hover:text-white transition-colors">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900">Visit Us</h3>
                <p className="text-zinc-500 font-medium">Our headquarters in New Delhi.</p>
              </div>
              <p className="text-lg font-bold text-zinc-900">Sector 12, Dwarka, Delhi 110075</p>
            </div>
          </div>
        </section>

        {/* Form & Map Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-20">
              
              {/* Contact Form */}
              <div className="lg:w-1/2 space-y-12">
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold text-zinc-900">Send us a message</h2>
                  <p className="text-lg text-zinc-500 font-medium">We'll get back to you within 24 hours.</p>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                      <Input placeholder="John Doe" className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                      <Input placeholder="john@example.com" className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Subject</label>
                    <Input placeholder="Booking Inquiry" className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Message</label>
                    <Textarea placeholder="How can we help you?" className="min-h-[160px] rounded-[32px] border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all p-6" />
                  </div>
                  <Button className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 gap-3 group">
                    Send Message
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </form>
              </div>

              {/* Map & Support Info */}
              <div className="lg:w-1/2 space-y-12">
                <div className="h-[400px] w-full rounded-[40px] overflow-hidden bg-zinc-100 border border-zinc-100 relative group">
                  {/* Mock Map Image */}
                  <img 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" 
                    alt="Map Location" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl animate-bounce">
                      <MapPin className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl">
                    <p className="text-sm font-bold text-zinc-900">Find us on Google Maps</p>
                    <p className="text-xs text-zinc-500 font-medium">Dwarka Sector 12, Delhi, India</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 rounded-[32px] bg-indigo-50/50 border border-indigo-100 space-y-4">
                    <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Partner Support
                    </h3>
                    <p className="text-sm text-indigo-800/80 font-medium">Are you a vendor? Get specialized support for your listings and earnings.</p>
                    <Link href="#" className="text-indigo-600 font-bold text-xs hover:underline inline-flex items-center gap-1">
                      Partner Portal <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="p-8 rounded-[32px] bg-emerald-50/50 border border-emerald-100 space-y-4">
                    <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-widest flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Fast Response
                    </h3>
                    <p className="text-sm text-emerald-800/80 font-medium">Our average response time for booking issues is under 2 hours.</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase text-emerald-600">Online Now</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

import Link from "next/link";
