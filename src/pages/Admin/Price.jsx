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
function KiloanRow({ item, onSave, onDeleteRequest }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ nama: item.nama, harga: item.harga });

  const save = () => { onSave(item.id, form); setEdit(false); };
  const cancel = () => { setForm({ nama: item.nama, harga: item.harga }); setEdit(false); };

  if (edit) {
    return (
      <div className="flex items-center gap-3 py-3 px-4 bg-blue-50 rounded-xl border border-[#0077b6]/30 mb-2">
        <input
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 bg-white"
          value={form.nama}
          onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
          placeholder="Nama layanan"
        />
        <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-white px-3 py-2">
          <span className="text-xs font-medium text-gray-400">Rp</span>
          <input
            type="number"
            step="500"
            className="w-24 text-sm font-semibold focus:outline-none"
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
    <div className="flex items-center gap-3 py-3 px-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-none">
      <p className="flex-1 text-gray-800 font-medium">{item.nama}</p>
      <p className="text-[#0077b6] font-semibold text-lg">{fmt(item.harga)}</p>
      <span className="text-gray-500 font-medium">/Kg</span>
      <div className="flex gap-1 transition">
        <button onClick={() => setEdit(true)} className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-500 flex items-center justify-center hover:bg-blue-100" title="Edit">
          <Pencil size={13} />
        </button>
        <button onClick={() => onDeleteRequest(item)} className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-100" title="Hapus">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── MODAL KONFIRMASI HAPUS (REUSABLE) ────────────────────────────────────────
function ConfirmDeleteModal({ item, typeName, onConfirm, onCancel }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-200">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={28} className="text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Apakah anda yakin menghapus ini?</h3>
        <p className="text-gray-500 text-sm mb-6">
          {typeName} <span className="font-semibold text-gray-700">{item.nama}</span> akan dihapus permanen.
        </p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 bg-red-50 border-2 border-red-400 text-red-500 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-100 transition">
            Hapus
          </button>
          <button onClick={onCancel} className="flex-1 border-2 border-[#0077b6] text-[#0077b6] py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50 transition">
            Kembali
          </button>
        </div>
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
  const [kiloanToDelete, setKiloanToDelete] = useState(null);

  // Addon CRUD
  const [addAddonOpen, setAddAddonOpen]     = useState(false);
  const [newAddon, setNewAddon]             = useState({ nama: "", harga: "" });
  const [editAddon, setEditAddon]           = useState(null);
  const [editAddonForm, setEditAddonForm]   = useState({ nama: "", harga: "" });
  const [addonToDelete, setAddonToDelete]   = useState(null);

  // ── Kiloan handlers ──
  const saveKiloan = (id, form) =>
    setKiloan((prev) => prev.map((k) => (k.id === id ? { ...k, ...form } : k)));
    
  const confirmDeleteKiloan = () => {
    setKiloan((prev) => prev.filter((k) => k.id !== kiloanToDelete.id));
    setKiloanToDelete(null);
  };

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
    setAddon((prev) => prev.filter((a) => a.id !== addonToDelete.id));
    setAddonToDelete(null);
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
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                <path d="M4 6h16" />
                <circle cx="12" cy="14" r="5" />
                <path d="M9.5 14.5c.8-.8 1.7-.8 2.5 0s1.7.8 2.5 0" />
                <circle cx="16" cy="4" r="0.5" fill="currentColor" />
                <circle cx="18" cy="4" r="0.5" fill="currentColor" />
              </svg>
          <h1 className="text-xl font-bold">Halo Admin</h1>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
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
            <h2 className="font-bold text-gray-800 text-base mb-4">Layanan Kiloan</h2>
            <div className="divide-y divide-gray-100">
              {kiloan.map((k) => (
                <KiloanRow key={k.id} item={k} onSave={saveKiloan} onDeleteRequest={setKiloanToDelete} />
              ))}
            </div>

            {/* Form tambah kiloan */}
            {addKiloanOpen ? (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <input
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium bg-[#eaf6fb] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30"
                  placeholder="Nama layanan"
                  value={newKiloan.nama}
                  onChange={(e) => setNewKiloan((f) => ({ ...f, nama: e.target.value }))}
                />
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-[#eaf6fb] px-3 py-2">
                  <span className="text-xs font-medium text-gray-400">Rp</span>
                  <input
                    type="number"
                    step="500"
                    className="w-20 text-sm font-semibold bg-transparent focus:outline-none"
                    placeholder="0"
                    value={newKiloan.harga}
                    onChange={(e) => setNewKiloan((f) => ({ ...f, harga: e.target.value }))}
                  />
                </div>
                <button onClick={addKiloan} className="px-3 py-2 bg-[#0077b6] text-white rounded-lg text-sm font-semibold hover:bg-[#005f92]">Simpan</button>
                <button onClick={() => setAddKiloanOpen(false)} className="px-3 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium hover:bg-gray-200">Batal</button>
              </div>
            ) : (
              <button
                onClick={() => setAddKiloanOpen(true)}
                className="mt-4 w-full py-3 rounded-xl bg-[#0077b6] text-white font-semibold text-sm hover:bg-[#005f92] transition flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Tambah Layanan
              </button>
            )}
          </div>

          {/* Maksimal Berat Per Nota */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-800 text-base mb-4">Maksimal Berat Per Nota</h2>
            <div className="flex items-center gap-4 bg-[#eaf6fb] rounded-xl px-4 py-3">
              <div className="w-10 h-10 rounded-xl bg-[#0077b6] flex items-center justify-center flex-shrink-0">
                <ShoppingBag size={18} className="text-white" />
              </div>
              <span className="text-sm font-medium text-gray-600">Maksimal Berat</span>
              <input
                type="number"
                min={1}
                value={maxBerat}
                onChange={(e) => setMaxBerat(Number(e.target.value))}
                className="w-16 text-center text-xl font-bold text-gray-800 bg-white border border-gray-200 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30"
              />
              <span className="text-gray-500 font-medium">/Kg</span>
            </div>
            <div className="mt-3 flex items-start gap-2 text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
              <AlertTriangle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
              <p>
                <span className="font-semibold text-gray-800">Max: {maxBerat} Kg</span>
                <br />Peringatan akan muncul jika berat melebihi batas.
              </p>
            </div>
          </div>
        </div>

        {/* ── KANAN: Add-On ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col">
          <h2 className="font-bold text-gray-800 text-base mb-4">Layanan Satuan (Add-On)</h2>

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
                    <td className="px-4 py-3 text-center text-gray-600 border border-black font-medium">{idx + 1}</td>
                    <td className="px-4 py-3 text-center text-gray-800 font-medium border border-black">{a.nama}</td>
                    <td className="px-4 py-3 text-center text-gray-700 font-semibold border border-black">
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
                          onClick={() => setAddonToDelete(a)}
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
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium bg-[#eaf6fb] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30"
                placeholder="Nama item"
                value={newAddon.nama}
                onChange={(e) => setNewAddon((f) => ({ ...f, nama: e.target.value }))}
              />
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-[#eaf6fb] px-3 py-2">
                <span className="text-xs font-medium text-gray-400">Rp</span>
                <input
                  type="number"
                  step="500"
                  className="w-24 text-sm font-semibold bg-transparent focus:outline-none"
                  placeholder="0"
                  value={newAddon.harga}
                  onChange={(e) => setNewAddon((f) => ({ ...f, harga: e.target.value }))}
                />
              </div>
              <button onClick={addAddonItem} className="px-3 py-2 bg-[#0077b6] text-white rounded-lg text-sm font-semibold hover:bg-[#005f92]">Simpan</button>
              <button onClick={() => setAddAddonOpen(false)} className="px-3 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium hover:bg-gray-200">Batal</button>
            </div>
          ) : (
            <button
              onClick={() => setAddAddonOpen(true)}
              className="mt-4 w-full py-3 rounded-xl bg-[#0077b6] text-white font-semibold text-sm hover:bg-[#005f92] transition flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Tambah Item
            </button>
          )}
        </div>
      </div>

      {/* ── Simpan Perubahan ── */}
      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className="px-16 py-3.5 bg-[#0077b6] text-white font-bold text-base rounded-2xl hover:bg-[#005f92] transition shadow-md flex items-center gap-2"
        >
          <Save size={18} /> Simpan Perubahan
        </button>
      </div>

      {/* ══ POPUP: Edit Add-On ══ */}
      {editAddon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 text-lg">Edit Add-On</h3>
              <button onClick={() => setEditAddon(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Nama Item</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium bg-[#eaf6fb] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30"
                  value={editAddonForm.nama}
                  onChange={(e) => setEditAddonForm((f) => ({ ...f, nama: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Harga Satuan (Rp)</label>
                <input
                  type="number"
                  step="500"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-[#eaf6fb] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30"
                  value={editAddonForm.harga}
                  onChange={(e) => setEditAddonForm((f) => ({ ...f, harga: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={saveEditAddon} className="flex-1 bg-[#0077b6] text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-[#005f92] transition">Simpan</button>
              <button onClick={() => setEditAddon(null)} className="flex-1 border-2 border-[#0077b6] text-[#0077b6] py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50 transition">Kembali</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ POPUP: Konfirmasi Hapus Kiloan ══ */}
      <ConfirmDeleteModal 
        item={kiloanToDelete} 
        typeName="Layanan"
        onConfirm={confirmDeleteKiloan} 
        onCancel={() => setKiloanToDelete(null)} 
      />

      {/* ══ POPUP: Konfirmasi Hapus Add-On ══ */}
      <ConfirmDeleteModal 
        item={addonToDelete} 
        typeName="Item satuan"
        onConfirm={confirmDeleteAddon} 
        onCancel={() => setAddonToDelete(null)} 
      />

    </AdminSidebar>
  );
}