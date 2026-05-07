"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Search, 
  Calendar, 
  User, 
  Circle,
  Clock,
  Phone,
  Video
} from "lucide-react";
import { useState } from "react";
import { VendorSidebar } from "@/components/navigation/vendor-sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CONVERSATIONS = [
  { id: 1, guest: "Aryan Singh", lastMsg: "Is the early check-in confirmed?", time: "2m ago", unread: 2, online: true, bookingId: "BOK-99021", item: "Mountain Whisper Villa" },
  { id: 2, guest: "Meera Kapoor", lastMsg: "Thank you for the rafting tip!", time: "1h ago", unread: 0, online: false, bookingId: "BOK-88012", item: "River Rafting" },
];

const MESSAGES = [
  { id: 1, sender: "guest", text: "Hi, I was wondering if we can check in around 11 AM?", time: "10:30 AM" },
  { id: 2, sender: "vendor", text: "Hello Aryan! Let me check the cleaning schedule.", time: "10:35 AM" },
];

export default function VendorMessagesPage() {
  const [activeChat, setActiveChat] = useState(CONVERSATIONS[0]);
  const [input, setInput] = useState("");

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 h-[600px]">
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            <VendorSidebar />

            <div className="flex-grow flex bg-white rounded-2xl border border-zinc-100 overflow-hidden">
              
              {/* Chat List */}
              <div className="w-64 sm:w-72 border-r border-zinc-50 flex flex-col shrink-0">
                <div className="p-4 border-b border-zinc-50">
                  <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-3">Messages</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <Input placeholder="Search..." className="h-8 pl-9 rounded-lg border-zinc-100 bg-zinc-50 text-[10px]" />
                  </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                  {CONVERSATIONS.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChat(chat)}
                      className={cn(
                        "w-full p-4 flex items-center gap-3 transition-all border-b border-zinc-50/50",
                        activeChat.id === chat.id ? "bg-zinc-50" : "hover:bg-zinc-50/50"
                      )}
                    >
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400"><User className="w-5 h-5" /></div>
                        {chat.online && <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />}
                      </div>
                      <div className="flex-grow text-left overflow-hidden">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-zinc-900 text-xs truncate">{chat.guest}</span>
                          <span className="text-[9px] text-zinc-400 font-bold">{chat.time}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 truncate font-medium">{chat.lastMsg}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Window */}
              <div className="flex-grow flex flex-col bg-[#fcfcfc]/30">
                <div className="p-4 bg-white border-b border-zinc-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400"><User className="w-4 h-4" /></div>
                    <div>
                      <h3 className="font-bold text-zinc-900 text-xs">{activeChat.guest}</h3>
                      <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                        <Circle className={cn("w-1.5 h-1.5 fill-current", activeChat.online ? "text-emerald-500" : "text-zinc-300")} />
                        {activeChat.online ? "Online" : "Away"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400 hover:text-primary"><Phone className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400 hover:text-primary"><Video className="w-4 h-4" /></Button>
                    <div className="w-px h-4 bg-zinc-100 mx-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900"><MoreVertical className="w-4 h-4" /></Button>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto p-5 space-y-4">
                  {MESSAGES.map((msg) => (
                    <div key={msg.id} className={cn("flex flex-col", msg.sender === "vendor" ? "items-end" : "items-start")}>
                      <div className={cn(
                        "max-w-[80%] p-3 px-4 rounded-2xl text-xs font-medium leading-relaxed",
                        msg.sender === "vendor" 
                          ? "bg-zinc-900 text-white rounded-tr-none" 
                          : "bg-white text-zinc-900 rounded-tl-none border border-zinc-100 shadow-sm"
                      )}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-zinc-400 mt-1.5 font-black uppercase tracking-widest">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-white border-t border-zinc-50">
                  <div className="flex items-center gap-3 bg-zinc-50 p-1.5 rounded-xl border border-zinc-100">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900"><Paperclip className="w-4 h-4" /></Button>
                    <Input placeholder="Type..." className="border-none bg-transparent shadow-none focus-visible:ring-0 text-xs h-8" value={input} onChange={(e)=>setInput(e.target.value)} />
                    <Button className="rounded-lg h-8 w-8 p-0"><Send className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              </div>

              {/* Context Panel */}
              <div className="w-64 bg-white border-l border-zinc-50 p-6 space-y-6 hidden xl:block">
                <div className="space-y-3">
                  <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Booking Context</h4>
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-3">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-primary">{activeChat.bookingId}</p>
                      <h5 className="font-bold text-zinc-900 text-[11px] leading-tight">{activeChat.item}</h5>
                    </div>
                    <div className="space-y-1.5 pt-3 border-t border-zinc-100">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500"><Calendar className="w-3 h-3" /> 12-15 Oct</div>
                    </div>
                    <Link href="/vendor/bookings">
                      <Button variant="link" className="p-0 h-auto text-[9px] font-black uppercase tracking-widest text-primary">View Details</Button>
                    </Link>
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
