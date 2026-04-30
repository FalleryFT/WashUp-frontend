// src/pages/Admin/FinancialReports.jsx
import { useState, useMemo, useRef, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import {
  TrendingUp, ShoppingBag, BarChart2, Upload,
  ChevronLeft, ChevronRight, Calendar, ChevronDown
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

// ─── DATA GRAFIK ─────────────────────────────────────────────────────────────
const chartData = [
  { label: "1-7",   value: 5200000 },
  { label: "8-14",  value: 9800000 },
  { label: "15-21", value: 13400000 },
  { label: "22-30", value: 18600000 },
];

// ─── DATA TABEL ──────────────────────────────────────────────────────────────
const allRows = [
  { id: 1,  tanggal: "1 April 1976",    nota: "01012000", pelanggan: "Don Norman",          nominal: 50000 },
  { id: 2,  tanggal: "24 Januari 1984",  nota: "11111111", pelanggan: "Jakob Nielsen",        nominal: 42000 },
  { id: 3,  tanggal: "9 Agustus 1995",   nota: "12345678", pelanggan: "Ben Shneiderman",      nominal: 58000 },
  { id: 4,  tanggal: "7 Januari 2007",   nota: "22222222", pelanggan: "Jesse James Garrett",  nominal: 30000 },
  { id: 5,  tanggal: "29 Juni 2007",     nota: "20062006", pelanggan: "Luke Wroblewski",      nominal: 70000 },
  { id: 6,  tanggal: "12 Maret 2010",    nota: "31031031", pelanggan: "Alan Cooper",          nominal: 88000 },
  { id: 7,  tanggal: "5 Mei 2015",       nota: "05052015", pelanggan: "Steve Krug",           nominal: 45000 },
  { id: 8,  tanggal: "18 Juli 2018",     nota: "18072018", pelanggan: "Jared Spool",          nominal: 63000 },
  { id: 9,  tanggal: "3 Oktober 2020",   nota: "03102020", pelanggan: "Brad Frost",           nominal: 49000 },
  { id: 10, tanggal: "22 Februari 2021", nota: "22022021", pelanggan: "Tim Brown",            nominal: 35000 },
  { id: 11, tanggal: "8 November 2021",  nota: "08112021", pelanggan: "Julie Zhuo",           nominal: 28000 },
  { id: 12, tanggal: "14 April 2022",    nota: "14042022", pelanggan: "Jonathan Ive",         nominal: 70000 },
  { id: 13, tanggal: "30 Agustus 2023",  nota: "30082023", pelanggan: "Budi Santoso",         nominal: 56000 },
  { id: 14, tanggal: "1 Januari 2024",   nota: "01012024", pelanggan: "Siti Rahayu",          nominal: 39000 },
  { id: 15, tanggal: "17 April 2026",    nota: "17042026", pelanggan: "Ahmad Fauzi",          nominal: 77000 },
];

const PER_PAGE = 5;

const fmt = (n) => "Rp" + n.toLocaleString("id-ID") + ",00";

// Array nama bulan untuk format teks
const NAMA_BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// Fungsi untuk mendapatkan jumlah hari dalam suatu bulan dan tahun
const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

// Generate list tahun (dari 2000 sampai 2030)
const YEAR_LIST = Array.from({ length: 31 }, (_, i) => 2000 + i);

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-md px-4 py-2 text-sm">
        <p className="font-bold text-gray-700">Tanggal: {label}</p>
        <p className="text-[#0077b6] font-semibold">{fmt(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({ title, value, sub, icon: Icon, accent }) {
  return (
    <div className={`flex-1 min-w-0 rounded-2xl p-5 flex flex-col justify-between ${accent} text-white shadow`}>
      <div className="flex items-start justify-between mb-3">
        <p className="font-bold text-sm tracking-wide uppercase opacity-90">{title}</p>
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-extrabold leading-tight">{value}</p>
        {sub && <p className="text-xs mt-1 opacity-80">{sub}</p>}
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function FinancialReports() {
  const [page, setPage] = useState(1);

  // ─── CUSTOM DATE PICKER STATE ───
  const [showPicker, setShowPicker] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
  const pickerRef = useRef(null);

  // Tutup popup kalender jika user klik di luar area popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
        setShowYearDropdown(false);
      }
    };
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  // Kalkulasi keterangan rentang tanggal (Misal: "1 - 30 April 2026")
  const dateRangeText = useMemo(() => {
    const totalDays = getDaysInMonth(selectedYear, selectedMonth);
    const monthName = NAMA_BULAN[selectedMonth - 1];
    return `1 - ${totalDays} ${monthName} ${selectedYear}`;
  }, [selectedMonth, selectedYear]);

  const totalPages = Math.max(1, Math.ceil(allRows.length / PER_PAGE));
  const paginated  = allRows.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalPendapatan = allRows.reduce((s, r) => s + r.nominal, 0);
  const jumlahPesanan   = allRows.length;
  const rataRata        = Math.round(totalPendapatan / jumlahPesanan);

  return (
    <AdminSidebar>
      {/* ── Header ── */}
      <div className="mb-6">
        {/* Halo Admin - Lebar Penuh (w-full) */}
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
          Laporan Keuangan <span className="font-normal text-gray-500">(Financial Reports)</span>
        </h1>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2">
          
          {/* Custom Date Picker Terpadu */}
          <div className="relative group" ref={pickerRef}>
            <button 
              onClick={() => setShowPicker(!showPicker)}
              className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-2.5 bg-white shadow-sm hover:border-[#0077b6] transition cursor-pointer"
            >
              <Calendar size={18} className="text-[#0077b6] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-gray-700 min-w-[140px] text-left">{dateRangeText}</span>
            </button>

            {/* Popup Kalender / Bulan & Tahun */}
            {showPicker && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-xl p-4 z-50 w-[280px]">
                
                {/* Header Popup (Bulan & Pilihan Tahun) */}
                <div className="flex justify-between items-center mb-4 relative">
                  <span className="font-bold text-gray-800 text-sm">Pilih Bulan & Tahun</span>
                  
                  {/* Tombol Pemilih Tahun (Custom Dropdown) */}
                  <button
                    onClick={() => setShowYearDropdown(!showYearDropdown)}
                    className="flex items-center gap-1 bg-[#eaf6fb] text-[#0077b6] font-bold text-sm border border-[#0077b6]/30 rounded-lg px-2 py-1 cursor-pointer hover:bg-blue-100 transition"
                  >
                    {selectedYear} <ChevronDown size={14} />
                  </button>

                  {/* List Tahun yang bisa discroll secara terbatas */}
                  {showYearDropdown && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-200 shadow-lg rounded-lg w-24 max-h-40 overflow-y-auto z-50">
                      {YEAR_LIST.map((y) => (
                        <button
                          key={y}
                          onClick={() => {
                            setSelectedYear(y);
                            setShowYearDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm transition ${
                            selectedYear === y 
                              ? "bg-[#0077b6] text-white font-bold" 
                              : "text-gray-700 hover:bg-[#eaf6fb] hover:text-[#0077b6]"
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Grid Tombol Bulan */}
                <div className="grid grid-cols-3 gap-2">
                  {NAMA_BULAN.map((bulan, index) => {
                    const m = index + 1;
                    const isSelected = selectedMonth === m;
                    return (
                      <button
                        key={bulan}
                        onClick={() => {
                          setSelectedMonth(m);
                          setShowPicker(false); // Tutup otomatis popup utama setelah memilih bulan
                          setShowYearDropdown(false);
                        }}
                        className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                          isSelected 
                            ? "bg-[#0077b6] text-white shadow-md" 
                            : "bg-gray-50 text-gray-600 hover:bg-[#eaf6fb] hover:text-[#0077b6] border border-transparent hover:border-[#0077b6]/30"
                        }`}
                      >
                        {bulan.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
        </div>

        {/* Export */}
        <button className="flex items-center gap-2 border-2 border-[#0077b6] text-[#0077b6] px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-50 transition">
          <Upload size={15} /> Eksport PDF/EXCEL
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <StatCard
          title="Total Pendapatan"
          value={fmt(totalPendapatan)}
          sub="↑10%  dari bulan lalu"
          icon={TrendingUp}
          accent="bg-[#0077b6]"
        />
        <StatCard
          title="Jumlah Pesanan"
          value={`${jumlahPesanan} Order`}
          sub={`Total transaksi bulan ini`}
          icon={ShoppingBag}
          accent="bg-[#023e8a]"
        />
        <StatCard
          title="Rata-Rata"
          value={fmt(rataRata)}
          sub="Per transaksi"
          icon={BarChart2}
          accent="bg-[#0096c7]"
        />
      </div>

      {/* ── Grafik ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <h2 className="font-bold text-gray-700 mb-4">Grafik Tren Pendapatan</h2>
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
              tickFormatter={(v) => `Rp${(v / 1000000).toFixed(0)}.000.000`}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              width={110}
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
      </div>

      {/* ── Tabel Transaksi ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-black overflow-hidden">
        <div className="px-6 py-4 border-b border-black">
          <h2 className="font-bold text-gray-700">Rincian Transaksi</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-black">
            <thead>
              <tr className="bg-[#0077b6] text-white">
                <th className="px-5 py-3 text-center font-semibold w-14 border border-black">No</th>
                <th className="px-5 py-3 text-center font-semibold border border-black">Tanggal</th>
                <th className="px-5 py-3 text-center font-semibold border border-black">No Nota</th>
                <th className="px-5 py-3 text-center font-semibold border border-black">Pelanggan</th>
                <th className="px-5 py-3 text-center font-semibold border border-black">Nominal</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="text-center py-10 text-gray-400 border border-black">Tidak ada data transaksi.</td>
                 </tr>
              ) : (
                paginated.map((row, idx) => (
                  // Zebra striping untuk baris tabel
                  <tr
                    key={row.id}
                    className={`transition hover:bg-blue-100/50 ${idx % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}`}
                  >
                    <td className="px-5 py-3.5 text-center text-gray-600 border border-black">{(page - 1) * PER_PAGE + idx + 1}</td>
                    <td className="px-5 py-3.5 text-center text-gray-700 border border-black">{row.tanggal}</td>
                    <td className="px-5 py-3.5 text-center font-mono text-gray-700 border border-black">{row.nota}</td>
                    <td className="px-5 py-3.5 text-center font-semibold text-gray-800 border border-black">{row.pelanggan}</td>
                    <td className="px-5 py-3.5 text-center text-gray-700 border border-black">{fmt(row.nominal)}</td>
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