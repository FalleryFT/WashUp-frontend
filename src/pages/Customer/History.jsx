// src/pages/Customer/RiwayatPesanan.jsx
import { useState, useEffect, useCallback } from "react";
import CustomerSidebar from "../../components/CustomerSidebar";
import { useAuth } from "../../context/AuthContext";
import { Eye, X, Printer, ChevronLeft, ChevronRight, WashingMachine, Search, RefreshCw } from "lucide-react";
import api from "../../api/axios";

// ─── KONSTANTA ────────────────────────────────────────────────────────────────
const STATUS_BADGE = {
  "Order Diterima": "bg-blue-100 text-blue-800 border-blue-200",
  "Sedang Dipilah": "bg-orange-100 text-orange-800 border-orange-200",
  "Sedang Dicuci":  "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Siap Diambil":   "bg-purple-100 text-purple-800 border-purple-200",
  "Selesai":        "bg-green-100 text-green-800 border-green-200",
  "Dibatalkan":     "bg-red-100 text-red-800 border-red-200",
};

const MONTHS = [
  "Semua","Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];

// Sesuai TIMELINE_STEPS di komponen Timeline — 4 step
const TIMELINE_STEPS = [
  { label: "Order Diterima" },
  { label: "Sedang Dipilah" },
  { label: "Sedang Dicuci"  },
  { label: "Siap Diambil"   },
];

const PER_PAGE = 5;

// ─── TIMELINE (Vertical / Popup) ─────────────────────────────────────────────
function Timeline({ detail }) {
  return (
    <div className="flex flex-col gap-0">
      {TIMELINE_STEPS.map((step, i) => {
        const done   = i <= detail.activeStep;
        const isLast = i === TIMELINE_STEPS.length - 1;
        // Tanggal dari array timeline yang dikirim API
        const tgl    = detail.timeline?.[i]?.tanggal ?? '-';
        return (
          <div key={i} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full border flex-shrink-0 mt-0.5 ${
                done ? "bg-[#0077b6] border-black" : "bg-white border-black"
              }`} />
              {!isLast && (
                <div className={`w-0.5 h-8 ${
                  done && i < detail.activeStep ? "bg-[#0077b6]" : "bg-black"
                }`} />
              )}
            </div>
            <div className="pb-1">
              <p className={`text-sm font-bold leading-tight ${done ? "text-gray-900" : "text-gray-400"}`}>
                {step.label}
              </p>
              <p className={`text-[10px] ${done ? "text-gray-500 font-medium" : "text-gray-400"}`}>
                {tgl}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── CETAK NOTA ───────────────────────────────────────────────────────────────
// Sesuai handlePrint — pakai field: nota, nama, tipe, tgl, estimasi, layanan,
//                                   totalHarga, items[]
function handlePrint(detailItem) {
  if (!detailItem) return;

  const printWindow = window.open('', '_blank', 'width=800,height=600');

  const itemsHtml = detailItem.items.map(item => `
    <tr>
      <td style="padding:10px;border-bottom:1px dashed #ccc;">${item.item}</td>
      <td style="padding:10px;border-bottom:1px dashed #ccc;text-align:center;">${item.jumlah}</td>
      <td style="padding:10px;border-bottom:1px dashed #ccc;text-align:right;">${item.harga}</td>
      <td style="padding:10px;border-bottom:1px dashed #ccc;text-align:right;">${item.sub}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Cetak Nota - ${detailItem.nota}</title>
        <style>
          body { font-family:'Courier New',Courier,monospace; color:#333; max-width:600px; margin:0 auto; padding:20px; }
          .header { text-align:center; border-bottom:2px dashed #333; padding-bottom:15px; margin-bottom:20px; }
          .header h1 { margin:0; font-size:24px; color:#0077b6; }
          .header p  { margin:5px 0 0; font-size:14px; color:#666; }
          .info-grid { display:flex; justify-content:space-between; margin-bottom:20px; font-size:14px; }
          .info-grid table { border-collapse:collapse; }
          .info-grid td { padding:3px 10px 3px 0; }
          .table { width:100%; border-collapse:collapse; margin-bottom:20px; font-size:14px; }
          .table th { border-bottom:2px dashed #333; padding:10px; text-align:left; }
          .table th.center { text-align:center; }
          .table th.right  { text-align:right; }
          .total-section { border-top:2px dashed #333; padding-top:15px; text-align:right; font-size:16px; }
          .footer { text-align:center; margin-top:40px; font-size:12px; color:#666; border-top:1px dashed #ccc; padding-top:20px; }
          @media print { body { padding:0; margin:20px; } button { display:none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>WASHUP LAUNDRY</h1>
          <p>Bukti Transaksi Pesanan</p>
        </div>
        <div class="info-grid">
          <table>
            <tr><td><strong>Nota</strong></td><td>: ${detailItem.nota}</td></tr>
            <tr><td><strong>Nama</strong></td><td>: ${detailItem.nama}</td></tr>
            <tr><td><strong>Tipe</strong></td><td>: ${detailItem.tipe}</td></tr>
          </table>
          <table>
            <tr><td><strong>Tanggal</strong></td><td>: ${detailItem.tgl}</td></tr>
            <tr><td><strong>Estimasi</strong></td><td>: ${detailItem.estimasi}</td></tr>
            <tr><td><strong>Layanan</strong></td><td>: ${detailItem.layanan}</td></tr>
          </table>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Item / Layanan</th>
              <th class="center">Jumlah</th>
              <th class="right">Harga</th>
              <th class="right">Sub Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div class="total-section">
          <strong>Total Bayar: <span style="color:#0077b6;font-size:20px;">${detailItem.totalHarga}</span></strong>
        </div>
        <div class="footer">
          <p>Terima kasih telah mempercayakan pakaian Anda di WashUp Laundry.</p>
          <p>Harap bawa nota ini saat pengambilan.</p>
        </div>
        <script>
          window.onload = function() { window.print(); setTimeout(() => { window.close(); }, 500); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

// ─── DETAIL POPUP ─────────────────────────────────────────────────────────────
function DetailPopup({ detail, statusLabel, onClose }) {
  const total = detail.items.reduce((s, r) => {
    const num = parseInt(r.sub.replace(/\D/g, ""), 10);
    return s + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-black">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-black bg-white sticky top-0 z-10">
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-wide">Detail Transaksi</h2>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold border ${STATUS_BADGE[statusLabel] ?? "bg-gray-100 text-gray-500 border-black"}`}>
              {statusLabel}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-red-600 transition-colors">
              <X size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row gap-8 p-8">

          {/* Kiri: info + tabel */}
          <div className="flex-1 flex flex-col">
            <div className="space-y-2 text-sm mb-6 bg-gray-50 p-5 rounded-2xl border border-black">
              {[
                ["Nota",             detail.nota],
                ["Layanan",          detail.layanan],
                ["Tanggal Order",    detail.tanggalOrder],
                ["Nama",             detail.nama],
                ["Total Berat",      detail.totalBerat],
                ["Estimasi Selesai", detail.estimasi],
              ].map(([label, val]) => (
                <div key={label} className="flex gap-3 text-xs">
                  <span className="w-32 text-gray-500 font-bold uppercase">{label}</span>
                  <span className="text-gray-600 font-black">:</span>
                  <span className="font-bold text-gray-900">{val}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden border border-black shadow-sm mb-8">
              <table className="w-full text-xs border-collapse">
                <thead className="bg-[#0077b6] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left  font-semibold border-b border-black">Item</th>
                    <th className="px-4 py-3 text-center font-semibold border-b border-l border-black">Jml</th>
                    <th className="px-4 py-3 text-right  font-semibold border-b border-l border-black">Harga</th>
                    <th className="px-4 py-3 text-right  font-semibold border-b border-l border-black">Sub Total</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.items.map((row, i) => (
                    <tr key={i} className={`border-b border-black ${i % 2 === 1 ? "bg-gray-50/50" : "bg-white"}`}>
                      <td className="px-4 py-2.5 font-bold text-gray-800">{row.item}</td>
                      <td className="px-4 py-2.5 text-center  font-medium text-gray-700 border-l border-black">{row.jumlah}</td>
                      <td className="px-4 py-2.5 text-right   font-medium text-gray-700 border-l border-black">{row.harga}</td>
                      <td className="px-4 py-2.5 text-right   font-bold   text-gray-800 border-l border-black">{row.sub}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#eaf6fb]">
                    <td colSpan={3} className="px-4 py-3.5 font-black text-gray-800 uppercase text-right">Total Bayar</td>
                    <td className="px-4 py-3.5 text-right font-black text-lg text-[#0077b6] border-l border-black">
                      Rp {total.toLocaleString("id-ID")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tombol Cetak — terhubung ke handlePrint */}
            <div className="mt-auto">
              <button
                onClick={() => handlePrint(detail)}
                className="flex items-center gap-2 bg-[#0077b6] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#005f92] transition-colors border border-black shadow-sm"
              >
                <Printer size={18} /> Cetak Nota
              </button>
            </div>
          </div>

          {/* Kanan: Timeline */}
          <div className="md:w-56 flex-shrink-0 bg-gray-50 p-5 rounded-2xl border border-black h-fit">
            <p className="font-bold text-gray-800 text-sm uppercase mb-4 border-b border-black pb-3">Status Pengerjaan</p>
            <Timeline detail={detail} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────
function TableSkeleton() {
  return Array.from({ length: PER_PAGE }).map((_, i) => (
    <tr key={i} className={i % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}>
      {[0,1,2,3,4,5,6,7].map(j => (
        <td key={j} className="px-4 py-3.5 border-b border-l border-black first:border-l-0">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  ));
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function RiwayatPesanan() {
  const { user }   = useAuth();
  const namaUser   = user?.name || user?.username || "Pelanggan";

  // ── State filter (dikontrol frontend → dikirim ke API) ────────────────────
  const [filterBulan,  setFilterBulan]  = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [sortOrder,    setSortOrder]    = useState("Terbaru");
  const [searchNota,   setSearchNota]   = useState("");
  const [page,         setPage]         = useState(1);
  const [popup,        setPopup]        = useState(null);

  // ── State data dari API ───────────────────────────────────────────────────
  const [rows,       setRows]       = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  // ── Fetch dari API ─────────────────────────────────────────────────────────
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/customer/history", {
        params: {
          status:   filterStatus,   // "Semua" | "Selesai" | dll
          bulan:    filterBulan,    // "Semua" | "Januari" | dll (nama bulan)
          sort:     sortOrder,      // "Terbaru" | "Terlama"
          nota:     searchNota || undefined,
          page,
          per_page: PER_PAGE,
        },
      });
      setRows(data.data ?? []);
      setTotalPages(data.meta?.total_pages ?? 1);
      setTotal(data.meta?.total ?? 0);
    } catch (err) {
      setError("Gagal memuat riwayat. Periksa koneksi dan coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterBulan, filterStatus, sortOrder, searchNota, page]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  // Reset ke page 1 saat filter berubah (sudah ditangani di onChange masing-masing)

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
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Halo, {namaUser}! ✨</h1>
            <p className="text-blue-50 text-sm font-medium mt-1 opacity-90">
              Kelola dan pantau seluruh riwayat transaksi cucianmu di sini.
            </p>
          </div>
        </div>

        {/* HEADER JUDUL */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-extrabold text-gray-800 text-lg tracking-wide uppercase">Riwayat Pesanan</h2>
            {!loading && (
              <p className="text-xs text-gray-400 mt-0.5">{total} transaksi ditemukan</p>
            )}
          </div>
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-[#0077b6] font-semibold hover:underline disabled:opacity-40"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchHistory} className="font-bold underline ml-4">Coba Lagi</button>
          </div>
        )}

        {/* FILTER & PENCARIAN */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm mb-8">
          <p className="font-bold text-gray-800 uppercase text-sm mb-4">Filter & Pencarian</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">

            <div className="flex flex-wrap gap-5">
              {/* Status */}
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Status Pesanan</p>
                <select
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0077b6] min-w-[200px] cursor-pointer"
                >
                  <option value="Semua">Semua</option>
                  <option value="Order Diterima">Order Diterima</option>
                  <option value="Sedang Dipilah">Sedang Dipilah</option>
                  <option value="Sedang Dicuci">Sedang Dicuci</option>
                  <option value="Siap Diambil">Siap Diambil</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>

              {/* Bulan — dikirim sebagai nama (Januari dll) ke API */}
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Bulan</p>
                <select
                  value={filterBulan}
                  onChange={(e) => { setFilterBulan(e.target.value); setPage(1); }}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0077b6] min-w-[160px] cursor-pointer"
                >
                  {MONTHS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>

              {/* Urutkan */}
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Urutkan</p>
                <select
                  value={sortOrder}
                  onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0077b6] min-w-[150px] cursor-pointer"
                >
                  <option value="Terbaru">Terbaru</option>
                  <option value="Terlama">Terlama</option>
                </select>
              </div>
            </div>

            {/* Search Nota */}
            <div className="w-full md:w-auto">
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Cari Nota</p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Masukkan NOTA..."
                  value={searchNota}
                  onChange={(e) => { setSearchNota(e.target.value); setPage(1); }}
                  className="border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm font-bold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0077b6] w-full md:w-[250px]"
                />
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* TABEL */}
        <div className="bg-white rounded-2xl border-2 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.12)]">
          <div className="px-6 py-5 border-b-2 border-black bg-white">
            <p className="font-black text-gray-800 uppercase text-sm">Daftar Transaksi</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-[#0077b6] text-white">
                <tr>
                  <th className="px-4 py-3.5 text-center font-bold border-b-2 border-black w-12">No</th>
                  <th className="px-4 py-3.5 text-center font-bold border-b-2 border-l-2 border-black">NOTA</th>
                  <th className="px-4 py-3.5 text-center font-bold border-b-2 border-l-2 border-black">Tgl Order</th>
                  <th className="px-4 py-3.5 text-left   font-bold border-b-2 border-l-2 border-black">Layanan Utama</th>
                  <th className="px-4 py-3.5 text-center font-bold border-b-2 border-l-2 border-black">Berat</th>
                  <th className="px-4 py-3.5 text-center font-bold border-b-2 border-l-2 border-black">Total Harga</th>
                  <th className="px-4 py-3.5 text-center font-bold border-b-2 border-l-2 border-black">Status</th>
                  <th className="px-4 py-3.5 text-center font-bold border-b-2 border-l-2 border-black">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton />
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-500 font-bold">
                      Data tidak ditemukan.
                    </td>
                  </tr>
                ) : (
                  rows.map((row, idx) => {
                    const isLastRow = idx === rows.length - 1;
                    return (
                      <tr
                        key={row.id}
                        className={`transition hover:bg-blue-50/50 ${idx % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}`}
                      >
                        <td className={`px-4 py-3.5 text-center font-bold text-gray-500 ${isLastRow ? "" : "border-b border-black"}`}>
                          {(page - 1) * PER_PAGE + idx + 1}
                        </td>
                        <td className={`px-4 py-3.5 text-center font-mono font-bold text-gray-900 border-l border-black ${isLastRow ? "" : "border-b"}`}>
                          {row.nota}
                        </td>
                        <td className={`px-4 py-3.5 text-center font-bold text-gray-600 border-l border-black ${isLastRow ? "" : "border-b"}`}>
                          {row.tanggal}
                        </td>
                        <td className={`px-4 py-3.5 font-bold text-gray-800 border-l border-black ${isLastRow ? "" : "border-b"}`}>
                          {row.layananUtama}
                        </td>
                        <td className={`px-4 py-3.5 text-center font-black text-gray-700 border-l border-black ${isLastRow ? "" : "border-b"}`}>
                          {row.berat}
                        </td>
                        <td className={`px-4 py-3.5 text-center font-black text-[#0077b6] border-l border-black ${isLastRow ? "" : "border-b"}`}>
                          {row.harga}
                        </td>
                        <td className={`px-4 py-3.5 text-center border-l border-black ${isLastRow ? "" : "border-b"}`}>
                          <span className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold border inline-block ${STATUS_BADGE[row.status] ?? "bg-gray-100 text-gray-500 border-gray-300"}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className={`px-4 py-3.5 text-center border-l border-black ${isLastRow ? "" : "border-b"}`}>
                          <button
                            onClick={() => setPopup({ detail: row.detail, status: row.status })}
                            className="w-8 h-8 rounded-lg bg-blue-50 text-[#0077b6] hover:bg-blue-100 transition-colors flex items-center justify-center mx-auto"
                            title="Lihat Detail"
                          >
                            <Eye size={16} strokeWidth={2.5} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t-2 border-black bg-gray-50">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Halaman {page} dari {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-black text-gray-800 bg-white hover:-translate-y-0.5 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Sebelumnya
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border border-black ${
                      page === p
                        ? "bg-[#0077b6] text-white border-[#0077b6]"
                        : "bg-white text-gray-800 hover:-translate-y-0.5 hover:shadow-sm"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-black text-gray-800 bg-white hover:-translate-y-0.5 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Selanjutnya <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* POPUP DETAIL */}
      {popup && (
        <DetailPopup
          detail={popup.detail}
          statusLabel={popup.status}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}