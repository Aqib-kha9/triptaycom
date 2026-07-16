"use client";

import { useEffect, useState } from "react";
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
  ChevronRight,
  Inbox,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { VendorSidebar } from "@/components/navigation/vendor-sidebar";
import { cn } from "@/lib/utils";
import { authApi, commissionApi } from "@/lib/api-client";
import Link from "next/link";

export default function VendorEarningsPage() {
  const [loading, setLoading] = useState(true);
  const [bankDetails, setBankDetails] = useState<{ account: string; ifsc: string } | null>(null);
  const [summary, setSummary] = useState({
    totalEarnings: 0,
    availablePayout: 0,
    processingPayout: 0,
  });
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchEarningsData = async () => {
      setLoading(true);
      try {
        // 1. Fetch user bank info
        const profileRes = await authApi.getMe();
        const user = profileRes.data?.user;
        if (user?.bankAccount) {
          setBankDetails({
            account: user.bankAccount,
            ifsc: user.bankIFSC || "",
          });
        }

        // 2. Fetch Ledger (Credits)
        const ledgerRes = await commissionApi.getHostLedger({ limit: 100 });
        const ledgerData = ledgerRes.data?.ledger || [];
        const ledgerSummary = ledgerRes.data?.summary;

        // 3. Fetch Payouts (Debits)
        const payoutsRes = await commissionApi.getHostPayouts({ limit: 100 });
        const payoutsData = payoutsRes.data?.payouts || [];

        // Calculate processing payouts (pending or processing status)
        const processingAmt = payoutsData
          .filter((p: any) => p.status === "pending" || p.status === "processing")
          .reduce((sum: number, p: any) => sum + p.amount, 0);

        setSummary({
          totalEarnings: ledgerSummary?.totalPayout || 0,
          availablePayout: ledgerSummary?.pendingPayout || 0,
          processingPayout: processingAmt,
        });

        // 4. Merge into unified transaction history
        const mergedList: any[] = [];

        // Map Credits (Commissions earned)
        ledgerData.forEach((item: any) => {
          mergedList.push({
            id: item.id,
            date: new Date(item.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            rawDate: new Date(item.createdAt),
            item: item.booking?.itemName || "Stay Booking",
            status: item.status === "processed" ? "Paid" : "Pending",
            amount: `+₹${item.hostPayoutAmount.toLocaleString("en-IN")}`,
            type: "Credit",
          });
        });

        // Map Debits (Payouts transferred to bank)
        payoutsData.forEach((item: any) => {
          mergedList.push({
            id: item.id,
            date: new Date(item.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            rawDate: new Date(item.createdAt),
            item: `Payout to Bank (${item.payoutRef})`,
            status: item.status === "processed" ? "Paid" : "Processing",
            amount: `-₹${item.amount.toLocaleString("en-IN")}`,
            type: "Debit",
          });
        });

        // Sort by date descending
        mergedList.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
        setTransactions(mergedList);

      } catch (err) {
        console.error("Failed to load earnings data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, []);

  // Format Bank Account Number mask
  const formattedBankInfo = () => {
    if (!bankDetails) return null;
    const last4 = bankDetails.account.slice(-4);
    const bankNameCode = bankDetails.ifsc.slice(0, 4).toUpperCase();
    const bankName = bankNameCode ? `${bankNameCode} Bank` : "Linked Bank Account";
    return `${bankName} (•••• ${last4})`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-28 lg:pb-12">
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
              <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 gap-4 pb-2 sm:pb-0 snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                {/* Total Revenue Card */}
                <div className="bg-zinc-900 rounded-2xl p-5 text-white space-y-3 relative overflow-hidden group min-w-[200px] flex-grow sm:flex-grow-0 snap-center">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-primary">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Total Revenue</p>
                    <h3 className="text-xl font-black text-white italic">
                      {loading ? (
                        <span className="inline-block w-24 h-5 bg-white/10 animate-pulse rounded" />
                      ) : (
                        `₹${summary.totalEarnings.toLocaleString("en-IN")}`
                      )}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[8px] font-black uppercase tracking-widest">
                    <TrendingUp className="w-3 h-3" />
                    Live Update
                  </div>
                </div>

                {/* Available Payout Card */}
                <div className="bg-white rounded-2xl border border-zinc-100 p-5 space-y-3 min-w-[200px] flex-grow sm:flex-grow-0 snap-center">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ArrowDownLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Available Payout</p>
                    <h3 className="text-xl font-black text-zinc-900">
                      {loading ? (
                        <span className="inline-block w-20 h-5 bg-zinc-100 animate-pulse rounded" />
                      ) : (
                        `₹${summary.availablePayout.toLocaleString("en-IN")}`
                      )}
                    </h3>
                  </div>
                  <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                    Processed by Admin
                  </div>
                </div>

                {/* Processing Card */}
                <div className="bg-white rounded-2xl border border-zinc-100 p-5 space-y-3 min-w-[200px] flex-grow sm:flex-grow-0 snap-center">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Processing</p>
                    <h3 className="text-xl font-black text-zinc-900">
                      {loading ? (
                        <span className="inline-block w-20 h-5 bg-zinc-100 animate-pulse rounded" />
                      ) : (
                        `₹${summary.processingPayout.toLocaleString("en-IN")}`
                      )}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Payout Channel */}
              <div className="bg-white rounded-2xl border border-zinc-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400">
                    <Building2 className="w-6 h-6" />
                  </div>
                  {loading ? (
                    <div className="space-y-2">
                      <div className="w-24 h-3 bg-zinc-100 animate-pulse rounded" />
                      <div className="w-48 h-4 bg-zinc-100 animate-pulse rounded" />
                    </div>
                  ) : bankDetails ? (
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Linked Payout Method</p>
                      <h4 className="text-sm font-bold text-zinc-900">{formattedBankInfo()}</h4>
                      <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] uppercase">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Payout Method</p>
                      <h4 className="text-sm font-bold text-rose-500 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        No Payout Details Linked
                      </h4>
                      <p className="text-[10px] text-zinc-400 font-bold">Please update your bank details in profile setting.</p>
                    </div>
                  )}
                </div>
                <Link href="/vendor/profile" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full rounded-xl h-10 px-6 text-xs font-bold border-zinc-100">
                    Manage Bank
                  </Button>
                </Link>
              </div>

              {/* Transaction History */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-zinc-900 px-1 uppercase tracking-widest">History</h2>
                {loading ? (
                  <div className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-xs text-zinc-400 font-bold">Fetching ledger records...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300">
                      <Inbox className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-zinc-900">No transactions yet</h3>
                      <p className="text-xs text-zinc-500 font-medium max-w-xs">Earnings from bookings will appear here once you start receiving payouts.</p>
                    </div>
                  </div>
                ) : (
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
                          {transactions.map((txn) => (
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
                )}
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
