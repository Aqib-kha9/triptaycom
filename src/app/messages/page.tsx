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
  Image as ImageIcon, 
  MoreVertical, 
  Phone, 
  Info,
  Calendar,
  Home
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CONVERSATIONS = [
  { id: "CHAT-001", name: "Vikram Negi", image: "https://i.pravatar.cc/150?u=vikram", lastMessage: "Looking forward to your arrival!", time: "2h ago", unread: true, booking: { title: "Mountain Whisper Villa", date: "12-15 Oct" } },
  { id: "CHAT-002", name: "Rohan Sharma", image: "https://i.pravatar.cc/150?u=rohan", lastMessage: "The rafting starts at 9 AM sharp.", time: "Yesterday", unread: false, booking: { title: "River Rafting", date: "20 Oct" } },
];

const MOCK_MESSAGES = [
  { id: 1, sender: "receiver", text: "Hello Aqib! Thank you for booking Mountain Whisper Villa.", time: "10:30 AM" },
  { id: 2, sender: "sender", text: "Hi Vikram! We're excited. Is there parking available?", time: "10:32 AM" },
  { id: 3, sender: "receiver", text: "Yes, we have free private parking for up to 3 cars.", time: "10:35 AM" },
];

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(CONVERSATIONS[0]);
  const [message, setMessage] = useState("");

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
            
            <DashboardSidebar />

            <div className="flex-grow flex bg-white rounded-2xl border border-zinc-100 overflow-hidden">
              
              {/* Chat List */}
              <div className="w-full md:w-72 border-r border-zinc-50 flex flex-col h-full shrink-0">
                <div className="p-4 border-b border-zinc-50 bg-white">
                  <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-3">Messages</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <Input placeholder="Search chats..." className="h-9 pl-9 rounded-lg border-zinc-100 bg-zinc-50 text-[10px]" />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {CONVERSATIONS.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChat(chat)}
                      className={cn(
                        "w-full p-4 flex items-center gap-3 transition-all border-b border-zinc-50/50 text-left relative group",
                        activeChat.id === chat.id ? "bg-zinc-50" : "hover:bg-zinc-50/50"
                      )}
                    >
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-xl overflow-hidden">
                          <img src={chat.image} alt={chat.name} className="w-full h-full object-cover" />
                        </div>
                        {chat.unread && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white" />}
                      </div>
                      <div className="flex-1 overflow-hidden space-y-0.5">
                        <div className="flex items-center justify-between">
                          <h4 className={cn("text-xs truncate", chat.unread ? "font-bold text-zinc-900" : "font-medium text-zinc-600")}>{chat.name}</h4>
                          <span className="text-[9px] font-bold text-zinc-400 uppercase">{chat.time}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 truncate">{chat.lastMessage}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Window */}
              <div className="flex-1 flex flex-col h-full bg-[#fcfcfc]/50 relative">
                
                <div className="p-4 border-b border-zinc-50 flex items-center justify-between bg-white z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                      <img src={activeChat.image} alt={activeChat.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-zinc-900">{activeChat.name}</h3>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900"><Phone className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900"><Info className="w-4 h-4" /></Button>
                  </div>
                </div>

                {activeChat.booking && (
                  <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Home className="w-3.5 h-3.5 text-zinc-400" />
                      <div>
                        <p className="text-[10px] font-bold text-zinc-900">{activeChat.booking.title}</p>
                        <p className="text-[9px] text-zinc-500">{activeChat.booking.date}</p>
                      </div>
                    </div>
                    <Link href="/bookings">
                      <Button variant="outline" className="h-7 rounded-lg px-3 text-[9px] font-bold border-zinc-200">View</Button>
                    </Link>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="flex justify-center mb-6">
                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-400 text-[9px] font-black uppercase tracking-widest">Today</span>
                  </div>
                  
                  {MOCK_MESSAGES.map((msg) => (
                    <div 
                      key={msg.id}
                      className={cn(
                        "flex flex-col max-w-[80%] space-y-1",
                        msg.sender === "sender" ? "ml-auto items-end" : "items-start"
                      )}
                    >
                      <div className={cn(
                        "px-4 py-3 rounded-2xl text-[11px] font-medium leading-relaxed",
                        msg.sender === "sender" 
                          ? "bg-zinc-900 text-white rounded-tr-none" 
                          : "bg-white border border-zinc-100 text-zinc-900 rounded-tl-none shadow-sm"
                      )}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest px-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-white border-t border-zinc-50">
                  <form className="flex items-center gap-3 bg-zinc-50 p-1.5 rounded-xl border border-zinc-100" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex items-center gap-0.5">
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900">
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..." 
                      className="flex-1 bg-transparent border-none focus-visible:ring-0 shadow-none h-8 text-[11px]"
                    />
                    <Button type="submit" size="icon" className="h-8 w-8 rounded-lg group">
                      <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Button>
                  </form>
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
