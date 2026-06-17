"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  RefreshCw,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Home,
  Compass,
  Search,
  X,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { VendorSidebar } from "@/components/navigation/vendor-sidebar";
import { cn } from "@/lib/utils";

// ──────────────────────── Types ────────────────────────

interface VendorItem {
  _id: string;
  name: string;
  type: "listing" | "activity";
  subtype: string;
  city: string;
  coverImage: string | null;
}

interface AvailabilityData {
  itemId: string;
  itemType: string;
  itemName: string;
  blockedDates: string[];
  notes: string | null;
  updatedAt?: string;
}

// ──────────────────────── Constants ────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ──────────────────────── Helpers ────────────────────────

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function todayString(): string {
  const now = new Date();
  return formatDateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

// ──────────────────────── Component ────────────────────────

export default function VendorCalendarPage() {
  // ── State: Items (dropdown) ──
  const [items, setItems] = useState<VendorItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState("");

  // ── State: Selected item ──
  const [activeItemId, setActiveItemId] = useState("");
  const [activeItemType, setActiveItemType] = useState<"listing" | "activity">("listing");

  // ── State: Availability ──
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [availLoading, setAvailLoading] = useState(false);
  const [availError, setAvailError] = useState("");

  // ── State: Calendar ──
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth()); // 0-indexed
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  // ── State: Actions ──
  const [blocking, setBlocking] = useState(false);
  const [unblocking, setUnblocking] = useState(false);
  const [bulkBlocking, setBulkBlocking] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // ── State: Tab-based item picker ──
  const [pickerTab, setPickerTab] = useState<"stays" | "activities">("stays");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  // ──────────────────────── Fetch Items ────────────────────────

  const fetchItems = useCallback(async () => {
    setItemsLoading(true);
    setItemsError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/availability/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === "success") {
        setItems(data.data.items);
        // Auto-select first item if none selected
        if (data.data.items.length > 0 && !activeItemId) {
          const first = data.data.items[0];
          setActiveItemId(first._id);
          setActiveItemType(first.type);
        }
      } else {
        setItemsError(data.message || "Failed to load items.");
      }
    } catch {
      setItemsError("Network error. Could not load your listings & activities.");
    } finally {
      setItemsLoading(false);
    }
  }, []);

  // ──────────────────────── Fetch Availability ────────────────────────

  const fetchAvailability = useCallback(async (itemId: string, itemType: string) => {
    if (!itemId) return;
    setAvailLoading(true);
    setAvailError("");
    setSelectedDates(new Set());
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/availability/${itemType}/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === "success") {
        setAvailability(data.data.availability);
      } else {
        setAvailError(data.message || "Failed to load availability.");
        setAvailability(null);
      }
    } catch {
      setAvailError("Network error. Could not load availability data.");
      setAvailability(null);
    } finally {
      setAvailLoading(false);
    }
  }, []);

  // ──────────────────────── Effects ────────────────────────

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (activeItemId) {
      fetchAvailability(activeItemId, activeItemType);
    }
  }, [activeItemId, activeItemType, fetchAvailability]);

  // ──────────────────────── Item Selection ────────────────────────

  const handleSelectItem = (type: "listing" | "activity", id: string) => {
    setActiveItemId(id);
    setActiveItemType(type);
    setShowPicker(false);
    setSearchQuery("");
  };

  // ──────────────────────── Calendar Navigation ────────────────────────

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
  };

  // ──────────────────────── Date Selection ────────────────────────

  const toggleDate = (dateKey: string) => {
    setSelectedDates((prev) => {
      const next = new Set(prev);
      if (next.has(dateKey)) {
        next.delete(dateKey);
      } else {
        next.add(dateKey);
      }
      return next;
    });
  };

  // ──────────────────────── Block / Unblock ────────────────────────

  const blockSelectedDates = async () => {
    if (selectedDates.size === 0) return;
    setBlocking(true);
    try {
      const token = localStorage.getItem("token");
      const dates = Array.from(selectedDates);
      const res = await fetch(`${API_BASE}/availability/${activeItemType}/${activeItemId}/block`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dates }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setAvailability(data.data.availability);
        setSelectedDates(new Set());
        showToast("success", `${dates.length} date(s) blocked successfully.`);
      } else {
        showToast("error", data.message || "Failed to block dates.");
      }
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setBlocking(false);
    }
  };

  const unblockSelectedDates = async () => {
    if (selectedDates.size === 0) return;
    setUnblocking(true);
    try {
      const token = localStorage.getItem("token");
      const dates = Array.from(selectedDates);
      const res = await fetch(`${API_BASE}/availability/${activeItemType}/${activeItemId}/unblock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dates }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setAvailability(data.data.availability);
        setSelectedDates(new Set());
        showToast("success", `${dates.length} date(s) unblocked successfully.`);
      } else {
        showToast("error", data.message || "Failed to unblock dates.");
      }
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setUnblocking(false);
    }
  };

  // ──────────────────────── Bulk Actions ────────────────────────

  const bulkAction = async (action: "all-weekends" | "all-weekdays" | "full-month") => {
    setBulkBlocking(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/availability/${activeItemType}/${activeItemId}/bulk-block`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, year: viewYear, month: viewMonth }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setAvailability(data.data.availability);
        setSelectedDates(new Set());
        const labels: Record<string, string> = {
          "all-weekends": "All weekends",
          "all-weekdays": "All weekdays",
          "full-month": "Full month",
        };
        showToast("success", `${labels[action]} blocked successfully.`);
      } else {
        showToast("error", data.message || "Bulk action failed.");
      }
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setBulkBlocking(false);
    }
  };

  const clearAllBlocked = async () => {
    setClearing(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/availability/${activeItemType}/${activeItemId}/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === "success") {
        setAvailability(data.data.availability);
        setSelectedDates(new Set());
        showToast("success", "All blocked dates cleared.");
      } else {
        showToast("error", data.message || "Failed to clear dates.");
      }
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setClearing(false);
    }
  };

  // ──────────────────────── Toast ────────────────────────

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // ──────────────────────── Derived Data ────────────────────────

  const blockedSet = new Set(availability?.blockedDates || []);
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const today = todayString();

  // Build calendar grid (with empty cells for offset)
  const calendarCells: { day: number; dateKey: string }[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push({ day: 0, dateKey: "" }); // empty
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({ day: d, dateKey: formatDateKey(viewYear, viewMonth, d) });
  }

  // Selected dates that are already blocked (for unblock mode)
  const selectedBlocked = Array.from(selectedDates).filter((d) => blockedSet.has(d));
  const selectedUnblocked = Array.from(selectedDates).filter((d) => !blockedSet.has(d));

  // ──────────────────────── Render ────────────────────────

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-28 lg:pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <VendorSidebar />

            <div className="flex-grow space-y-6">
              {/* ── Toast ── */}
              {toast && (
                <div
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold border animate-in slide-in-from-top-2",
                    toast.type === "success"
                      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                      : "bg-red-50 border-red-100 text-red-700"
                  )}
                >
                  {toast.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {toast.message}
                </div>
              )}

              {/* ── Header ── */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">Availability</h1>
                  <p className="text-xs text-zinc-500 font-medium italic">
                    Block dates to prevent bookings on specific days.
                  </p>
                </div>

                {itemsLoading ? (
                  <div className="flex items-center gap-2 h-10 px-4 rounded-xl border border-zinc-100 bg-white text-xs text-zinc-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Loading items...
                  </div>
                ) : itemsError ? (
                  <div className="flex items-center gap-2 h-10 px-4 rounded-xl border border-red-100 bg-red-50 text-xs text-red-500">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {itemsError}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[10px] font-bold text-red-600 hover:bg-red-100 rounded-lg"
                      onClick={fetchItems}
                    >
                      Retry
                    </Button>
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex items-center gap-2 h-10 px-4 rounded-xl border border-amber-100 bg-amber-50 text-xs text-amber-600 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    No published listings or activities yet.
                  </div>
                ) : (
                  <div className="relative">
                    {/* Trigger button */}
                    <button
                      type="button"
                      onClick={() => setShowPicker(!showPicker)}
                      onBlur={(e) => {
                        // Close picker on blur, but not if clicking inside picker
                        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                          setTimeout(() => {
                            if (!document.querySelector("[data-picker-panel]:focus-within")) {
                              setShowPicker(false);
                              setSearchQuery("");
                            }
                          }, 150);
                        }
                      }}
                      className="h-10 pl-3 pr-8 rounded-xl border border-zinc-100 bg-white text-xs font-bold text-zinc-900 outline-none focus:border-zinc-300 cursor-pointer flex items-center gap-2 min-w-[200px] max-w-[280px] hover:border-zinc-200 transition-colors"
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        {activeItemType === "listing" ? (
                          <Home className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                        ) : (
                          <Compass className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                        )}
                        <span className="truncate">
                          {items.find((i) => i._id === activeItemId && i.type === activeItemType)?.name || "Select item..."}
                        </span>
                      </span>
                      <svg className="w-3 h-3 text-zinc-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                    </button>

                    {/* Dropdown panel */}
                    {showPicker && (
                      <div
                        data-picker-panel
                        className="absolute top-full right-0 mt-1 w-[320px] bg-white rounded-xl border border-zinc-200 shadow-lg shadow-zinc-950/5 z-50 overflow-hidden"
                        tabIndex={-1}
                      >
                        {/* Tabs */}
                        <div className="flex border-b border-zinc-100">
                          <button
                            type="button"
                            onClick={() => { setPickerTab("stays"); setSearchQuery(""); }}
                            className={cn(
                              "flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5",
                              pickerTab === "stays"
                                ? "text-zinc-900 border-b-2 border-zinc-900 bg-zinc-50/50"
                                : "text-zinc-400 hover:text-zinc-600"
                            )}
                          >
                            <Home className="w-3 h-3" />
                            Stays ({items.filter((i) => i.type === "listing").length})
                          </button>
                          <button
                            type="button"
                            onClick={() => { setPickerTab("activities"); setSearchQuery(""); }}
                            className={cn(
                              "flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5",
                              pickerTab === "activities"
                                ? "text-zinc-900 border-b-2 border-zinc-900 bg-zinc-50/50"
                                : "text-zinc-400 hover:text-zinc-600"
                            )}
                          >
                            <Compass className="w-3 h-3" />
                            Activities ({items.filter((i) => i.type === "activity").length})
                          </button>
                        </div>

                        {/* Search bar */}
                        <div className="p-2 border-b border-zinc-50">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400" />
                            <input
                              type="text"
                              placeholder={`Search ${pickerTab === "stays" ? "stays" : "activities"}...`}
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full h-8 pl-7 pr-2 rounded-lg border border-zinc-100 bg-zinc-50 text-[11px] font-medium text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-200 focus:bg-white"
                              autoFocus
                            />
                            {searchQuery && (
                              <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-zinc-200"
                              >
                                <X className="w-2.5 h-2.5 text-zinc-400" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="max-h-[240px] overflow-y-auto">
                          {(() => {
                            const targetType = pickerTab === "stays" ? "listing" : "activity";
                            const filtered = items.filter((i) => {
                              if (i.type !== targetType) return false;
                              if (!searchQuery.trim()) return true;
                              const q = searchQuery.toLowerCase();
                              return i.name.toLowerCase().includes(q) || i.city?.toLowerCase().includes(q) || i.subtype?.toLowerCase().includes(q);
                            });

                            if (filtered.length === 0) {
                              return (
                                <div className="py-8 text-center text-[10px] text-zinc-400 font-medium">
                                  {searchQuery ? "No matching items found." : `No ${pickerTab} available.`}
                                </div>
                              );
                            }

                            return filtered.map((i) => {
                              const isActive = activeItemId === i._id && activeItemType === i.type;
                              return (
                                <button
                                  key={i._id}
                                  type="button"
                                  onClick={() => handleSelectItem(i.type, i._id)}
                                  className={cn(
                                    "w-full text-left px-3 py-2.5 flex items-center gap-2.5 transition-colors border-b border-zinc-50 last:border-b-0",
                                    isActive
                                      ? "bg-zinc-100"
                                      : "hover:bg-zinc-50"
                                  )}
                                >
                                  <span className={cn(
                                    "w-3 h-3 rounded-full border-2 flex-shrink-0",
                                    isActive ? "border-zinc-900 bg-zinc-900" : "border-zinc-200"
                                  )}>
                                    {isActive && (
                                      <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5" /></svg>
                                    )}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-bold text-zinc-900 truncate">{i.name}</p>
                                    <p className="text-[9px] text-zinc-400 font-medium truncate">
                                      {i.subtype}{i.city ? ` · ${i.city}` : ""}
                                    </p>
                                  </div>
                                </button>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Selected Item Info ── */}
              {activeItemId && availability && (
                <div className="flex items-center gap-2 px-1">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-100">
                    {activeItemType === "listing" ? (
                      <Home className="w-3 h-3 text-zinc-400" />
                    ) : (
                      <Compass className="w-3 h-3 text-zinc-400" />
                    )}
                    <span className="text-[11px] font-bold text-zinc-700">{availability.itemName}</span>
                    <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                      · {activeItemType === "listing" ? "Stay" : "Activity"}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    {availability.blockedDates.length} date(s) blocked
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* ── Main Calendar ── */}
                <div className="xl:col-span-2 space-y-4">
                  <div className="bg-white rounded-2xl border border-zinc-100 p-6 md:p-8">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-zinc-900">
                          {MONTH_NAMES[viewMonth]} {viewYear}
                        </h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[10px] font-bold text-zinc-400 hover:text-zinc-700 rounded-lg"
                          onClick={goToToday}
                        >
                          Today
                        </Button>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-zinc-100"
                          onClick={prevMonth}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-zinc-100"
                          onClick={nextMonth}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Loading / Error states */}
                    {availLoading && (
                      <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
                      </div>
                    )}

                    {availError && !availLoading && (
                      <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <AlertCircle className="w-8 h-8 text-red-300" />
                        <p className="text-xs text-red-500 font-medium">{availError}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-[10px] font-bold rounded-lg"
                          onClick={() => fetchAvailability(activeItemId, activeItemType)}
                        >
                          Retry
                        </Button>
                      </div>
                    )}

                    {/* Calendar Grid */}
                    {!availLoading && !availError && (
                      <>
                        {/* Day Headers */}
                        <div className="grid grid-cols-7 mb-4">
                          {DAYS.map((day) => (
                            <div
                              key={day}
                              className="text-center text-[9px] font-black uppercase tracking-widest text-zinc-400"
                            >
                              {day}
                            </div>
                          ))}
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-7 gap-1">
                          {calendarCells.map((cell, idx) => {
                            if (cell.day === 0) {
                              return <div key={`empty-${idx}`} className="h-12 sm:h-16" />;
                            }

                            const isBlocked = blockedSet.has(cell.dateKey);
                            const isSelected = selectedDates.has(cell.dateKey);
                            const isToday = cell.dateKey === today;
                            const isPast = cell.dateKey < today;

                            return (
                              <button
                                key={cell.dateKey}
                                onClick={() => toggleDate(cell.dateKey)}
                                disabled={isPast}
                                className={cn(
                                  "h-12 sm:h-16 rounded-xl border flex flex-col items-center justify-center transition-all relative text-xs font-bold",
                                  isPast && "opacity-30 cursor-not-allowed bg-zinc-50",
                                  !isPast && isBlocked && isSelected && "bg-red-500 border-red-500 text-white ring-2 ring-red-200",
                                  !isPast && isBlocked && !isSelected && "bg-red-50 border-red-100 text-red-500",
                                  !isPast && !isBlocked && isSelected && "bg-primary border-primary text-white",
                                  !isPast && !isBlocked && !isSelected && "bg-white border-zinc-50 text-zinc-900 hover:border-zinc-200",
                                  isToday && !isBlocked && !isSelected && "border-primary/30 ring-1 ring-primary/20"
                                )}
                              >
                                {cell.day}
                                {isBlocked && !isPast && isSelected && (
                                  <Unlock className="w-2.5 h-2.5 mt-0.5" />
                                )}
                                {isBlocked && !isPast && !isSelected && (
                                  <Lock className="w-2.5 h-2.5 mt-0.5" />
                                )}
                                {isToday && (
                                  <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-6 px-2">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                      <div className="w-2 h-2 rounded-full bg-red-400" /> Blocked
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                      <div className="w-2 h-2 rounded-full bg-primary" /> Selected
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                      <div className="w-2 h-2 rounded-full bg-primary/30" /> Today
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                      <div className="w-2 h-2 rounded-full bg-zinc-100" /> Past
                    </div>
                  </div>
                </div>

                {/* ── Controls Panel ── */}
                <div className="bg-white rounded-2xl border border-zinc-100 p-6 space-y-6">
                  {/* Selected Dates */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">
                      Bulk Actions
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-medium">
                      Select dates on the calendar, then block or unblock them.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">
                      Selected ({selectedDates.size})
                    </p>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                      {selectedDates.size > 0 ? (
                        Array.from(selectedDates)
                          .sort()
                          .map((d) => (
                            <span
                              key={d}
                              className={cn(
                                "px-2 py-0.5 rounded border text-[10px] font-bold",
                                blockedSet.has(d)
                                  ? "bg-red-50 border-red-100 text-red-600"
                                  : "bg-white border-zinc-100 text-zinc-900"
                              )}
                            >
                              {d}
                            </span>
                          ))
                      ) : (
                        <span className="text-[10px] text-zinc-400 italic font-medium">
                          {availLoading ? "Loading..." : activeItemId ? "None selected" : "Select an item first"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Block / Unblock Buttons */}
                  <div className="space-y-2">
                    <Button
                      disabled={selectedUnblocked.length === 0 || blocking || !activeItemId}
                      onClick={blockSelectedDates}
                      className="w-full h-11 rounded-xl text-xs font-bold gap-2"
                    >
                      {blocking ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                      Block {selectedUnblocked.length > 0 ? `(${selectedUnblocked.length})` : "Dates"}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={selectedBlocked.length === 0 || unblocking || !activeItemId}
                      onClick={unblockSelectedDates}
                      className="w-full h-11 rounded-xl text-xs font-bold gap-2 border-zinc-100"
                    >
                      {unblocking ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5" />
                      )}
                      Make Available {selectedBlocked.length > 0 ? `(${selectedBlocked.length})` : ""}
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-zinc-50" />

                  {/* Quick Bulk Actions */}
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-3">
                      Quick Block — {MONTH_NAMES[viewMonth]} {viewYear}
                    </p>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        disabled={bulkBlocking || !activeItemId}
                        onClick={() => bulkAction("all-weekends")}
                        className="w-full h-9 rounded-xl text-[10px] font-bold border-zinc-100 hover:bg-red-50 hover:border-red-100 hover:text-red-600"
                      >
                        {bulkBlocking ? (
                          <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                        ) : null}
                        Block All Weekends
                      </Button>
                      <Button
                        variant="outline"
                        disabled={bulkBlocking || !activeItemId}
                        onClick={() => bulkAction("all-weekdays")}
                        className="w-full h-9 rounded-xl text-[10px] font-bold border-zinc-100 hover:bg-red-50 hover:border-red-100 hover:text-red-600"
                      >
                        {bulkBlocking ? (
                          <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                        ) : null}
                        Block All Weekdays
                      </Button>
                      <Button
                        variant="outline"
                        disabled={bulkBlocking || !activeItemId}
                        onClick={() => bulkAction("full-month")}
                        className="w-full h-9 rounded-xl text-[10px] font-bold border-zinc-100 hover:bg-red-50 hover:border-red-100 hover:text-red-600"
                      >
                        {bulkBlocking ? (
                          <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                        ) : null}
                        Block Entire Month
                      </Button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-zinc-50" />

                  {/* Clear All */}
                  <Button
                    variant="ghost"
                    disabled={clearing || !activeItemId || availability?.blockedDates.length === 0}
                    onClick={clearAllBlocked}
                    className="w-full justify-start gap-2 text-zinc-500 font-bold text-[10px] uppercase tracking-widest hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    {clearing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    Clear All Blocked Dates
                  </Button>
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
