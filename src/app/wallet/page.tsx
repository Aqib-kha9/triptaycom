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
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const formatDate = (dateInput: string | Date) => {
  const date = new Date(dateInput);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-GB', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};
import { walletApi, WalletTransaction } from "@/lib/api-client";

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [spent, setSpent] = useState(0);
  const [refunds, setRefunds] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{type: "success" | "error" | null, message: string}>({ type: null, message: "" });
  const [selectedTxn, setSelectedTxn] = useState<WalletTransaction | null>(null);

  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenuId(null);
      setIsFilterOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const filteredTransactions = transactions.filter(t => filter === "all" ? true : t.type === filter);
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handleDownloadCSV = () => {
    if (filteredTransactions.length === 0) return;
    const headers = ["Date", "Title", "Description", "Type", "Amount", "Status"];
    const rows = filteredTransactions.map(t => [
      `"${new Date(t.createdAt).toISOString()}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${(t.description || "").replace(/"/g, '""')}"`,
      `"${t.type}"`,
      `"${t.amount}"`,
      `"${t.status}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `wallet_history_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const res = await walletApi.getHistory();
      if (res.data) {
        setBalance(res.data.balance);
        setSpent(res.data.spent);
        setRefunds(res.data.refunds);
        setTransactions(res.data.transactions);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    const amt = parseFloat(amountToAdd);
    if (isNaN(amt) || amt <= 0) {
      setPaymentStatus({ type: "error", message: "Please enter a valid amount" });
      return;
    }

    try {
      setPaymentStatus({ type: null, message: "" });
      setIsSubmitting(true);
      
      // 1. Create order on backend
      const orderRes = await walletApi.createOrder({ amount: amt });
      if (!orderRes.data) throw new Error("Failed to create order");

      // 2. Load Razorpay
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Razorpay SDK failed to load. Are you online?");
      }

      // 3. Open Razorpay Checkout
      const options = {
        key: orderRes.data.keyId || "",
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "Triptay",
        description: "Wallet Top-up",
        order_id: orderRes.data.orderId,
        handler: async function (response: any) {
          try {
            // 4. Verify Payment on Backend
            await walletApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              amount: amt,
            });
            
            setPaymentStatus({ type: "success", message: `Successfully added ₹${amt} to your wallet!` });
            setTimeout(() => {
              setIsAddingMoney(false);
              setAmountToAdd("");
              setPaymentStatus({ type: null, message: "" });
            }, 3000);
            
            fetchWalletData(); // Refresh data
          } catch (err: any) {
            setPaymentStatus({ type: "error", message: err.message || "Payment verification failed" });
          }
        },
        theme: { color: "#6366f1" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setPaymentStatus({ type: "error", message: response.error.description || "Payment failed" });
      });
      rzp.open();

    } catch (error: any) {
      setPaymentStatus({ type: "error", message: error.message || "Failed to initiate payment" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatShortCurrency = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
    return formatCurrency(amount);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-28 lg:pb-12">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col lg:flex-row gap-6">
            
            <DashboardSidebar />

            {/* Wallet Content */}
            <div className="flex-grow space-y-6 relative">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">Triptay Wallet</h1>
                  <p className="text-xs text-zinc-500 font-medium italic">Manage your credits and refunds.</p>
                </div>
                <Button 
                  onClick={() => setIsAddingMoney(true)}
                  className="rounded-xl px-6 h-10 font-bold gap-1.5 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Money
                </Button>
              </div>

              {/* Add Money Modal (Overlay) */}
              {isAddingMoney && (
                <div className="absolute top-0 right-0 z-50 bg-white rounded-2xl shadow-xl border border-zinc-200 p-6 w-full sm:w-80 animate-in fade-in slide-in-from-top-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm">Add Funds</h3>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => {
                      setIsAddingMoney(false);
                      setPaymentStatus({ type: null, message: "" });
                    }}>
                      <AlertCircle className="w-4 h-4 text-zinc-400 rotate-45" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {paymentStatus.type && (
                      <div className={cn(
                        "p-3 rounded-lg text-xs font-bold",
                        paymentStatus.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      )}>
                        {paymentStatus.message}
                      </div>
                    )}
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₹</span>
                      <input 
                        type="number"
                        value={amountToAdd}
                        onChange={(e) => setAmountToAdd(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-zinc-900"
                      />
                    </div>
                    <div className="flex gap-2">
                      {[500, 1000, 5000].map(amt => (
                        <button 
                          key={amt} 
                          onClick={() => setAmountToAdd(amt.toString())}
                          className="flex-1 py-1.5 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
                        >
                          +₹{amt}
                        </button>
                      ))}
                    </div>
                    <Button 
                      className="w-full rounded-xl font-bold" 
                      onClick={handleAddMoney}
                      disabled={isSubmitting || !amountToAdd}
                    >
                      {isSubmitting ? "Processing..." : "Proceed to Pay"}
                    </Button>
                  </div>
                </div>
              )}

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
                      {loading ? (
                        <div className="h-12 w-48 bg-white/10 animate-pulse rounded-lg" />
                      ) : (
                        <p className="text-4xl sm:text-5xl font-black tracking-tighter italic">
                          {formatCurrency(balance)}
                        </p>
                      )}
                      <p className="text-zinc-400 font-medium text-[10px] flex items-center gap-1.5 uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        Verified Wallet
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 w-full md:w-auto">
                    <div className="flex-1 md:flex-none p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <p className="text-[8px] font-black uppercase text-white/40 tracking-widest mb-0.5">Spent</p>
                      {loading ? <div className="h-5 w-16 bg-white/10 animate-pulse rounded" /> : <p className="text-sm font-bold">{formatShortCurrency(spent)}</p>}
                    </div>
                    <div className="flex-1 md:flex-none p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <p className="text-[8px] font-black uppercase text-white/40 tracking-widest mb-0.5">Refunds</p>
                      {loading ? <div className="h-5 w-16 bg-white/10 animate-pulse rounded" /> : <p className="text-sm font-bold">{formatShortCurrency(refunds)}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions History */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">History</h2>
                  <div className="flex items-center gap-1 relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900"
                      onClick={handleDownloadCSV}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <div className="relative">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn(
                          "h-8 w-8 rounded-lg transition-colors",
                          filter !== "all" ? "text-primary bg-primary/10" : "text-zinc-400 hover:text-zinc-900"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.nativeEvent.stopImmediatePropagation();
                          setIsFilterOpen(!isFilterOpen);
                          setActiveMenuId(null);
                        }}
                      >
                        <Filter className="w-4 h-4" />
                      </Button>
                      {isFilterOpen && (
                        <div 
                          className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-zinc-100 py-1 z-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                          }}
                        >
                          {["all", "credit", "debit"].map(f => (
                            <button
                              key={f}
                              className={cn(
                                "w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider",
                                filter === f ? "text-primary bg-primary/5" : "text-zinc-600 hover:bg-zinc-50"
                              )}
                              onClick={() => {
                                setFilter(f as any);
                                setIsFilterOpen(false);
                              }}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-100 divide-y divide-zinc-50">
                  {loading ? (
                    [1, 2, 3].map((i) => (
                      <div key={i} className="p-5 flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-zinc-100" />
                          <div className="space-y-2"><div className="w-32 h-4 bg-zinc-100 rounded" /><div className="w-24 h-3 bg-zinc-100 rounded" /></div>
                        </div>
                        <div className="w-16 h-5 bg-zinc-100 rounded" />
                      </div>
                    ))
                  ) : paginatedTransactions.length > 0 ? (
                    paginatedTransactions.map((txn) => (
                      <div key={txn.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-zinc-50/50 transition-colors group first:rounded-t-2xl last:rounded-b-2xl relative">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                            txn.type === "credit" ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
                          )}>
                            {txn.type === "credit" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-zinc-900 truncate">{txn.title}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-xs text-zinc-500 truncate">{txn.description}</p>
                              <span className="text-[10px] text-zinc-300">•</span>
                              <p className="text-xs font-medium text-zinc-400 whitespace-nowrap">{formatDate(txn.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                          <div className="text-right flex-1 sm:flex-none">
                            <p className={cn(
                              "text-sm font-black",
                              txn.type === "credit" ? "text-emerald-600" : "text-zinc-900"
                            )}>
                              {txn.type === "credit" ? "+" : "-"}{formatCurrency(txn.amount)}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">{txn.status}</p>
                          </div>
                          <div className="relative">
                            <button 
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0",
                                activeMenuId === txn.id ? "text-zinc-900 bg-zinc-100 opacity-100" : "text-zinc-300 hover:text-zinc-900 hover:bg-zinc-100 opacity-0 group-hover:opacity-100"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                                setActiveMenuId(activeMenuId === txn.id ? null : txn.id);
                                setIsFilterOpen(false);
                              }}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            {activeMenuId === txn.id && (
                              <div 
                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-zinc-100 py-1 z-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.nativeEvent.stopImmediatePropagation();
                                }}
                              >
                                <button 
                                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors"
                                  onClick={() => {
                                    setSelectedTxn(txn);
                                    setActiveMenuId(null);
                                  }}
                                >
                                  View Details
                                </button>
                                <button className="w-full text-left px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors" onClick={handleDownloadCSV}>
                                  Download Receipt
                                </button>
                                <div className="h-px bg-zinc-100 my-1" />
                                <button 
                                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                                  onClick={() => {
                                    window.location.href = `mailto:support@triptay.com?subject=Issue with Transaction ${txn.id}&body=Hi Triptay Support,%0D%0A%0D%0AI have an issue with transaction ${txn.id}.%0D%0A%0D%0ADetails:%0D%0AAmount: ${txn.amount}%0D%0ADate: ${formatDate(txn.createdAt)}%0D%0A%0D%0APlease help me resolve this.`;
                                    setActiveMenuId(null);
                                  }}
                                >
                                  Report Issue
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-zinc-50 mx-auto flex items-center justify-center mb-4">
                        <CreditCard className="w-6 h-6 text-zinc-300" />
                      </div>
                      <h3 className="text-zinc-900 font-bold mb-1">No transactions yet</h3>
                      <p className="text-zinc-500 text-sm">Your wallet history will appear here.</p>
                    </div>
                  )}
                </div>
                
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-1 mt-4">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="h-8 px-3 text-xs font-bold rounded-lg"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className="h-8 px-3 text-xs font-bold rounded-lg"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Alert */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3 mt-4">
                <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-blue-900 mb-1">Refund Processing</h4>
                  <p className="text-xs text-blue-700/80 leading-relaxed">Refunds are typically credited instantly to your Triptay Wallet. If you wish to withdraw to your original bank method, it may take 5-7 business days depending on your bank.</p>
                </div>
              </div>

              {/* Transaction Details Modal */}
              {selectedTxn && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
                  <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95 fade-in duration-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="font-bold text-lg text-zinc-900">Transaction Details</h3>
                          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">{selectedTxn.id}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full -mr-2 -mt-2 text-zinc-400 hover:text-zinc-900" onClick={() => setSelectedTxn(null)}>
                          <AlertCircle className="w-5 h-5 rotate-45" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-100 mb-6">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center shrink-0 border",
                          selectedTxn.type === "credit" ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
                        )}>
                          {selectedTxn.type === "credit" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className={cn(
                            "text-2xl font-black",
                            selectedTxn.type === "credit" ? "text-emerald-600" : "text-zinc-900"
                          )}>
                            {selectedTxn.type === "credit" ? "+" : "-"}{formatCurrency(selectedTxn.amount)}
                          </p>
                          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mt-0.5">{selectedTxn.status}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Title</p>
                          <p className="text-sm font-medium text-zinc-900">{selectedTxn.title}</p>
                        </div>
                        {selectedTxn.description && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Description</p>
                            <p className="text-sm text-zinc-600 leading-relaxed">{selectedTxn.description}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Date & Time</p>
                            <p className="text-sm font-medium text-zinc-900">{new Date(selectedTxn.createdAt).toLocaleString('en-IN')}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Transaction Type</p>
                            <p className="text-sm font-medium text-zinc-900 capitalize">{selectedTxn.type}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-zinc-50 border-t border-zinc-100">
                      <Button className="w-full rounded-xl font-bold" onClick={() => setSelectedTxn(null)}>
                        Close Details
                      </Button>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
