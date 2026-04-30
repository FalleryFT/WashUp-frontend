// src/pages/Admin/OrderList.jsx
import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Search, Printer, Trash2, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";

// ─── DATA DUMMY ─────────────────────────────────────────────────────────────
const initialData = [
  {
    id: 1, nota: "17081945", nama: "Hamba Allah", berat: "10Kg", tgl: "17 Januari 1983",
    estimasi: "18 Januari 1983", status: "Sedang Dicuci", layanan: "Cuci Kering",
    tipe: "Member", totalHarga: "Rp 70.000",
    items: [{ item: "Kiloan", jumlah: "10kg", harga: "Rp7.000", sub: "Rp70.000" }],
    timeline: ["Order di terima\n17 Jan 10.30", "Sedang Di Pilah\n17 Jan 11.00", "Sedang Di cuci\nSedang Berjalan", null],
  },
  {
    id: 2, nota: "31122023", nama: "Alan Cooper", berat: "4Kg", tgl: "6 Oktober 2010",
    estimasi: "6 Oktober 2010", status: "Sedang Dicuci", layanan: "Cuci Setrika",
    tipe: "Member", totalHarga: "Rp 88.000",
    items: [
      { item: "Kiloan", jumlah: "4kg", harga: "Rp7.000", sub: "Rp28.000" },
      { item: "Selimut", jumlah: "1x", harga: "Rp20.000", sub: "Rp20.000" },
      { item: "Bedcover", jumlah: "1x", harga: "Rp30.000", sub: "Rp30.000" },
      { item: "Pelembut", jumlah: "1x", harga: "Rp5.000", sub: "Rp5.000" },
      { item: "Sabun", jumlah: "1x", harga: "Rp5.000", sub: "Rp5.000" },
    ],
    timeline: ["Order di terima\n6 Okt 10.30", "Sedang Di Pilah\n6 Okt 12.30", "Sedang Di cuci\nSedang Berjalan", null],
  },
  {
    id: 3, nota: "01072006", nama: "Steve Krug", berat: "1Kg", tgl: "7 Juni 2012",
    estimasi: "8 Juni 2012", status: "Selesai", layanan: "Cuci Kering",
    tipe: "Non-Member", totalHarga: "Rp 7.000",
    items: [{ item: "Kiloan", jumlah: "1kg", harga: "Rp7.000", sub: "Rp7.000" }],
    timeline: ["Order di terima\n7 Jun 09.00", "Sedang Di Pilah\n7 Jun 10.00", "Sedang Di cuci\n7 Jun 12.00", "Siap Di ambil\n8 Jun 08.00"],
  },
  {
    id: 4, nota: "15081945", nama: "Jeff Gothelf", berat: "3Kg", tgl: "1 Oktober 2015",
    estimasi: "2 Oktober 2015", status: "Dibatalkan", layanan: "Cuci Setrika",
    tipe: "Non-Member", totalHarga: "Rp 21.000",
    items: [{ item: "Kiloan", jumlah: "3kg", harga: "Rp7.000", sub: "Rp21.000" }],
    timeline: ["Order di terima\n1 Okt 14.00", null, null, null],
  },
  {
    id: 5, nota: "24682468", nama: "Jared Spool", berat: "9Kg", tgl: "12 November 2020",
    estimasi: "13 November 2020", status: "Sedang Dicuci", layanan: "Cuci Kering",
    tipe: "Member", totalHarga: "Rp 63.000",
    items: [{ item: "Kiloan", jumlah: "9kg", harga: "Rp7.000", sub: "Rp63.000" }],
    timeline: ["Order di terima\n12 Nov 08.00", "Sedang Di Pilah\n12 Nov 09.30", "Sedang Di cuci\nSedang Berjalan", null],
  },
  {
    id: 6, nota: "13571357", nama: "Khoi Vinh", berat: "5Kg", tgl: "5 Oktober 2021",
    estimasi: "6 Oktober 2021", status: "Dibatalkan", layanan: "Cuci Kering",
    tipe: "Non-Member", totalHarga: "Rp 35.000",
    items: [{ item: "Kiloan", jumlah: "5kg", harga: "Rp7.000", sub: "Rp35.000" }],
    timeline: ["Order di terima\n5 Okt 13.00", null, null, null],
  },
  {
    id: 7, nota: "12344321", nama: "Brad Frost", berat: "7Kg", tgl: "8 Juni 2022",
    estimasi: "9 Juni 2022", status: "Selesai", layanan: "Cuci Setrika",
    tipe: "Member", totalHarga: "Rp 49.000",
    items: [{ item: "Kiloan", jumlah: "7kg", harga: "Rp7.000", sub: "Rp49.000" }],
    timeline: ["Order di terima\n8 Jun 10.00", "Sedang Di Pilah\n8 Jun 11.00", "Sedang Di cuci\n8 Jun 14.00", "Siap Di ambil\n9 Jun 08.00"],
  },
  {
    id: 8, nota: "12122021", nama: "Tim Brown", berat: "5Kg", tgl: "27 April 2005",
    estimasi: "28 April 2005", status: "Dibatalkan", layanan: "Cuci Kering",
    tipe: "Non-Member", totalHarga: "Rp 35.000",
    items: [{ item: "Kiloan", jumlah: "5kg", harga: "Rp7.000", sub: "Rp35.000" }],
    timeline: ["Order di terima\n27 Apr 09.00", null, null, null],
  },
  {
    id: 9, nota: "99999999", nama: "Julie Zhuo", berat: "4Kg", tgl: "14 Februari 2005",
    estimasi: "15 Februari 2005", status: "Selesai", layanan: "Cuci Kering",
    tipe: "Member", totalHarga: "Rp 28.000",
    items: [{ item: "Kiloan", jumlah: "4kg", harga: "Rp7.000", sub: "Rp28.000" }],
    timeline: ["Order di terima\n14 Feb 08.00", "Sedang Di Pilah\n14 Feb 09.00", "Sedang Di cuci\n14 Feb 11.00", "Siap Di ambil\n15 Feb 08.00"],
  },
  {
    id: 10, nota: "10101010", nama: "Jonathan Ive", berat: "10Kg", tgl: "23 April 2005",
    estimasi: "24 April 2005", status: "Siap Diambil", layanan: "Cuci Setrika",
    tipe: "Member", totalHarga: "Rp 70.000",
    items: [{ item: "Kiloan", jumlah: "10kg", harga: "Rp7.000", sub: "Rp70.000" }],
    timeline: ["Order di terima\n23 Apr 08.00", "Sedang Di Pilah\n23 Apr 09.00", "Sedang Di cuci\n23 Apr 13.00", "Siap Di ambil\n24 Apr 08.00"],
  },
];

const TIMELINE_LABELS = ["Order di terima", "Sedang Di Pilah", "Sedang Di cuci", "Siap Di ambil"];
const TABS = ["SEMUA", "PROSES", "SIAP AMBIL", "SELESAI", "DIBATALKAN"];
const PER_PAGE = 10;

// ─── STATUS BADGE ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    "Sedang Dicuci": "bg-yellow-100 text-yellow-700",
    "Siap Diambil":  "bg-cyan-100 text-cyan-700",
    "Selesai":       "bg-green-100 text-green-700",
    "Dibatalkan":    "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

// ─── TIPE BADGE ──────────────────────────────────────────────────────────────
function TipeBadge({ tipe }) {
  return tipe === "Member" ? (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{tipe}</span>
  ) : (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">{tipe}</span>
  );
}

// ─── TIMELINE ────────────────────────────────────────────────────────────────
function Timeline({ timeline }) {
  return (
    <div className="flex flex-col gap-0">
      {TIMELINE_LABELS.map((label, i) => {
        const info = timeline[i];
        const done = info !== null;
        const isLast = i === TIMELINE_LABELS.length - 1;
        return (
          <div key={i} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${done ? "bg-green-500 border-green-500" : "bg-white border-gray-300"}`} />
              {!isLast && <div className={`w-0.5 h-8 ${done && timeline[i + 1] ? "bg-green-500" : "bg-gray-200"}`} />}
            </div>
            <div className="pb-2">
              <p className={`text-sm font-bold leading-tight ${done ? "text-gray-800" : "text-gray-300"}`}>{label}</p>
              {info && (
                <p className="text-xs text-gray-400 whitespace-pre-line">{info.split("\n")[1] || ""}</p>
              )}
              {!done && <p className="text-xs text-gray-300">Belum Terjadi</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function OrderList() {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState("SEMUA");
  const [search, setSearch] = useState("");
  const [filterTipe, setFilterTipe] = useState("Semua Tipe");
  const [page, setPage] = useState(1);

  const [detailItem, setDetailItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteFromDetail, setDeleteFromDetail] = useState(false);

  // ── Filter ──
  const tabFilter = (item) => {
    if (activeTab === "SEMUA") return true;
    if (activeTab === "PROSES") return item.status === "Sedang Dicuci";
    if (activeTab === "SIAP AMBIL") return item.status === "Siap Diambil";
    if (activeTab === "SELESAI") return item.status === "Selesai";
    if (activeTab === "DIBATALKAN") return item.status === "Dibatalkan";
    return true;
  };

  const filtered = data
    .filter(tabFilter)
    .filter((item) => filterTipe === "Semua Tipe" || item.tipe === filterTipe)
    .filter((item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nota.includes(search)
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleTabChange = (tab) => { setActiveTab(tab); setPage(1); };
  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleFilterTipe = (e) => { setFilterTipe(e.target.value); setPage(1); };

  // ── Delete ──
  const openDelete = (item, fromDetail = false) => {
    setDeleteItem(item);
    setDeleteFromDetail(fromDetail);
  };
  const confirmDelete = () => {
    setData((prev) => prev.filter((d) => d.id !== deleteItem.id));
    setDeleteItem(null);
    if (deleteFromDetail) setDetailItem(null);
  };
  const cancelDelete = () => setDeleteItem(null);

  return (
    <AdminSidebar>
      {/* Header */}
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
          DAFTAR PESANAN <span className="font-normal text-gray-500">(ORDER LIST)</span>
        </h1>
      </div>

      {/* TABS & FILTER TIPE (Bersebelahan) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
        
        {/* Tab Status */}
        <div className="flex gap-1 bg-white rounded-xl shadow-sm border border-black p-1 w-full md:w-fit overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-[#0077b6] text-white shadow"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dropdown Filter Tipe Pelanggan */}
        <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-black px-4 py-2 flex-shrink-0">
          <span className="text-sm font-bold text-gray-700">Tipe Pelanggan:</span>
          <select
            value={filterTipe}
            onChange={handleFilterTipe}
            className="text-sm font-bold text-[#0077b6] bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="Semua Tipe">Semua Tipe</option>
            <option value="Member">Member</option>
            <option value="Non-Member">Non-Member</option>
          </select>
        </div>

      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-black overflow-hidden">
        {/* Table Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b border-black gap-4">
          <h2 className="font-bold text-gray-700 text-base">Tabel Transaksi</h2>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Cari :</span>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Nama / Nota..."
                className="border border-black rounded-lg pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 bg-[#eaf6fb]"
              />
              <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-black">
            <thead>
              <tr className="bg-[#0077b6] text-white">
                <th className="px-4 py-3 text-center font-semibold border border-black">No</th>
                <th className="px-4 py-3 text-center font-semibold border border-black">NOTA</th>
                <th className="px-4 py-3 text-center font-semibold border border-black">Nama</th>
                <th className="px-4 py-3 text-center font-semibold border border-black">Tipe</th>
                <th className="px-4 py-3 text-center font-semibold border border-black">Berat</th>
                <th className="px-4 py-3 text-center font-semibold border border-black">Estimasi Selesai</th>
                <th className="px-4 py-3 text-center font-semibold border border-black">Status</th>
                <th className="px-4 py-3 text-center font-semibold border border-black">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400 border border-black">Tidak ada data</td>
                </tr>
              ) : (
                paginated.map((item, idx) => (
                  <tr key={item.id} className={`transition hover:bg-blue-100/50 ${idx % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}`}>
                    <td className="px-4 py-3 text-center text-gray-600 border border-black">{(page - 1) * PER_PAGE + idx + 1}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-700 border border-black">{item.nota}</td>
                    <td className="px-4 py-3 text-center text-gray-800 font-medium border border-black">{item.nama}</td>
                    <td className="px-4 py-3 text-center border border-black"><TipeBadge tipe={item.tipe} /></td>
                    <td className="px-4 py-3 text-center text-gray-700 border border-black">{item.berat}</td>
                    <td className="px-4 py-3 text-center text-gray-600 border border-black">{item.estimasi}</td>
                    <td className="px-4 py-3 text-center border border-black"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-3 text-center border border-black">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openDelete(item)}
                          className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition flex items-center justify-center"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          onClick={() => setDetailItem(item)}
                          className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-500 hover:bg-blue-100 transition flex items-center justify-center"
                          title="Detail"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-1 px-6 py-4 border-t border-black">
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

      {/* ══════════════════════════════════════════
          POPUP: DETAIL TRANSAKSI
      ══════════════════════════════════════════ */}
      {detailItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Popup Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black">
              <h2 className="text-xl font-extrabold text-gray-800">Detail Transaksi</h2>
              <div className="flex items-center gap-3">
                <button onClick={() => setDetailItem(null)} className="text-gray-400 hover:text-gray-600 ml-2">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 p-6">
              {/* LEFT: Info + Table */}
              <div className="flex-1">
                <div className="space-y-2 mb-5 text-sm">
                  {[
                    ["Nota", detailItem.nota],
                    ["Layanan", detailItem.layanan],
                    ["Tanggal Order", detailItem.tgl],
                    ["Nama", detailItem.nama],
                    ["Total Berat", detailItem.berat],
                    ["Total Harga", detailItem.totalHarga],
                    ["Estimasi Selesai", detailItem.estimasi],
                  ].map(([label, val]) => (
                    <div key={label} className="flex gap-2">
                      <span className="w-36 text-gray-500 font-medium flex-shrink-0">{label}</span>
                      <span className="text-gray-400 flex-shrink-0">:</span>
                      <span className="font-semibold text-gray-800">{val}</span>
                    </div>
                  ))}
                </div>

                {/* Items Table di Detail */}
                <div className="border border-black">
                  <table className="w-full text-sm border-collapse border border-black">
                    <thead>
                      <tr className="bg-[#0077b6] text-white">
                        <th className="px-3 py-2 text-left font-semibold border border-black">Item</th>
                        <th className="px-3 py-2 text-right font-semibold border border-black">Jumlah</th>
                        <th className="px-3 py-2 text-right font-semibold border border-black">Harga satuan</th>
                        <th className="px-3 py-2 text-right font-semibold border border-black">Sub Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailItem.items.map((row, i) => (
                        <tr key={i} className={`transition hover:bg-blue-100/50 ${i % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}`}>
                          <td className="px-3 py-2 text-gray-700 border border-black">{row.item}</td>
                          <td className="px-3 py-2 text-right text-gray-600 border border-black">{row.jumlah}</td>
                          <td className="px-3 py-2 text-right text-gray-600 border border-black">{row.harga}</td>
                          <td className="px-3 py-2 text-right text-gray-700 font-medium border border-black">{row.sub}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="px-3 py-2 font-bold text-gray-700 border border-black text-right">Total</td>
                        <td className="px-3 py-2 text-right font-extrabold text-[#0077b6] border border-black">{detailItem.totalHarga}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-5">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-[#0077b6] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#005f92] transition">
                      <Printer size={15} /> Cetak
                    </button>
                    <button
                      onClick={() => openDelete(detailItem, true)}
                      className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-500 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition"
                    >
                      <Trash2 size={15} /> Hapus
                    </button>
                  </div>
                  <button
                    onClick={() => setDetailItem(null)}
                    className="border-2 border-[#0077b6] text-[#0077b6] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition"
                  >
                    Kembali
                  </button>
                </div>
              </div>

              {/* RIGHT: Status & Timeline */}
              <div className="md:w-52 flex-shrink-0">
                
                {/* Tipe Pelanggan & Status di sisi Kanan */}
                <div className="mb-6 flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Tipe Pelanggan</span>
                    <TipeBadge tipe={detailItem.tipe} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Status Saat Ini</span>
                    <StatusBadge status={detailItem.status} />
                  </div>
                </div>

                {/* Timeline */}
                <div className="px-2">
                  <Timeline timeline={detailItem.timeline} />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          POPUP: KONFIRMASI HAPUS
      ══════════════════════════════════════════ */}
      {deleteItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-200">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-2">Apakah anda yakin menghapus ini?</h3>
            <p className="text-sm text-gray-400 mb-6">
              Transaksi <span className="font-bold text-gray-600">{deleteItem.nota}</span> · {deleteItem.nama}
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-50 border-2 border-red-400 text-red-500 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
              >
                Hapus
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 border-2 border-[#00b4d8] text-[#00b4d8] py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminSidebar>
  );
}