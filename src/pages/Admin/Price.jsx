// src/pages/Admin/PriceSetting.jsx
import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import api from "../../api/axios";
import {
  Pencil, Trash2, Plus, Save, X,
  ShoppingBag, CheckCircle2, AlertTriangle,
  Loader2, RotateCcw, Trash,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
const fmt = (n) => "Rp " + Number(n).toLocaleString("id-ID") + ",00";

// ═══════════════════════════════════════════════════════════════
// KOMPONEN KECIL
// ═══════════════════════════════════════════════════════════════

/** Toast notifikasi sukses / error */
function Toast({ msg, type = "success", onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-semibold ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`}>
      {type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
      {msg}
    </div>
  );
}

/** Modal konfirmasi hapus / hard delete */
function ConfirmModal({ item, typeName, mode = "soft", onConfirm, onCancel, loading }) {
  if (!item) return null;

  const isHard = mode === "hard";
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-200">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${isHard ? "bg-orange-50" : "bg-red-50"}`}>
          {isHard ? <Trash size={28} className="text-orange-500" /> : <Trash2 size={28} className="text-red-500" />}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {isHard ? "Hapus Permanen?" : "Apakah anda yakin menghapus ini?"}
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          {typeName}{" "}
          <span className="font-semibold text-gray-700">{item.nama}</span>{" "}
          {isHard ? "akan dihapus PERMANEN dan tidak bisa dipulihkan." : "akan dihapus (dapat dipulihkan dari Recycle Bin)."}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 border-2 py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-1 ${
              isHard
                ? "bg-orange-50 border-orange-400 text-orange-500 hover:bg-orange-100"
                : "bg-red-50 border-red-400 text-red-500 hover:bg-red-100"
            }`}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {isHard ? "Hapus Permanen" : "Hapus"}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 border-2 border-[#0077b6] text-[#0077b6] py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}

/** Baris kiloan — inline edit */
function KiloanRow({ item, onSave, onDeleteRequest, saving }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ nama: item.nama, harga: item.harga });

  const save = async () => {
    await onSave(item.id, form);
    setEdit(false);
  };
  const cancel = () => {
    setForm({ nama: item.nama, harga: item.harga });
    setEdit(false);
  };

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
        <button
          onClick={save}
          disabled={saving}
          className="w-8 h-8 rounded-lg bg-[#0077b6] text-white flex items-center justify-center hover:bg-[#005f92] disabled:opacity-50"
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={14} />}
        </button>
        <button onClick={cancel} className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-3 px-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-none">
      <p className="flex-1 text-gray-800 font-medium">{item.nama}</p>
      <p className="text-[#0077b6] font-semibold text-lg">{fmt(item.harga)}</p>
      <span className="text-gray-500 font-medium">/Kg</span>
      <div className="flex gap-1">
        <button
          onClick={() => setEdit(true)}
          className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-500 flex items-center justify-center hover:bg-blue-100"
          title="Edit"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onDeleteRequest(item)}
          className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-100"
          title="Hapus"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

/** Modal Recycle Bin */
function TrashModal({ items, onRestore, onForceDelete, onClose, loading }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <Trash size={20} className="text-orange-400" /> Recycle Bin
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Trash size={36} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Recycle Bin kosong</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-700 text-sm truncate">{item.nama}</p>
                  <p className="text-xs text-gray-400">
                    {item.type === "kiloan" ? "Kiloan" : "Add-On"} · {fmt(item.harga)}
                  </p>
                  {item.deleted_at_label && (
                    <p className="text-[10px] text-red-400 mt-0.5">Dihapus: {item.deleted_at_label}</p>
                  )}
                </div>
                <button
                  onClick={() => onRestore(item)}
                  disabled={loading}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-50 border border-green-300 text-green-600 rounded-lg text-xs font-semibold hover:bg-green-100 transition disabled:opacity-50"
                  title="Pulihkan"
                >
                  <RotateCcw size={12} /> Pulihkan
                </button>
                <button
                  onClick={() => onForceDelete(item)}
                  disabled={loading}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 border border-red-300 text-red-500 rounded-lg text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50"
                  title="Hapus Permanen"
                >
                  <Trash size={12} /> Hapus
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 border-2 border-[#0077b6] text-[#0077b6] rounded-xl text-sm font-semibold hover:bg-blue-50 transition">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

/** Modal edit addon */
function EditAddonModal({ item, onSave, onClose, loading }) {
  const [form, setForm] = useState({ nama: item.nama, harga: item.harga });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800 text-lg">Edit Add-On</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Nama Item</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium bg-[#eaf6fb] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30"
              value={form.nama}
              onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Harga Satuan (Rp)</label>
            <input
              type="number"
              step="500"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-[#eaf6fb] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30"
              value={form.harga}
              onChange={(e) => setForm((f) => ({ ...f, harga: Number(e.target.value) }))}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onSave(item.id, form)}
            disabled={loading}
            className="flex-1 bg-[#0077b6] text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-[#005f92] transition disabled:opacity-50 flex items-center justify-center gap-1"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Simpan
          </button>
          <button onClick={onClose} className="flex-1 border-2 border-[#0077b6] text-[#0077b6] py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50 transition">
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
export default function PriceSetting() {
  // ── Data state ─────────────────────────────────────────────────────────────
  const [kiloan, setKiloan]     = useState([]);
  const [addon, setAddon]       = useState([]);
  const [maxBerat, setMaxBerat] = useState(7);

  // ── Loading state ──────────────────────────────────────────────────────────
  const [pageLoading, setPageLoading]   = useState(true);
  const [saving, setSaving]             = useState(false);
  const [maxBeratLoading, setMaxBeratLoading] = useState(false);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null); // { msg, type }
  const showToast = (msg, type = "success") => setToast({ msg, type });

  // ── Modals ─────────────────────────────────────────────────────────────────
  const [kiloanToDelete, setKiloanToDelete]   = useState(null);
  const [addonToDelete, setAddonToDelete]     = useState(null);
  const [editAddon, setEditAddon]             = useState(null);
  const [trashOpen, setTrashOpen]             = useState(false);
  const [trashItems, setTrashItems]           = useState([]);
  const [trashLoading, setTrashLoading]       = useState(false);
  const [hardDeleteItem, setHardDeleteItem]   = useState(null); // item untuk force delete

  // ── Tambah form state ──────────────────────────────────────────────────────
  const [addKiloanOpen, setAddKiloanOpen] = useState(false);
  const [newKiloan, setNewKiloan]         = useState({ nama: "", harga: "" });
  const [addAddonOpen, setAddAddonOpen]   = useState(false);
  const [newAddon, setNewAddon]           = useState({ nama: "", harga: "" });

  // ── Fetch semua data ───────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setPageLoading(true);
    try {
      const { data } = await api.get("/admin/prices");
      setKiloan(data.kiloan ?? []);
      setAddon(data.addon ?? []);
      setMaxBerat(data.max_berat ?? 7);
    } catch {
      showToast("Gagal memuat data harga", "error");
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Fetch trash ────────────────────────────────────────────────────────────
  const fetchTrash = async () => {
    setTrashLoading(true);
    try {
      const { data } = await api.get("/admin/prices/trash");
      setTrashItems(data.data ?? []);
    } catch {
      showToast("Gagal memuat recycle bin", "error");
    } finally {
      setTrashLoading(false);
    }
  };

  const openTrash = () => { setTrashOpen(true); fetchTrash(); };

  // ─────────────────────────────────────────────────────────────────────────
  // KILOAN handlers
  // ─────────────────────────────────────────────────────────────────────────

  const saveKiloan = async (id, form) => {
    setSaving(true);
    try {
      const { data } = await api.put(`/admin/prices/${id}`, form);
      setKiloan((prev) => prev.map((k) => k.id === id ? data.data : k));
      showToast("Layanan kiloan diperbarui");
    } catch {
      showToast("Gagal memperbarui layanan", "error");
    } finally {
      setSaving(false);
    }
  };

  const addKiloan = async () => {
    if (!newKiloan.nama || !newKiloan.harga) return;
    setSaving(true);
    try {
      const { data } = await api.post("/admin/prices", { ...newKiloan, harga: Number(newKiloan.harga), type: "kiloan" });
      setKiloan((prev) => [...prev, data.data]);
      setNewKiloan({ nama: "", harga: "" });
      setAddKiloanOpen(false);
      showToast("Layanan kiloan ditambahkan");
    } catch {
      showToast("Gagal menambah layanan", "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteKiloan = async () => {
    setSaving(true);
    try {
      await api.delete(`/admin/prices/${kiloanToDelete.id}`);
      setKiloan((prev) => prev.filter((k) => k.id !== kiloanToDelete.id));
      showToast("Layanan dihapus (dapat dipulihkan dari Recycle Bin)");
    } catch {
      showToast("Gagal menghapus layanan", "error");
    } finally {
      setSaving(false);
      setKiloanToDelete(null);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // ADDON handlers
  // ─────────────────────────────────────────────────────────────────────────

  const saveAddon = async (id, form) => {
    setSaving(true);
    try {
      const { data } = await api.put(`/admin/prices/${id}`, form);
      setAddon((prev) => prev.map((a) => a.id === id ? data.data : a));
      setEditAddon(null);
      showToast("Add-on diperbarui");
    } catch {
      showToast("Gagal memperbarui add-on", "error");
    } finally {
      setSaving(false);
    }
  };

  const addAddon = async () => {
    if (!newAddon.nama || !newAddon.harga) return;
    setSaving(true);
    try {
      const { data } = await api.post("/admin/prices", { ...newAddon, harga: Number(newAddon.harga), type: "addon" });
      setAddon((prev) => [...prev, data.data]);
      setNewAddon({ nama: "", harga: "" });
      setAddAddonOpen(false);
      showToast("Add-on ditambahkan");
    } catch {
      showToast("Gagal menambah add-on", "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteAddon = async () => {
    setSaving(true);
    try {
      await api.delete(`/admin/prices/${addonToDelete.id}`);
      setAddon((prev) => prev.filter((a) => a.id !== addonToDelete.id));
      showToast("Add-on dihapus (dapat dipulihkan dari Recycle Bin)");
    } catch {
      showToast("Gagal menghapus add-on", "error");
    } finally {
      setSaving(false);
      setAddonToDelete(null);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // TRASH handlers
  // ─────────────────────────────────────────────────────────────────────────

  const handleRestore = async (item) => {
    setTrashLoading(true);
    try {
      const { data } = await api.post(`/admin/prices/${item.id}/restore`);
      // Masukkan kembali ke list yang sesuai
      if (data.data.type === "kiloan") setKiloan((prev) => [...prev, data.data]);
      else setAddon((prev) => [...prev, data.data]);
      // Hapus dari trash list
      setTrashItems((prev) => prev.filter((t) => t.id !== item.id));
      showToast(`${item.nama} berhasil dipulihkan`);
    } catch {
      showToast("Gagal memulihkan layanan", "error");
    } finally {
      setTrashLoading(false);
    }
  };

  const handleForceDelete = async () => {
    if (!hardDeleteItem) return;
    setTrashLoading(true);
    try {
      await api.delete(`/admin/prices/${hardDeleteItem.id}/force`);
      setTrashItems((prev) => prev.filter((t) => t.id !== hardDeleteItem.id));
      showToast(`${hardDeleteItem.nama} dihapus permanen`);
    } catch (err) {
      const msg = err.response?.data?.message ?? "Gagal menghapus permanen";
      showToast(msg, "error");
    } finally {
      setTrashLoading(false);
      setHardDeleteItem(null);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // MAX BERAT handler
  // ─────────────────────────────────────────────────────────────────────────

  const saveMaxBerat = async () => {
    setMaxBeratLoading(true);
    try {
      await api.put("/admin/prices/settings/max-berat", { max_berat: maxBerat });
      showToast(`Maksimal berat diperbarui: ${maxBerat} Kg`);
    } catch {
      showToast("Gagal memperbarui batas berat", "error");
    } finally {
      setMaxBeratLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <AdminSidebar>
      {/* Toast */}
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />
      )}

      {/* Modal: Konfirmasi hapus kiloan (soft) */}
      <ConfirmModal
        item={kiloanToDelete}
        typeName="Layanan"
        onConfirm={confirmDeleteKiloan}
        onCancel={() => setKiloanToDelete(null)}
        loading={saving}
      />

      {/* Modal: Konfirmasi hapus addon (soft) */}
      <ConfirmModal
        item={addonToDelete}
        typeName="Item satuan"
        onConfirm={confirmDeleteAddon}
        onCancel={() => setAddonToDelete(null)}
        loading={saving}
      />

      {/* Modal: Konfirmasi hard delete dari trash */}
      <ConfirmModal
        item={hardDeleteItem}
        typeName="Layanan"
        mode="hard"
        onConfirm={handleForceDelete}
        onCancel={() => setHardDeleteItem(null)}
        loading={trashLoading}
      />

      {/* Modal: Edit addon */}
      {editAddon && (
        <EditAddonModal
          item={editAddon}
          onSave={saveAddon}
          onClose={() => setEditAddon(null)}
          loading={saving}
        />
      )}

      {/* Modal: Recycle Bin */}
      {trashOpen && (
        <TrashModal
          items={trashItems}
          onRestore={handleRestore}
          onForceDelete={(item) => { setHardDeleteItem(item); }}
          onClose={() => setTrashOpen(false)}
          loading={trashLoading}
        />
      )}

      {/* ── Header ── */}
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

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Pengaturan Harga{" "}
            <span className="font-normal text-gray-500">(Price Setting)</span>
          </h1>
          {/* Tombol Recycle Bin */}
          <button
            onClick={openTrash}
            className="flex items-center gap-2 border-2 border-orange-400 text-orange-500 px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-50 transition"
          >
            <Trash size={15} /> Recycle Bin
          </button>
        </div>
      </div>

      {/* ── Loading skeleton ── */}
      {pageLoading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {[0, 1].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              {[0, 1, 2].map((j) => (
                <div key={j} className="h-12 bg-gray-100 rounded-xl mb-2 animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* ── Grid ── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

            {/* ── KIRI: Kiloan + Max Berat ── */}
            <div className="flex flex-col gap-5">

              {/* Layanan Kiloan */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="font-bold text-gray-800 text-base mb-4">Layanan Kiloan</h2>
                <div className="divide-y divide-gray-100">
                  {kiloan.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4 text-center">Belum ada layanan kiloan</p>
                  ) : (
                    kiloan.map((k) => (
                      <KiloanRow
                        key={k.id}
                        item={k}
                        onSave={saveKiloan}
                        onDeleteRequest={setKiloanToDelete}
                        saving={saving}
                      />
                    ))
                  )}
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
                    <button
                      onClick={addKiloan}
                      disabled={saving}
                      className="px-3 py-2 bg-[#0077b6] text-white rounded-lg text-sm font-semibold hover:bg-[#005f92] disabled:opacity-50 flex items-center gap-1"
                    >
                      {saving && <Loader2 size={13} className="animate-spin" />}
                      Simpan
                    </button>
                    <button onClick={() => setAddKiloanOpen(false)} className="px-3 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm hover:bg-gray-200">
                      Batal
                    </button>
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
                  <span className="text-sm font-medium text-gray-600 flex-1">Maksimal Berat</span>
                  <input
                    type="number"
                    min={1}
                    value={maxBerat}
                    onChange={(e) => setMaxBerat(Number(e.target.value))}
                    className="w-16 text-center text-xl font-bold text-gray-800 bg-white border border-gray-200 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30"
                  />
                  <span className="text-gray-500 font-medium">/Kg</span>
                  <button
                    onClick={saveMaxBerat}
                    disabled={maxBeratLoading}
                    className="w-8 h-8 rounded-lg bg-[#0077b6] text-white flex items-center justify-center hover:bg-[#005f92] disabled:opacity-50 flex-shrink-0"
                    title="Simpan batas berat"
                  >
                    {maxBeratLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  </button>
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
                    {addon.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-gray-400 border border-black text-sm">
                          Belum ada add-on
                        </td>
                      </tr>
                    ) : (
                      addon.map((a, idx) => (
                        <tr
                          key={a.id}
                          className={`transition hover:bg-blue-100/50 ${idx % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}`}
                        >
                          <td className="px-4 py-3 text-center text-gray-600 border border-black font-medium">{idx + 1}</td>
                          <td className="px-4 py-3 text-center text-gray-800 font-medium border border-black">{a.nama}</td>
                          <td className="px-4 py-3 text-center text-gray-700 font-semibold border border-black">{fmt(a.harga)}</td>
                          <td className="px-4 py-3 border border-black">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setEditAddon(a)}
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
                      ))
                    )}
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
                  <button
                    onClick={addAddon}
                    disabled={saving}
                    className="px-3 py-2 bg-[#0077b6] text-white rounded-lg text-sm font-semibold hover:bg-[#005f92] disabled:opacity-50 flex items-center gap-1"
                  >
                    {saving && <Loader2 size={13} className="animate-spin" />}
                    Simpan
                  </button>
                  <button onClick={() => setAddAddonOpen(false)} className="px-3 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm hover:bg-gray-200">
                    Batal
                  </button>
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
        </>
      )}
    </AdminSidebar>
  );
}