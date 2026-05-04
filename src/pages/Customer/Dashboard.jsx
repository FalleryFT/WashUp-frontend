// src/pages/Customer/Dashboard.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CustomerSidebar from "../../components/CustomerSidebar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import {
  ChevronRight, ClipboardList, PackageCheck, Layers,
  WashingMachine, Wallet, ShoppingBag, Hash,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// KONSTANTA
// ═══════════════════════════════════════════════════════════════

// 4 step aktif — urutan & label HARUS sama persis dengan Track.jsx & controller
const STEPS = [
  { icon: ClipboardList, label: "Diterima"    },  // 0 = Order Diterima
  { icon: Layers,        label: "Di Pilah"    },  // 1 = Sedang Di Pilah
  { icon: WashingMachine,label: "Dicuci"      },  // 2 = Sedang Dicuci
  { icon: PackageCheck,  label: "Siap Diambil"},  // 3 = Siap Diambil
];

const STATUS_BADGE = {
  "Selesai":         "bg-[#d8f3dc] text-green-800 border-green-200",
  "Dibatalkan":      "bg-[#ffddd2] text-red-800 border-red-200",
  "Order Diterima":  "bg-blue-100 text-blue-800 border-blue-200",
  "Sedang Di Pilah": "bg-purple-100 text-purple-800 border-purple-200",
  "Sedang Dicuci":   "bg-[#fdf0d5] text-yellow-800 border-yellow-200",
  "Siap Diambil":    "bg-cyan-100 text-cyan-800 border-cyan-200",
};

const fmtRupiah = (n) => "Rp " + Number(n).toLocaleString("id-ID");

// ═══════════════════════════════════════════════════════════════
// KOMPONEN KECIL
// ═══════════════════════════════════════════════════════════════

function StatusCard({ title, value, isCurrency, icon: Icon, iconBg, iconColor, borderColor, loading }) {
  return (
    <div className={`bg-white border border-gray-100 rounded-2xl flex flex-col shadow-sm relative transition-all hover:shadow-md hover:-translate-y-1 border-b-[5px] ${borderColor}`}>
      <div className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
        {Icon && <Icon size={20} className={iconColor} />}
      </div>
      <div className="flex-1 px-5 py-5 z-10">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 pr-10">{title}</p>
        {loading ? (
          <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse mt-1" />
        ) : (
          <p className={`font-black text-gray-800 ${isCurrency ? "text-xl" : "text-3xl"}`}>{value}</p>
        )}
      </div>
    </div>
  );
}

// Progress bar menggunakan flex-1 per step agar presisi
// Logika: center icon-i = (i+0.5)/total*100% → untuk 4 step = 12.5%, 37.5%, 62.5%, 87.5%
// Track abu: left 12.5% s/d right 12.5%
// Fill biru: left 12.5%, width = activeStep/3 * 75%
function ProgressBar({ activeStep }) {
  const total   = STEPS.length;
  const fillPct = activeStep === 0 ? 0 : (activeStep / (total - 1)) * 75;

  return (
    <div className="relative flex items-start mb-8 mt-4">
      {/* Track abu */}
      <div
        className="absolute top-6 h-[3px] bg-gray-100 rounded-full z-0"
        style={{ left: "12.5%", right: "12.5%" }}
      />
      {/* Fill biru */}
      <div
        className="absolute top-6 h-[3px] bg-[#0077b6] rounded-full z-0 transition-all duration-700 ease-out"
        style={{ left: "12.5%", width: `${fillPct}%` }}
      />

      {STEPS.map(({ icon: Icon, label }, i) => {
        const done    = i <= activeStep;
        const current = i === activeStep;
        return (
          <div key={i} className="z-10 flex flex-col items-center gap-3 flex-1">
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
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6 transition-all hover:shadow-md">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
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
          {/* Badge status berwarna */}
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full w-fit border ${
            STATUS_BADGE[order.status] ?? "bg-gray-100 text-gray-700 border-gray-200"
          }`}>
            {order.status}
          </span>
          <span className="text-[11px] text-gray-400 font-medium">
            Estimasi: <span className="text-gray-700 font-bold">{order.estimasi}</span>
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar activeStep={order.activeStep} />

      {/* Footer detail */}
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

function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mb-6 animate-pulse">
      <div className="flex justify-between mb-8">
        <div className="h-8 w-40 bg-gray-200 rounded-xl" />
        <div className="h-8 w-44 bg-gray-200 rounded-xl" />
      </div>
      <div className="flex mb-8">
        {[0,1,2,3].map(i => (
          <div key={i} className="flex flex-col items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div className="h-3 w-14 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      <div className="flex justify-between pt-6 border-t border-gray-100">
        <div className="flex gap-8">
          <div className="h-10 w-20 bg-gray-200 rounded-lg" />
          <div className="h-10 w-16 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-10 w-28 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <tr>
      {[0,1,2,3,4].map(i => (
        <td key={i} className="px-3 py-3 border border-black">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════
export default function CustomerDashboard() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const namaUser   = user?.name || "Pelanggan";

  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [stats, setStats]               = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [history, setHistory]           = useState([]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/customer/dashboard");
      if (data.success) {
        setStats(data.stats);
        setActiveOrders(data.active_orders ?? []);
        setHistory(data.recent_history ?? []);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/login");
      } else {
        setError("Gagal memuat data dashboard. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const statCards = [
    {
      title: "PESANAN AKTIF",
      value: stats?.pesanan_aktif ?? "-",
      borderColor: "border-b-[#3b82f6]",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      icon: WashingMachine,
    },
    {
      title: "SELESAI",
      value: stats?.selesai ?? "-",
      borderColor: "border-b-[#10b981]",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <CustomerSidebar />

      <main className="flex-1 overflow-y-auto p-6 md:p-8">

        {/* GREETING BANNER */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-[#0077b6] to-[#00b4d8] text-white rounded-3xl px-8 py-7 mb-8 shadow-lg shadow-blue-100 w-full">
          <div className="bg-white/20 p-3 rounded-2xl flex-shrink-0 backdrop-blur-sm">
            <WashingMachine size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Halo, {namaUser}! ✨
            </h1>
            <p className="text-blue-50 text-sm font-medium mt-1 opacity-90">
              Cucianmu sedang kami tangani dengan sepenuh hati.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center justify-between text-sm">
            <span>{error}</span>
            <button onClick={fetchDashboard} className="font-bold underline hover:text-red-800 ml-4 flex-shrink-0">
              Coba lagi
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

          {/* ── KOLOM KIRI: Pesanan Aktif ── */}
          <div className="xl:col-span-7 flex flex-col">
            <div className="flex justify-between items-center mb-6 px-1">
              <p className="font-extrabold text-gray-500 text-xs tracking-widest uppercase">
                Pesanan Diproses
              </p>
              {activeOrders.length > 2 && (
                <button
                  onClick={() => navigate("/customer/track")}
                  className="text-xs font-bold text-[#0077b6] hover:underline flex items-center gap-1"
                >
                  Lihat Semua <ChevronRight size={14} />
                </button>
              )}
            </div>

            {loading ? (
              <><OrderCardSkeleton /><OrderCardSkeleton /></>
            ) : activeOrders.length > 0 ? (
              <>
                {activeOrders.slice(0, 2).map((o) => (
                  <OrderCard key={o.id} order={o} />
                ))}
                {activeOrders.length > 2 && (
                  <button
                    onClick={() => navigate("/customer/track")}
                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold hover:border-[#0077b6] hover:text-[#0077b6] transition-all text-sm mb-6"
                  >
                    + Lihat {activeOrders.length - 2} Pesanan Lainnya
                  </button>
                )}
              </>
            ) : (
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center text-gray-400">
                <WashingMachine size={48} className="mb-4 text-gray-200" />
                <p className="font-bold">Tidak ada pesanan aktif</p>
                <p className="text-sm mt-1 text-gray-300">Pesananmu akan muncul di sini</p>
              </div>
            )}
          </div>

          {/* ── KOLOM KANAN: Stats + Riwayat ── */}
          <div className="xl:col-span-5 flex flex-col gap-6 xl:mt-[44px]">

            <div className="grid grid-cols-2 gap-4">
              {statCards.map((card) => (
                <StatusCard key={card.title} {...card} loading={loading} />
              ))}
              <div className="col-span-2">
                <StatusCard
                  title="PENGELUARAN BULAN INI"
                  value={stats ? fmtRupiah(stats.pengeluaran_bulan_ini) : "-"}
                  borderColor="border-b-[#f97316]"
                  iconBg="bg-orange-50"
                  iconColor="text-orange-500"
                  isCurrency
                  icon={Wallet}
                  loading={loading}
                />
              </div>
            </div>

            {/* Tabel Riwayat */}
            <div className="bg-white rounded-2xl shadow-sm border border-black overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-black">
                <h2 className="font-extrabold text-gray-800 text-base">Riwayat Terakhir</h2>
                <button
                  onClick={() => navigate("/customer/track")}
                  className="flex items-center gap-1 text-sm font-bold text-[#0077b6] hover:text-[#005f92] transition-colors"
                >
                  Lihat Semua <ChevronRight size={16} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-[#0077b6] text-white">
                    <tr>
                      {["Tanggal", "Nota", "Layanan", "Total", "Status"].map((h) => (
                        <th key={h} className="px-2 sm:px-3 py-3 font-semibold text-center text-[10px] sm:text-xs tracking-wider border border-black">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} />)
                    ) : history.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-400 text-sm border border-black">
                          Belum ada riwayat pesanan
                        </td>
                      </tr>
                    ) : (
                      history.slice(0, 8).map((r, i) => (
                        <tr
                          key={i}
                          className={`transition hover:bg-blue-100/50 ${i % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}`}
                        >
                          <td className="px-2 sm:px-3 py-3 text-center text-[11px] sm:text-xs text-gray-800 font-medium border border-black">
                            {r.tanggal}
                          </td>
                          <td className="px-2 sm:px-3 py-3 text-center text-[11px] sm:text-xs font-bold text-gray-900 border border-black font-mono">
                            {r.nota}
                          </td>
                          <td className="px-2 sm:px-3 py-3 text-center text-[11px] sm:text-xs text-gray-800 border border-black">
                            {r.layanan}
                          </td>
                          <td className="px-2 sm:px-3 py-3 text-center text-[11px] sm:text-xs font-bold text-gray-900 border border-black">
                            {r.total}
                          </td>
                          <td className="px-2 sm:px-3 py-3 text-center border border-black">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold inline-block border ${
                              STATUS_BADGE[r.status] ?? "bg-gray-100 text-gray-700 border-gray-200"
                            }`}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
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