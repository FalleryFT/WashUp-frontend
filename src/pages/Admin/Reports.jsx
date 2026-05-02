// src/pages/Admin/FinancialReports.jsx
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import api from "../../api/axios";
import {
  TrendingUp, ShoppingBag, BarChart2, Upload,
  ChevronLeft, ChevronRight, Calendar, ChevronDown,
  FileText, Sheet, Loader2,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

// ═══════════════════════════════════════════════════════════════
// KONSTANTA
// ═══════════════════════════════════════════════════════════════
const PER_PAGE = 5;

const NAMA_BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const YEAR_LIST = Array.from({ length: 31 }, (_, i) => 2000 + i);

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
const fmt = (n) =>
  "Rp" + Number(n).toLocaleString("id-ID") + ",00";

const getDaysInMonth = (year, month) =>
  new Date(year, month, 0).getDate();

// ═══════════════════════════════════════════════════════════════
// KOMPONEN KECIL
// ═══════════════════════════════════════════════════════════════

/** Tooltip Recharts */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md px-4 py-2 text-sm">
      <p className="font-bold text-gray-700">Tanggal: {label}</p>
      <p className="text-[#0077b6] font-semibold">{fmt(payload[0].value)}</p>
    </div>
  );
};

/** Kartu statistik berwarna */
function StatCard({ title, value, sub, icon: Icon, accent, loading }) {
  return (
    <div className={`flex-1 min-w-0 rounded-2xl p-5 flex flex-col justify-between ${accent} text-white shadow`}>
      <div className="flex items-start justify-between mb-3">
        <p className="font-bold text-sm tracking-wide uppercase opacity-90">{title}</p>
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <div>
        {loading ? (
          <div className="h-7 w-32 bg-white/30 rounded animate-pulse" />
        ) : (
          <p className="text-2xl font-extrabold leading-tight">{value}</p>
        )}
        {sub && <p className="text-xs mt-1 opacity-80">{sub}</p>}
      </div>
    </div>
  );
}

/** Custom date picker bulan + tahun */
function MonthYearPicker({ month, year, onSelect }) {
  const [open, setOpen]           = useState(false);
  const [yearMenu, setYearMenu]   = useState(false);
  const [draftYear, setDraftYear] = useState(year);
  const ref = useRef(null);

  const totalDays  = getDaysInMonth(year, month);
  const labelText  = `1 - ${totalDays} ${NAMA_BULAN[month - 1]} ${year}`;

  // Tutup saat klik di luar
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setYearMenu(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleMonthSelect = (m) => {
    onSelect(m, draftYear);
    setOpen(false);
    setYearMenu(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-2.5 bg-white shadow-sm hover:border-[#0077b6] transition"
      >
        <Calendar size={18} className="text-[#0077b6]" />
        <span className="text-sm font-bold text-gray-700 min-w-[160px] text-left">{labelText}</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-xl p-4 z-50 w-[280px]">
          {/* Header tahun */}
          <div className="flex justify-between items-center mb-4 relative">
            <span className="font-bold text-gray-800 text-sm">Pilih Bulan & Tahun</span>

            <div className="relative">
              <button
                onClick={() => setYearMenu(!yearMenu)}
                className="flex items-center gap-1 border border-gray-300 rounded-lg px-2 py-1 text-sm font-bold text-gray-700 hover:border-[#0077b6] transition"
              >
                {draftYear}
                <ChevronDown size={14} className={`transition-transform ${yearMenu ? "rotate-180" : ""}`} />
              </button>
              {yearMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-44 overflow-y-auto z-50 w-24">
                  {YEAR_LIST.map((y) => (
                    <button
                      key={y}
                      onClick={() => { setDraftYear(y); setYearMenu(false); }}
                      className={`w-full text-center py-1.5 text-sm font-semibold transition ${
                        y === draftYear
                          ? "bg-[#0077b6] text-white"
                          : "hover:bg-[#eaf6fb] text-gray-700"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Grid bulan */}
          <div className="grid grid-cols-3 gap-2">
            {NAMA_BULAN.map((nama, idx) => {
              const m = idx + 1;
              const active = m === month && draftYear === year;
              return (
                <button
                  key={nama}
                  onClick={() => handleMonthSelect(m)}
                  className={`py-2 text-xs font-bold rounded-lg transition ${
                    active
                      ? "bg-[#0077b6] text-white shadow-md"
                      : "bg-gray-50 text-gray-600 hover:bg-[#eaf6fb] hover:text-[#0077b6] border border-transparent hover:border-[#0077b6]/30"
                  }`}
                >
                  {nama.slice(0, 3)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/** Dropdown tombol export PDF / Excel */
function ExportButton({ month, year, disabled }) {
  const [open, setOpen]         = useState(false);
  const [loading, setLoading]   = useState(null); // 'pdf' | 'excel' | null
  const [errMsg, setErrMsg]     = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleExport = async (format) => {
    setLoading(format);
    setErrMsg(null);
    setOpen(false);
    try {
      // ✅ Gunakan axios (sudah ada token interceptor & baseURL yang benar)
      const response = await api.get("/admin/reports/export", {
        params: { format, month, year },
        responseType: "blob", // penting: terima binary
      });

      // Tentukan ekstensi & mime
      const ext      = format === "pdf" ? "pdf" : "xlsx";
      const mime     = format === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const filename = `laporan-${NAMA_BULAN[month - 1].toLowerCase()}-${year}.${ext}`;

      // Cek apakah server mengembalikan JSON error (bukan file)
      const contentType = response.headers["content-type"] ?? "";
      if (contentType.includes("application/json")) {
        const text = await response.data.text();
        const json = JSON.parse(text);
        throw new Error(json.message ?? "Server mengembalikan error.");
      }

      // Trigger download
      const blob   = new Blob([response.data], { type: mime });
      const objUrl = URL.createObjectURL(blob);
      const a      = document.createElement("a");
      a.href       = objUrl;
      a.download   = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objUrl);

    } catch (err) {
      // Tangkap pesan error spesifik dari server jika ada
      let msg = "Export gagal.";
      if (err.response) {
        // Axios error — server merespon
        const status = err.response.status;
        if (status === 401) msg = "Sesi habis, silakan login ulang.";
        else if (status === 403) msg = "Akses ditolak.";
        else if (status === 422) msg = "Format tidak valid.";
        else if (status === 500) msg = "Error server (500). Cek log Laravel.";
        else msg = `Error ${status} dari server.`;
      } else if (err.request) {
        // Request dikirim tapi tidak ada respon — server mati
        msg = "Server tidak merespon. Pastikan Laravel berjalan di port 8000.";
      } else {
        msg = err.message ?? "Export gagal.";
      }
      setErrMsg(msg);
      console.error("[Export Error]", err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">

      {/* ── Error inline ── */}
      {errMsg && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 max-w-xs">
          <span>⚠️ {errMsg}</span>
          <button
            onClick={() => setErrMsg(null)}
            className="ml-1 text-red-400 hover:text-red-600 font-bold leading-none"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Tombol + Dropdown ── */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          disabled={disabled || !!loading}
          className="flex items-center gap-2 border-2 border-[#0077b6] text-[#0077b6] px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-50 transition disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Upload size={15} />
          )}
          {loading
            ? `Mengexport ${loading.toUpperCase()}...`
            : "Eksport PDF / Excel"}
          {!loading && (
            <ChevronDown
              size={14}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          )}
        </button>

        {open && !loading && (
          <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden w-44">
            <button
              onClick={() => handleExport("pdf")}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
            >
              <FileText size={16} className="text-red-500" />
              Export PDF
            </button>
            <div className="border-t border-gray-100" />
            <button
              onClick={() => handleExport("excel")}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
            >
              <Sheet size={16} className="text-green-500" />
              Export Excel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** Skeleton satu baris tabel */
function SkeletonRow({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-3.5 border border-black">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
export default function FinancialReports() {
  const [page, setPage]     = useState(1);
  const [month, setMonth]   = useState(new Date().getMonth() + 1);
  const [year, setYear]     = useState(new Date().getFullYear());

  // ── API state ──────────────────────────────────────────────────────────────
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [stats, setStats]             = useState(null);
  const [chartData, setChartData]     = useState([]);
  const [transactions, setTransactions] = useState([]);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/admin/reports", {
        params: { month, year },
      });
      if (data.success) {
        setStats(data.stats);
        setChartData(data.chart_data ?? []);
        setTransactions(data.transactions ?? []);
        setPage(1);
      }
    } catch (err) {
      setError("Gagal memuat laporan keuangan.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(transactions.length / PER_PAGE));
  const paginated  = transactions.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Stat cards config ──────────────────────────────────────────────────────
  const growthText = stats?.growth != null
    ? `${stats.growth >= 0 ? "↑" : "↓"}${Math.abs(stats.growth)}% dari bulan lalu`
    : "Belum ada data bulan lalu";

  const statCards = [
    {
      title: "Total Pendapatan",
      value: stats ? fmt(stats.total_pendapatan) : "-",
      sub: growthText,
      icon: TrendingUp,
      accent: "bg-[#0077b6]",
    },
    {
      title: "Jumlah Pesanan",
      value: stats ? `${stats.jumlah_pesanan} Order` : "-",
      sub: "Total transaksi bulan ini",
      icon: ShoppingBag,
      accent: "bg-[#023e8a]",
    },
    {
      title: "Rata-Rata",
      value: stats ? fmt(stats.rata_rata) : "-",
      sub: "Per transaksi",
      icon: BarChart2,
      accent: "bg-[#0096c7]",
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <AdminSidebar>
      {/* ── Header ── */}
      <div className="mb-6">
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
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
          Laporan Keuangan{" "}
          <span className="font-normal text-gray-500">(Financial Reports)</span>
        </h1>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center justify-between text-sm">
          <span>{error}</span>
          <button onClick={fetchReport} className="font-bold underline hover:text-red-800">
            Coba lagi
          </button>
        </div>
      )}

      {/* ── Filter Bar ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <MonthYearPicker
          month={month}
          year={year}
          onSelect={(m, y) => { setMonth(m); setYear(y); }}
        />

        <ExportButton month={month} year={year} disabled={loading} />
      </div>

      {/* ── Stat Cards ── */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} loading={loading} />
        ))}
      </div>

      {/* ── Grafik Tren ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <h2 className="font-bold text-gray-700 mb-4">Grafik Tren Pendapatan</h2>
        {loading ? (
          <div className="h-52 bg-gray-100 rounded-xl animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `Rp${(v / 1000000).toFixed(0)}jt`}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0077b6"
                strokeWidth={2.5}
                dot={{ r: 5, fill: "#0077b6", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Tabel Transaksi ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-black overflow-hidden">
        <div className="px-6 py-4 border-b border-black flex items-center justify-between">
          <h2 className="font-bold text-gray-700">Rincian Transaksi</h2>
          {!loading && (
            <span className="text-xs text-gray-400 font-medium">
              {transactions.length} transaksi
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-black">
            <thead>
              <tr className="bg-[#0077b6] text-white">
                {["No", "Tanggal", "No Nota", "Pelanggan", "Nominal"].map((h) => (
                  <th key={h} className="px-5 py-3 text-center font-semibold border border-black">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400 border border-black">
                    Tidak ada data transaksi untuk periode ini.
                  </td>
                </tr>
              ) : (
                paginated.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`transition hover:bg-blue-100/50 ${
                      idx % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"
                    }`}
                  >
                    <td className="px-5 py-3.5 text-center text-gray-600 border border-black">
                      {(page - 1) * PER_PAGE + idx + 1}
                    </td>
                    <td className="px-5 py-3.5 text-center text-gray-700 border border-black">
                      {row.tanggal}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono text-gray-700 border border-black">
                      {row.nota}
                    </td>
                    <td className="px-5 py-3.5 text-center font-semibold text-gray-800 border border-black">
                      {row.pelanggan}
                    </td>
                    <td className="px-5 py-3.5 text-center text-gray-700 border border-black">
                      {fmt(row.nominal)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-1 px-6 py-4 border-t border-black bg-white">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg text-sm border border-black text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft size={14} /> Sebelumnya
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-semibold transition ${
                page === p
                  ? "bg-[#0077b6] text-white"
                  : "border border-black text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg text-sm border border-black text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Selanjutnya <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </AdminSidebar>
  );
}