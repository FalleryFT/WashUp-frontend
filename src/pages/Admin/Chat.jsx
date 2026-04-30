// src/pages/Admin/ChatCustomer.jsx
import { useState, useRef, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Search, Send } from "lucide-react";

// ─── DATA DUMMY PERCAKAPAN ───────────────────────────────────────────────────
const initialContacts = [
  {
    id: 1,
    nama: "Budi Santoso",
    avatar: "BS",
    color: "bg-blue-500",
    messages: [
      { from: "customer", text: "Halo min, laundry saya sudah selesai belum?", time: "09.00" },
      { from: "admin",    text: "Halo Pak Budi! Laundry Anda sedang dalam proses ya, estimasi selesai hari ini sore jam 5.", time: "09.02" },
      { from: "customer", text: "Oke siap, makasih min!", time: "09.03" },
      { from: "admin",    text: "Sama-sama Pak! Nanti kami kabari kalau sudah siap diambil 😊", time: "09.04" },
    ],
  },
  {
    id: 2,
    nama: "Siti Rahayu",
    avatar: "SR",
    color: "bg-pink-500",
    messages: [
      { from: "customer", text: "Min, selimut saya bisa pakai layanan express gak?", time: "09.30" },
      { from: "admin",    text: "Bisa Mbak Siti! Layanan express selesai dalam 6 jam. Mau langsung diproses?", time: "09.32" },
      { from: "customer", text: "Iya mau min, besok pagi udah mau dipakai soalnya 😅", time: "09.33" },
      { from: "admin",    text: "Siap Mbak! Kami proses segera ya. Total biaya nanti kami kirimkan lewat sini.", time: "09.35" },
      { from: "customer", text: "Makasih banyak min, bintang 5 deh!", time: "09.36" },
    ],
  },
  {
    id: 3,
    nama: "Ahmad Fauzi",
    avatar: "AF",
    color: "bg-green-500",
    messages: [
      { from: "customer", text: "Permisi, mau tanya harga cuci bedcover berapa ya?", time: "10.00" },
      { from: "admin",    text: "Halo Pak Ahmad! Harga cuci bedcover Rp 35.000 per pcs ya.", time: "10.01" },
      { from: "customer", text: "Kalau bedcover king size sama harganya?", time: "10.02" },
      { from: "admin",    text: "Untuk king size ada tambahan Rp 10.000 Pak, jadi Rp 45.000 ya.", time: "10.03" },
      { from: "customer", text: "Oke paham, nanti saya antar siang ini ya min.", time: "10.05" },
      { from: "admin",    text: "Siap Pak Ahmad, kami tunggu! Jam operasional kami 08.00–20.00 ya 👍", time: "10.06" },
    ],
  },
  {
    id: 4,
    nama: "Dewi Lestari",
    avatar: "DL",
    color: "bg-purple-500",
    messages: [
      { from: "customer", text: "Min orderan saya kok belum ada update ya?", time: "11.00" },
      { from: "admin",    text: "Maaf Mbak Dewi, kami cek dulu ya. Boleh share nomor nota-nya?", time: "11.02" },
      { from: "customer", text: "Nota #31122023 min.", time: "11.03" },
      { from: "admin",    text: "Sudah kami cek Mbak, orderan Anda sedang dalam proses cuci setrika ya. Estimasi selesai 2 jam lagi.", time: "11.05" },
      { from: "customer", text: "Oke min, ditunggu ya!", time: "11.06" },
    ],
  },
  {
    id: 5,
    nama: "Rizky Pratama",
    avatar: "RP",
    color: "bg-orange-500",
    messages: [
      { from: "customer", text: "Gan, ada promo gak bulan ini?", time: "13.00" },
      { from: "admin",    text: "Ada Kak Rizky! Bulan ini diskon 20% untuk cuci kilogram minimal 5kg. Berlaku sampai akhir bulan 🎉", time: "13.01" },
      { from: "customer", text: "Wah mantap! Bisa daftar member gak biar dapat benefit lebih?", time: "13.03" },
      { from: "admin",    text: "Bisa banget Kak! Daftar member gratis, nanti dapat poin setiap transaksi yang bisa ditukar diskon.", time: "13.04" },
      { from: "customer", text: "Caranya gimana min?", time: "13.05" },
      { from: "admin",    text: "Tinggal download app WashUp terus register pakai nomor HP Kakak. Mudah banget 😊", time: "13.06" },
    ],
  },
];

function getTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}.${String(now.getMinutes()).padStart(2, "0")}`;
}

// ─── BUBBLE ──────────────────────────────────────────────────────────────────
function Bubble({ msg, isAdmin }) {
  return (
    <div className={`flex ${isAdmin ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
        isAdmin
          ? "bg-[#0077b6] text-white rounded-br-sm"
          : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
      }`}>
        <p className="leading-relaxed">{msg.text}</p>
        <p className={`text-xs mt-1 text-right ${isAdmin ? "text-blue-200" : "text-gray-400"}`}>{msg.time}</p>
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function ChatCustomer() {
  const [contacts, setContacts] = useState(initialContacts);
  const [activeId, setActiveId] = useState(1);
  const [search, setSearch]     = useState("");
  const [input, setInput]       = useState("");
  const bottomRef               = useRef(null);

  const active = contacts.find((c) => c.id === activeId);

  // Auto-scroll ke bawah
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, contacts]);

  // Filter kontak
  const filtered = contacts.filter((c) =>
    c.nama.toLowerCase().includes(search.toLowerCase())
  );

  // Last message preview
  const lastMsg = (c) => c.messages[c.messages.length - 1]?.text ?? "";
  const lastTime = (c) => c.messages[c.messages.length - 1]?.time ?? "";

  // Kirim pesan admin (HANYA MENGIRIM PESAN, TANPA AUTO-REPLY)
  const sendMessage = () => {
    if (!input.trim()) return;
    const adminMsg = { from: "admin", text: input.trim(), time: getTime() };

    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeId ? { ...c, messages: [...c.messages, adminMsg] } : c
      )
    );
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <AdminSidebar>
      {/* Header */}
      <div className="mb-6">
        {/* Halo Admin - Lebar Penuh (w-full) */}
        <div className="flex items-center gap-3 bg-[#0077b6] text-white rounded-xl px-5 py-4 mb-6 shadow w-full">
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
          <h1 className="text-xl font-bold">Halo Admin</h1>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-800">Chat Customer</h1>
      </div>

      {/* Layout Chat */}
      <div className="flex rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white" style={{ height: "calc(100vh - 220px)", minHeight: 480 }}>

        {/* ── SIDEBAR KONTAK ── */}
        <div className="w-64 flex-shrink-0 border-r border-gray-100 flex flex-col">
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari Customer"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm bg-[#eaf6fb] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30"
              />
              <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Daftar kontak */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 text-left transition hover:bg-[#eaf6fb] ${
                  activeId === c.id ? "bg-[#eaf6fb] border-l-4 border-l-[#0077b6]" : ""
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${c.color}`}>
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{c.nama}</p>
                  <p className="text-xs text-gray-400 truncate">{lastMsg(c)}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{lastTime(c)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── AREA CHAT ── */}
        <div className="flex-1 flex flex-col">
          {/* Header chat */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-white">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${active?.color}`}>
              {active?.avatar}
            </div>
            <span className="font-semibold text-gray-800">{active?.nama}</span>
          </div>

          {/* Pesan */}
          <div className="flex-1 overflow-y-auto px-5 py-4 bg-[#f0f7fb]">
            {active?.messages.map((msg, i) => (
              <Bubble key={i} msg={msg} isAdmin={msg.from === "admin"} />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 px-4 py-3 bg-white flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ketik pesan..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-[#eaf6fb] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 transition"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full bg-[#0077b6] text-white flex items-center justify-center hover:bg-[#005f92] transition disabled:opacity-40 disabled:cursor-not-allowed shadow"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}