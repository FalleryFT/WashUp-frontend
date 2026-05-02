// src/pages/Customer/ChatAdmin.jsx
import { useState, useRef, useEffect } from "react";
import CustomerSidebar from "../../components/CustomerSidebar";
import { useAuth } from "../../context/AuthContext";
import { Send, UserCircle2, WashingMachine } from "lucide-react";

function getTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}.${String(now.getMinutes()).padStart(2, "0")}`;
}

// ─── BUBBLE CHAT COMPONENT ────────────────────────────────────────────────────
function Bubble({ msg, isMe }) {
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm shadow-sm border border-black ${
          isMe
            ? "bg-[#0077b6] text-white rounded-br-sm"
            : "bg-white text-gray-800 rounded-bl-sm"
        }`}
      >
        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
        <p className={`text-[10px] mt-1.5 font-bold ${isMe ? "text-blue-100 text-right" : "text-gray-400 text-left"}`}>
          {msg.time}
        </p>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ChatAdmin() {
  const { user } = useAuth();
  const namaUser  = user?.name || user?.username || "Pelanggan";

  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const bottomRef               = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;

    // Hanya mengirim pesan dari customer ke dalam state
    const myMsg = { from: "customer", text: input.trim(), time: getTime() };
    setMessages((prev) => [...prev, myMsg]);
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <CustomerSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          
          {/* GREETING BANNER */}
          <div className="flex items-center gap-4 bg-gradient-to-r from-[#0077b6] to-[#00b4d8] text-white rounded-3xl px-8 py-7 mb-8 shadow-lg shadow-blue-100 w-full">
            <div className="bg-white/20 p-3 rounded-2xl flex-shrink-0 backdrop-blur-sm">
              <WashingMachine size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">Halo, {namaUser}! ✨</h1>
              <p className="text-blue-50 text-sm font-medium mt-1 opacity-90">Ada kendala atau pertanyaan? Hubungi admin kami di sini.</p>
            </div>
          </div>

          {/* HEADER JUDUL */}
          <div className="mb-6">
            <h2 className="font-extrabold text-gray-800 text-lg tracking-wide uppercase">Pesan Admin</h2>
          </div>

          {/* CHAT BOX CONTAINER */}
          <div
            className="bg-white rounded-3xl border border-black flex flex-col overflow-hidden shadow-sm"
            style={{ height: "calc(100vh - 280px)", minHeight: 480 }}
          >
            {/* Header Profil Admin di dalam Chat (Background Putih) */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-black bg-white">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 border border-black text-[#0077b6]">
                <UserCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 tracking-wide">CS WashUp</p>
                <p className="text-[11px] font-bold text-green-600 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>

            {/* Area Daftar Pesan (Background Biru Lembut) */}
            <div className="flex-1 overflow-y-auto px-6 py-5 bg-[#eaf6fb]">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-60">
                  <WashingMachine size={48} className="text-[#0077b6] mb-3 opacity-50" />
                  <p className="text-gray-500 text-sm font-bold">Belum ada percakapan.</p>
                  <p className="text-gray-500 text-xs mt-1">Silakan kirim pesan untuk memulai percakapan.</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <Bubble key={i} msg={msg} isMe={msg.from === "customer"} />
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Area Input Chat */}
            <div className="border-t border-black px-5 py-4 bg-white flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ketik pesan Anda di sini..."
                className="flex-1 bg-gray-50 border border-black rounded-xl px-5 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0077b6] transition-all"
              />
              <button
                onClick={send}
                disabled={!input.trim()}
                className="w-12 h-12 rounded-xl bg-[#0077b6] border border-black text-white flex items-center justify-center hover:bg-[#005f92] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
              >
                <Send size={18} className="ml-1" />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}