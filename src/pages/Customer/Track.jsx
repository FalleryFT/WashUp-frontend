// src/pages/Customer/LacakPesanan.jsx
import { useEffect, useState } from "react";
import CustomerSidebar from "../../components/CustomerSidebar";
import { useAuth } from "../../context/AuthContext";
import {
  ClipboardList, Layers, WashingMachine, PackageCheck,
  Hash, RefreshCw, PackageOpen, XCircle,
} from "lucide-react";
import api from "../../api/axios";

// ─── KONFIGURASI STATUS ───────────────────────────────────────────────────────
// 4 step aktif yang ditampilkan di progress bar (urutan proses)
const STEPS = [
  { key: "Order Diterima",  Icon: ClipboardList, label: "Diterima"   },
  { key: "Sedang Di Pilah", Icon: Layers,         label: "Di Pilah"  },
  { key: "Sedang Dicuci",   Icon: WashingMachine, label: "Dicuci"    },
  { key: "Siap Diambil",    Icon: PackageCheck,   label: "Siap Ambil"},
];

// Status → index step pada progress bar
const STATUS_STEP = {
  "Order Diterima":  0,
  "Sedang Di Pilah": 1,
  "Sedang Dicuci":   2,
  "Siap Diambil":    3,
};

// Warna badge per status (sesuai STATUS_MAP yang sudah ada)
const STATUS_STYLE = {
  "Order Diterima":  "bg-blue-100   text-blue-700",
  "Sedang Di Pilah": "bg-purple-100 text-purple-700",
  "Sedang Dicuci":   "bg-yellow-100 text-yellow-700",
  "Siap Diambil":    "bg-cyan-100   text-cyan-700",
  "Selesai":         "bg-green-100  text-green-700",
  "Dibatalkan":      "bg-red-100    text-red-700",
};

// Status ini disembunyikan dari halaman lacak pesanan
const HIDDEN_STATUS = new Set(["Selesai", "Dibatalkan"]);

// ─── SKELETON ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6 animate-pulse">
      <div className="flex justify-between mb-8">
        <div className="h-8 w-40 bg-gray-100 rounded-xl" />
        <div className="h-8 w-32 bg-gray-100 rounded-xl" />
      </div>
      <div className="flex mb-8">
        {[0,1,2,3].map(i => (
          <div key={i} className="flex flex-col items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-full bg-gray-100" />
            <div className="h-3 w-16 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      <div className="pt-6 border-t border-gray-100">
        <div className="h-28 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="bg-blue-50 p-6 rounded-full mb-4">
        <PackageOpen size={40} className="text-[#0077b6]" />
      </div>
      <p className="text-gray-700 font-bold text-lg">Tidak Ada Pesanan Aktif</p>
      <p className="text-gray-400 text-sm mt-1">
        Pesanan yang sedang diproses akan muncul di sini.
      </p>
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
// Logika matematis:
//   Setiap step = flex-1  →  center icon-i  = (i + 0.5) / total * 100%
//   Untuk 4 step: center icon-0 = 12.5%, center icon-3 = 87.5%
//   Track abu  : left 12.5%, right 12.5%
//   Fill biru  : left 12.5%, width = activeStep/3 * 75%
//     → step 0: 0%  | step 1: 25% | step 2: 50% | step 3: 75%
//   Setiap nilai tepat berhenti di center icon yang sesuai ✓
function ProgressBar({ activeStep, timeline }) {
  const total   = STEPS.length;
  const fillPct = activeStep === 0 ? 0 : (activeStep / (total - 1)) * 75;

  return (
    <div className="relative flex items-start mb-8 mt-4">
      {/* Track abu-abu */}
      <div
        className="absolute top-6 h-[3px] bg-gray-100 rounded-full z-0"
        style={{ left: "12.5%", right: "12.5%" }}
      />
      {/* Fill biru */}
      <div
        className="absolute top-6 h-[3px] bg-[#0077b6] rounded-full z-0 transition-all duration-700 ease-out"
        style={{ left: "12.5%", width: `${fillPct}%` }}
      />

      {STEPS.map(({ Icon, label }, i) => {
        const done    = i <= activeStep;
        const current = i === activeStep;
        const tgl     = timeline?.[i]?.tanggal ?? "–";

        return (
          <div key={i} className="z-10 flex flex-col items-center gap-2 flex-1">
            <div className={[
              "w-12 h-12 rounded-full flex items-center justify-center mx-auto transition-all duration-300",
              done
                ? "bg-[#0077b6] text-white shadow-lg shadow-blue-100"
                : "bg-white border-2 border-gray-100 text-gray-300",
              current ? "scale-110 ring-4 ring-blue-50" : "",
            ].join(" ")}>
              <Icon size={20} />
            </div>
            <span className={[
              "text-[11px] sm:text-xs text-center font-bold leading-tight",
              current ? "text-[#0077b6]" : done ? "text-gray-700" : "text-gray-400",
            ].join(" ")}>
              {label}
            </span>
            <span className="text-[9px] sm:text-[10px] text-gray-400 text-center">
              {tgl}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── ORDER CARD ───────────────────────────────────────────────────────────────
function OrderCard({ order }) {
  const activeStep = STATUS_STEP[order.status] ?? 0;
  const badgeClass = STATUS_STYLE[order.status] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6 transition-all hover:shadow-md">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-2 rounded-lg">
            <Hash size={20} className="text-gray-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nomor Nota</p>
            <p className="text-lg font-mono font-bold text-gray-800 tracking-tight">{order.nota}</p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5">
          {/* Badge status berwarna sesuai STATUS_MAP */}
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full w-fit ${badgeClass}`}>
            {order.status}
          </span>
          <span className="text-[11px] text-gray-400 font-medium">
            Estimasi:{" "}
            <span className="text-gray-700 font-bold">{order.estimasi}</span>
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar activeStep={activeStep} timeline={order.timeline} />

      {/* Detail */}
      <div className="flex flex-col lg:flex-row gap-8 pt-6 border-t border-black items-start">

        {/* Info kiri */}
        <div className="flex flex-col gap-3 lg:w-56 flex-shrink-0">
          {[
            ["Layanan",       order.layanan],
            ["Tanggal Order", order.tanggalOrder],
            ["Total Berat",   order.totalBerat],
          ].map(([label, val]) => (
            <div key={label} className="flex gap-2 text-[11px] sm:text-xs">
              <span className="w-24 text-gray-500 font-bold uppercase">{label}</span>
              <span className="text-gray-400">:</span>
              <span className="font-bold text-gray-900">{val}</span>
            </div>
          ))}
          <div className="mt-2 pt-3 border-t border-gray-100">
            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Bayar</p>
            <p className="text-xl font-black text-[#0077b6]">{order.totalHarga}</p>
          </div>
        </div>

        {/* Tabel item */}
        <div className="flex-1 w-full rounded-xl border border-black overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="bg-[#0077b6] text-white">
                <tr>
                  <th className="px-3 py-2.5 text-left   font-semibold border-b border-black">Item</th>
                  <th className="px-3 py-2.5 text-center font-semibold border-b border-l border-black">Jumlah</th>
                  <th className="px-3 py-2.5 text-right  font-semibold border-b border-l border-black">Harga Satuan</th>
                  <th className="px-3 py-2.5 text-right  font-semibold border-b border-l border-black">Sub Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((row, i) => {
                  const isLast = i === order.items.length - 1;
                  return (
                    <tr
                      key={i}
                      className={`transition hover:bg-blue-50/50 ${i % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}`}
                    >
                      <td className={`px-3 py-2.5 text-gray-800 font-medium ${isLast ? "" : "border-b border-black"}`}>
                        {row.item}
                      </td>
                      <td className={`px-3 py-2.5 text-center text-gray-700 border-l border-black ${isLast ? "" : "border-b border-black"}`}>
                        {row.jumlah}
                      </td>
                      <td className={`px-3 py-2.5 text-right text-gray-700 border-l border-black ${isLast ? "" : "border-b border-black"}`}>
                        {row.harga}
                      </td>
                      <td className={`px-3 py-2.5 text-right font-bold text-gray-900 border-l border-black ${isLast ? "" : "border-b border-black"}`}>
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
  const { user }  = useAuth();
  const namaUser  = user?.name || user?.username || "Pelanggan";

  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/customer/orders");

      const processed = (data.data ?? [])
        // Sembunyikan pesanan Selesai & Dibatalkan
        .filter(o => !HIDDEN_STATUS.has(o.status))
        // Urutkan terbaru di atas berdasarkan order_date dari API
        .sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

      setOrders(processed);
    } catch (err) {
      setError("Gagal memuat pesanan. Periksa koneksi dan coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <CustomerSidebar />

      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="w-full">

          {/* Greeting Banner */}
          <div className="flex items-center gap-4 bg-gradient-to-r from-[#0077b6] to-[#00b4d8] text-white rounded-3xl px-8 py-7 mb-8 shadow-lg shadow-blue-100">
            <div className="bg-white/20 p-3 rounded-2xl flex-shrink-0 backdrop-blur-sm">
              <WashingMachine size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                Halo, {namaUser}! ✨
              </h1>
              <p className="text-blue-50 text-sm font-medium mt-1 opacity-90">
                Pantau progres cucianmu yang sedang diproses di sini.
              </p>
            </div>
          </div>

          {/* Sub-header */}
          <div className="flex items-center justify-between mb-6 ml-1">
            <div>
              <h2 className="font-extrabold text-gray-800 uppercase text-xs tracking-wide">
                Pesanan Aktif
              </h2>
              {!loading && orders.length > 0 && (
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {orders.length} pesanan sedang diproses
                </p>
              )}
            </div>
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-[#0077b6] font-semibold hover:underline disabled:opacity-40"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle size={16} />
                <span>{error}</span>
              </div>
              <button onClick={fetchOrders} className="font-bold underline ml-4 flex-shrink-0">
                Coba Lagi
              </button>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <><SkeletonCard /><SkeletonCard /></>
          ) : orders.length === 0 && !error ? (
            <EmptyState />
          ) : (
            orders.map((order, i) => (
              <OrderCard key={order.nota ?? i} order={order} />
            ))
          )}

        </div>
      </main>
    </div>
  );
}