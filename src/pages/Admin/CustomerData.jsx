// src/pages/Admin/CustomerData.jsx
import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import api from "../../api/axios"; // Mengimpor axios instance Anda
import { Search, Trash2, Pencil, X, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";

const PER_PAGE = 10;

export default function CustomerData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Popups
  const [editItem, setEditItem] = useState(null); 
  const [deleteItem, setDeleteItem] = useState(null); 
  const [addOpen, setAddOpen] = useState(false);  

  // Form state untuk edit & tambah
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  // ── Ambil Data dari API (Read) ──
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Mengirim keyword pencarian langsung ke server side
      const response = await api.get(`/customers?search=${search}`);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data customer:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]); // Ambil ulang data setiap kali pencarian berubah

  // ── Pagination logic ──
  const totalPages = Math.max(1, Math.ceil(data.length / PER_PAGE));
  const paginated = data.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // ── Open Create ──
  const openAdd = () => {
    setForm({ name: "", phone: "", address: "" });
    setAddOpen(true);
  };

  // ── Save Create ──
  const saveAdd = async () => {
    try {
      const response = await api.post("/customers", form);
      if (response.data.success) {
        setData((prev) => [response.data.data, ...prev]);
        setAddOpen(false);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menambahkan customer");
    }
  };

  // ── Open Edit ──
  const openEdit = (item) => {
    setForm({ name: item.name, phone: item.phone, address: item.address });
    setEditItem(item);
  };

  // ── Save Edit ──
  const saveEdit = async () => {
    try {
      const response = await api.put(`/customers/${editItem.id}`, form);
      if (response.data.success) {
        setData((prev) =>
          prev.map((d) => (d.id === editItem.id ? response.data.data : d))
        );
        setEditItem(null);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Gagal memperbarui data");
    }
  };

  // ── Confirm Delete (Soft Delete) ──
  const confirmDelete = async () => {
    try {
      const response = await api.delete(`/customers/${deleteItem.id}`);
      if (response.data.success) {
        setData((prev) => prev.filter((d) => d.id !== deleteItem.id));
        setDeleteItem(null);
      }
    } catch (error) {
      alert("Gagal menghapus data");
    }
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

        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
            Data Pelanggan <span className="font-normal text-gray-500">(Customer Data)</span>
          </h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#0077b6] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#005f92] transition shadow"
          >
            <UserPlus size={16} /> + Tambah Pelanggan
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-black overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black">
          <h2 className="font-bold text-gray-700 text-base">Tabel Data Pelanggan</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Cari :</span>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Nama / ID / HP..."
                className="border border-black rounded-lg pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 bg-[#eaf6fb]"
              />
              <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-black">
            <thead>
              <tr className="bg-[#0077b6] text-white">
                <th className="px-4 py-3 text-center font-semibold w-12 border border-black">No</th>
                <th className="px-4 py-3 text-center font-semibold border border-black">ID</th>
                <th className="px-4 py-3 text-center font-semibold border border-black">Nama</th>
                <th className="px-4 py-3 text-center font-semibold border border-black">NO HP</th>
                <th className="px-4 py-3 text-left font-semibold border border-black">Alamat</th>
                <th className="px-4 py-3 text-center font-semibold w-24 border border-black">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500 border border-black">Sedang memuat data...</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 border border-black">Tidak ada data</td>
                </tr>
              ) : (
                paginated.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`transition hover:bg-blue-100/50 ${idx % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}`}
                  >
                    <td className="px-4 py-3 text-center text-gray-600 border border-black">{(page - 1) * PER_PAGE + idx + 1}</td>
                    <td className="px-4 py-3 text-center font-mono text-gray-700 border border-black">{item.id}</td>
                    <td className="px-4 py-3 text-center font-medium text-gray-800 border border-black">{item.name}</td>
                    <td className="px-4 py-3 text-center text-gray-600 border border-black">{item.phone}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs leading-relaxed max-w-xs border border-black">{item.address}</td>
                    <td className="px-4 py-3 border border-black">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-500 hover:bg-blue-100 transition flex items-center justify-center"
                          title="Edit / Detail"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteItem(item)}
                          className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition flex items-center justify-center"
                          title="Hapus"
                        >
                          <Trash2 size={13} />
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

      {/* POPUP FORM (ADD / EDIT) */}
      {(editItem || addOpen) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-gray-800">
                {addOpen ? "Tambah Pelanggan" : "Detail Customer"}
              </h2>
              <button
                onClick={() => { setEditItem(null); setAddOpen(false); }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nama</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-[#eaf6fb] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 transition"
                  placeholder="Nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nomor HP</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-[#eaf6fb] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 transition"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Alamat</label>
                <textarea
                  rows={3}
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-[#eaf6fb] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 transition resize-none"
                  placeholder="Alamat lengkap"
                />
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={addOpen ? saveAdd : saveEdit}
                disabled={!form.name.trim() || !form.phone.trim()}
                className="flex-1 bg-[#0077b6] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#005f92] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Simpan
              </button>
              <button
                onClick={() => { setEditItem(null); setAddOpen(false); }}
                className="flex-1 border-2 border-[#0077b6] text-[#0077b6] py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP KONFIRMASI HAPUS */}
      {deleteItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-2">
              Apakah anda yakin menghapus ini?
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              <span className="font-bold text-gray-600">{deleteItem.name}</span>
              <br />
              <span className="font-mono text-xs">ID: {deleteItem.id}</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-50 border-2 border-red-400 text-red-500 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 transition"
              >
                Hapus
              </button>
              <button
                onClick={() => setDeleteItem(null)}
                className="flex-1 border-2 border-[#0077b6] text-[#0077b6] py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition"
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