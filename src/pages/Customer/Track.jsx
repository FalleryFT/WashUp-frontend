// src/pages/Customer/LacakPesanan.jsx
import CustomerSidebar from "../../components/CustomerSidebar";
import { useAuth } from "../../context/AuthContext";
import { ClipboardList, WashingMachine, Shirt, Check, Hash } from "lucide-react";

// ─── DATA DUMMY ──────────────────────────────────────────────────────────────
const orders = [
  {
    nota: "INV-202401",
    activeStep: 2, // 0=Diterima, 1=Dicuci, 2=DiSetrika, 3=Selesai
    layanan: "Cuci Setrika",
    tanggalOrder: "6 Oktober 2024",
    totalBerat: "4 Kg",
    totalHarga: "Rp 88.000",
    estimasi: "9 Oktober 2024",
    timeline: [
      { label: "Diterima",  tanggal: "6 Okt 2024" },
      { label: "Dicuci",    tanggal: "7 Okt 2024" },
      { label: "Disetrika", tanggal: "8 Okt 2024" },
      { label: "Selesai",   tanggal: "9 Okt 2024" },
    ],
    items: [
      { item: "Kiloan",   jumlah: "4 Kg", harga: "Rp 7.000",  sub: "Rp 28.000" },
      { item: "Selimut",  jumlah: "1x",   harga: "Rp 20.000", sub: "Rp 20.000" },
      { item: "Bedcover", jumlah: "1x",   harga: "Rp 30.000", sub: "Rp 30.000" },
      { item: "Pelembut", jumlah: "1x",   harga: "Rp 5.000",  sub: "Rp 5.000"  },
      { item: "Sabun",    jumlah: "1x",   harga: "Rp 5.000",  sub: "Rp 5.000"  },
    ],
  },
  {
    nota: "INV-202402",
    activeStep: 1,
    layanan: "Cuci Kering",
    tanggalOrder: "10 Oktober 2024",
    totalBerat: "3 Kg",
    totalHarga: "Rp 21.000",
    estimasi: "12 Oktober 2024",
    timeline: [
      { label: "Diterima",  tanggal: "10 Okt 2024" },
      { label: "Dicuci",    tanggal: "11 Okt 2024" },
      { label: "Disetrika", tanggal: "-" },
      { label: "Selesai",   tanggal: "-" },
    ],
    items: [
      { item: "Kiloan", jumlah: "3 Kg", harga: "Rp 7.000", sub: "Rp 21.000" },
    ],
  },
];

const STEP_ICONS = [ClipboardList, WashingMachine, Shirt, Check];

// ─── ORDER CARD COMPONENT (SAMA PERSIS DENGAN DASHBOARD) ─────────────────────
function OrderCard({ order }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6 transition-all hover:shadow-md">
      
      {/* Card Header */}
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
          style={{ width: `calc(${(order.activeStep / (STEP_ICONS.length - 1)) * 100}% - 56px)` }}
        />

        {STEP_ICONS.map((Icon, i) => {
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
              }`}>{order.timeline[i].label}</span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 text-center mt-[-8px]">
                {order.timeline[i].tanggal}
              </span>
            </div>
          );
        })}
      </div>

      {/* Garis Batas Hitam & Tabel Rincian (Sesuai Request) */}
      <div className="flex flex-col lg:flex-row gap-8 pt-6 border-t border-black items-start">
        
        {/* Info Kiri */}
        <div className="flex flex-col gap-3 lg:w-56 flex-shrink-0">
          {[
            ["Layanan",          order.layanan],
            ["Tanggal Order",    order.tanggalOrder],
            ["Total Berat",      order.totalBerat],
          ].map(([label, val]) => (
            <div key={label} className="flex gap-2 text-[11px] sm:text-xs">
              <span className="w-24 text-gray-500 font-bold uppercase">{label}</span>
              <span className="text-gray-400">:</span>
              <span className="font-bold text-gray-900">{val}</span>
            </div>
          ))}
          <div className="mt-2 pt-4">
            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Bayar</p>
            <p className="text-xl font-black text-[#0077b6]">{order.totalHarga}</p>
          </div>
        </div>

        {/* Tabel Kanan (Hitam & Selang-Seling) */}
        <div className="flex-1 w-full rounded-xl border border-black overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="bg-[#0077b6] text-white">
                <tr>
                  <th className="px-3 py-2.5 text-left font-semibold border-b border-black">Item</th>
                  <th className="px-3 py-2.5 text-center font-semibold border-b border-l border-black">Jumlah</th>
                  <th className="px-3 py-2.5 text-right font-semibold border-b border-l border-black">Harga Satuan</th>
                  <th className="px-3 py-2.5 text-right font-semibold border-b border-l border-black">Sub Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((row, i) => {
                  const isLastRow = i === order.items.length - 1;
                  return (
                    <tr
                      key={i}
                      className={`transition hover:bg-blue-50/50 ${i % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}`}
                    >
                      <td className={`px-3 py-2.5 text-gray-800 font-medium ${isLastRow ? "" : "border-b border-black"}`}>
                        {row.item}
                      </td>
                      <td className={`px-3 py-2.5 text-center text-gray-700 border-l border-black ${isLastRow ? "" : "border-b border-black"}`}>
                        {row.jumlah}
                      </td>
                      <td className={`px-3 py-2.5 text-right text-gray-700 border-l border-black ${isLastRow ? "" : "border-b border-black"}`}>
                        {row.harga}
                      </td>
                      <td className={`px-3 py-2.5 text-right font-bold text-gray-900 border-l border-black ${isLastRow ? "" : "border-b border-black"}`}>
                        {row.sub}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function LacakPesanan() {
  const { user } = useAuth();
  const namaUser = user?.name || user?.username || "Pelanggan";

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <CustomerSidebar />
      
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {/* max-w-5xl dipakai agar nota cukup luas untuk tabel namun tetap rata kiri sejajar dengan Dashboard */}
        <div className="max-w-5xl">
          
          {/* GREETING BANNER */}
          <div className="flex items-center gap-4 bg-gradient-to-r from-[#0077b6] to-[#00b4d8] text-white rounded-3xl px-8 py-7 mb-8 shadow-lg shadow-blue-100 w-full">
            <div className="bg-white/20 p-3 rounded-2xl flex-shrink-0 backdrop-blur-sm">
              <WashingMachine size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">Halo, {namaUser}! ✨</h1>
              <p className="text-blue-50 text-sm font-medium mt-1 opacity-90">Pantau detail rincian dan progres cucianmu di sini.</p>
            </div>
          </div>

          <h2 className="font-extrabold text-gray-800 text-lg tracking-wide mb-6 ml-1 uppercase text-xs">Daftar Pesanan</h2>
          
          {/* Daftar Order */}
          <div className="flex flex-col">
            {orders.map((order, i) => (
              <OrderCard key={i} order={order} />
            ))}
          </div>
          
        </div>
      </main>
    </div>
  );
}