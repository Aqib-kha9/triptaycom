"use client";

import Link from "next/link";

export function FooterPrivate() {
  return (
    <footer className="bg-white border-t border-zinc-100 py-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 text-white">
              <span className="text-sm font-bold italic">T</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-zinc-900">Triptay Dashboard</span>
          </div>
          
          <div className="flex items-center gap-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">
            <Link href="/faq" className="hover:text-zinc-900">FAQs</Link>
            <Link href="/contact" className="hover:text-zinc-900">Contact</Link>
            <Link href="/support" className="hover:text-zinc-900">Support</Link>
            <Link href="/terms" className="hover:text-zinc-900">Terms</Link>
            <Link href="/privacy" className="hover:text-zinc-900">Privacy</Link>
          </div>
          
          <p className="text-xs text-zinc-400 font-medium">© 2024 Triptay Enterprise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
