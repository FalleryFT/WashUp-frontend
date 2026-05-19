// src/pages/Customer/Notifications.jsx
import { useEffect, useState, useCallback } from "react";
import CustomerSidebar from "../../components/CustomerSidebar";
import { useAuth } from "../../context/AuthContext";
import {
  ClipboardList, AlertTriangle, Bell,
  WashingMachine, CheckCircle, CheckCheck, Loader2, RotateCcw, Trash2, X,
} from "lucide-react";
import axios from "../../api/axios";

// ─── Mapping title → tipe ikon ───────────────────────────────────────────────
function resolveType(title = "") {
  const t = title.toLowerCase();
  if (t.includes("maaf") || t.includes("kekeliruan") || t.includes("khilaf")) return "undo";
  if (t.includes("dibatalkan"))                                               return "batal";
  if (t.includes("dicuci") || t.includes("dipilah"))                          return "dicuci";
  if (t.includes("selesai") || t.includes("siap"))                            return "selesai";
  return "diterima";
}

const TYPES = {
  diterima: { icon: ClipboardList,  iconBg: "bg-green-500",  border: "border-l-green-500"  },
  batal:    { icon: AlertTriangle,  iconBg: "bg-red-500",    border: "border-l-red-500"    },
  dicuci:   { icon: WashingMachine, iconBg: "bg-blue-400",   border: "border-l-blue-400"   },
  selesai:  { icon: CheckCircle,    iconBg: "bg-green-500",  border: "border-l-green-500"  },
  undo:     { icon: RotateCcw,      iconBg: "bg-amber-500",  border: "border-l-amber-500"  },
};

// ─── Popup Konfirmasi Hapus ───────────────────────────────────────────────────
function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in">
        {/* Ikon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 size={26} className="text-red-500" />
          </div>
        </div>
        {/* Teks */}
        <h3 className="text-center text-gray-800 text-lg font-extrabold mb-1">
          Hapus Notifikasi?
        </h3>
        <p className="text-center text-gray-500 text-sm leading-relaxed mb-6">
          Semua notifikasi yang sudah dibaca akan dihapus permanen.
          Notifikasi yang belum dibaca tetap tersimpan.
        </p>
        {/* Tombol */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CustomerNotifikasi() {
  const { user } = useAuth();
  const namaUser = user?.name || user?.username || "Pelanggan";

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [markingAll, setMarkingAll]       = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [deleting, setDeleting]           = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/customer/notifications");
      const data = res.data.data ?? [];
      setNotifications(data);
    } catch (err) {
      console.error("Gagal ambil notifikasi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // ── Tandai satu dibaca ──────────────────────────────────────────────────
  const handleMarkRead = async (id) => {
    try {
      await axios.patch(`/customer/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) { console.error("Gagal tandai dibaca:", err); }
  };

  // ── Tandai semua dibaca ─────────────────────────────────────────────────
  const handleMarkAllRead = async () => {
    try {
      setMarkingAll(true);
      await axios.patch("/customer/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) { console.error("Gagal tandai semua dibaca:", err); }
    finally { setMarkingAll(false); }
  };

  // ── Hapus semua yang sudah dibaca ───────────────────────────────────────
  const handleDeleteRead = async () => {
    try {
      setDeleting(true);
      await axios.delete("/customer/notifications/read");
      // Hapus dari state hanya yang is_read === true
      setNotifications((prev) => prev.filter((n) => !n.is_read));
    } catch (err) { console.error("Gagal hapus notifikasi:", err); }
    finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const readCount   = notifications.filter((n) => n.is_read).length;
  const hasNotifications = notifications.length > 0;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <CustomerSidebar />

      {/* Modal Konfirmasi */}
      {showConfirm && (
        <ConfirmModal
          onConfirm={handleDeleteRead}
          onCancel={() => setShowConfirm(false)}
        />
      )}

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

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          {/* Kiri: Judul + badge unread */}
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-extrabold text-gray-800 tracking-wide uppercase">
              Notifikasi
            </h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount} baru
              </span>
            )}
          </div>

          {/* Kanan: Tombol aksi - Hanya hilang jika sama sekali tidak ada notifikasi */}
          {hasNotifications && (
            <div className="flex items-center gap-3 ml-auto flex-wrap">
              {/* Tombol Tandai Semua Dibaca */}
              <button
                onClick={handleMarkAllRead}
                disabled={markingAll || unreadCount === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all
                  ${unreadCount === 0
                    ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400 bg-white"
                    : "border-[#0077b6] text-[#0077b6] bg-white hover:bg-[#0077b6] hover:text-white"
                  }`}
              >
                {markingAll
                  ? <Loader2 size={15} className="animate-spin" />
                  : <CheckCheck size={15} />
                }
                Tandai Semua Dibaca
              </button>

              {/* Tombol Hapus Semua (yang sudah dibaca) */}
              <button
                onClick={() => setShowConfirm(true)}
                disabled={deleting || readCount === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all
                  ${readCount === 0
                    ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400 bg-white"
                    : "border-red-400 text-red-500 bg-white hover:bg-red-500 hover:text-white"
                  }`}
              >
                {deleting
                  ? <Loader2 size={15} className="animate-spin" />
                  : <Trash2 size={15} />
                }
                Hapus Semua
              </button>
            </div>
          )}
        </div>

        {/* KONTEN */}
        {loading ? (
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
        ) : !hasNotifications ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Bell size={48} className="mb-4 opacity-30" />
            <p className="text-base font-semibold">Belum ada notifikasi</p>
            <p className="text-sm mt-1">Notifikasi pesananmu akan muncul di sini.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => {
              const type   = resolveType(n.title);
              const cfg    = TYPES[type];
              const Icon   = cfg.icon;
              const isUndo = type === "undo";

              return (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && handleMarkRead(n.id)}
                  className={[
                    "flex flex-col sm:flex-row sm:items-center gap-4 bg-white rounded-2xl shadow-sm",
                    "border border-gray-100 border-l-4", cfg.border,
                    "px-6 py-5 transition-all",
                    !n.is_read ? "cursor-pointer hover:shadow-md" : "opacity-50",
                    isUndo && !n.is_read
                      ? "bg-amber-50/20 hover:bg-amber-50/40"
                      : !n.is_read ? "hover:bg-blue-50/30" : "",
                  ].join(" ")}
                >
                  {/* Ikon + Teks */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${cfg.iconBg} shadow-sm`}>
                      <Icon size={20} className="text-white" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 text-sm sm:text-base font-bold leading-snug mb-0.5">
                        {n.title}
                      </p>
                      <p className="text-gray-500 text-sm leading-relaxed">{n.message}</p>
                    </div>
                  </div>

                  {/* Waktu + Dot */}
                  <div className="flex items-center gap-3 sm:ml-auto ml-16 flex-shrink-0">
                    <div className="text-sm font-bold text-gray-400 flex gap-2">
                      <span>{n.waktu}</span>
                      <span>•</span>
                      <span>{n.tanggal}</span>
                    </div>
                    {!n.is_read && (
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isUndo ? "bg-amber-500" : "bg-blue-500"}`} />
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