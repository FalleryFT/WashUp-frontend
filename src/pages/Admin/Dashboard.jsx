// src/pages/Admin/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import AdminSidebar            from "../../components/AdminSidebar";
import api                     from "../../api/axios";
import {
  Printer, Trash2, Eye,
  ShoppingBag, Clock, CheckCircle2, TrendingUp,
  ChevronLeft, ChevronRight, X, ArrowRightCircle,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// KONSTANTA
// ═══════════════════════════════════════════════════════════════════════════════
const TIMELINE_LABELS = ["Order di terima", "Sedang Di Pilah", "Sedang Di cuci", "Siap Di ambil"];
const PER_PAGE        = 5;

const STATUS_MAP = {
  "Order Diterima": "bg-blue-100 text-blue-700",
    "Sedang Di Pilah": "bg-purple-100 text-purple-700",
    "Sedang Dicuci":  "bg-yellow-100 text-yellow-700",
    "Siap Diambil":   "bg-cyan-100 text-cyan-700",
    "Selesai":        "bg-green-100 text-green-700",
    "Dibatalkan":     "bg-red-100 text-red-700",
};

// Cari bagian STATS_CONFIG dan ubah baris terakhir
const STATS_CONFIG = [
  { key: "total_order",    title: "ORDER HARI INI", icon: ShoppingBag,   border: "border-b-[#3b82f6]", bg: "bg-blue-50",    color: "text-blue-500"    },
  { key: "cucian_proses",  title: "TOTAL PROSES",   icon: Clock,         border: "border-b-[#f97316]", bg: "bg-orange-50",  color: "text-orange-500"  },
  { key: "selesai",        title: "SELESAI HARI INI", icon: CheckCircle2,  border: "border-b-[#10b981]", bg: "bg-emerald-50", color: "text-emerald-500" },
  { key: "omzet_minggu_ini", title: "OMZET MINGGU INI", icon: TrendingUp,    border: "border-b-[#8b5cf6]", bg: "bg-purple-50",  color: "text-purple-500", isCurrency: true },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════
const statusStyle = (s) => STATUS_MAP[s] ?? "bg-gray-100 text-gray-700";
const fmtRupiah   = (n)  => "Rp " + Number(n).toLocaleString("id-ID");

// ═══════════════════════════════════════════════════════════════════════════════
// KOMPONEN UI KECIL
// ═══════════════════════════════════════════════════════════════════════════════

/** Badge Member / Non-Member */
function TipeBadge({ tipe }) {
  return tipe === "Member"
    ? <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Member</span>
    : <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Non-Member</span>;
}

/** Badge status order */
function StatusBadge({ status }) {
  return (
    <span className={`px-3 py-1 rounded-md text-[11px] font-bold inline-block ${statusStyle(status)}`}>
      {status}
    </span>
  );
}

/** Kartu statistik */
function StatusCard({ title, value, border, bg, color, icon: Icon, isCurrency }) {
  return (
    <div className={`bg-white border-2 border-black rounded-xl overflow-hidden flex flex-col shadow-[3px_3px_0px_0px_rgba(0,0,0,0.12)] relative border-b-[5px] ${border}`}>
      <div className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
        {Icon && <Icon size={20} className={color} />}
      </div>
      <div className="flex-1 px-5 py-4 z-10">
        <p className="text-[10px] font-black leading-tight text-gray-500 uppercase tracking-tighter mb-1 pr-10">{title}</p>
        <p className={`font-black text-gray-900 ${isCurrency ? "text-xl leading-tight" : "text-3xl"}`}>{value}</p>
      </div>
    </div>
  );
}

/** Grafik garis pendapatan mingguan (SVG) */
function LineChart({ data = [] }) {
  const [tooltip, setTooltip] = useState(null);

  const W = 560, H = 220, padL = 60, padB = 10, padT = 10, padR = 20;
  const drawW = W - padL - padR;
  const drawH = H - padB - padT;
  const maxVal  = 600000;
  const yTicks  = [0, 100000, 200000, 300000, 400000, 500000, 600000];
  const values  = data.map((d) => d.value ?? 0);
  const labels  = data.map((d) => d.day  ?? "");

  const xPos = (i) => padL + (i / Math.max(values.length - 1, 1)) * drawW;
  const yPos = (v) => padT + drawH - (v / maxVal) * drawH;

  const pts  = values.map((v, i) => `${xPos(i)},${yPos(v)}`).join(" ");
  const area = values.length
    ? `${xPos(0)},${yPos(0)} ${pts} ${xPos(values.length - 1)},${yPos(0)}`
    : "";

  if (!data.length) {
    return <div className="h-48 flex items-center justify-center text-gray-300 text-sm">Belum ada data</div>;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {/* Grid + label Y */}
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} x2={W - padR} y1={yPos(t)} y2={yPos(t)} stroke="#e5e7eb" strokeWidth="1" />
          <text x={padL - 6} y={yPos(t) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
            {t === 0 ? "0" : `${t / 1000}k`}
          </text>
        </g>
      ))}
      <text x={10} y={H / 2} textAnchor="middle" fontSize="10" fill="#6b7280"
        transform={`rotate(-90, 10, ${H / 2})`}>
        Pendapatan (Rp)
      </text>
      {/* Area + garis */}
      <polygon points={area} fill="#00b4d8" fillOpacity="0.08" />
      <polyline points={pts}  fill="none" stroke="#0077b6" strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round" />
      {/* Titik interaktif */}
      {values.map((v, i) => (
        <g key={i} style={{ cursor: "pointer" }}
          onMouseEnter={() => setTooltip({ i, v, label: labels[i] })}
          onMouseLeave={() => setTooltip(null)}>
          <circle cx={xPos(i)} cy={yPos(v)} r="10" fill="transparent" />
          <circle cx={xPos(i)} cy={yPos(v)} r="5"  fill="white" stroke="#0077b6" strokeWidth="2.5" />
        </g>
      ))}
      {/* Tooltip */}
      {tooltip && (() => {
        const tx   = xPos(tooltip.i);
        const ty   = yPos(tooltip.v);
        const text = `${tooltip.label}, Rp ${tooltip.v.toLocaleString("id-ID")},00`;
        const bW = 145, bH = 28;
        const bx = Math.min(tx - bW / 2, W - padR - bW);
        return (
          <g>
            <rect x={bx} y={ty - 36} width={bW} height={bH} rx="6" fill="white" stroke="#d1d5db" strokeWidth="1" />
            <text x={bx + bW / 2} y={ty - 18} textAnchor="middle" fontSize="10" fill="#111827" fontWeight="600">
              {text}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}

/** Timeline vertikal — sama persis dengan OrderList.jsx */
function Timeline({ timeline }) {
  return (
    <div className="flex flex-col gap-0">
      {TIMELINE_LABELS.map((label, i) => {
        const info  = timeline?.[i];
        const done  = info !== null && info !== undefined;
        const isLast = i === TIMELINE_LABELS.length - 1;
        return (
          <div key={i} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                done ? "bg-green-500 border-green-500" : "bg-white border-gray-300"
              }`} />
              {!isLast && (
                <div className={`w-0.5 h-8 ${done && timeline?.[i + 1] ? "bg-green-500" : "bg-gray-200"}`} />
              )}
            </div>
            <div className="pb-2">
              <p className={`text-sm font-bold leading-tight ${done ? "text-gray-800" : "text-gray-300"}`}>
                {label}
              </p>
              {info
                ? <p className="text-xs text-gray-400 whitespace-pre-line">{info.split("\n")[1] || ""}</p>
                : <p className="text-xs text-gray-300">Belum Terjadi</p>
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Skeleton row untuk loading state */
function SkeletonRow({ cols = 7 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3 border border-black">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

/** Modal detail transaksi — sama strukturnya dengan OrderList */
function DetailModal({ item, onClose}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting,    setDeleting]    = useState(false);
  const [advancing,   setAdvancing]   = useState(false);

  const totalNum = item.items?.reduce((acc, it) => (
    acc + parseInt(it.sub?.replace(/[^0-9]/g, "") || "0", 10)
  ), 0) ?? 0;

  const canAdvance = !["Selesai", "Dibatalkan"].includes(item.status);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

        {/* Header popup */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black sticky top-0 bg-white z-10">
          <h2 className="text-xl font-extrabold text-gray-800">Detail Transaksi</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* ── Kiri: Info + Tabel Item ── */}
          <div className="flex-1">
            {/* Info baris */}
            <div className="space-y-1.5 mb-5 text-sm">
              {[
                ["Nota",             item.nota],
                ["Layanan",          item.layanan],
                ["Tanggal Order",    item.tgl],
                ["Nama",             item.nama],
                ["Total Berat",      item.berat],
                ["Total Harga",      item.totalHarga],
                ["Estimasi Selesai", item.estimasi],
              ].map(([label, val]) => (
                <div key={label} className="flex gap-2">
                  <span className="w-36 text-gray-500 font-medium flex-shrink-0">{label}</span>
                  <span className="text-gray-400 flex-shrink-0">:</span>
                  <span className="font-semibold text-gray-800">{val}</span>
                </div>
              ))}
            </div>

            {/* Tabel item */}
            <div className="border border-black rounded-lg overflow-hidden">
              <table className="w-full text-sm border-collapse border border-black">
                <thead>
                  <tr className="bg-[#0077b6] text-white">
                    <th className="px-3 py-2 text-left font-semibold border border-black">Item</th>
                    <th className="px-3 py-2 text-right font-semibold border border-black">Jumlah</th>
                    <th className="px-3 py-2 text-right font-semibold border border-black">Harga Satuan</th>
                    <th className="px-3 py-2 text-right font-semibold border border-black">Sub Total</th>
                  </tr>
                </thead>
                <tbody>
                  {item.items?.map((row, i) => (
                    <tr key={i} className={`hover:bg-blue-100/50 ${i % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}`}>
                      <td className="px-3 py-1.5 text-gray-700 border border-black">{row.item}</td>
                      <td className="px-3 py-1.5 text-right text-gray-600 border border-black">{row.jumlah}</td>
                      <td className="px-3 py-1.5 text-right text-gray-600 border border-black">{row.harga}</td>
                      <td className="px-3 py-1.5 text-right text-gray-700 font-medium border border-black">{row.sub}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="px-3 py-2 font-bold text-gray-700 border border-black text-right">Total</td>
                    <td className="px-3 py-2 text-right font-extrabold text-[#0077b6] border border-black">
                      Rp{totalNum.toLocaleString("id-ID")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Kanan: Status + Timeline ── */}
          <div className="md:w-52 flex-shrink-0">
            <div className="mb-6 flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Tipe Pelanggan</span>
                <TipeBadge tipe={item.tipe} />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Status Saat Ini</span>
                <StatusBadge status={item.status} />
              </div>
            </div>
            <div className="px-2">
              <Timeline timeline={item.timeline} />
            </div>
          </div>
        </div>

        {/* Confirm modal (nested) */}
        {showConfirm && (
          <ConfirmModal
            item={item}
            onConfirm={handleDelete}
            onCancel={() => setShowConfirm(false)}
            loading={deleting}
          />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN — Dashboard
// ═══════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [stats,       setStats]       = useState(null);
  const [chartData,   setChartData]   = useState([]);
  const [orders,      setOrders]      = useState([]);
  const [page,        setPage]        = useState(1);
  const [detailItem,  setDetailItem]  = useState(null);
  const [deleteItem,  setDeleteItem]  = useState(null);
  const [deleting,    setDeleting]    = useState(false);

  const totalPages = Math.max(1, Math.ceil(orders.length / PER_PAGE));
  const pageData   = orders.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Fetch data ─────────────────────────────────────────────────────────────
  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/admin/dashboard");
      if (data.success) {
        setStats(data.stats);
        setChartData(data.weekly_chart ?? []);
        setOrders(data.recent_orders  ?? []);

        // Jika detail sedang terbuka, sinkronkan datanya
        if (detailItem) {
          const updated = (data.recent_orders ?? []).find((o) => o.id === detailItem.id);
          if (updated) setDetailItem(updated);
        }
      }
    } catch (err) {
      if (err.response?.status === 403) navigate("/login");
      else setError("Gagal memuat data. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <AdminSidebar>
      {/* Modal detail */}
      {detailItem && (
        <DetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
        />
      )}

      {/* ── Greeting ── */}
      <div className="flex items-center gap-3 bg-[#0077b6] text-white rounded-xl px-5 py-4 mb-6 shadow w-full">
        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <path d="M4 6h16" />
          <circle cx="12" cy="14" r="5" />
          <path d="M9.5 14.5c.8-.8 1.7-.8 2.5 0s1.7.8 2.5 0" />
          <circle cx="16" cy="4" r="0.5" fill="currentColor" />
          <circle cx="18" cy="4" r="0.5" fill="currentColor" />
        </svg>
        <h1 className="text-xl font-bold">Halo Admin</h1>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchDashboard} className="text-sm font-bold underline hover:text-red-800">
            Coba lagi
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* ── Grafik + Status Cards ── */}
        <div className="grid grid-cols-12 gap-6">
          {/* Grafik */}
          <div className="col-span-12 lg:col-span-8 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-extrabold text-gray-800 text-sm uppercase tracking-wide mb-3">
              Grafik Pendapatan Mingguan
            </h2>
            {loading
              ? <div className="h-48 bg-gray-100 animate-pulse rounded-xl" />
              : <>
                  <LineChart data={chartData} />
                  <div className="flex justify-between px-14 mt-1 text-xs font-bold text-gray-500 uppercase">
                    {chartData.map((d) => <span key={d.date}>{d.day}</span>)}
                  </div>
                </>
            }
          </div>

          {/* Status Cards */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-3">
            <p className="font-extrabold text-gray-800 text-sm uppercase tracking-wide">Status Cards</p>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {STATS_CONFIG.map(({ key, title, icon, border, bg, color, isCurrency }) => (
                <StatusCard
                  key={key}
                  title={title}
                  icon={icon}
                  border={border}
                  bg={bg}
                  color={color}
                  isCurrency={isCurrency}
                  value={
                    loading ? "—"
                    : isCurrency ? fmtRupiah(stats?.[key] ?? 0)
                    : (stats?.[key] ?? 0)
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabel Transaksi Terbaru ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-black overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-black bg-white">
            <h2 className="font-extrabold text-gray-800 text-base">Tabel Transaksi Terbaru</h2>
            <button onClick={() => navigate("/admin/orders")}
              className="flex items-center gap-1 text-sm font-bold text-[#0077b6] hover:text-[#005f92] transition">
              Lihat Semua <ChevronRight size={16} />
            </button>
          </div>

          {/* Tabel */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-black">
              <thead>
                <tr className="bg-[#0077b6] text-white">
                  {["No", "NOTA", "Nama", "Tipe", "Berat", "Estimasi Selesai", "Status", "Aksi"].map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold border border-black text-center">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={8} />)
                  : pageData.length === 0
                    ? <tr><td colSpan={8} className="text-center py-10 text-gray-400 border border-black">Tidak ada data</td></tr>
                    : pageData.map((row, i) => (
                        <tr key={row.id}
                          className={`transition hover:bg-blue-100/50 ${i % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}`}>
                          <td className="px-4 py-3 text-center border border-black text-sm">
                            {(page - 1) * PER_PAGE + i + 1}
                          </td>
                          <td className="px-4 py-3 text-center border border-black text-sm font-mono">{row.nota}</td>
                          <td className="px-4 py-3 text-center border border-black text-sm font-medium">{row.nama}</td>
                          <td className="px-4 py-3 text-center border border-black">
                            <TipeBadge tipe={row.tipe} />
                          </td>
                          <td className="px-4 py-3 text-center border border-black text-sm">{row.berat}</td>
                          <td className="px-4 py-3 text-center border border-black text-sm">{row.estimasi}</td>
                          <td className="px-4 py-3 text-center border border-black">
                            <StatusBadge status={row.status} />
                          </td>
                          <td className="px-4 py-3 text-center border border-black">
                            <div className="flex items-center justify-center gap-2">
                              
                              <button onClick={() => setDetailItem(row)} title="Detail"
                                className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition">
                                <Eye size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}