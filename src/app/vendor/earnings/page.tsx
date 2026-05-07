"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  Building2, 
  Clock, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { VendorSidebar } from "@/components/navigation/vendor-sidebar";
import { cn } from "@/lib/utils";

const TRANSACTIONS = [
  { id: "TXN-77021", date: "05 Oct, 2024", type: "Credit", item: "Mountain Whisper Villa", amount: "+₹13,440", status: "Paid" },
  { id: "TXN-77019", date: "02 Oct, 2024", type: "Credit", item: "River Rafting", amount: "+₹2,400", status: "Paid" },
  { id: "TXN-77012", date: "25 Sep, 2024", type: "Credit", item: "The Creek Villa", amount: "+₹18,200", status: "Pending" },
];

export default function VendorEarningsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <VendorSidebar />

            <div className="flex-grow space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">Earnings</h1>
                  <p className="text-xs text-zinc-500 font-medium italic">Track your revenue.</p>
                </div>
                <Button variant="outline" className="rounded-xl px-5 h-10 text-xs font-bold border-zinc-100 gap-2">
                  <Download className="w-3.5 h-3.5" />
                  Export
                </Button>
              </div>

              {/* Financial Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-900 rounded-2xl p-5 text-white space-y-3 relative overflow-hidden group">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-primary">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Total Revenue</p>
                    <h3 className="text-xl font-black text-white italic">₹1,84,200</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[8px] font-black uppercase tracking-widest">
                    <TrendingUp className="w-3 h-3" />
                    +12% this month
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-100 p-5 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ArrowDownLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Available Payout</p>
                    <h3 className="text-xl font-black text-zinc-900">₹42,500</h3>
                  </div>
                  <button className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:translate-x-1 transition-transform">
                    Request <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-100 p-5 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Processing</p>
                    <h3 className="text-xl font-black text-zinc-900">₹18,200</h3>
                  </div>
                </div>
              </div>

              {/* Payout Channel */}
              <div className="bg-white rounded-2xl border border-zinc-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Linked Payout Method</p>
                    <h4 className="text-sm font-bold text-zinc-900">HDFC Bank India (•••• 8812)</h4>
                    <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] uppercase">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full sm:w-auto rounded-xl h-10 px-6 text-xs font-bold border-zinc-100">
                  Change
                </Button>
              </div>

              {/* Transaction History */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-zinc-900 px-1 uppercase tracking-widest">History</h2>
                <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-zinc-50">
                          <th className="px-6 py-4 text-left font-black text-zinc-400 uppercase tracking-widest">Date</th>
                          <th className="px-6 py-4 text-left font-black text-zinc-400 uppercase tracking-widest">Item</th>
                          <th className="px-6 py-4 text-left font-black text-zinc-400 uppercase tracking-widest">Status</th>
                          <th className="px-6 py-4 text-right font-black text-zinc-400 uppercase tracking-widest">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50">
                        {TRANSACTIONS.map((txn) => (
                          <tr key={txn.id} className="hover:bg-zinc-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-bold text-zinc-900">{txn.date}</p>
                              <p className="text-[9px] text-zinc-400">{txn.id}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "w-6 h-6 rounded flex items-center justify-center shrink-0",
                                  txn.type === "Credit" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                                )}>
                                  {txn.type === "Credit" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                                </div>
                                <span className="font-bold text-zinc-900">{txn.item}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                                txn.status === "Paid" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                              )}>
                                {txn.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <p className={cn("font-black italic", txn.type === "Credit" ? "text-zinc-900" : "text-rose-500")}>
                                {txn.amount}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
