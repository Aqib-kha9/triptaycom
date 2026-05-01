"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    question: "How do you verify the homestays?",
    answer: "Every property on Triptay undergoes a 50-point physical verification process. Our local team visits the stay to ensure safety, cleanliness, and the authenticity of the amenities listed."
  },
  {
    question: "What is your cancellation policy?",
    answer: "We offer flexible cancellation. You can get a full refund if you cancel up to 48 hours before your check-in time. For adventure activities, the policy varies by the specific experience."
  },
  {
    question: "Are the adventure activities safe?",
    answer: "Yes, we only partner with certified adventure experts who follow international safety standards and provide high-quality equipment for all activities."
  },
  {
    question: "How can I contact my host?",
    answer: "Once your booking is confirmed, you'll receive the host's contact details and exact location. You can also message them through our platform for any pre-arrival requests."
  },
  {
    question: "Do you offer group discounts?",
    answer: "Yes, for groups of 8 or more, we offer custom packages and special discounts. Please contact our support team for a tailored quote."
  },
  {
    question: "Is there any membership program?",
    answer: "Yes, Triptay Elite offers exclusive early access to new stays and up to 15% extra discount on all activity bundles throughout the year."
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="container mx-auto px-4 py-24 bg-white">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-4">Support</span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
          Common Questions
        </h2>
        <p className="text-zinc-500 font-medium ">Everything you need to know about Triptay</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FAQS.map((faq, index) => (
          <div 
            key={index} 
            className="border border-zinc-100 rounded-[2rem] overflow-hidden transition-all duration-300 hover:border-primary/20 h-fit"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 md:p-8 text-left bg-white"
            >
              <span className="text-base md:text-lg font-bold text-zinc-900 pr-4">{faq.question}</span>
              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-primary text-white' : 'bg-zinc-50 text-zinc-400'}`}>
                {openIndex === index ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </div>
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-8 pb-8 text-zinc-500 font-medium text-sm md:text-base leading-relaxed bg-white">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
