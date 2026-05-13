// src/pages/Customer/Notifications.jsx
import { useEffect, useState, useCallback } from "react";
import CustomerSidebar from "../../components/CustomerSidebar";
import { useAuth } from "../../context/AuthContext";
import {
  ClipboardList, AlertTriangle, Bell,
  WashingMachine, CheckCircle, CheckCheck, Loader2,
} from "lucide-react";
import axios from "../../api/axios";

// ─── Mapping title → tipe ikon ───────────────────────────────────────────────
function resolveType(title = "") {
  const t = title.toLowerCase();
  if (t.includes("dibatalkan"))                         return "batal";
  if (t.includes("pesan") || t.includes("chat"))        return "pesan";
  if (t.includes("dicuci") || t.includes("dipilah"))    return "dicuci";
  if (t.includes("selesai") || t.includes("siap"))      return "selesai";
  return "diterima";
}

const TYPES = {
  diterima: { icon: ClipboardList,  iconBg: "bg-green-500",   border: "border-l-green-500"   },
  batal:    { icon: AlertTriangle,  iconBg: "bg-red-500",     border: "border-l-red-500"     },
  pesan:    { icon: Bell,           iconBg: "bg-[#0077b6]",   border: "border-l-[#0077b6]"  },
  dicuci:   { icon: WashingMachine, iconBg: "bg-blue-400",    border: "border-l-blue-400"    },
  selesai:  { icon: CheckCircle,    iconBg: "bg-green-500",   border: "border-l-green-500"   },
};

export default function CustomerNotifikasi() {
  const { user } = useAuth();
  const namaUser = user?.name || user?.username || "Pelanggan";

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [markingAll, setMarkingAll]       = useState(false);

  // ── Ambil semua notifikasi ──────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/customer/notifications");
      setNotifications(res.data.data ?? []);
    } catch (err) {
      console.error("Gagal ambil notifikasi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ── Tandai satu notifikasi dibaca ───────────────────────────────────────
  const handleMarkRead = async (id) => {
    try {
      await axios.patch(`/customer/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Gagal tandai dibaca:", err);
    }
  };

  // ── Tandai semua dibaca ─────────────────────────────────────────────────
  const handleMarkAllRead = async () => {
    try {
      setMarkingAll(true);
      await axios.patch("/customer/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Gagal tandai semua dibaca:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <CustomerSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">

        {/* GREETING BANNER */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-[#0077b6] to-[#00b4d8] text-white rounded-3xl px-8 py-7 mb-8 shadow-lg shadow-blue-100 w-full">
          <div className="bg-white/20 p-3 rounded-2xl flex-shrink-0 backdrop-blur-sm">
            <WashingMachine size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Halo, {namaUser}! ✨</h1>
            <p className="text-blue-50 text-sm font-medium mt-1 opacity-90">
              Pantau semua pemberitahuan dan pembaruan pesananmu di sini.
            </p>
          </div>
        </div>

        {/* Header + Tombol Tandai Semua */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-extrabold text-gray-800 tracking-wide uppercase">
              Notifikasi
            </h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount} baru
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="flex items-center gap-2 text-sm font-semibold text-[#0077b6] hover:text-[#005f8e] disabled:opacity-50 transition-colors"
            >
              {markingAll
                ? <Loader2 size={16} className="animate-spin" />
                : <CheckCheck size={16} />
              }
              Tandai semua dibaca
            </button>
          )}
        </div>

        {/* KONTEN */}
        {loading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 px-6 py-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Bell size={48} className="mb-4 opacity-30" />
            <p className="text-base font-semibold">Belum ada notifikasi</p>
            <p className="text-sm mt-1">Notifikasi pesananmu akan muncul di sini.</p>
          </div>
        ) : (
          // List notifikasi
          <div className="space-y-4">
            {notifications.map((n) => {
              const type = resolveType(n.title);
              const cfg  = TYPES[type];
              const Icon = cfg.icon;

              return (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && handleMarkRead(n.id)}
                  className={`flex flex-col sm:flex-row sm:items-center gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${cfg.border} px-6 py-5 transition-all
                    ${!n.is_read ? "cursor-pointer hover:shadow-md hover:bg-blue-50/30" : "opacity-70"}`}
                >
                  {/* Kiri: Ikon + Teks */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${cfg.iconBg} shadow-sm`}>
                      <Icon size={20} className="text-white" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-gray-800 text-sm sm:text-base font-bold leading-snug ${!n.is_read ? "" : "font-semibold"}`}>
                        {n.title}
                      </p>
                      <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                  </div>

                  {/* Kanan: Waktu + Status */}
                  <div className="flex items-center gap-3 sm:ml-auto ml-16 flex-shrink-0">
                    <div className="text-sm font-bold text-gray-400 flex gap-2">
                      <span>{n.waktu}</span>
                      <span>•</span>
                      <span>{n.tanggal}</span>
                    </div>
                    {!n.is_read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}