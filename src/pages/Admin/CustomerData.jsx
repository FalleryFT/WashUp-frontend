// src/pages/Admin/CustomerData.jsx
import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Search, Trash2, Pencil, X, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";

// ─── DATA DUMMY ──────────────────────────────────────────────────────────────
const initialData = [
  { id: 1, customerId: "13571357", nama: "Daniel Spatzek",   noHp: "081234567890", password: "pass1234", alamat: "Jalan Kutai Utara No. 1, Kelurahan Sumber, Kecamatan Banjarsari, Kota Surakarta (Solo), Jawa Tengah 57138" },
  { id: 2, customerId: "09090909", nama: "Haley Takeda",     noHp: "082345678901", password: "haley999", alamat: "Jalan Veteran No. 12-14, Kelurahan Ketawanggede, Kecamatan Lowokwaru, Kota Malang, Jawa Timur 65145." },
  { id: 3, customerId: "12344321", nama: "Ridd",             noHp: "083456789012", password: "ridd2023", alamat: "Jalan Kertanegara No. 4, Kelurahan Selong, Kecamatan Kebayoran Baru, Jakarta Selatan, DKI Jakarta." },
  { id: 4, customerId: "24682468", nama: "Olivia Xu",        noHp: "084567890123", password: "olivia88", alamat: "Desa Bojong Koneng, Kecamatan Babakan Madang, Kabupaten Bogor, Jawa Barat." },
  { id: 5, customerId: "31122023", nama: "Anton Sten",       noHp: "085678901234", password: "anton007", alamat: "Jalan Puncak Dieng, Kunci, Kalisongo, Kecamatan Dau, Kabupaten Malang, Jawa Timur 65151." },
  { id: 6, customerId: "02022002", nama: "Mizko",            noHp: "086789012345", password: "mizko321", alamat: "548 Market St PMB 60761, San Francisco, CA 94104, Amerika Serikat." },
  { id: 7, customerId: "17081945", nama: "Steve Schoger",    noHp: "087890123456", password: "steve456", alamat: "455 Bryant St, San Francisco, CA 94107, Amerika Serikat." },
  { id: 8, customerId: "08081945", nama: "Adam Wathan",      noHp: "088901234567", password: "adam2024", alamat: "5000 Forbes Ave, Pittsburgh, PA 15213, Amerika Serikat." },
  { id: 9, customerId: "31415926", nama: "Lapa Ninja",       noHp: "089012345678", password: "lapa9999", alamat: "1600 Amphitheatre Parkway, Mountain View, CA 94043, Amerika Serikat." },
  { id: 10, customerId: "12122021", nama: "Brittany Chiang", noHp: "081122334455", password: "brit2021", alamat: "One Microsoft Way, Redmond, WA 98052, Amerika Serikat." },
  { id: 11, customerId: "99887766", nama: "Chris Davidson",  noHp: "081233445566", password: "chris123", alamat: "Jalan Sudirman No. 5, Jakarta Pusat, DKI Jakarta 10220." },
  { id: 12, customerId: "11223344", nama: "Nisa Pratiwi",    noHp: "082233445567", password: "nisa2022", alamat: "Jalan Ahmad Yani No. 15, Kota Malang, Jawa Timur 65115." },
];

const PER_PAGE = 10;

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function CustomerData() {
  const [data, setData]           = useState(initialData);
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);

  // Popups
  const [editItem, setEditItem]     = useState(null);   // edit/detail popup
  const [deleteItem, setDeleteItem] = useState(null);   // delete confirm popup
  const [addOpen, setAddOpen]       = useState(false);  // add new popup

  // Form state untuk edit & tambah (password dihapus dari UI)
  const [form, setForm] = useState({ nama: "", noHp: "", alamat: "" });

  // ── Filter + Paginate ──
  const filtered = data.filter(
    (d) =>
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.customerId.includes(search) ||
      d.noHp.includes(search)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };

  // ── Open Edit ──
  const openEdit = (item) => {
    setForm({ nama: item.nama, noHp: item.noHp, alamat: item.alamat });
    setEditItem(item);
  };

  // ── Save Edit ──
  const saveEdit = () => {
    setData((prev) =>
      prev.map((d) => d.id === editItem.id ? { ...d, ...form } : d)
    );
    setEditItem(null);
  };

  // ── Delete ──
  const confirmDelete = () => {
    setData((prev) => prev.filter((d) => d.id !== deleteItem.id));
    setDeleteItem(null);
  };

  // ── Add New ──
  const openAdd = () => {
    setForm({ nama: "", noHp: "", alamat: "" });
    setAddOpen(true);
  };
  const saveAdd = () => {
    const newId = Math.max(...data.map((d) => d.id)) + 1;
    const newCustomerId = String(Math.floor(10000000 + Math.random() * 90000000));
    // Password default ditambahkan di belakang layar karena di UI dihapus
    setData((prev) => [...prev, { id: newId, customerId: newCustomerId, password: "user123", ...form }]);
    setAddOpen(false);
  };

  return (
    <AdminSidebar>
      {/* Header */}
      <div className="mb-6">
        {/* Greeting Halo Admin - Lebar Penuh */}
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

        {/* Baris Judul & Tombol Tambah */}
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
                <th className="px-4 py-3 text-center font-semibold border border-black">ID CUSTOMER</th>
                <th className="px-4 py-3 text-center font-semibold border border-black">Nama</th>
                <th className="px-4 py-3 text-center font-semibold border border-black">NO HP</th>
                <th className="px-4 py-3 text-left font-semibold border border-black">Alamat</th>
                <th className="px-4 py-3 text-center font-semibold w-24 border border-black">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
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
                    <td className="px-4 py-3 text-center font-mono text-gray-700 border border-black">{item.customerId}</td>
                    <td className="px-4 py-3 text-center font-medium text-gray-800 border border-black">{item.nama}</td>
                    <td className="px-4 py-3 text-center text-gray-600 border border-black">{item.noHp}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs leading-relaxed max-w-xs border border-black">{item.alamat}</td>
                    <td className="px-4 py-3 border border-black">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit / Detail */}
                        <button
                          onClick={() => openEdit(item)}
                          className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-500 hover:bg-blue-100 transition flex items-center justify-center"
                          title="Edit / Detail"
                        >
                          <Pencil size={13} />
                        </button>
                        {/* Hapus */}
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

      {/* ══════════════════════════════════════════
          POPUP: EDIT / DETAIL CUSTOMER
      ══════════════════════════════════════════ */}
      {(editItem || addOpen) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
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

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nama</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-[#eaf6fb] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 transition"
                  placeholder="Nama lengkap"
                />
              </div>

              {/* No HP */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nomor HP</label>
                <input
                  type="tel"
                  value={form.noHp}
                  onChange={(e) => setForm((f) => ({ ...f, noHp: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-[#eaf6fb] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 transition"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Alamat</label>
                <textarea
                  rows={4}
                  value={form.alamat}
                  onChange={(e) => setForm((f) => ({ ...f, alamat: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-[#eaf6fb] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 transition resize-none"
                  placeholder="Alamat lengkap"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={addOpen ? saveAdd : saveEdit}
                disabled={!form.nama.trim() || !form.noHp.trim()}
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

      {/* ══════════════════════════════════════════
          POPUP: KONFIRMASI HAPUS
      ══════════════════════════════════════════ */}
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
              <span className="font-bold text-gray-600">{deleteItem.nama}</span>
              <br />
              <span className="font-mono text-xs">ID: {deleteItem.customerId}</span>
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