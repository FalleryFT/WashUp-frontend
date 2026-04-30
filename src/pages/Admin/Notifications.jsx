// src/pages/Admin/Notifikasi.jsx
import AdminSidebar from "../../components/AdminSidebar";
import { Trash2, AlertTriangle, Bell, Plus, Pencil, CheckCircle } from "lucide-react";

// ─── TIPE NOTIFIKASI ─────────────────────────────────────────────────────────
// warna border kiri & background icon sesuai screenshot
const TYPES = {
  hapus:     { icon: Trash2,         iconBg: "bg-red-500",    border: "border-l-red-500",    iconColor: "text-white" },
  batal:     { icon: AlertTriangle,  iconBg: "bg-red-500",    border: "border-l-red-500",    iconColor: "text-white" },
  pesan:     { icon: Bell,           iconBg: "bg-[#0077b6]",  border: "border-l-[#0077b6]",  iconColor: "text-white" },
  tambah:    { icon: Plus,           iconBg: "bg-[#0077b6]",  border: "border-l-[#0077b6]",  iconColor: "text-white" },
  ubah:      { icon: Pencil,         iconBg: "bg-orange-400", border: "border-l-orange-400", iconColor: "text-white" },
  selesai:   { icon: CheckCircle,    iconBg: "bg-green-500",  border: "border-l-green-500",  iconColor: "text-white" },
};

// ─── DATA DUMMY ──────────────────────────────────────────────────────────────
const notifications = [
  { id: 1, type: "hapus",   pesan: "Data Berhasil Di Hapus",                       waktu: "10.00", tanggal: "10/10/2026" },
  { id: 2, type: "batal",   pesan: "Pesanan Nota#001 Dibatalkan",                  waktu: "10.00", tanggal: "10/10/2026" },
  { id: 3, type: "pesan",   pesan: "Anda Mendapat Pesan Dari Alvin Farhan Adison", waktu: "10.00", tanggal: "10/10/2026" },
  { id: 4, type: "tambah",  pesan: "Data Berhasil Di Tambahkan",                   waktu: "10.00", tanggal: "10/10/2026" },
  { id: 5, type: "ubah",    pesan: "Data Berhasil Di Ubah",                        waktu: "10.00", tanggal: "10/10/2026" },
  { id: 6, type: "selesai", pesan: "Laundry Nota #001 Sudah Selesai",              waktu: "10.00", tanggal: "10/10/2026" },
];

// ─── NOTIF ITEM ───────────────────────────────────────────────────────────────
function NotifItem({ type, pesan, waktu, tanggal }) {
  const cfg = TYPES[type];
  const Icon = cfg.icon;

  return (
    <div className={`flex items-center gap-4 bg-white rounded-xl shadow-sm border-l-4 ${cfg.border} px-5 py-4`}>
      {/* Icon */}
      <div className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center ${cfg.iconBg}`}>
        <Icon size={20} className={cfg.iconColor} />
      </div>

      {/* Pesan */}
      <p className="flex-1 text-gray-700 text-sm font-medium">{pesan}</p>

      {/* Waktu & Tanggal */}
      <div className="text-right text-sm text-gray-500 flex-shrink-0 space-x-2">
        <span>{waktu}</span>
        <span>{tanggal}</span>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Notifikasi() {
  return (
    <AdminSidebar>
      {/* Header */}
      <div className="mb-6">
        {/* Halo Admin yang dipanjangkan penuh (w-full) */}
        <div className="flex items-center gap-3 bg-[#0077b6] text-white rounded-xl px-5 py-4 mb-6 shadow w-full">
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
          <h1 className="text-xl font-bold">Halo Admin</h1>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-800">Notifikasi</h1>
      </div>

      {/* List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <NotifItem key={n.id} {...n} />
        ))}
      </div>
    </AdminSidebar>
  );
}