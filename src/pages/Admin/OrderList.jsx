import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import api from "../../api/axios"; 
import { Search, Printer, Trash2, Eye, X, ChevronLeft, ChevronRight, ArrowRightCircle, Undo2 } from "lucide-react";

const TIMELINE_LABELS = ["Order Di Terima", "Sedang Di Pilah", "Sedang Di Cuci", "Siap Di Ambil"];
const TABS = ["SEMUA", "Order Di Terima", "Sedang Di Pilah", "Sedang Di Cuci", "Siap Di Ambil", "SELESAI", "DIBATALKAN"];
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

// Default: nilai bulan ini dalam format YYYY-MM
const getCurrentMonthValue = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

// FUNGSI BARU: Untuk menghitung total valid dari semua sub-total item (kiloan + satuan)
const calculateRealTotal = (items) => {
  if (!items || !Array.isArray(items)) return "Rp 0";
  const total = items.reduce((sum, item) => {
    // Ambil string sub, pisahkan jika ada koma desimal (misal Rp 15.000,00)
    const subString = String(item.sub || "0").split(',')[0];
    // Bersihkan karakter selain angka
    const numericValue = parseInt(subString.replace(/[^0-9]/g, ""), 10);
    return sum + (isNaN(numericValue) ? 0 : numericValue);
  }, 0);
  
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(total);
};

function StatusBadge({ status }) {
  const map = {
    "Order Diterima": "bg-blue-100 text-blue-700",
    "Sedang Dipilah": "bg-purple-100 text-purple-700",
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
  const [filterStatus, setFilterStatus] = useState("SEMUA"); 
  const [search, setSearch] = useState("");
  const [filterTipe, setFilterTipe] = useState("Semua Tipe");
  // ✅ FIX: Default filter bulan = bulan ini, bukan "Semua Bulan"
  const [filterBulan, setFilterBulan] = useState(getCurrentMonthValue());
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  const [detailItem, setDetailItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteFromDetail, setDeleteFromDetail] = useState(false);

  // ✅ Helper: update 1 row di state data (tanpa refetch semua)
  const updateRowById = useCallback((id, updatedOrder) => {
    setData(prev => prev.map(o => o.id === id ? updatedOrder : o));
    // Jika popup detail sedang buka untuk row ini, update juga
    setDetailItem(prev => prev && prev.id === id ? updatedOrder : prev);
  }, []);

  // ✅ Helper: hapus 1 row dari state data (tanpa refetch semua)
  const removeRowById = useCallback((id) => {
    setData(prev => prev.filter(o => o.id !== id));
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders", {
        params: {
          search,
          status: filterStatus,
          customer_type: filterTipe,
          month: filterBulan, 
          sort
        }
      });
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data pesanan", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, search, filterTipe, filterBulan, sort]); 

  const totalPages = Math.max(1, Math.ceil(data.length / PER_PAGE));
  const paginated = data.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleFilterStatus = (e) => { setFilterStatus(e.target.value); setPage(1); };
  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleFilterTipe = (e) => { setFilterTipe(e.target.value); setPage(1); };
  const handleFilterBulan = (e) => { setFilterBulan(e.target.value); setPage(1); }; 
  const handleSortChange = (e) => { setSort(e.target.value); setPage(1); };

  // ✅ Next Status — hanya reload 1 row
  const handleNextStatus = async (item) => {
    try {
      const response = await api.post(`/orders/${item.id}/next-status`);
      if (response.data.success) {
        updateRowById(item.id, response.data.data);
      }
    } catch (error) {
      console.error("Gagal memperbarui status", error);
    }
  };

  // ✅ Undo / Prev Status — hanya reload 1 row
  const handleUndoStatus = async (item) => {
    try {
      const response = await api.post(`/orders/${item.id}/prev-status`);
      if (response.data.success) {
        updateRowById(item.id, response.data.data);
      }
    } catch (error) {
      console.error("Gagal undo status", error);
    }
  };

  const openDelete = (item, fromDetail = false) => {
    setDeleteItem(item);
    setDeleteFromDetail(fromDetail);
  };

  // ✅ Delete/Cancel — hanya update/hapus 1 row
  const confirmDelete = async () => {
    try {
      const response = await api.delete(`/orders/${deleteItem.id}`);
      if (response.data.success) {
        const isSoftDelete = deleteItem.status === "Selesai" || deleteItem.status === "Dibatalkan";
        setDeleteItem(null);

        if (isSoftDelete) {
          // Row dihapus permanen → buang dari list
          removeRowById(deleteItem.id);
          if (deleteFromDetail) setDetailItem(null);
        } else {
          // Status berubah jadi "Dibatalkan" → update row
          if (response.data.data) {
            updateRowById(deleteItem.id, response.data.data);
          }
          if (deleteFromDetail) setDetailItem(null);
        }
      }
    } catch (error) {
      console.error("Gagal menghapus/membatalkan pesanan", error);
    }
  };

  const cancelDelete = () => setDeleteItem(null);

  const handlePrint = () => {
    if (!detailItem) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    const itemsHtml = detailItem.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px dashed #ccc;">${item.item}</td>
        <td style="padding: 10px; border-bottom: 1px dashed #ccc; text-align: center;">${item.jumlah}</td>
        <td style="padding: 10px; border-bottom: 1px dashed #ccc; text-align: right;">${item.harga}</td>
        <td style="padding: 10px; border-bottom: 1px dashed #ccc; text-align: right;">${item.sub}</td>
      </tr>
    `).join('');

    // Gunakan fungsi hitung dinamis agar total yang tercetak benar
    const computedTotal = calculateRealTotal(detailItem.items);

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
            <strong>Total Bayar: <span style="color: #0077b6; font-size: 20px;">${computedTotal}</span></strong>
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

  const isSoftDeleteMode = deleteItem && (deleteItem.status === "Selesai" || deleteItem.status === "Dibatalkan");
  
  // Variabel untuk menampilkan total yang dihitung secara dinamis di Popup Detail
  const computedTotalDetail = detailItem ? calculateRealTotal(detailItem.items) : "Rp 0";

  // ✅ Apakah order bisa di-undo: sudah melewati status pertama & bukan Dibatalkan
  const STATUS_SEQUENCE = ['Order Diterima', 'Sedang Di Pilah', 'Sedang Dicuci', 'Siap Diambil', 'Selesai'];
  const canUndo = (item) => {
    const idx = STATUS_SEQUENCE.indexOf(item.status);
    return idx > 0; // bisa undo jika bukan index 0 dan bukan Dibatalkan
  };

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

      {/* FILTER & PENCARIAN */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm mb-8">
        <p className="font-bold text-gray-800 uppercase text-sm mb-4">Filter & Pencarian</p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">

          <div className="flex flex-wrap gap-5">
            {/* Status Pesanan */}
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Status Pesanan</p>
              <select
                value={filterStatus}
                onChange={handleFilterStatus}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0077b6] min-w-[160px] cursor-pointer"
              >
                {TABS.map((tab) => (
                  <option key={tab} value={tab}>{tab}</option>
                ))}
              </select>
            </div>

            {/* Tipe Pelanggan */}
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Tipe Pelanggan</p>
              <select
                value={filterTipe}
                onChange={handleFilterTipe}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0077b6] min-w-[160px] cursor-pointer"
              >
                <option value="Semua Tipe">Semua Tipe</option>
                <option value="Member">Member</option>
                <option value="Non-Member">Non-Member</option>
              </select>
            </div>

            {/* Bulan — ✅ Default: bulan ini */}
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Bulan</p>
              <select
                value={filterBulan}
                onChange={handleFilterBulan}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0077b6] min-w-[160px] cursor-pointer"
              >
                {MONTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Urutkan */}
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Urutkan</p>
              <select
                value={sort}
                onChange={handleSortChange}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0077b6] min-w-[150px] cursor-pointer"
              >
                <option value="latest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </select>
            </div>
          </div>

          {/* Cari Pesanan */}
          <div className="w-full md:w-auto">
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Cari Pesanan</p>
            <div className="relative">
              <input
                type="text"
                placeholder="Masukkan Nama / NOTA..."
                value={search}
                onChange={handleSearch}
                className="border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm font-bold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0077b6] w-full md:w-[250px]"
              />
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-black overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b border-black gap-4">
          <h2 className="font-bold text-gray-800 text-base uppercase">Tabel Transaksi</h2>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border-b border-black">
            <thead>
              <tr className="bg-[#0077b6] text-white">
                <th className="px-4 py-3.5 text-center font-bold border-r border-black w-12">No</th>
                <th className="px-4 py-3.5 text-center font-bold border-r border-black">NOTA</th>
                <th className="px-4 py-3.5 text-center font-bold border-r border-black">Nama</th>
                <th className="px-4 py-3.5 text-center font-bold border-r border-black">Tipe</th>
                <th className="px-4 py-3.5 text-center font-bold border-r border-black">Berat</th>
                <th className="px-4 py-3.5 text-center font-bold border-r border-black">Estimasi Selesai</th>
                <th className="px-4 py-3.5 text-center font-bold border-r border-black">Status</th>
                <th className="px-4 py-3.5 text-center font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400 font-bold">Memuat data...</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400 font-bold">Tidak ada data</td>
                </tr>
              ) : (
                paginated.map((item, idx) => {
                  const isLastRow = idx === paginated.length - 1;
                  return (
                    <tr key={item.id} className={`transition hover:bg-blue-100/50 ${idx % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}`}>
                      <td className={`px-4 py-3 text-center text-gray-600 font-bold border-r border-black ${!isLastRow ? "border-b border-black" : ""}`}>
                        {(page - 1) * PER_PAGE + idx + 1}
                      </td>
                      <td className={`px-4 py-3 text-center font-mono font-bold text-gray-900 border-r border-black ${!isLastRow ? "border-b border-black" : ""}`}>
                        {item.nota}
                      </td>
                      <td className={`px-4 py-3 text-center text-gray-800 font-bold border-r border-black ${!isLastRow ? "border-b border-black" : ""}`}>
                        {item.nama}
                      </td>
                      <td className={`px-4 py-3 text-center border-r border-black ${!isLastRow ? "border-b border-black" : ""}`}>
                        <TipeBadge tipe={item.tipe} />
                      </td>
                      <td className={`px-4 py-3 text-center font-bold text-gray-700 border-r border-black ${!isLastRow ? "border-b border-black" : ""}`}>
                        {item.berat}
                      </td>
                      <td className={`px-4 py-3 text-center font-medium text-gray-600 border-r border-black ${!isLastRow ? "border-b border-black" : ""}`}>
                        {item.estimasi}
                      </td>
                      <td className={`px-4 py-3 text-center border-r border-black ${!isLastRow ? "border-b border-black" : ""}`}>
                        <StatusBadge status={item.status} />
                      </td>
                      <td className={`px-4 py-3 text-center ${!isLastRow ? "border-b border-black" : ""}`}>
                        <div className="flex items-center justify-center gap-2">
                          {/* ✅ Tombol Next Status */}
                          {item.status !== "Selesai" && item.status !== "Dibatalkan" && (
                            <button
                              onClick={() => handleNextStatus(item)}
                              className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 text-green-500 hover:bg-green-100 transition flex items-center justify-center"
                              title="Lanjutkan Status"
                            >
                              <ArrowRightCircle size={14} />
                            </button>
                          )}
                          {/* ✅ Tombol Undo Status */}
                          {canUndo(item) && item.status !== "Dibatalkan" && (
                            <button
                              onClick={() => handleUndoStatus(item)}
                              className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 text-orange-500 hover:bg-orange-100 transition flex items-center justify-center"
                              title="Undo Status"
                            >
                              <Undo2 size={14} />
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
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-50">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Halaman {page} dari {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-black bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Sebelumnya
            </button>
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition border border-black ${
                    page === p ? "bg-[#0077b6] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-black bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Selanjutnya <ChevronRight size={14} />
            </button>
          </div>
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
                    ["Total Harga", computedTotalDetail],
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
                        <td className="px-3 py-2 text-right font-extrabold text-[#0077b6] border border-black">{computedTotalDetail}</td>
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
                  
                  {/* Tombol Aksi Status */}
                  <div className="flex gap-2">
                    {/* ✅ Tombol Undo di Popup Detail */}
                    {canUndo(detailItem) && detailItem.status !== "Dibatalkan" && (
                      <button
                        onClick={() => handleUndoStatus(detailItem)}
                        className="flex items-center gap-2 bg-orange-50 border-2 border-orange-400 text-orange-500 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-100 transition"
                      >
                        <Undo2 size={15} /> Undo Status
                      </button>
                    )}
                    {/* Tombol Fase Berikutnya */}
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