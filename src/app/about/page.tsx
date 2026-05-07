"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Target, 
  Heart, 
  ShieldCheck, 
  Globe, 
  Zap,
  ChevronRight,
  ArrowRight,
  Camera,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const TEAM = [
  { name: "Aryan Singh", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
  { name: "Sanya Malhotra", role: "Head of Experiences", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
  { name: "Rahul Verma", role: "Tech Lead", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
  { name: "Priya Das", role: "Community Manager", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" },
];

const VALUES = [
  { icon: <Heart className="w-6 h-6 text-rose-500" />, title: "Authenticity", desc: "We believe in real local experiences that go beyond the tourist traps." },
  { icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />, title: "Trust", desc: "Every property and activity is personally verified by our team." },
  { icon: <Zap className="w-6 h-6 text-amber-500" />, title: "Impact", desc: "We empower local communities and promote sustainable tourism." },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000" 
              alt="Mountains" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl text-white"
            >
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
                Redefining the way you <span className="text-primary italic">travel.</span>
              </h1>
              <p className="text-xl md:text-2xl text-zinc-200 font-medium leading-relaxed mb-10">
                Triptay is more than just a booking platform. We're a community dedicated to uncovering India's most authentic stays and offbeat adventures.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full px-10 h-16 text-lg font-bold shadow-2xl shadow-primary/30">
                  Our Mission
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg font-bold border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-zinc-900 transition-all">
                  Watch Story
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Company Info */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-1/2 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                  <Globe className="w-4 h-4" />
                  Our Story
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 leading-tight">
                  Started in the mountains, built for the world.
                </h2>
                <p className="text-xl text-zinc-500 leading-relaxed font-medium">
                  What started as a small project to help friends find hidden stays in the Himalayas has grown into India's premier platform for offbeat travel. 
                  <br /><br />
                  We noticed that travelers were tired of cookie-cutter hotels and commercial tours. They wanted something real—a home-cooked meal in a village villa, 
                  a trek through untouched forests, or a day spent learning local crafts.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-6">
                  <div>
                    <p className="text-4xl font-black text-primary">500+</p>
                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mt-1">Verified Stays</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black text-primary">200+</p>
                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mt-1">Unique Experiences</p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl shadow-zinc-200">
                  <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1000" alt="Adventure" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-rose-50 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-32 bg-zinc-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-4xl font-bold text-zinc-900">Driven by Purpose</h2>
              <p className="text-lg text-zinc-500 font-medium">We're on a mission to make every journey meaningful, authentic, and sustainable.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {VALUES.map((value, i) => (
                <div key={i} className="bg-white p-10 rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:translate-y-[-10px] transition-all duration-500 group">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-4">{value.title}</h3>
                  <p className="text-zinc-500 font-medium leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                  <Users className="w-3.5 h-3.5" />
                  The Dream Team
                </div>
                <h2 className="text-4xl font-bold text-zinc-900">Meet the visionaries.</h2>
              </div>
              <p className="text-zinc-500 font-medium max-w-sm">
                A diverse group of explorers, technologists, and storytellers working together to build the future of travel.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {TEAM.map((member, i) => (
                <div key={i} className="group">
                  <div className="aspect-[4/5] rounded-[40px] overflow-hidden mb-6 relative">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                      <div className="flex gap-4">
                        <Button size="icon" variant="ghost" className="rounded-full text-white hover:bg-white/20"><Globe className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="rounded-full text-white hover:bg-white/20"><MessageSquare className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="rounded-full text-white hover:bg-white/20"><Camera className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">{member.name}</h3>
                  <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-primary rounded-[60px] p-12 md:p-24 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">Ready to start your next adventure?</h2>
                <p className="text-xl text-white/80 font-medium">Join 50,000+ travelers who are discovering India differently.</p>
                <Link href="/explore">
                  <Button size="lg" variant="outline" className="rounded-full px-12 h-16 text-lg font-bold bg-white text-primary hover:bg-zinc-50 border-none transition-all mt-6 shadow-2xl">
                    Explore Stays & Activities
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
