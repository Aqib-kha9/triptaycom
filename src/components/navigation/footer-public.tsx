"use client";

import Link from "next/link";
import { Globe, Camera, Play, Mail, MapPin, Phone, Share2 } from "lucide-react";

const FOOTER_LINKS = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Story", href: "/story" },
    { label: "Careers", href: "/careers" },
    { label: "Become a Vendor", href: "/vendor/onboarding" },
    { label: "News & Media", href: "/news" },
  ],
  explore: [
    { label: "Destinations", href: "/destinations" },
    { label: "Homestays", href: "/stays" },
    { label: "Activities", href: "/activities" },
    { label: "Offers", href: "/offers" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Safety Info", href: "/safety" },
    { label: "Cancellation Options", href: "/cancellation" },
    { label: "Our Response", href: "/safety" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ]
};

export function FooterPublic() {
  return (
    <footer className="bg-white text-zinc-500 pt-20 pb-10 border-t border-zinc-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6 text-center md:text-left">
            <Link href="/" className="text-3xl font-bold text-zinc-900 tracking-tighter">
              TRIPTAY<span className="text-primary">.</span>
            </Link>
            <p className="text-zinc-400 max-w-sm text-sm leading-relaxed mx-auto md:mx-0">
              Curating India's most unique homestays and offbeat local experiences. Discover the authentic charm of every destination with Triptay.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white transition-all border border-zinc-100">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white transition-all border border-zinc-100">
                <Camera className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white transition-all border border-zinc-100">
                <Play className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white transition-all border border-zinc-100">
                <Share2 className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-zinc-900 font-bold mb-6 uppercase tracking-widest text-[11px]">Company</h4>
            <ul className="space-y-4 text-sm">
              {FOOTER_LINKS.company.map((link, i) => (
                <li key={i}><Link href={link.href} className="hover:text-primary transition-colors font-medium">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-900 font-bold mb-6 uppercase tracking-widest text-[11px]">Support</h4>
            <ul className="space-y-4 text-sm">
              {FOOTER_LINKS.support.map((link, i) => (
                <li key={i}><Link href={link.href} className="hover:text-primary transition-colors font-medium">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-900 font-bold mb-6 uppercase tracking-widest text-[11px]">Legal</h4>
            <ul className="space-y-4 text-sm">
              {FOOTER_LINKS.legal.map((link, i) => (
                <li key={i}><Link href={link.href} className="hover:text-primary transition-colors font-medium">{link.label}</Link></li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-primary" /> hello@triptay.com
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-primary" /> +91 98765 43210
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Made in India
            </div>
          </div>
          
          <div className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Triptay Holidays Private Limited
          </div>
        </div>
      </div>
    </footer>
  );
}
