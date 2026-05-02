// src/pages/Customer/RiwayatPesanan.jsx
import { useState, useMemo } from "react";
import CustomerSidebar from "../../components/CustomerSidebar";
import { useAuth } from "../../context/AuthContext";
import { Eye, X, Printer, ChevronLeft, ChevronRight, WashingMachine, Search } from "lucide-react";

// ─── DATA DUMMY (Status Divariasikan) ────────────────────────────────────────
const allData = [
  {
    id: 8, nota: "17081945", tanggal: "18 Jan 2024",
    layananUtama: "Kiloan 7Kg (Reguler) + Bedcover 1x",
    berat: "10Kg", harga: "Rp25.000", status: "Selesai",
    detail: {
      nota: "17081945", layanan: "Cuci Setrika", tanggalOrder: "18 Jan 2024",
      nama: "Alvin Farhan Adison", totalBerat: "10 Kg", totalHarga: "Rp25.000",
      estimasi: "19 Jan 2024", activeStep: 3,
      items: [
        { item: "Kiloan",   jumlah: "7kg", harga: "Rp7.000",  sub: "Rp49.000" },
        { item: "Bedcover", jumlah: "1x",  harga: "Rp30.000", sub: "Rp30.000" },
      ],
    },
  },
  {
    id: 7, nota: "31122023", tanggal: "18 Jan 2024",
    layananUtama: "Bedcover 1x (Satuan)",
    berat: "3Kg", harga: "Rp20.000", status: "Dibatalkan",
    detail: {
      nota: "31122023", layanan: "Cuci Setrika", tanggalOrder: "6 Okt 2023",
      nama: "Alvin Farhan Adison", totalBerat: "4 Kg", totalHarga: "Rp88.000",
      estimasi: "6 Okt 2023", activeStep: 2,
      items: [
        { item: "Kiloan",   jumlah: "4kg", harga: "Rp7.000",  sub: "Rp28.000" },
        { item: "Selimut",  jumlah: "1x",  harga: "Rp20.000", sub: "Rp20.000" },
        { item: "Bedcover", jumlah: "1x",  harga: "Rp30.000", sub: "Rp30.000" },
        { item: "Pelembut", jumlah: "1x",  harga: "Rp5.000",  sub: "Rp5.000"  },
        { item: "Sabun",    jumlah: "1x",  harga: "Rp5.000",  sub: "Rp5.000"  },
      ],
    },
  },
  {
    id: 6, nota: "01072006", tanggal: "18 Jan 2024",
    layananUtama: "Selimut 1x (Satuan)",
    berat: "1Kg", harga: "Rp15.000", status: "Siap Diambil",
    detail: {
      nota: "01072006", layanan: "Cuci Kering", tanggalOrder: "18 Jan 2024",
      nama: "Alvin Farhan Adison", totalBerat: "1 Kg", totalHarga: "Rp15.000",
      estimasi: "19 Jan 2024", activeStep: 3,
      items: [
        { item: "Selimut", jumlah: "1x", harga: "Rp15.000", sub: "Rp15.000" },
      ],
    },
  },
  {
    id: 5, nota: "15081945", tanggal: "18 Jan 2024",
    layananUtama: "Bedcover 1x (Satuan)",
    berat: "3Kg", harga: "Rp10.000", status: "Order Diterima",
    detail: {
      nota: "15081945", layanan: "Cuci Setrika", tanggalOrder: "18 Jan 2024",
      nama: "Alvin Farhan Adison", totalBerat: "3 Kg", totalHarga: "Rp10.000",
      estimasi: "19 Jan 2024", activeStep: 0,
      items: [
        { item: "Bedcover", jumlah: "1x", harga: "Rp10.000", sub: "Rp10.000" },
      ],
    },
  },
  {
    id: 4, nota: "24682468", tanggal: "18 Jan 2024",
    layananUtama: "Kiloan 9Kg (Reguler)",
    berat: "9Kg", harga: "Rp24.000", status: "Sedang Dicuci",
    detail: {
      nota: "24682468", layanan: "Cuci Kering", tanggalOrder: "18 Jan 2024",
      nama: "Alvin Farhan Adison", totalBerat: "9 Kg", totalHarga: "Rp24.000",
      estimasi: "20 Jan 2024", activeStep: 1,
      items: [
        { item: "Kiloan", jumlah: "9kg", harga: "Rp7.000", sub: "Rp24.000" },
      ],
    },
  },
  {
    id: 3, nota: "13571357", tanggal: "5 Feb 2024",
    layananUtama: "Kiloan 5Kg (Reguler)",
    berat: "5Kg", harga: "Rp35.000", status: "Sedang Dipilah",
    detail: {
      nota: "13571357", layanan: "Cuci Setrika", tanggalOrder: "5 Feb 2024",
      nama: "Alvin Farhan Adison", totalBerat: "5 Kg", totalHarga: "Rp35.000",
      estimasi: "6 Feb 2024", activeStep: 1,
      items: [{ item: "Kiloan", jumlah: "5kg", harga: "Rp7.000", sub: "Rp35.000" }],
    },
  },
  {
    id: 2, nota: "12344321", tanggal: "12 Feb 2024",
    layananUtama: "Kiloan 7Kg (Reguler)",
    berat: "7Kg", harga: "Rp49.000", status: "Selesai",
    detail: {
      nota: "12344321", layanan: "Cuci Kering", tanggalOrder: "12 Feb 2024",
      nama: "Alvin Farhan Adison", totalBerat: "7 Kg", totalHarga: "Rp49.000",
      estimasi: "13 Feb 2024", activeStep: 3,
      items: [{ item: "Kiloan", jumlah: "7kg", harga: "Rp7.000", sub: "Rp49.000" }],
    },
  },
  {
    id: 1, nota: "12122021", tanggal: "20 Feb 2024",
    layananUtama: "Kiloan 5Kg (Reguler)",
    berat: "5Kg", harga: "Rp35.000", status: "Dibatalkan",
    detail: {
      nota: "12122021", layanan: "Cuci Kering", tanggalOrder: "20 Feb 2024",
      nama: "Alvin Farhan Adison", totalBerat: "5 Kg", totalHarga: "Rp35.000",
      estimasi: "21 Feb 2024", activeStep: 0,
      items: [{ item: "Kiloan", jumlah: "5kg", harga: "Rp7.000", sub: "Rp35.000" }],
    },
  },
];

const TIMELINE_STEPS = [
  { label: "Order Diterima",   sub: (d) => d.tanggalOrder + " 10.30" },
  { label: "Sedang Dipilah",   sub: (d) => d.tanggalOrder + " 12.30" },
  { label: "Sedang Dicuci",    sub: () => "Sedang Berjalan" },
  { label: "Siap Diambil",     sub: () => "Belum Terjadi" },
];

const STATUS_BADGE = {
  "Order Diterima": "bg-blue-100 text-blue-800 border-blue-200",
  "Sedang Dipilah": "bg-orange-100 text-orange-800 border-orange-200",
  "Sedang Dicuci":  "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Siap Diambil":   "bg-purple-100 text-purple-800 border-purple-200",
  "Selesai":        "bg-green-100 text-green-800 border-green-200",
  "Dibatalkan":     "bg-red-100 text-red-800 border-red-200",
};

const MONTHS = [
  "Semua", "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];

const PER_PAGE = 5;

// ─── TIMELINE vertical (Popup/Garis Hitam) ───────────────────────────────────
function Timeline({ detail }) {
  return (
    <div className="flex flex-col gap-0">
      {TIMELINE_STEPS.map((step, i) => {
        const done = i <= detail.activeStep;
        const isLast = i === TIMELINE_STEPS.length - 1;
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
                {step.sub(detail)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── DETAIL POPUP (Hitam Tipis + Tabel Bergaris Hitam) ────────────────────────
function DetailPopup({ detail, statusLabel, onClose }) {
  const total = detail.items.reduce((s, r) => {
    const num = parseInt(r.sub.replace(/\D/g, ""), 10);
    return s + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-black">
        
        {/* Header Popup */}
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

        {/* Body Popup */}
        <div className="flex flex-col md:flex-row gap-8 p-8">
          
          {/* Kiri: info + tabel */}
          <div className="flex-1 flex flex-col">
            
            {/* Info Teks */}
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

            {/* Tabel Item Popup (Bergaris Hitam Tipis) */}
            <div className="rounded-2xl overflow-hidden border border-black shadow-sm mb-8">
              <table className="w-full text-xs border-collapse">
                <thead className="bg-[#0077b6] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold border-b border-black">Item</th>
                    <th className="px-4 py-3 text-center font-semibold border-b border-l border-black">Jml</th>
                    <th className="px-4 py-3 text-right font-semibold border-b border-l border-black">Harga</th>
                    <th className="px-4 py-3 text-right font-semibold border-b border-l border-black">Sub Total</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.items.map((row, i) => (
                    <tr key={i} className={`border-b border-black ${i % 2 === 1 ? "bg-gray-50/50" : "bg-white"}`}>
                      <td className="px-4 py-2.5 font-bold text-gray-800">{row.item}</td>
                      <td className="px-4 py-2.5 text-center font-medium text-gray-700 border-l border-black">{row.jumlah}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-gray-700 border-l border-black">{row.harga}</td>
                      <td className="px-4 py-2.5 text-right font-bold text-gray-800 border-l border-black">{row.sub}</td>
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

            {/* Footer Buttons Popup (Hanya Cetak) */}
            <div className="mt-auto flex items-center w-full">
              <button className="flex items-center gap-2 bg-[#0077b6] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#005f92] transition-colors border border-black shadow-sm">
                <Printer size={18} /> Cetak
              </button>
            </div>
          </div>

          {/* Kanan: Timeline Popup */}
          <div className="md:w-56 flex-shrink-0 bg-gray-50 p-5 rounded-2xl border border-black h-fit">
            <p className="font-bold text-gray-800 text-sm uppercase mb-4 border-b border-black pb-3">Status Pengerjaan</p>
            <Timeline detail={detail} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function RiwayatPesanan() {
  const { user } = useAuth();
  const namaUser = user?.name || user?.username || "Pelanggan";

  const [filterBulan, setFilterBulan] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [sortOrder, setSortOrder] = useState("Terbaru"); // Terbaru, Terlama
  const [searchNota, setSearchNota] = useState(""); // Filter Pencarian Nota
  const [page, setPage]   = useState(1);
  const [popup, setPopup] = useState(null);

  // Proses Filter & Sort Data
  const filteredData = useMemo(() => {
    let data = allData.filter((r) => {
      const statusOk = filterStatus === "Semua" || r.status === filterStatus;
      const searchOk = searchNota === "" || r.nota.toLowerCase().includes(searchNota.toLowerCase());
      return statusOk && searchOk;
    });

    // Mengurutkan berdasarkan ID (Terbaru = ID Terbesar, Terlama = ID Terkecil)
    data.sort((a, b) => {
      if (sortOrder === "Terbaru") return b.id - a.id;
      if (sortOrder === "Terlama") return a.id - b.id;
      return 0;
    });

    return data;
  }, [filterStatus, sortOrder, searchNota]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PER_PAGE));
  const paginated  = filteredData.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
            <p className="text-blue-50 text-sm font-medium mt-1 opacity-90">Kelola dan pantau seluruh riwayat transaksi cucianmu di sini.</p>
          </div>
        </div>

        {/* HEADER JUDUL */}
        <div className="mb-6">
          <h2 className="font-extrabold text-gray-800 text-lg tracking-wide uppercase">Riwayat Pesanan</h2>
        </div>

        {/* KOTAK FILTER & PENCARIAN */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm mb-8">
          <p className="font-bold text-gray-800 uppercase text-sm mb-4">Filter & Pencarian</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            
            {/* Group Kiri: Filter Status, Bulan, Urutkan */}
            <div className="flex flex-wrap gap-5">
              {/* 1. Filter Status */}
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

              {/* 2. Filter Bulan */}
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

              {/* 3. Urutkan (Terbaru/Terlama) */}
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

            {/* 4. Search Box Nota (Di Pojok Kanan) */}
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

        {/* KOTAK TABEL (Admin Style / Brutalism) */}
        <div className="bg-white rounded-2xl border-2 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.12)]">
          
          {/* Table Header Wrapper */}
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
                  <th className="px-4 py-3.5 text-left font-bold border-b-2 border-l-2 border-black">Layanan Utama</th>
                  <th className="px-4 py-3.5 text-center font-bold border-b-2 border-l-2 border-black">Berat</th>
                  <th className="px-4 py-3.5 text-center font-bold border-b-2 border-l-2 border-black">Total Harga</th>
                  <th className="px-4 py-3.5 text-center font-bold border-b-2 border-l-2 border-black">Status</th>
                  <th className="px-4 py-3.5 text-center font-bold border-b-2 border-l-2 border-black">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-500 font-bold">Data tidak ditemukan.</td>
                  </tr>
                ) : (
                  paginated.map((row, idx) => {
                    const isLastRow = idx === paginated.length - 1;
                    return (
                      <tr key={row.id} className={`transition hover:bg-blue-50/50 ${idx % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}`}>
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
                        
                        {/* BADGE STATUS */}
                        <td className={`px-4 py-3.5 text-center border-l border-black ${isLastRow ? "" : "border-b"}`}>
                          <span className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold border inline-block ${STATUS_BADGE[row.status] ?? "bg-gray-100 text-gray-500 border-gray-300"}`}>
                            {row.status}
                          </span>
                        </td>
                        
                        {/* TOMBOL AKSI MATA (Kotak) */}
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

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t-2 border-black bg-gray-50">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Halaman {page} dari {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-black text-gray-800 bg-white hover:-translate-y-0.5 hover:shadow-sm transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Sebelumnya
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border border-black ${
                      page === p ? "bg-[#0077b6] text-white border-[#0077b6]" : "bg-white text-gray-800 hover:-translate-y-0.5 hover:shadow-sm"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-black text-gray-800 bg-white hover:-translate-y-0.5 hover:shadow-sm transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed flex items-center gap-1"
              >
                Selanjutnya <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Popup Detail */}
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