"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Home,
  Loader2,
  Wifi,
  WifiOff,
  ChevronLeft,
  X,
  Circle,
  Users,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { io, Socket } from "socket.io-client";

// ──────────────────────── Types ────────────────────────

interface OtherUser {
  _id: string;
  name: string;
  email: string;
}

interface BookingContext {
  title: string;
  dateRange: string;
  type: "listing" | "activity";
}

interface Conversation {
  _id: string;
  otherUser: OtherUser | null;
  listingId?: string;
  activityId?: string;
  bookingContext?: BookingContext | null;
  lastMessage?: {
    text: string;
    sender: string;
    sentAt: string;
  } | null;
  unreadCount: number;
  updatedAt: string;
}

interface Message {
  _id: string;
  conversation: string;
  sender: { _id: string; name: string; email: string };
  type: "text" | "image" | "file" | "system";
  text?: string;
  mediaUrl?: string;
  mediaType?: string;
  fileName?: string;
  fileSize?: number;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

// ──────────────────────── Constants ────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || API_BASE.replace(/\/api$/, "");

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  const timeStr = `${displayHour}:${minutes} ${ampm}`;

  if (diffDays === 0) return timeStr;
  if (diffDays === 1) return `Yesterday`;
  if (diffDays < 7) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  }
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function formatMessageDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

// ──────────────────────── Component ────────────────────────

export default function MessagesPage() {
  // ── Core State ──
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");

  // ── UI State ──
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [conversationsError, setConversationsError] = useState<string | null>(
    null
  );
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  // ── Refs ──
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingEmittedRef = useRef(false);

  // ──────────────────────── Socket Connection ────────────────────────

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setSocketError("Not authenticated. Please log in.");
      return;
    }

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });

    newSocket.on("connect", () => {
      console.log("[Socket] Connected:", newSocket.id);
      setIsConnected(true);
      setSocketError(null);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
      setSocketError(`Connection failed: ${err.message}`);
      setIsConnected(false);
    });

    // Incoming message
    newSocket.on("message:new", ({ message }: { message: Message }) => {
      setMessages((prev) => {
        // Deduplicate
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
      // Refresh conversation list to update lastMessage & order
      fetchConversations();
      // Scroll down
      setTimeout(() => scrollToBottom(), 100);
    });

    // Typing indicator
    newSocket.on(
      "typing:update",
      ({
        conversationId,
        userId,
        isTyping,
      }: {
        conversationId: string;
        userId: string;
        isTyping: boolean;
      }) => {
        if (activeConversation?._id !== conversationId) return;
        setTypingUsers((prev) => {
          const next = new Set(prev);
          if (isTyping) next.add(userId);
          else next.delete(userId);
          return next;
        });
      }
    );

    // Read receipts
    newSocket.on(
      "messages:read",
      ({
        conversationId,
        readBy,
      }: {
        conversationId: string;
        readBy: string;
      }) => {
        if (activeConversation?._id !== conversationId) return;
        setMessages((prev) =>
          prev.map((m) =>
            m.sender._id !== readBy && !m.isRead ? { ...m, isRead: true } : m
          )
        );
      }
    );

    // Online/offline status
    newSocket.on("user:online", ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });

    newSocket.on("user:offline", ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.removeAllListeners();
      newSocket.close();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // ──────────────────────── Fetch Conversations ────────────────────────

  const fetchConversations = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      setConversationsError(null);
      const res = await fetch(`${API_BASE}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "Failed to load conversations.");
      }

      const json = await res.json();
      setConversations(json.data || []);
    } catch (err: any) {
      setConversationsError(err.message);
    } finally {
      setConversationsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ──────────────────────── Fetch Messages ────────────────────────

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      const token = getToken();
      if (!token) return;

      try {
        setMessagesLoading(true);
        setMessagesError(null);

        const res = await fetch(
          `${API_BASE}/chat/conversations/${conversationId}/messages?limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.message || "Failed to load messages.");
        }

        const json = await res.json();
        setMessages(json.data || []);
      } catch (err: any) {
        setMessagesError(err.message);
      } finally {
        setMessagesLoading(false);
      }
    },
    []
  );

  // ──────────────────────── Join/Leave Socket Room ────────────────────────

  const handleSelectConversation = useCallback(
    (conv: Conversation) => {
      // Leave previous room
      if (activeConversation && socket) {
        socket.emit("conversation:leave", activeConversation._id);
      }

      setActiveConversation(conv);
      setShowMobileChat(true);
      setMessages([]);
      setTypingUsers(new Set());

      // Join new room
      if (socket) {
        socket.emit("conversation:join", conv._id);
        // Mark as read
        socket.emit("messages:read", conv._id);
      }

      fetchMessages(conv._id);

      // Update local unread count
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conv._id ? { ...c, unreadCount: 0 } : c
        )
      );
    },
    [activeConversation, socket, fetchMessages]
  );

  const handleBackToList = () => {
    if (activeConversation && socket) {
      socket.emit("conversation:leave", activeConversation._id);
    }
    setActiveConversation(null);
    setShowMobileChat(false);
    setMessages([]);
    setTypingUsers(new Set());
  };

  // ──────────────────────── Send Message ────────────────────────

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = messageInput.trim();
    if (!trimmed || !activeConversation || sending) return;

    setSending(true);
    setMessageInput("");

    // Stop typing indicator
    if (socket && activeConversation) {
      socket.emit("typing:stop", activeConversation._id);
      isTypingEmittedRef.current = false;
    }

    if (socket && isConnected) {
      socket.emit(
        "message:send",
        {
          conversationId: activeConversation._id,
          text: trimmed,
          type: "text",
        },
        (response: { ok: boolean; data?: Message; error?: string }) => {
          setSending(false);
          if (response.ok && response.data) {
            setMessages((prev) => {
              if (prev.some((m) => m._id === response.data!._id)) return prev;
              return [...prev, response.data!];
            });
            scrollToBottom();
            fetchConversations();
          } else {
            setMessagesError(response.error || "Failed to send message.");
          }
        }
      );
    } else {
      // REST fallback
      try {
        const token = getToken();
        const res = await fetch(
          `${API_BASE}/chat/conversations/${activeConversation._id}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text: trimmed, type: "text" }),
          }
        );

        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.message || "Failed to send message.");
        }

        const json = await res.json();
        setMessages((prev) => [...prev, json.data]);
        scrollToBottom();
        fetchConversations();
      } catch (err: any) {
        setMessagesError(err.message);
      } finally {
        setSending(false);
      }
    }
  };

  // ──────────────────────── Typing Indicator ────────────────────────

  const handleTyping = (text: string) => {
    setMessageInput(text);

    if (!socket || !activeConversation) return;

    if (text.trim() && !isTypingEmittedRef.current) {
      socket.emit("typing:start", activeConversation._id);
      isTypingEmittedRef.current = true;
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingEmittedRef.current && socket && activeConversation) {
        socket.emit("typing:stop", activeConversation._id);
        isTypingEmittedRef.current = false;
      }
    }, 2000);
  };

  // ──────────────────────── Helpers ────────────────────────

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Filter conversations by search
  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = c.otherUser?.name?.toLowerCase() || "";
    const booking = c.bookingContext?.title?.toLowerCase() || "";
    return name.includes(q) || booking.includes(q);
  });

  // Group messages by date
  const groupedMessages = messages.reduce<
    { date: string; messages: Message[] }[]
  >((acc, msg) => {
    const date = formatMessageDate(msg.createdAt);
    const last = acc[acc.length - 1];
    if (last && last.date === date) {
      last.messages.push(msg);
    } else {
      acc.push({ date, messages: [msg] });
    }
    return acc;
  }, []);

  // Get typing indicator text
  const getTypingText = (): string => {
    if (typingUsers.size === 0) return "";
    const otherUser = activeConversation?.otherUser;
    const otherName = otherUser?.name || "User";
    return `${otherName} is typing...`;
  };

  // ──────────────────────── Empty State Helpers ────────────────────────

  const renderEmptyConversations = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-3">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
        <MessageSquare className="w-7 h-7 text-zinc-300" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-zinc-500">No Conversations</h4>
        <p className="text-[10px] text-zinc-400 mt-0.5 max-w-[220px]">
          When you message a host or a guest, conversations will appear here.
        </p>
      </div>
    </div>
  );

  const renderEmptyChat = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center"
      >
        <MessageSquare className="w-10 h-10 text-zinc-300" />
      </motion.div>
      <div>
        <h3 className="text-sm font-bold text-zinc-600">Your Messages</h3>
        <p className="text-[11px] text-zinc-400 mt-1 max-w-[280px]">
          Select a conversation from the left to start chatting. Messages are
          sent and received in real-time.
        </p>
      </div>
    </div>
  );

  // ──────────────────────── Render ────────────────────────

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
            {/* ── Sidebar ── */}
            <DashboardSidebar />

            {/* ── Main Chat Container ── */}
            <div className="flex-grow flex bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
              {/* ──────────────────── Conversation List ──────────────────── */}
              <div
                className={cn(
                  "w-full md:w-80 border-r border-zinc-50 flex flex-col h-full shrink-0",
                  showMobileChat && activeConversation
                    ? "hidden md:flex"
                    : "flex"
                )}
              >
                {/* Header */}
                <div className="p-4 border-b border-zinc-50 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">
                      Messages
                    </h2>
                    <div
                      className={cn(
                        "flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider",
                        isConnected ? "text-emerald-600" : "text-red-500"
                      )}
                    >
                      {isConnected ? (
                        <>
                          <Wifi className="w-3 h-3" />
                          <span>Live</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-3 h-3" />
                          <span>Offline</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <Input
                      placeholder="Search chats..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 pl-9 pr-8 rounded-lg border-zinc-100 bg-zinc-50 text-[10px]"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-3 h-3 text-zinc-400 hover:text-zinc-600" />
                      </button>
                    )}
                  </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                  {conversationsLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                    </div>
                  ) : conversationsError ? (
                    <div className="flex flex-col items-center justify-center h-32 p-4 gap-2">
                      <p className="text-[10px] text-red-500 text-center">
                        {conversationsError}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[9px] rounded-lg"
                        onClick={fetchConversations}
                      >
                        Retry
                      </Button>
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    renderEmptyConversations()
                  ) : (
                    <AnimatePresence>
                      {filteredConversations.map((chat) => (
                        <motion.button
                          key={chat._id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          onClick={() => handleSelectConversation(chat)}
                          className={cn(
                            "w-full p-4 flex items-center gap-3 transition-all border-b border-zinc-50/50 text-left relative group",
                            activeConversation?._id === chat._id
                              ? "bg-zinc-50 border-l-2 border-l-primary"
                              : "hover:bg-zinc-50/50"
                          )}
                        >
                          <div className="relative shrink-0">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm",
                                chat.bookingContext?.type === "listing"
                                  ? "bg-amber-500"
                                  : chat.bookingContext?.type === "activity"
                                    ? "bg-blue-500"
                                    : "bg-zinc-300"
                              )}
                            >
                              {chat.otherUser?.name?.charAt(0)?.toUpperCase() ||
                                "?"}
                            </div>
                            {onlineUsers.has(chat.otherUser?._id || "") && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                            )}
                            {chat.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-primary flex items-center justify-center border-2 border-white">
                                <span className="text-[8px] font-black text-white px-1">
                                  {chat.unreadCount > 9
                                    ? "9+"
                                    : chat.unreadCount}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 overflow-hidden space-y-0.5">
                            <div className="flex items-center justify-between">
                              <h4
                                className={cn(
                                  "text-xs truncate",
                                  chat.unreadCount > 0
                                    ? "font-bold text-zinc-900"
                                    : "font-medium text-zinc-600"
                                )}
                              >
                                {chat.otherUser?.name || "Unknown User"}
                              </h4>
                              <span className="text-[9px] font-bold text-zinc-400 uppercase shrink-0 ml-2">
                                {chat.lastMessage?.sentAt
                                  ? formatTime(chat.lastMessage.sentAt)
                                  : formatTime(chat.updatedAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {chat.bookingContext && (
                                <div className="flex items-center gap-1 min-w-0">
                                  <Home className="w-2.5 h-2.5 text-zinc-400 shrink-0" />
                                  <span className="text-[9px] text-zinc-500 truncate">
                                    {chat.bookingContext.title}
                                  </span>
                                </div>
                              )}
                            </div>
                            <p
                              className={cn(
                                "text-[10px] truncate",
                                chat.unreadCount > 0
                                  ? "text-zinc-700 font-medium"
                                  : "text-zinc-500"
                              )}
                            >
                              {chat.lastMessage?.text || "No messages yet"}
                            </p>
                          </div>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>

              {/* ──────────────────── Chat Window ──────────────────── */}
              <div
                className={cn(
                  "flex-1 flex flex-col h-full bg-[#fcfcfc]/50 relative",
                  !showMobileChat || !activeConversation
                    ? "hidden md:flex"
                    : "flex"
                )}
              >
                {!activeConversation ? (
                  renderEmptyChat()
                ) : (
                  <>
                    {/* ── Chat Header ── */}
                    <div className="p-4 border-b border-zinc-50 flex items-center justify-between bg-white z-10 shrink-0">
                      <div className="flex items-center gap-3">
                        {/* Back button (mobile) */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg md:hidden"
                          onClick={handleBackToList}
                        >
                          <ChevronLeft className="w-5 h-5 text-zinc-600" />
                        </Button>
                        <div
                          className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0",
                            activeConversation.bookingContext?.type ===
                              "listing"
                              ? "bg-amber-500"
                              : activeConversation.bookingContext?.type ===
                                "activity"
                                ? "bg-blue-500"
                                : "bg-zinc-300"
                          )}
                        >
                          {activeConversation.otherUser?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-zinc-900">
                            {activeConversation.otherUser?.name ||
                              "Unknown User"}
                          </h3>
                          <div className="flex items-center gap-1.5">
                            {onlineUsers.has(
                              activeConversation.otherUser?._id || ""
                            ) ? (
                              <>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">
                                  Online
                                </span>
                              </>
                            ) : (
                              <>
                                <Circle className="w-1.5 h-1.5 text-zinc-300 fill-zinc-300" />
                                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">
                                  Offline
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── Booking Context Bar ── */}
                    {activeConversation.bookingContext && (
                      <div className="px-4 py-2.5 bg-zinc-50 border-b border-zinc-50 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={cn(
                              "w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
                              activeConversation.bookingContext.type ===
                                "listing"
                                ? "bg-amber-100"
                                : "bg-blue-100"
                            )}
                          >
                            <Home
                              className={cn(
                                "w-3 h-3",
                                activeConversation.bookingContext.type ===
                                  "listing"
                                  ? "text-amber-600"
                                  : "text-blue-600"
                              )}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-zinc-900 truncate">
                              {activeConversation.bookingContext.title}
                            </p>
                            {activeConversation.bookingContext.dateRange && (
                              <p className="text-[9px] text-zinc-500">
                                {activeConversation.bookingContext.dateRange}
                              </p>
                            )}
                          </div>
                        </div>
                        <Link
                          href={
                            activeConversation.bookingContext.type === "listing"
                              ? `/stays/${activeConversation.listingId || ""}`
                              : `/activities/${activeConversation.activityId || ""}`
                          }
                        >
                          <Button
                            variant="outline"
                            className="h-7 rounded-lg px-3 text-[9px] font-bold border-zinc-200 shrink-0"
                          >
                            View
                          </Button>
                        </Link>
                      </div>
                    )}

                    {/* ── Messages ── */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                      {messagesLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
                        </div>
                      ) : messagesError ? (
                        <div className="flex flex-col items-center justify-center h-full gap-2">
                          <p className="text-[10px] text-red-500">
                            {messagesError}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[9px] rounded-lg"
                            onClick={() =>
                              activeConversation &&
                              fetchMessages(activeConversation._id)
                            }
                          >
                            Retry
                          </Button>
                        </div>
                      ) : groupedMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                          <MessageSquare className="w-8 h-8 text-zinc-300" />
                          <p className="text-[11px] text-zinc-400">
                            No messages yet. Say hello!
                          </p>
                        </div>
                      ) : (
                        <>
                          {groupedMessages.map((group, gi) => (
                            <div key={group.date} className="space-y-3">
                              {/* Date divider */}
                              <div className="flex justify-center">
                                <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-400 text-[9px] font-black uppercase tracking-widest">
                                  {group.date}
                                </span>
                              </div>

                              {group.messages.map((msg, mi) => {
                                // Determine if message is mine based on conversation.otherUser
                                const isMine =
                                  msg.sender._id !==
                                  activeConversation.otherUser?._id;

                                return (
                                  <div
                                    key={msg._id}
                                    className={cn(
                                      "flex flex-col max-w-[80%] space-y-0.5",
                                      isMine
                                        ? "ml-auto items-end"
                                        : "items-start"
                                    )}
                                  >
                                    {/* Text message */}
                                    {msg.type === "text" && msg.text && (
                                      <div
                                        className={cn(
                                          "px-4 py-2.5 rounded-2xl text-[11px] font-medium leading-relaxed break-words",
                                          isMine
                                            ? "bg-zinc-900 text-white rounded-tr-none"
                                            : "bg-white border border-zinc-100 text-zinc-900 rounded-tl-none shadow-sm"
                                        )}
                                      >
                                        {msg.text}
                                      </div>
                                    )}

                                    {/* Image message */}
                                    {msg.type === "image" && msg.mediaUrl && (
                                      <div className="rounded-2xl overflow-hidden max-w-[240px]">
                                        <img
                                          src={msg.mediaUrl}
                                          alt="Shared image"
                                          className="w-full h-auto object-cover"
                                        />
                                      </div>
                                    )}

                                    {/* File message */}
                                    {msg.type === "file" && (
                                      <div
                                        className={cn(
                                          "px-4 py-3 rounded-2xl flex items-center gap-2 text-[11px]",
                                          isMine
                                            ? "bg-zinc-900 text-white rounded-tr-none"
                                            : "bg-white border border-zinc-100 text-zinc-900 rounded-tl-none shadow-sm"
                                        )}
                                      >
                                        <Paperclip className="w-4 h-4 shrink-0" />
                                        <span className="truncate">
                                          {msg.fileName || "File"}
                                        </span>
                                      </div>
                                    )}

                                    {/* System message */}
                                    {msg.type === "system" && msg.text && (
                                      <div className="flex justify-center w-full">
                                        <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-400 text-[9px] font-medium italic">
                                          {msg.text}
                                        </span>
                                      </div>
                                    )}

                                    {/* Timestamp */}
                                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest px-1">
                                      {formatTime(msg.createdAt)}
                                      {isMine && (
                                        <span className="ml-1">
                                          {msg.isRead ? "✓✓" : "✓"}
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          ))}

                          {/* Typing indicator */}
                          <AnimatePresence>
                            {typingUsers.size > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-start gap-2"
                              >
                                <div className="px-4 py-2.5 rounded-2xl rounded-tl-none bg-white border border-zinc-100 shadow-sm flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0ms]" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:150ms]" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:300ms]" />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* ── Message Input ── */}
                    <div className="p-4 bg-white border-t border-zinc-50 shrink-0">
                      <form
                        onSubmit={sendMessage}
                        className="flex items-center gap-2 bg-zinc-50 p-1.5 rounded-xl border border-zinc-100"
                      >
                        <Input
                          ref={inputRef}
                          value={messageInput}
                          onChange={(e) => handleTyping(e.target.value)}
                          placeholder={
                            isConnected
                              ? "Type a message..."
                              : "Reconnecting..."
                          }
                          disabled={!isConnected}
                          className="flex-1 bg-transparent border-none focus-visible:ring-0 shadow-none h-8 text-[11px] placeholder:text-[10px]"
                        />
                        <Button
                          type="submit"
                          size="icon"
                          disabled={!messageInput.trim() || sending}
                          className="h-8 w-8 rounded-lg group"
                        >
                          {sending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          )}
                        </Button>
                      </form>
                    </div>
                  </>
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
