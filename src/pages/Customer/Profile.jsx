// src/pages/Customer/ProfilSaya.jsx
import { useState } from "react";
import CustomerSidebar from "../../components/CustomerSidebar";
import { useAuth } from "../../context/AuthContext";
import { WashingMachine, User } from "lucide-react";

export default function ProfilSaya() {
  const { user } = useAuth();
  const namaUser = user?.name || user?.username || "Pelanggan";

  // Nama otomatis mengambil dari variabel namaUser
  const [form, setForm] = useState({
    nama:   namaUser,
    noHp:   "08854 4571 5445",
    alamat: "Jalan Reventa No. 12, Kelurahan Gedetawangke, Kecamatan Lowokwaru, Paris van Java, Bang Wetan 14556, Nederlandsch-Indië.",
  });

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
              <p className="text-blue-50 text-sm font-medium mt-1 opacity-90">Kelola informasi pribadi dan pengaturan akunmu di sini.</p>
            </div>
          </div>

          {/* HEADER JUDUL */}
          <div className="mb-6">
            <h2 className="font-extrabold text-gray-800 text-lg tracking-wide uppercase">Profil Saya</h2>
          </div>

          {/* CARD PROFIL */}
          <div className="bg-white rounded-3xl border border-black p-6 md:p-8 shadow-sm">
            
            <p className="font-black text-gray-800 uppercase text-sm mb-6 border-b border-black pb-4">Informasi Utama Profil</p>

            {/* Bagian Foto Profil (Tanpa Kamera) */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              <div>
                <div className="w-24 h-24 rounded-full bg-blue-50 border border-black flex items-center justify-center text-[#0077b6] overflow-hidden shadow-sm">
                  <User size={48} strokeWidth={1.5} />
                </div>
              </div>
              <div className="text-center sm:text-left mt-2">
                <p className="font-bold text-gray-800 text-xl">{form.nama}</p>
                <p className="text-sm font-bold text-gray-500 mt-1">
                  ID: {String(user?.id || "00912").padStart(5, "0")}
                </p>
              </div>
            </div>

            {/* Baris Input Form */}
            <div className="space-y-6">

              {/* ID Pelanggan — read only */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <span className="w-48 flex-shrink-0 text-[11px] font-bold text-gray-500 uppercase tracking-wide">ID Pelanggan</span>
                <div className="flex-1">
                  <span className="inline-block bg-gray-100 border border-black text-gray-700 font-bold px-4 py-2 rounded-lg text-sm">
                    ID-{String(user?.id || "00912").padStart(5, "0")}
                  </span>
                </div>
              </div>

              {/* Nama Lengkap */}
              <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
                <span className="w-48 flex-shrink-0 text-[11px] font-bold text-gray-500 uppercase tracking-wide pt-3">Nama Lengkap</span>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                  className="flex-1 border border-black rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0077b6] focus:bg-white transition-all w-full"
                />
              </div>

              {/* Nomor HP */}
              <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
                <span className="w-48 flex-shrink-0 text-[11px] font-bold text-gray-500 uppercase tracking-wide pt-3">Nomor HP / WA</span>
                <input
                  type="tel"
                  value={form.noHp}
                  onChange={(e) => setForm((f) => ({ ...f, noHp: e.target.value }))}
                  className="flex-1 border border-black rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0077b6] focus:bg-white transition-all w-full"
                />
              </div>

              {/* Alamat */}
              <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
                <span className="w-48 flex-shrink-0 text-[11px] font-bold text-gray-500 uppercase tracking-wide pt-3">Alamat Lengkap</span>
                <textarea
                  rows={4}
                  value={form.alamat}
                  onChange={(e) => setForm((f) => ({ ...f, alamat: e.target.value }))}
                  className="flex-1 border border-black rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0077b6] focus:bg-white transition-all resize-none leading-relaxed w-full"
                />
              </div>

            </div>

            {/* Footer Form */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-5 border-t border-black gap-4">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                Member Sejak: <span className="text-gray-800">20 Jan 2024</span>
              </p>
              <button
                className="w-full sm:w-auto bg-[#0077b6] text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-[#005f92] border border-black shadow-sm transition-colors"
              >
                Simpan Perubahan
              </button>
            </div>
            
          </div>

        </div>
      </main>
    </div>
  );
}