"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  Filter, 
  Coins,
  ShieldCheck,
  Gift,
  Clock,
  RotateCcw,
  CheckCircle2,
  Info
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { creditsApi, WalletTransaction, CreditsSummary } from "@/lib/api-client";

const formatDate = (dateInput: string | Date) => {
  const date = new Date(dateInput);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-GB', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

export default function CreditsPage() {
  const [summary, setSummary] = useState<CreditsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCreditsData();
  }, []);

  const fetchCreditsData = async () => {
    try {
      setLoading(true);
      const res = await creditsApi.getSummary();
      if (res.data) {
        setSummary(res.data);
      }
    } catch (error: any) {
      console.error("[Credits fetch error]:", error);
    } finally {
      setLoading(false);
    }
  };

  const transactions = summary?.transactions || [];
  const filteredTransactions = transactions.filter(t => filter === "all" ? true : t.type === filter);
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handleDownloadCSV = () => {
    if (filteredTransactions.length === 0) return;
    const headers = ["Date", "Title", "Category", "Type", "Amount", "Status", "Reference"];
    const rows = filteredTransactions.map(t => [
      `"${new Date(t.createdAt).toISOString()}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.category || "PROMOTIONAL"}"`,
      `"${t.type}"`,
      `"${t.amount}"`,
      `"${t.status}"`,
      `"${t.referenceId || t.bookingRef || ""}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `triptay_credits_statement_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case "CANCELLATION":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/50">Cancellation Refund</span>;
      case "REFERRAL":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/50">Referral Reward</span>;
      case "COMPENSATION":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/50">Goodwill Support</span>;
      case "BOOKING_REDEMPTION":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">Stay Booking</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">Promotional Reward</span>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBFC]">
      <Navbar />

      <main className="flex-grow pt-24 pb-28 lg:pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            
            <DashboardSidebar />

            {/* Credits Content Area */}
            <div className="flex-grow space-y-6">
              
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-black tracking-tight text-zinc-900">TripTay Credits</h1>
                    <span className="text-[11px] font-bold bg-emerald-100/80 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      1 Credit = ₹1
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-medium mt-1">
                    Redeemable instantly across all verified homestays & adventures in India.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadCSV}
                    disabled={filteredTransactions.length === 0}
                    className="h-9 rounded-xl text-xs font-bold border-zinc-200 text-zinc-700 hover:bg-zinc-50 gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Statement
                  </Button>
                </div>
              </div>

              {/* Primary Balance Hero Card */}
              <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white p-6 sm:p-8 shadow-2xl border border-zinc-800">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                        <Coins className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Available Credits</span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                        {loading ? "..." : formatCurrency(summary?.availableCredits || 0)}
                      </h2>
                      <span className="text-sm font-semibold text-emerald-400">TripTay Credits</span>
                    </div>

                    <p className="text-xs text-zinc-400 mt-2 font-medium flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 inline" />
                      Applied automatically at checkout to reduce your payable amount.
                    </p>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-zinc-800/80 pt-4 md:pt-0 md:pl-8">
                    <div className="bg-zinc-900/60 rounded-2xl p-3 border border-zinc-800/60">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Lifetime Earned</p>
                      <p className="text-sm font-black text-white mt-0.5">
                        {loading ? "..." : formatCurrency(summary?.totalEarned || 0)}
                      </p>
                    </div>

                    <div className="bg-zinc-900/60 rounded-2xl p-3 border border-zinc-800/60">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Redeemed</p>
                      <p className="text-sm font-black text-white mt-0.5">
                        {loading ? "..." : formatCurrency(summary?.totalSpent || 0)}
                      </p>
                    </div>

                    <div className="bg-zinc-900/60 rounded-2xl p-3 border border-zinc-800/60 col-span-2 sm:col-span-1">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">In Checkout Hold</p>
                      <p className="text-sm font-black text-amber-400 mt-0.5">
                        {loading ? "..." : formatCurrency(summary?.heldCredits || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informational Feature Cards: How to Earn TripTay Credits */}
              <div>
                <h3 className="text-sm font-bold text-zinc-900 px-1 mb-3">How to Get TripTay Credits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Card 1: Instant Cancellation */}
                  <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm hover:border-zinc-300 transition-all space-y-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-zinc-900">Instant Cancellation</h4>
                      <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mt-1">
                        Choose instant credits when cancelling to rebook your next stay immediately with zero banking delay.
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Refer Friends */}
                  <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm hover:border-zinc-300 transition-all space-y-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-zinc-900">Refer a Friend</h4>
                      <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mt-1">
                        Invite fellow travellers. Earn ₹250 TripTay Credits automatically as soon as they complete their first stay.
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Loyalty & Promotions */}
                  <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm hover:border-zinc-300 transition-all space-y-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-zinc-900">Promotions & Drops</h4>
                      <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mt-1">
                        Enjoy seasonal welcome rewards, festive promotions, and member credits dropped directly into your account.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Transactions Ledger Container */}
              <div className="bg-white rounded-[24px] border border-zinc-200/80 shadow-sm overflow-hidden">
                
                {/* Ledger Toolbar */}
                <div className="p-4 sm:p-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-zinc-900">Credit Activity Ledger</h3>
                    <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Immutable audit record of all credit earnings & redemptions</p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 bg-zinc-100/80 p-1 rounded-xl">
                    <button
                      onClick={() => setFilter("all")}
                      className={cn(
                        "px-3 py-1 text-xs font-bold rounded-lg transition-all",
                        filter === "all" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                      )}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter("credit")}
                      className={cn(
                        "px-3 py-1 text-xs font-bold rounded-lg transition-all",
                        filter === "credit" ? "bg-white text-emerald-700 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                      )}
                    >
                      Earned
                    </button>
                    <button
                      onClick={() => setFilter("debit")}
                      className={cn(
                        "px-3 py-1 text-xs font-bold rounded-lg transition-all",
                        filter === "debit" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                      )}
                    >
                      Redeemed
                    </button>
                  </div>
                </div>

                {/* Ledger List */}
                <div className="divide-y divide-zinc-100">
                  {loading ? (
                    <div className="py-16 text-center text-zinc-400 text-xs font-semibold animate-pulse">
                      Loading your credit ledger...
                    </div>
                  ) : paginatedTransactions.length === 0 ? (
                    <div className="py-16 text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                        <Coins className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-zinc-700">No credit activity found</p>
                      <p className="text-[11px] text-zinc-400 max-w-sm mx-auto">
                        Earn TripTay Credits via booking cancellations, inviting friends, or through member promotions.
                      </p>
                    </div>
                  ) : (
                    paginatedTransactions.map((txn) => {
                      const isCredit = txn.type === "credit";
                      return (
                        <div key={txn.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-zinc-50/60 transition-colors">
                          <div className="flex items-start gap-3.5">
                            <div className={cn(
                              "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border mt-0.5",
                              isCredit 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                : "bg-zinc-100 text-zinc-600 border-zinc-200"
                            )}>
                              {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-zinc-900">{txn.title}</span>
                                {getCategoryBadge(txn.category)}
                                {txn.status === "HOLD" && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                                    Checkout Hold
                                  </span>
                                )}
                              </div>

                              {txn.description && (
                                <p className="text-[11px] text-zinc-500 font-medium line-clamp-1">{txn.description}</p>
                              )}

                              <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-semibold">
                                <span>{formatDate(txn.createdAt)}</span>
                                {txn.referenceId && (
                                  <span>• Ref: {txn.referenceId}</span>
                                )}
                                {txn.expiresAt && (
                                  <span className="flex items-center gap-1 text-amber-600">
                                    <Clock className="w-3 h-3" />
                                    Expires {formatDate(txn.expiresAt)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className={cn(
                              "text-sm font-black",
                              isCredit ? "text-emerald-600" : "text-zinc-900"
                            )}>
                              {isCredit ? `+₹${txn.amount.toLocaleString()}` : `-₹${txn.amount.toLocaleString()}`}
                            </span>
                            <p className="text-[10px] text-zinc-400 font-bold capitalize mt-0.5">{txn.status.toLowerCase()}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-zinc-500">
                    <span>Page {currentPage} of {totalPages}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="h-8 text-xs font-bold rounded-xl"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className="h-8 text-xs font-bold rounded-xl"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Regulatory Notice (RBI PPI Non-Deposit Disclaimer) */}
              <div className="rounded-2xl p-4 bg-zinc-100/80 border border-zinc-200/80 flex items-start gap-3">
                <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <div className="text-[11px] text-zinc-600 font-medium leading-relaxed">
                  <span className="font-bold text-zinc-800">TripTay Credits Policy: </span>
                  TripTay Credits represent proprietary non-monetary booking credits and promotional discount vouchers issued by TripTay. Credits can only be redeemed as deductions against eligible stays and adventures on the TripTay marketplace. In compliance with RBI digital payment directions, TripTay Credits are non-transferable, cannot be withdrawn to bank accounts or payment cards, and cannot be loaded via direct cash deposits.
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
