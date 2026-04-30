// src/pages/Admin/PriceSetting.jsx
import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Pencil, Trash2, Plus, Save, X, ShoppingBag, CheckCircle2, AlertTriangle } from "lucide-react";

// ─── DATA AWAL ───────────────────────────────────────────────────────────────
const initKiloan = [
  { id: 1, nama: "Cuci Setrika", harga: 7000 },
  { id: 2, nama: "Cuci Kering",  harga: 5000 },
  { id: 3, nama: "Setrika Saja", harga: 4000 },
];
const initAddon = [
  { id: 1, nama: "Selimut",  harga: 10000 },
  { id: 2, nama: "Bedcover", harga: 15000 },
  { id: 3, nama: "Pelembut", harga: 11000 },
  { id: 4, nama: "Sabun",    harga: 1000  },
];

const fmt = (n) => "Rp " + Number(n).toLocaleString("id-ID") + ",00";

// ─── INLINE EDIT ROW (Kiloan) ─────────────────────────────────────────────────
function KiloanRow({ item, onSave, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ nama: item.nama, harga: item.harga });

  const save = () => { onSave(item.id, form); setEdit(false); };
  const cancel = () => { setForm({ nama: item.nama, harga: item.harga }); setEdit(false); };

  if (edit) {
    return (
      <div className="flex items-center gap-3 py-3 px-4 bg-blue-50 rounded-xl border border-[#0077b6]/30 mb-2">
        <input
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 bg-white"
          value={form.nama}
          onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
          placeholder="Nama layanan"
        />
        <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-white px-3 py-2">
          <span className="text-xs text-gray-400">Rp</span>
          <input
            type="number"
            step="500"
            className="w-24 text-sm focus:outline-none"
            value={form.harga}
            onChange={(e) => setForm((f) => ({ ...f, harga: Number(e.target.value) }))}
          />
        </div>
        <span className="text-sm text-gray-500 font-medium">/Kg</span>
        <button onClick={save} className="w-8 h-8 rounded-lg bg-[#0077b6] text-white flex items-center justify-center hover:bg-[#005f92]"><Save size={14} /></button>
        <button onClick={cancel} className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200"><X size={14} /></button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-gray-50 transition border-b border-gray-100 last:border-none">
      <p className="flex-1 text-gray-700 font-medium">{item.nama}</p>
      <p className="text-gray-800 font-extrabold text-lg">{fmt(item.harga)}</p>
      <span className="text-gray-500 font-semibold">/Kg</span>
      {/* Tombol aksi Kiloan dibuat selalu terlihat */}
      <div className="flex gap-1 transition">
        <button onClick={() => setEdit(true)} className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-500 flex items-center justify-center hover:bg-blue-100" title="Edit">
          <Pencil size={13} />
        </button>
        <button onClick={() => onDelete(item.id)} className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-100" title="Hapus">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function PriceSetting() {
  const [kiloan, setKiloan]   = useState(initKiloan);
  const [addon, setAddon]     = useState(initAddon);
  const [maxBerat, setMaxBerat] = useState(7);
  const [saved, setSaved]     = useState(false);

  // Kiloan CRUD
  const [addKiloanOpen, setAddKiloanOpen]   = useState(false);
  const [newKiloan, setNewKiloan]           = useState({ nama: "", harga: "" });

  // Addon CRUD
  const [addAddonOpen, setAddAddonOpen]     = useState(false);
  const [newAddon, setNewAddon]             = useState({ nama: "", harga: "" });
  const [editAddon, setEditAddon]           = useState(null);
  const [editAddonForm, setEditAddonForm]   = useState({ nama: "", harga: "" });
  const [deleteAddon, setDeleteAddon]       = useState(null);

  // ── Kiloan handlers ──
  const saveKiloan = (id, form) =>
    setKiloan((prev) => prev.map((k) => (k.id === id ? { ...k, ...form } : k)));
  const deleteKiloan = (id) =>
    setKiloan((prev) => prev.filter((k) => k.id !== id));
  const addKiloan = () => {
    if (!newKiloan.nama || !newKiloan.harga) return;
    setKiloan((prev) => [...prev, { id: Date.now(), nama: newKiloan.nama, harga: Number(newKiloan.harga) }]);
    setNewKiloan({ nama: "", harga: "" });
    setAddKiloanOpen(false);
  };

  // ── Addon handlers ──
  const openEditAddon = (item) => { setEditAddon(item); setEditAddonForm({ nama: item.nama, harga: item.harga }); };
  const saveEditAddon = () => {
    setAddon((prev) => prev.map((a) => (a.id === editAddon.id ? { ...a, ...editAddonForm, harga: Number(editAddonForm.harga) } : a)));
    setEditAddon(null);
  };
  const confirmDeleteAddon = () => {
    setAddon((prev) => prev.filter((a) => a.id !== deleteAddon.id));
    setDeleteAddon(null);
  };
  const addAddonItem = () => {
    if (!newAddon.nama || !newAddon.harga) return;
    setAddon((prev) => [...prev, { id: Date.now(), nama: newAddon.nama, harga: Number(newAddon.harga) }]);
    setNewAddon({ nama: "", harga: "" });
    setAddAddonOpen(false);
  };

  // ── Save All ──
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AdminSidebar>
      {/* Header */}
      <div className="mb-6">
        {/* Halo Admin - Lebar Penuh */}
        <div className="flex items-center gap-3 bg-[#0077b6] text-white rounded-xl px-5 py-4 mb-6 shadow w-full">
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
          <h1 className="text-xl font-bold">Halo Admin</h1>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-800">
          Pengaturan Harga <span className="font-normal text-gray-500">(Price Setting)</span>
        </h1>
      </div>

      {/* Toast */}
      {saved && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-green-500 text-white px-5 py-3 rounded-2xl shadow-xl">
          <CheckCircle2 size={18} /> Perubahan berhasil disimpan!
        </div>
      )}

      {/* ── Grid Layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

        {/* ── KIRI: Kiloan + Max Berat ── */}
        <div className="flex flex-col gap-5">

          {/* Layanan Kiloan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-extrabold text-gray-800 text-base mb-4">Layanan Kiloan</h2>
            <div className="divide-y divide-gray-100">
              {kiloan.map((k) => (
                <KiloanRow key={k.id} item={k} onSave={saveKiloan} onDelete={deleteKiloan} />
              ))}
            </div>

            {/* Form tambah kiloan */}
            {addKiloanOpen ? (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <input
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-[#eaf6fb] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30"
                  placeholder="Nama layanan"
                  value={newKiloan.nama}
                  onChange={(e) => setNewKiloan((f) => ({ ...f, nama: e.target.value }))}
                />
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-[#eaf6fb] px-3 py-2">
                  <span className="text-xs text-gray-400">Rp</span>
                  <input
                    type="number"
                    step="500"
                    className="w-20 text-sm bg-transparent focus:outline-none"
                    placeholder="0"
                    value={newKiloan.harga}
                    onChange={(e) => setNewKiloan((f) => ({ ...f, harga: e.target.value }))}
                  />
                </div>
                <button onClick={addKiloan} className="px-3 py-2 bg-[#0077b6] text-white rounded-lg text-sm font-bold hover:bg-[#005f92]">Simpan</button>
                <button onClick={() => setAddKiloanOpen(false)} className="px-3 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm hover:bg-gray-200">Batal</button>
              </div>
            ) : (
              <button
                onClick={() => setAddKiloanOpen(true)}
                className="mt-4 w-full py-3 rounded-xl bg-[#0077b6] text-white font-bold text-sm hover:bg-[#005f92] transition flex items-center justify-center gap-2"
              >
                <Plus size={15} /> Tambah Layanan
              </button>
            )}
          </div>

          {/* Maksimal Berat Per Nota */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-extrabold text-gray-800 text-base mb-4">Maksimal Berat Per Nota</h2>
            <div className="flex items-center gap-4 bg-[#eaf6fb] rounded-xl px-4 py-3">
              <div className="w-10 h-10 rounded-xl bg-[#0077b6] flex items-center justify-center flex-shrink-0">
                <ShoppingBag size={18} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-600">Maksimal Berat</span>
              <input
                type="number"
                min={1}
                value={maxBerat}
                onChange={(e) => setMaxBerat(Number(e.target.value))}
                className="w-16 text-center text-xl font-extrabold text-gray-800 bg-white border border-gray-200 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30"
              />
              <span className="text-gray-500 font-semibold">/Kg</span>
            </div>
            <div className="mt-3 flex items-start gap-2 text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
              <AlertTriangle size={15} className="text-yellow-500 flex-shrink-0 mt-0.5" />
              <p>
                <span className="font-bold text-gray-700">Max: {maxBerat} Kg</span>
                <br />Peringatan akan muncul jika berat melebihi batas.
              </p>
            </div>
          </div>
        </div>

        {/* ── KANAN: Add-On ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col">
          <h2 className="font-extrabold text-gray-800 text-base mb-4">Layanan Satuan (Add-On)</h2>

          {/* Tabel Seragam dengan Garis Hitam */}
          <div className="rounded-xl overflow-hidden border border-black flex-1">
            <table className="w-full text-sm border-collapse border border-black">
              <thead>
                <tr className="bg-[#0077b6] text-white">
                  <th className="px-4 py-3 text-center font-semibold w-12 border border-black">No</th>
                  <th className="px-4 py-3 text-center font-semibold border border-black">NAMA ITEM</th>
                  <th className="px-4 py-3 text-center font-semibold border border-black">HARGA SATUAN</th>
                  <th className="px-4 py-3 text-center font-semibold w-24 border border-black">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {addon.map((a, idx) => (
                  <tr key={a.id} className={`transition hover:bg-blue-100/50 ${idx % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}`}>
                    <td className="px-4 py-3 text-center text-gray-600 border border-black">{idx + 1}</td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-800 border border-black">{a.nama}</td>
                    <td className="px-4 py-3 text-center text-gray-700 border border-black">
                      {fmt(a.harga)}
                    </td>
                    <td className="px-4 py-3 border border-black">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditAddon(a)}
                          className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-500 flex items-center justify-center hover:bg-blue-100"
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteAddon(a)}
                          className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-100"
                          title="Hapus"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Form tambah addon */}
          {addAddonOpen ? (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <input
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-[#eaf6fb] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30"
                placeholder="Nama item"
                value={newAddon.nama}
                onChange={(e) => setNewAddon((f) => ({ ...f, nama: e.target.value }))}
              />
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-[#eaf6fb] px-3 py-2">
                <span className="text-xs text-gray-400">Rp</span>
                <input
                  type="number"
                  step="500"
                  className="w-24 text-sm bg-transparent focus:outline-none"
                  placeholder="0"
                  value={newAddon.harga}
                  onChange={(e) => setNewAddon((f) => ({ ...f, harga: e.target.value }))}
                />
              </div>
              <button onClick={addAddonItem} className="px-3 py-2 bg-[#0077b6] text-white rounded-lg text-sm font-bold hover:bg-[#005f92]">Simpan</button>
              <button onClick={() => setAddAddonOpen(false)} className="px-3 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm hover:bg-gray-200">Batal</button>
            </div>
          ) : (
            <button
              onClick={() => setAddAddonOpen(true)}
              className="mt-4 w-full py-3 rounded-xl bg-[#0077b6] text-white font-bold text-sm hover:bg-[#005f92] transition flex items-center justify-center gap-2"
            >
              <Plus size={15} /> Tambah Item
            </button>
          )}
        </div>
      </div>

      {/* ── Simpan Perubahan ── */}
      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className="px-16 py-3.5 bg-[#0077b6] text-white font-extrabold text-base rounded-2xl hover:bg-[#005f92] transition shadow-md flex items-center gap-2"
        >
          <Save size={17} /> Simpan Perubahan
        </button>
      </div>

      {/* ══ POPUP: Edit Add-On ══ */}
      {editAddon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-gray-800 text-lg">Edit Add-On</h3>
              <button onClick={() => setEditAddon(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Nama Item</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-[#eaf6fb] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30"
                  value={editAddonForm.nama}
                  onChange={(e) => setEditAddonForm((f) => ({ ...f, nama: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Harga Satuan (Rp)</label>
                <input
                  type="number"
                  step="500"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-[#eaf6fb] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30"
                  value={editAddonForm.harga}
                  onChange={(e) => setEditAddonForm((f) => ({ ...f, harga: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={saveEditAddon} className="flex-1 bg-[#0077b6] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#005f92]">Simpan</button>
              <button onClick={() => setEditAddon(null)} className="flex-1 border-2 border-[#0077b6] text-[#0077b6] py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50">Kembali</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ POPUP: Hapus Add-On ══ */}
      {deleteAddon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-2">Apakah anda yakin menghapus ini?</h3>
            <p className="text-gray-400 text-sm mb-6">Item <span className="font-bold text-gray-600">{deleteAddon.nama}</span> akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={confirmDeleteAddon} className="flex-1 bg-red-50 border-2 border-red-400 text-red-500 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100">Hapus</button>
              <button onClick={() => setDeleteAddon(null)} className="flex-1 border-2 border-[#0077b6] text-[#0077b6] py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50">Kembali</button>
            </div>
          </div>
        </div>
      )}
    </AdminSidebar>
  );
}