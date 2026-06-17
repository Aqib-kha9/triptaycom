"use client";

import Link from "next/link";

export function FooterPrivate() {
  return (
    <footer className="bg-white border-t border-zinc-100 py-8 md:py-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 text-white">
              <span className="text-sm font-bold italic">T</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-zinc-900 mt-2 md:mt-0">Triptay Dashboard</span>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-xs font-bold text-zinc-400 uppercase tracking-widest text-center">
            <Link href="/faq" className="hover:text-zinc-900">FAQs</Link>
            <Link href="/contact" className="hover:text-zinc-900">Contact</Link>
            <Link href="/support" className="hover:text-zinc-900">Support</Link>
            <Link href="/terms" className="hover:text-zinc-900">Terms</Link>
            <Link href="/privacy" className="hover:text-zinc-900">Privacy</Link>
          </div>
          
          <p className="text-xs text-zinc-400 font-medium text-center">© 2024 Triptay Enterprise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
