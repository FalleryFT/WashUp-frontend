// src/pages/Customer/Notifikasi.jsx
import CustomerSidebar from "../../components/CustomerSidebar";
import { useAuth } from "../../context/AuthContext";
import { ClipboardList, AlertTriangle, Bell, WashingMachine, CheckCircle } from "lucide-react";

// ─── TIPE NOTIFIKASI ──────────────────────────────────────────────────────────
const TYPES = {
  diterima:  { icon: ClipboardList,  iconBg: "bg-green-500",  border: "border-l-green-500"  },
  batal:     { icon: AlertTriangle,  iconBg: "bg-red-500",    border: "border-l-red-500"    },
  pesan:     { icon: Bell,           iconBg: "bg-[#0077b6]",  border: "border-l-[#0077b6]"  },
  dicuci:    { icon: WashingMachine, iconBg: "bg-green-500",  border: "border-l-green-500"  },
  selesai:   { icon: CheckCircle,    iconBg: "bg-green-500",  border: "border-l-green-500"  },
};

const notifications = [
  { id: 1, type: "diterima", pesan: "Pesanan Nota#001 Sudah Diterima",    waktu: "10.00", tanggal: "10/10/2026" },
  { id: 2, type: "batal",    pesan: "Pesanan Nota#001 Dibatalkan",        waktu: "10.00", tanggal: "10/10/2026" },
  { id: 3, type: "pesan",    pesan: "Anda Mendapat Pesan Dari Admin",     waktu: "10.00", tanggal: "10/10/2026" },
  { id: 4, type: "dicuci",   pesan: "Pesanan Nota#001 Sedang Di cuci",    waktu: "10.00", tanggal: "10/10/2026" },
  { id: 5, type: "selesai",  pesan: "Pesanan Nota#001 Sudah Selesai",     waktu: "10.00", tanggal: "10/10/2026" },
];

export default function CustomerNotifikasi() {
  const { user } = useAuth();
  const namaUser = user?.name || user?.username || "Pelanggan";

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <CustomerSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">

        {/* GREETING BANNER (100% Sama Persis) */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-[#0077b6] to-[#00b4d8] text-white rounded-3xl px-8 py-7 mb-8 shadow-lg shadow-blue-100 w-full">
          <div className="bg-white/20 p-3 rounded-2xl flex-shrink-0 backdrop-blur-sm">
            <WashingMachine size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Halo, {namaUser}! ✨</h1>
            <p className="text-blue-50 text-sm font-medium mt-1 opacity-90">Pantau semua pemberitahuan dan pembaruan pesananmu di sini.</p>
          </div>
        </div>

        {/* Header Judul */}
        <div className="mb-6">
          <h2 className="text-lg font-extrabold text-gray-800 tracking-wide uppercase">Notifikasi</h2>
        </div>

        {/* List Notifikasi (Clean & Modern) */}
        <div className="space-y-4">
          {notifications.map((n) => {
            const cfg  = TYPES[n.type];
            const Icon = cfg.icon;
            return (
              <div
                key={n.id}
                className={`flex flex-col sm:flex-row sm:items-center gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${cfg.border} px-6 py-5 hover:shadow-md transition-all`}
              >
                {/* Bagian Kiri: Ikon dan Pesan */}
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${cfg.iconBg} shadow-sm`}>
                    <Icon size={20} className="text-white" strokeWidth={2} />
                  </div>
                  <p className="text-gray-800 text-sm sm:text-base font-bold">{n.pesan}</p>
                </div>

                {/* Bagian Kanan: Waktu dan Tanggal */}
                <div className="text-sm font-bold text-gray-400 flex-shrink-0 flex gap-3 sm:ml-auto ml-16">
                  <span>{n.waktu}</span>
                  <span>•</span>
                  <span>{n.tanggal}</span>
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}