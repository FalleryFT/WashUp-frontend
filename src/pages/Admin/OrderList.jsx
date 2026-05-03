import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import api from "../../api/axios"; 
import { Search, Printer, Trash2, Eye, X, ChevronLeft, ChevronRight, ArrowRightCircle } from "lucide-react";

const TIMELINE_LABELS = ["Order di terima", "Sedang Di Pilah", "Sedang Di cuci", "Siap Di ambil"];
const TABS = ["SEMUA", "Order Diterima", "Sedang DiPilah", "Sedang DiCuci", "SIAP AMBIL", "SELESAI", "DIBATALKAN"];
const PER_PAGE = 10;

// Fungsi helper untuk generate 12 bulan terakhir secara dinamis
const generateMonthOptions = () => {
  const options = [{ value: "Semua Bulan", label: "Semua Bulan" }];
  const currentDate = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    options.push({ value, label });
  }
  return options;
};
const MONTH_OPTIONS = generateMonthOptions();

function StatusBadge({ status }) {
  const map = {
    "Order Diterima": "bg-blue-100 text-blue-700",
    "Sedang Di Pilah": "bg-purple-100 text-purple-700",
    "Sedang Dicuci": "bg-yellow-100 text-yellow-700",
    "Siap Diambil": "bg-cyan-100 text-cyan-700",
    "Selesai": "bg-green-100 text-green-700",
    "Dibatalkan": "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function TipeBadge({ tipe }) {
  const isMember = tipe && tipe.toLowerCase() === "member";
  return isMember ? (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Member</span>
  ) : (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Non-Member</span>
  );
}

function Timeline({ timeline }) {
  return (
    <div className="flex flex-col gap-0">
      {TIMELINE_LABELS.map((label, i) => {
        const info = timeline && timeline[i];
        const done = info !== null && info !== undefined;
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

export default function OrderList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("SEMUA");
  const [search, setSearch] = useState("");
  const [filterTipe, setFilterTipe] = useState("Semua Tipe");
  const [filterBulan, setFilterBulan] = useState("Semua Bulan"); // State baru untuk filter bulan
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  const [detailItem, setDetailItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteFromDetail, setDeleteFromDetail] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders", {
        params: {
          search,
          status: activeTab,
          customer_type: filterTipe,
          month: filterBulan, // Mengirim parameter bulan ke backend
          sort
        }
      });
      if (response.data.success) {
        setData(response.data.data);

        if (detailItem) {
          const updatedDetail = response.data.data.find(o => o.id === detailItem.id);
          if (updatedDetail) {
            setDetailItem(updatedDetail);
          }
        }
      }
    } catch (error) {
      console.error("Gagal mengambil data pesanan", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab, search, filterTipe, filterBulan, sort]); // Menambahkan filterBulan sebagai dependency

  const totalPages = Math.max(1, Math.ceil(data.length / PER_PAGE));
  const paginated = data.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleTabChange = (tab) => { setActiveTab(tab); setPage(1); };
  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleFilterTipe = (e) => { setFilterTipe(e.target.value); setPage(1); };
  const handleFilterBulan = (e) => { setFilterBulan(e.target.value); setPage(1); }; // Handler baru untuk filter bulan
  const handleSortChange = (e) => { setSort(e.target.value); setPage(1); };

  const handleNextStatus = async (item) => {
    try {
      const response = await api.post(`/orders/${item.id}/next-status`);
      if (response.data.success) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Gagal memperbarui status", error);
    }
  };

  const openDelete = (item, fromDetail = false) => {
    setDeleteItem(item);
    setDeleteFromDetail(fromDetail);
  };

  const confirmDelete = async () => {
    try {
      const response = await api.delete(`/orders/${deleteItem.id}`);
      if (response.data.success) {
        setDeleteItem(null);
        if (deleteFromDetail) {
          setDetailItem(null);
        }
        fetchOrders();
      }
    } catch (error) {
      console.error("Gagal menghapus/membatalkan pesanan", error);
    }
  };

const cancelDelete = () => setDeleteItem(null);

  // Fungsi untuk fitur Cetak Nota
  const handlePrint = () => {
    if (!detailItem) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    // Looping item untuk tabel cetak
    const itemsHtml = detailItem.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px dashed #ccc;">${item.item}</td>
        <td style="padding: 10px; border-bottom: 1px dashed #ccc; text-align: center;">${item.jumlah}</td>
        <td style="padding: 10px; border-bottom: 1px dashed #ccc; text-align: right;">${item.harga}</td>
        <td style="padding: 10px; border-bottom: 1px dashed #ccc; text-align: right;">${item.sub}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak Nota - ${detailItem.nota}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 15px; margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 24px; color: #0077b6; }
            .header p { margin: 5px 0 0; font-size: 14px; color: #666; }
            .info-grid { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; }
            .info-grid table { border-collapse: collapse; }
            .info-grid td { padding: 3px 10px 3px 0; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
            .table th { border-bottom: 2px dashed #333; padding: 10px; text-align: left; }
            .table th.center { text-align: center; }
            .table th.right { text-align: right; }
            .total-section { border-top: 2px dashed #333; padding-top: 15px; text-align: right; font-size: 16px; }
            .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; border-top: 1px dashed #ccc; padding-top: 20px; }
            @media print {
              body { padding: 0; margin: 20px; }
              button { display: none; }
            }
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
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="total-section">
            <strong>Total Bayar: <span style="color: #0077b6; font-size: 20px;">${detailItem.totalHarga}</span></strong>
          </div>

          <div class="footer">
            <p>Terima kasih telah mempercayakan pakaian Anda di WashUp Laundry.</p>
            <p>Harap bawa nota ini saat pengambilan.</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Cek apakah item yang dipilih untuk dihapus berstatus Selesai atau Dibatalkan
  const isSoftDeleteMode = deleteItem && (deleteItem.status === "Selesai" || deleteItem.status === "Dibatalkan");

  
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

      {/* TABS & FILTERS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
        <div className="flex gap-1 bg-white rounded-xl shadow-sm border border-black p-1 w-full md:w-fit overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab
                  ? "bg-[#0077b6] text-white shadow"
                  : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filter & Sorting Options */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Bulan */}
          <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-black px-4 py-2">
            <span className="text-sm font-bold text-gray-700">Bulan:</span>
            <select
              value={filterBulan}
              onChange={handleFilterBulan}
              className="text-sm font-bold text-[#0077b6] bg-transparent focus:outline-none cursor-pointer"
            >
              {MONTH_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Filter Tipe */}
          <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-black px-4 py-2">
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

          {/* Urutkan (Sorting) */}
          <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-black px-4 py-2">
            <span className="text-sm font-bold text-gray-700">Urutkan:</span>
            <select
              value={sort}
              onChange={handleSortChange}
              className="text-sm font-bold text-[#0077b6] bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="latest">Terbaru</option>
              <option value="oldest">Terlama</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-black overflow-hidden">
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

        {/* Table Content */}
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
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400 border border-black">Memuat data...</td>
                </tr>
              ) : paginated.length === 0 ? (
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
                        {item.status !== "Selesai" && item.status !== "Dibatalkan" && (
                          <button
                            onClick={() => handleNextStatus(item)}
                            className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 text-green-500 hover:bg-green-100 transition flex items-center justify-center"
                            title="Lanjutkan Status"
                          >
                            <ArrowRightCircle size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => openDelete(item)}
                          className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition flex items-center justify-center"
                          title={item.status === "Selesai" || item.status === "Dibatalkan" ? "Hapus Permanen" : "Batalkan Order"}
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
                page === p ? "bg-[#0077b6] text-white" : "border border-black text-gray-600 hover:bg-gray-50"
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
                      {detailItem.items && detailItem.items.map((row, i) => (
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
                    <button onClick={handlePrint} className="flex items-center gap-2 bg-[#0077b6] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#005f92] transition">
                      <Printer size={15} /> Cetak
                    </button>
                    {/* Tombol Hapus/Batal */}
                    <button
                      onClick={() => openDelete(detailItem, true)}
                      className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-500 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition"
                    >
                      <Trash2 size={15} /> 
                      {detailItem.status === "Selesai" || detailItem.status === "Dibatalkan" ? "Hapus" : "Batalkan"}
                    </button>
                  </div>
                  
                  {/* Tombol Fase Berikutnya */}
                  <div className="flex gap-2">
                    {detailItem.status !== "Selesai" && detailItem.status !== "Dibatalkan" && (
                      <button
                        onClick={() => handleNextStatus(detailItem)}
                        className="flex items-center gap-2 bg-green-50 border-2 border-green-500 text-green-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-100 transition"
                      >
                        <ArrowRightCircle size={15} /> Fase Berikutnya
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT: Status & Timeline */}
              <div className="md:w-52 flex-shrink-0">
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

                <div className="px-2">
                  <Timeline timeline={detailItem.timeline} />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* POPUP: KONFIRMASI (Batal atau Hapus Dinamis) */}
      {deleteItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-200">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-500" />
            </div>
            
            <h3 className="text-xl font-extrabold text-gray-800 mb-2">
              {isSoftDeleteMode ? "Hapus Data Pesanan?" : "Apakah anda yakin membatalkan ini?"}
            </h3>
            
            <p className="text-sm text-gray-400 mb-6">
              {isSoftDeleteMode ? (
                <span>
                  Data pesanan <span className="font-bold text-gray-600">{deleteItem.nota}</span> akan dihapus dari daftar aktif.
                </span>
              ) : (
                <span>
                  Status transaksi <span className="font-bold text-gray-600">{deleteItem.nota}</span> · {deleteItem.nama} akan diubah menjadi <span className="text-red-500 font-bold">Dibatalkan</span>.
                </span>
              )}
            </p>
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-50 border-2 border-red-400 text-red-500 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
              >
                {isSoftDeleteMode ? "Hapus" : "Batalkan"}
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