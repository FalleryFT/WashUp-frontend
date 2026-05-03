// src/pages/Admin/NewTransaction.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import api from "../../api/axios";
import {
  User, Search, ChevronDown, CheckCircle2,
  Printer, X, AlertCircle, Loader2, AlertTriangle,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
const fmtRupiah = (n) => "Rp " + Number(n).toLocaleString("id-ID") + ",00";

// ═══════════════════════════════════════════════════════════════
// KOMPONEN KECIL
// ═══════════════════════════════════════════════════════════════

/** Tombol +/- untuk addon */
function Counter({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 rounded-full border-2 border-red-400 text-red-500 font-bold text-lg flex items-center justify-center hover:bg-red-50 transition-colors"
      >
        −
      </button>
      <div className="w-12 h-8 border border-gray-300 rounded-md text-center text-sm font-semibold flex items-center justify-center bg-white">
        {value}
      </div>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 rounded-full bg-[#0077b6] text-white font-bold text-lg flex items-center justify-center hover:bg-[#005f92] transition-colors"
      >
        +
      </button>
    </div>
  );
}

/** Modal sukses setelah transaksi tersimpan */
function SuccessModal({ data, onReset, onClose, onPrint }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={36} className="text-green-500" />
        </div>
        <h3 className="text-xl font-extrabold text-gray-800 mb-2">Transaksi Berhasil!</h3>

        {/* Info ringkas */}
        <p className="text-gray-500 text-sm mb-1">
          <strong>{data.nama}</strong>
          {" · "}
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
            {data.tipe}
          </span>
        </p>
        <p className="text-gray-500 text-sm mb-1">{data.layanan} · {data.berat}</p>
        <p className="text-xs text-gray-400 font-mono mb-2">Nota #{data.nota}</p>

        <p className="text-2xl font-extrabold text-[#0077b6] my-4">{data.totalHarga}</p>

        <div className="flex gap-3 mt-4">
          <button
            onClick={onReset}
            className="flex-1 border-2 border-[#0077b6] text-[#0077b6] py-2.5 rounded-xl font-bold text-sm hover:bg-[#eaf6fb] transition"
          >
            Transaksi Baru
          </button>
          <button
            onClick={() => { onPrint(); onClose(); }}
            className="flex-1 bg-[#0077b6] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#005f92] transition flex items-center justify-center gap-2"
          >
            <Printer size={15} /> Cetak
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
export default function NewTransaction() {

  // ── Master data dari API ───────────────────────────────────────────────────
  const [kiloanList, setKiloanList] = useState([]);  // [{ id, nama, harga }]
  const [addonList, setAddonList]   = useState([]);  // [{ id, nama, harga }]
  const [maxBerat, setMaxBerat]     = useState(7);
  const [formLoading, setFormLoading] = useState(true);

  // ── State form ─────────────────────────────────────────────────────────────
  const [isMember, setIsMember]             = useState(null); // null | 'member' | 'non-member'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery]       = useState("");
  const [searchResults, setSearchResults]   = useState([]);
  const [searchLoading, setSearchLoading]   = useState(false);
  const [showDropdown, setShowDropdown]     = useState(false);
  const [nonMemberName, setNonMemberName]   = useState("");
  const [nonMemberPhone, setNonMemberPhone] = useState("");
  const dropdownRef = useRef(null);

  // Detail cucian
  const [berat, setBerat]   = useState("");
  const [layananId, setLayananId] = useState(null); // id service kiloan
  // addons: { [service_id]: quantity }
  const [addons, setAddons] = useState({});

  // Submit
  const [submitting, setSubmitting]     = useState(false);
  const [submitError, setSubmitError]   = useState(null);
  const [successData, setSuccessData]   = useState(null);

  // ── Fetch form data (kiloan, addon, max_berat) ─────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/admin/transactions/form-data");
        setKiloanList(data.kiloan ?? []);
        setAddonList(data.addon ?? []);
        setMaxBerat(data.max_berat ?? 7);

        // Default layanan = kiloan pertama
        if (data.kiloan?.length > 0) {
          setLayananId(data.kiloan[0].id);
        }

        // Init addons state: semua 0
        const addonInit = {};
        (data.addon ?? []).forEach((a) => { addonInit[a.id] = 0; });
        setAddons(addonInit);
      } catch {
        // Fallback jika gagal — form tetap bisa diisi manual
      } finally {
        setFormLoading(false);
      }
    };
    load();
  }, []);

  // ── Search member (debounce 300ms) ─────────────────────────────────────────
  useEffect(() => {
    if (isMember !== "member" || searchQuery.length < 1) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const { data } = await api.get("/admin/transactions/search-member", {
          params: { q: searchQuery },
        });
        setSearchResults(data.data ?? []);
        setShowDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, isMember]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Computed values ────────────────────────────────────────────────────────
  const selectedKiloan = kiloanList.find((k) => k.id === layananId);

  const hargaLayanan = parseFloat(berat || 0) * (selectedKiloan?.harga ?? 0);

  const hargaAddon = addonList.reduce((sum, a) => {
    return sum + (addons[a.id] ?? 0) * a.harga;
  }, 0);

  const subtotal = hargaLayanan + hargaAddon;

  const customerName = isMember === "member"
    ? (selectedCustomer?.name ?? "")
    : nonMemberName;

  const beratNum     = parseFloat(berat || 0);
  const beratMelebihi = beratNum > maxBerat;

  const isFormValid =
    customerName.trim() !== "" &&
    berat !== "" &&
    beratNum > 0 &&
    !beratMelebihi &&
    layananId !== null;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleMemberSelect = (type) => {
    setIsMember(type);
    setSelectedCustomer(null);
    setSearchQuery("");
    setSearchResults([]);
    setNonMemberName("");
    setNonMemberPhone("");
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setSearchQuery(customer.name);
    setShowDropdown(false);
    setSearchResults([]);
  };

  const handleReset = useCallback(() => {
    setIsMember(null);
    setSelectedCustomer(null);
    setSearchQuery("");
    setNonMemberName("");
    setNonMemberPhone("");
    setBerat("");
    if (kiloanList.length > 0) setLayananId(kiloanList[0].id);
    const addonReset = {};
    addonList.forEach((a) => { addonReset[a.id] = 0; });
    setAddons(addonReset);
    setSuccessData(null);
    setSubmitError(null);
  }, [kiloanList, addonList]);

  // ── Submit ke API ──────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!isFormValid) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Kumpulkan addon yang qty > 0
      const addonPayload = addonList
        .filter((a) => (addons[a.id] ?? 0) > 0)
        .map((a) => ({ service_id: a.id, quantity: addons[a.id] }));

      const payload = {
        customer_type:  isMember,
        user_id:        isMember === "member" ? selectedCustomer?.id : null,
        customer_name:  customerName,
        customer_phone: isMember === "non-member" ? nonMemberPhone || null : null,
        service_id:     layananId,
        weight:         parseFloat(berat),
        addons:         addonPayload,
      };

      const { data } = await api.post("/admin/transactions", payload);

      if (data.success) {
        setSuccessData(data.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message ?? "Transaksi gagal disimpan. Coba lagi.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = (detailItem) => {
  if (!detailItem) return;

  const printWindow = window.open('', '_blank', 'width=800,height=600');

  // Mapping items dari data API — sesuaikan field dengan respons API kamu
  const itemsHtml = (detailItem.items ?? []).map(item => `
    <tr>
      <td style="padding:10px;border-bottom:1px dashed #ccc;">${item.item ?? item.nama ?? '-'}</td>
      <td style="padding:10px;border-bottom:1px dashed #ccc;text-align:center;">${item.jumlah ?? item.quantity ?? '-'}</td>
      <td style="padding:10px;border-bottom:1px dashed #ccc;text-align:right;">${item.harga ?? '-'}</td>
      <td style="padding:10px;border-bottom:1px dashed #ccc;text-align:right;">${item.sub ?? item.subtotal ?? '-'}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html><html>
    <head>
      <title>Cetak Nota - ${detailItem.nota}</title>
      <style>
        body { font-family:'Courier New',Courier,monospace; color:#333; max-width:600px; margin:0 auto; padding:20px; }
        .header { text-align:center; border-bottom:2px dashed #333; padding-bottom:15px; margin-bottom:20px; }
        .header h1 { margin:0; font-size:24px; color:#0077b6; }
        .header p { margin:5px 0 0; font-size:14px; color:#666; }
        .info-grid { display:flex; justify-content:space-between; margin-bottom:20px; font-size:14px; }
        .info-grid td { padding:3px 10px 3px 0; }
        .table { width:100%; border-collapse:collapse; margin-bottom:20px; font-size:14px; }
        .table th { border-bottom:2px dashed #333; padding:10px; text-align:left; }
        .table th.center { text-align:center; } .table th.right { text-align:right; }
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
      <script>window.onload=function(){window.print();setTimeout(()=>{window.close();},500);}<\/script>
    </body></html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <AdminSidebar>

      {/* Success Modal */}
      {successData && (
        <SuccessModal
          data={successData}
          onReset={handleReset}
          onClose={() => setSuccessData(null)}
          onPrint={() => handlePrint(successData)} 
        />
      )}

      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 bg-[#0077b6] text-white rounded-xl px-5 py-4 mb-6 shadow">
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
          BUAT TRANSAKSI BARU{" "}
          <span className="font-normal text-gray-500">(New Transaction)</span>
        </h1>
      </div>

      {/* Error banner */}
      {submitError && (
        <div className="mb-4 flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{submitError}</span>
          <button onClick={() => setSubmitError(null)} className="ml-auto">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-6">

        {/* ── FORM ── */}
        <div className="flex-1 space-y-6">

          {/* ── SECTION 1: Tipe Pelanggan ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-700 mb-4 text-base">1. Tipe Pelanggan</h2>

            {/* Toggle Member / Non-Member */}
            <div className="flex gap-4 mb-5">
              {[
                { value: "member", label: "Member" },
                { value: "non-member", label: "Non-Member" },
              ].map(({ value, label }) => (
                <label
                  key={value}
                  onClick={() => handleMemberSelect(value)}
                  className={`flex items-center gap-3 cursor-pointer flex-1 border-2 rounded-xl px-4 py-3 transition-all ${
                    isMember === value
                      ? "border-[#0077b6] bg-[#eaf6fb]"
                      : "border-gray-200 hover:border-[#0077b6]/40"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                      isMember === value
                        ? "border-[#0077b6] bg-[#0077b6]"
                        : "border-gray-300"
                    }`}
                  >
                    {isMember === value && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${isMember === value ? "text-[#0077b6]" : "text-gray-700"}`}>
                      {label}
                    </p>
                    <p className="text-xs text-gray-400">
                      {value === "member" ? "Pelanggan terdaftar" : "Pelanggan baru / tanpa akun"}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {/* Search member */}
            {isMember === "member" && (
              <div className="relative" ref={dropdownRef}>
                <label className="text-sm text-gray-500 mb-1 block font-medium">Cari Pelanggan</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ketik nama atau nomor HP..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedCustomer(null);
                    }}
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-3 bg-[#eaf6fb] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 transition"
                  />
                  {searchLoading && (
                    <Loader2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
                  )}
                </div>

                {/* Dropdown hasil search */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-30 max-h-56 overflow-y-auto">
                    {searchResults.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCustomer(c)}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#eaf6fb] transition text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#0077b6]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User size={15} className="text-[#0077b6]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-800 text-sm truncate">{c.name}</p>
                          <p className="text-xs text-gray-500">{c.phone} · {c.totalOrders} order</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Tidak ditemukan */}
                {showDropdown && !searchLoading && searchResults.length === 0 && searchQuery.length >= 1 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-30 px-4 py-4 text-sm text-gray-400 text-center">
                    Pelanggan tidak ditemukan
                  </div>
                )}

                {/* Info pelanggan terpilih */}
                {selectedCustomer && (
                  <div className="mt-3 flex items-start gap-3 bg-[#eaf6fb] rounded-xl p-3 border border-[#0077b6]/20">
                    <div className="w-9 h-9 rounded-full bg-[#0077b6] flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-sm">{selectedCustomer.name}</p>
                      <p className="text-xs text-gray-500">{selectedCustomer.phone}</p>
                      <p className="text-xs text-gray-400 truncate">{selectedCustomer.address}</p>
                    </div>
                    <button
                      onClick={() => { setSelectedCustomer(null); setSearchQuery(""); }}
                      className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Non-member input */}
            {isMember === "non-member" && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block font-medium">Nama Pelanggan <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    placeholder="Masukkan nama pelanggan"
                    value={nonMemberName}
                    onChange={(e) => setNonMemberName(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-[#eaf6fb] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 transition"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Nomor HP (opsional)"
                  value={nonMemberPhone}
                  onChange={(e) => setNonMemberPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-[#eaf6fb] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 transition"
                />
              </div>
            )}

            {isMember === null && (
              <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                <AlertCircle size={14} /> Pilih tipe pelanggan terlebih dahulu
              </p>
            )}
          </div>

          {/* ── SECTION 2: Detail Cucian ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-700 mb-4 text-base">2. Detail Cucian</h2>

            {/* Kiloan */}
            <p className="font-bold text-gray-800 mb-3">Kiloan</p>

            {formLoading ? (
              <div className="h-14 bg-gray-100 rounded-xl animate-pulse mb-5" />
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 mb-5">
                {/* Berat */}
                <div className="flex-1">
                  <label className="text-sm text-gray-500 mb-1 block">Berat (Kg)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="0"
                    value={berat}
                    onChange={(e) => setBerat(e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 bg-[#eaf6fb] text-gray-700 focus:outline-none focus:ring-2 transition ${
                      beratMelebihi
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-200 focus:ring-[#0077b6]/30"
                    }`}
                  />
                  {beratMelebihi && (
                    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                      <AlertTriangle size={12} /> Melebihi batas maksimal {maxBerat} Kg
                    </p>
                  )}
                </div>

                {/* Layanan */}
                <div className="flex-1">
                  <label className="text-sm text-gray-500 mb-1 block">Layanan</label>
                  <div className="relative">
                    <select
                      value={layananId ?? ""}
                      onChange={(e) => setLayananId(Number(e.target.value))}
                      className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-3 bg-[#eaf6fb] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 transition pr-10"
                    >
                      {kiloanList.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.nama} — {fmtRupiah(k.harga)}/Kg
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Add-On */}
            <p className="font-bold text-gray-800 mb-3">Add-On</p>
            {formLoading ? (
              <div className="grid grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {addonList.map((a) => (
                  <div key={a.id}>
                    <p className="text-sm text-gray-500 mb-1">{a.nama}</p>
                    <p className="text-xs text-gray-400 mb-2">{fmtRupiah(a.harga)}/pcs</p>
                    <Counter
                      value={addons[a.id] ?? 0}
                      onChange={(v) => setAddons((prev) => ({ ...prev, [a.id]: v }))}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RINGKASAN NOTA ── */}
        <div className="xl:w-80 w-full">
          <div className="bg-[#0077b6] text-white rounded-2xl shadow-md p-6 sticky top-6">
            <h3 className="font-extrabold text-lg mb-4 border-b border-white/20 pb-3">
              RINGKASAN NOTA
            </h3>

            {/* Pelanggan */}
            {customerName && (
              <div className="mb-4">
                <p className="text-white/70 text-xs mb-1">Pelanggan</p>
                <p className="font-bold text-sm">{customerName}</p>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {isMember === "member" ? "Member" : "Non-Member"}
                </span>
              </div>
            )}

            {/* Rincian item */}
            <p className="text-white/70 text-sm font-semibold mb-2">Rincian:</p>
            <div className="space-y-1.5 text-sm mb-4">
              {berat && parseFloat(berat) > 0 && selectedKiloan && (
                <div className="flex justify-between">
                  <span className="text-white/80">
                    -{berat}Kg × {selectedKiloan.nama}
                  </span>
                  <span>={fmtRupiah(hargaLayanan)}</span>
                </div>
              )}
              {addonList.map((a) =>
                (addons[a.id] ?? 0) > 0 ? (
                  <div key={a.id} className="flex justify-between">
                    <span className="text-white/80">{a.nama} ×{addons[a.id]}</span>
                    <span>={fmtRupiah((addons[a.id]) * a.harga)}</span>
                  </div>
                ) : null
              )}
              {subtotal === 0 && (
                <p className="text-white/40 text-xs italic">Belum ada item</p>
              )}
            </div>

            {/* Subtotal */}
            <div className="border-t border-white/20 pt-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Subtotal</span>
                <span>={fmtRupiah(subtotal)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="mb-6">
              <p className="text-white/70 text-sm font-semibold">TOTAL BAYAR :</p>
              <p className="text-2xl font-extrabold">{fmtRupiah(subtotal)}</p>
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || submitting}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                isFormValid && !submitting
                  ? "bg-white text-[#0077b6] hover:bg-blue-50 shadow"
                  : "bg-white/30 text-white/50 cursor-not-allowed"
              }`}
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Printer size={16} />
              )}
              {submitting ? "Menyimpan..." : "Simpan & Cetak Struk"}
            </button>

            {!isFormValid && !submitting && (
              <p className="text-white/50 text-xs text-center mt-2">
                {beratMelebihi
                  ? `Berat melebihi batas ${maxBerat} Kg`
                  : "Lengkapi data pelanggan & berat cucian"}
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}