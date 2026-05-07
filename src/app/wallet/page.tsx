"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  Filter, 
  MoreVertical,
  Plus,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { cn } from "@/lib/utils";

const TRANSACTIONS = [
  { id: "TXN-8821", type: "debit", title: "Mountain Whisper Villa", desc: "Booking Payment", amount: "₹14,500", date: "12 Oct, 2024", status: "Success" },
  { id: "TXN-9021", type: "credit", title: "Refund Processed", desc: "Cancellation of Desert Safari", amount: "₹3,500", date: "20 Sep, 2024", status: "Refunded" },
  { id: "TXN-7732", type: "credit", title: "Added to Wallet", desc: "UPI Transfer", amount: "₹5,000", date: "15 Sep, 2024", status: "Success" },
  { id: "TXN-6612", type: "debit", title: "River Rafting", desc: "Activity Booking", amount: "₹2,400", date: "10 Sep, 2024", status: "Success" }
];

export default function WalletPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col lg:flex-row gap-6">
            
            <DashboardSidebar />

            {/* Wallet Content */}
            <div className="flex-grow space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">Triptay Wallet</h1>
                  <p className="text-xs text-zinc-500 font-medium italic">Manage your credits and refunds.</p>
                </div>
                <Button className="rounded-xl px-6 h-10 font-bold gap-1.5 text-xs">
                  <Plus className="w-3.5 h-3.5" />
                  Add Money
                </Button>
              </div>

              {/* Balance Card */}
              <div className="relative overflow-hidden bg-zinc-900 rounded-2xl p-6 sm:p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                        <CreditCard className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Available Balance</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-4xl sm:text-5xl font-black tracking-tighter italic">₹4,500<span className="text-white/30 text-xl not-italic ml-1">.00</span></p>
                      <p className="text-zinc-400 font-medium text-[10px] flex items-center gap-1.5 uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        Verified Wallet
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 w-full md:w-auto">
                    <div className="flex-1 md:flex-none p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <p className="text-[8px] font-black uppercase text-white/40 tracking-widest mb-0.5">Spent</p>
                      <p className="text-sm font-bold">₹28.4k</p>
                    </div>
                    <div className="flex-1 md:flex-none p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <p className="text-[8px] font-black uppercase text-white/40 tracking-widest mb-0.5">Refunds</p>
                      <p className="text-sm font-bold">₹3.5k</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions History */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">History</h2>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900"><Download className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900"><Filter className="w-4 h-4" /></Button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden divide-y divide-zinc-50">
                  {TRANSACTIONS.map((txn) => (
                    <div key={txn.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-zinc-50/50 transition-colors group">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                          txn.type === "credit" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        )}>
                          {txn.type === "credit" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-900 text-sm">{txn.title}</h4>
                          <p className="text-[10px] text-zinc-400 font-medium">
                            {txn.desc} • {txn.date}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6">
                        <div className="text-right">
                          <p className={cn(
                            "text-sm font-black italic",
                            txn.type === "credit" ? "text-emerald-500" : "text-zinc-900"
                          )}>
                            {txn.type === "credit" ? "+" : "-"}{txn.amount}
                          </p>
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                            txn.status === "Refunded" ? "bg-indigo-50 text-indigo-600" : "bg-zinc-50 text-zinc-400"
                          )}>
                            {txn.status}
                          </span>
                        </div>
                        <button className="text-zinc-300 hover:text-zinc-900">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Help/Notice */}
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest">Refund Processing</h4>
                  <p className="text-[10px] text-indigo-800/70 font-medium leading-relaxed">
                    Refunds are typically credited instantly. Bank withdrawals may take 5-7 business days.
                  </p>
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
