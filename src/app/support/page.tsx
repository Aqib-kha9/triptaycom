"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageSquare, Mail, User, LifeBuoy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await fetch(`${API_BASE}/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setError(data.message || "Failed to submit support request.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary"
          >
            <LifeBuoy className="w-8 h-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4"
          >
            How can we help you?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-500 max-w-2xl mx-auto"
          >
            Whether you have a question about your bookings, need help with your vendor account, or just want to share feedback, we're here for you.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl shadow-zinc-200/40 overflow-hidden border border-zinc-100"
        >
          <div className="grid md:grid-cols-5 h-full">
            {/* Left side info */}
            <div className="md:col-span-2 bg-zinc-900 text-white p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -ml-32 -mb-32" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Get in Touch</h3>
                <p className="text-zinc-400 mb-12">Fill out the form and our team will get back to you within 24 hours.</p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-zinc-300">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>support@triptay.com</span>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-300">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <span>Live chat available 24/7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side form */}
            <div className="md:col-span-3 p-10">
              {success ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">Message Sent!</h3>
                  <p className="text-zinc-500 mb-8 max-w-sm">
                    Thank you for reaching out. We've received your message and will respond to the email provided shortly.
                  </p>
                  <Button onClick={() => setSuccess(false)} variant="outline" className="rounded-full">
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-zinc-900">Your Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="pl-10 rounded-xl h-12 bg-zinc-50/50 border-zinc-200"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-zinc-900">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="pl-10 rounded-xl h-12 bg-zinc-50/50 border-zinc-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-900">Subject</label>
                    <Input
                      name="subject"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="rounded-xl h-12 bg-zinc-50/50 border-zinc-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-900">Message</label>
                    <Textarea
                      name="message"
                      placeholder="Please describe your issue or question in detail..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="rounded-xl min-h-[150px] resize-none bg-zinc-50/50 border-zinc-200 p-4"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl font-bold text-base bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                  >
                    {loading ? "Sending..." : "Send Message"}
                    {!loading && <Send className="w-4 h-4 ml-2" />}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
    </div>
  );
}
