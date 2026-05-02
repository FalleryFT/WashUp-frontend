// src/pages/Customer/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import CustomerSidebar from "../../components/CustomerSidebar";
import { useAuth } from "../../context/AuthContext";
import { ChevronRight, ClipboardList, PackageCheck, Shirt, WashingMachine, Wallet, ShoppingBag, Hash } from "lucide-react";

// ─── DATA DUMMY ──────────────────────────────────────────────────────────────
const activeOrders = [
  {
    nota: "INV-202401",
    berat: "4Kg",
    layanan: "Cuci Setrika",
    totalBayar: "Rp 20.000",
    estimasi: "20 Juli, 10.20 WIB",
    activeStep: 2, // 0=Diterima, 1=Dicuci, 2=Disetrika, 3=Selesai
  },
  {
    nota: "INV-202402",
    berat: "2Kg",
    layanan: "Cuci Kering",
    totalBayar: "Rp 12.000",
    estimasi: "21 Juli, 08.00 WIB",
    activeStep: 1,
  },
];

// Data Riwayat
const riwayat = [
  { tanggal: "20 Jan", nota: "INV-202390", layanan: "Cuci Setrika", total: "Rp20.000", status: "Selesai" },
  { tanggal: "10 Feb", nota: "INV-202391", layanan: "Cuci Kering",  total: "Rp15.000", status: "Selesai" },
  { tanggal: "15 Feb", nota: "INV-202392", layanan: "Setrika Saja", total: "Rp10.000", status: "Selesai" },
  { tanggal: "01 Mar", nota: "INV-202393", layanan: "Cuci Setrika", total: "Rp25.000", status: "Selesai" },
  { tanggal: "10 Mar", nota: "INV-202394", layanan: "Cuci Kering",  total: "Rp15.000", status: "Selesai" },
  { tanggal: "20 Mar", nota: "INV-202395", layanan: "Cuci Setrika", total: "Rp30.000", status: "Selesai" },
];

// Label dan Ikon Step
const STEPS = [
  { icon: ClipboardList, label: "Diterima" },
  { icon: WashingMachine, label: "Dicuci" },
  { icon: Shirt, label: "Disetrika" },
  { icon: PackageCheck, label: "Siap Diambil" },
];

// ─── STATUS CARD COMPONENT ──────────────────────────────────────────────────
function StatusCard({ title, value, isCurrency, icon: Icon, iconBg, iconColor, borderColor }) {
  return (
    <div className={`bg-white border border-gray-100 rounded-2xl flex flex-col shadow-sm relative transition-all hover:shadow-md hover:-translate-y-1 border-b-[5px] ${borderColor}`}>
      <div className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
        {Icon && <Icon size={20} className={iconColor} />}
      </div>
      <div className="flex-1 px-5 py-5 z-10">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 pr-10">{title}</p>
        <p className={`font-black text-gray-800 ${isCurrency ? "text-xl" : "text-3xl"}`}>{value}</p>
      </div>
    </div>
  );
}

// ─── ORDER CARD COMPONENT ────────────────────────────────────────────────────
function OrderCard({ order }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6 transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg">
                <Hash size={20} className="text-gray-500" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nomor Nota</p>
                <p className="text-lg font-mono font-bold text-gray-800 tracking-tight">{order.nota}</p>
            </div>
        </div>
        <div className="flex items-center bg-blue-50 text-[#0077b6] px-4 py-2 rounded-xl w-fit border border-blue-100">
          <span className="text-[11px] font-bold tracking-wide uppercase">
            Estimasi: {order.estimasi}
          </span>
        </div>
      </div>

      {/* Timeline Progress */}
      <div className="relative flex items-start justify-between px-2 sm:px-6 mb-8 mt-6">
        <div className="absolute top-[24px] left-8 right-8 sm:left-14 sm:right-14 h-[3px] bg-gray-100 -translate-y-1/2 z-0 rounded-full" />
        <div
          className="absolute top-[24px] left-8 sm:left-14 h-[3px] bg-[#0077b6] -translate-y-1/2 z-0 transition-all duration-700 ease-out rounded-full"
          style={{ width: `calc(${(order.activeStep / (STEPS.length - 1)) * 100}% - 56px)` }}
        />

        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const done = i <= order.activeStep;
          const current = i === order.activeStep;
          return (
            <div key={i} className="z-10 flex flex-col items-center gap-3 w-16 sm:w-20">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  done ? "bg-[#0077b6] text-white shadow-lg shadow-blue-100" : "bg-white border-2 border-gray-100 text-gray-300"
                } ${current ? "scale-110 ring-4 ring-blue-50" : ""}`}>
                <Icon size={20} />
              </div>
              <span className={`text-[11px] sm:text-xs text-center font-bold leading-tight ${
                current ? "text-[#0077b6]" : done ? "text-gray-700" : "text-gray-400"
              }`}>{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Detail dalam Nota menggunakan garis batas hitam sesuai request */}
      <div className="flex flex-wrap justify-between items-center gap-4 pt-6 border-t border-black">
        <div className="flex gap-8">
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Layanan</p>
            <p className="text-sm font-bold text-gray-900">{order.layanan}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Berat</p>
            <p className="text-sm font-bold text-gray-900">{order.berat}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Bayar</p>
          <p className="text-xl font-black text-[#0077b6]">{order.totalBayar}</p>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const namaUser = user?.name || user?.username || "Pelanggan";

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
            <p className="text-blue-50 text-sm font-medium mt-1 opacity-90">Cucianmu sedang kami tangani dengan sepenuh hati.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* KOLOM KIRI (Pesanan Aktif) */}
          <div className="xl:col-span-7 flex flex-col">
            <h2 className="font-extrabold text-gray-800 text-lg tracking-wide mb-6 ml-1 uppercase text-xs">Pesanan Diproses</h2>
            <div className="flex flex-col">
              {activeOrders.length > 0 ? (
                activeOrders.map((o, i) => <OrderCard key={i} order={o} />)
              ) : (
                <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center text-gray-400">
                  <WashingMachine size={48} className="mb-4 text-gray-200" />
                  <p className="font-bold">Tidak ada pesanan aktif</p>
                </div>
              )}
            </div>
          </div>

          {/* KOLOM KANAN (Status Cards & Tabel Riwayat) */}
          <div className="xl:col-span-5 flex flex-col gap-6 xl:mt-[44px]">
            
            {/* Status Cards disamakan dengan gaya warna Dashboard Admin */}
            <div className="grid grid-cols-2 gap-4">
              <StatusCard 
                title="PESANAN AKTIF" 
                value="2" 
                borderColor="border-b-[#3b82f6]"
                iconBg="bg-blue-50" 
                iconColor="text-blue-500" 
                icon={WashingMachine} 
              />
              <StatusCard 
                title="SELESAI" 
                value="14" 
                borderColor="border-b-[#10b981]"
                iconBg="bg-emerald-50" 
                iconColor="text-emerald-500" 
                icon={ShoppingBag} 
              />
              <div className="col-span-2">
                <StatusCard 
                  title="PENGELUARAN BULAN INI" 
                  value="Rp 145.000" 
                  borderColor="border-b-[#f97316]"
                  iconBg="bg-orange-50" 
                  iconColor="text-orange-500" 
                  isCurrency 
                  icon={Wallet} 
                />
              </div>
            </div>
            
            {/* TABEL RIWAYAT (BORDER HITAM FULL & SELANG-SELING WARNA) */}
            <div className="bg-white rounded-2xl shadow-sm border border-black overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-black">
                <h2 className="font-extrabold text-gray-800 text-base">Riwayat Terakhir</h2>
                <button
                  onClick={() => navigate("/customer/history")}
                  className="flex items-center gap-1 text-sm font-bold text-[#0077b6] hover:text-[#005f92] transition-colors cursor-pointer"
                >
                  Lihat Semua <ChevronRight size={16} />
                </button>
              </div>

              <div className="bg-white">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-[#0077b6] text-white">
                    <tr>
                      {["Tanggal", "Nota", "Layanan", "Total", "Status"].map(h => (
                        <th key={h} className="px-2 sm:px-3 py-3 font-semibold text-center text-[10px] sm:text-xs tracking-wider border border-black">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {riwayat.map((r, i) => (
                      <tr key={i} className={`transition hover:bg-blue-100/50 ${i % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}`}>
                        <td className="px-2 sm:px-3 py-3 text-center text-[11px] sm:text-xs text-gray-800 font-medium border border-black">{r.tanggal}</td>
                        <td className="px-2 sm:px-3 py-3 text-center text-[11px] sm:text-xs font-bold text-gray-900 border border-black">{r.nota}</td>
                        <td className="px-2 sm:px-3 py-3 text-center text-[11px] sm:text-xs text-gray-800 border border-black">{r.layanan}</td>
                        <td className="px-2 sm:px-3 py-3 text-center text-[11px] sm:text-xs font-bold text-gray-900 border border-black">{r.total}</td>
                        <td className="px-2 sm:px-3 py-3 text-center border border-black">
                          <span className="px-2 py-1 rounded-md text-[10px] font-bold inline-block bg-[#d8f3dc] text-green-800 border border-green-200">
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}