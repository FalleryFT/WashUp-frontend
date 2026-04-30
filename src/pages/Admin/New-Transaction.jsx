// src/pages/Admin/NewTransaction.jsx
import { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import {
  User,
  Search,
  ChevronDown,
  CheckCircle2,
  Printer,
  X,
  AlertCircle,
} from "lucide-react";

// ─── DATA DUMMY PELANGGAN ───────────────────────────────────────────────────
const dummyCustomers = [
  { id: 1, name: "Budi Santoso", phone: "081234567890", email: "budi@mail.com", address: "Jl. Mawar No. 10, Malang", totalOrders: 12 },
  { id: 2, name: "Siti Rahayu", phone: "082345678901", email: "siti@mail.com", address: "Jl. Melati No. 5, Malang", totalOrders: 7 },
  { id: 3, name: "Ahmad Fauzi", phone: "083456789012", email: "ahmad@mail.com", address: "Jl. Anggrek No. 3, Malang", totalOrders: 3 },
  { id: 4, name: "Dewi Lestari", phone: "084567890123", email: "dewi@mail.com", address: "Jl. Kenanga No. 8, Malang", totalOrders: 20 },
  { id: 5, name: "Rizky Pratama", phone: "085678901234", email: "rizky@mail.com", address: "Jl. Dahlia No. 2, Malang", totalOrders: 1 },
];

// ─── HARGA ──────────────────────────────────────────────────────────────────
const HARGA = {
  "Cuci Kering": 7000,
  "Cuci Setrika": 9000,
  "Setrika Saja": 5000,
};
const ADDON_HARGA = {
  selimut: 25000,
  bedcover: 35000,
  pelembut: 5000,
  sabun: 5000,
};

// ─── COUNTER COMPONENT ──────────────────────────────────────────────────────
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

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function NewTransaction() {
  // Tipe Pelanggan
  const [isMember, setIsMember] = useState(null); // null | 'member' | 'non-member'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [nonMemberName, setNonMemberName] = useState("");
  const [nonMemberPhone, setNonMemberPhone] = useState("");
  const dropdownRef = useRef(null);

  // Detail Cucian
  const [berat, setBerat] = useState("");
  const [layanan, setLayanan] = useState("Cuci Setrika");
  const [addons, setAddons] = useState({ selimut: 0, bedcover: 0, pelembut: 0, sabun: 0 });

  // Success modal
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter customers
  const filteredCustomers = dummyCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Hitung total
  const hargaLayanan = parseFloat(berat || 0) * (HARGA[layanan] || 0);
  const hargaAddon = Object.entries(addons).reduce(
    (sum, [key, qty]) => sum + qty * (ADDON_HARGA[key] || 0),
    0
  );
  const subtotal = hargaLayanan + hargaAddon;

  const handleMemberSelect = (type) => {
    setIsMember(type);
    setSelectedCustomer(null);
    setSearchQuery("");
    setNonMemberName("");
    setNonMemberPhone("");
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setSearchQuery(customer.name);
    setShowDropdown(false);
  };

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  const handleReset = () => {
    setIsMember(null);
    setSelectedCustomer(null);
    setSearchQuery("");
    setNonMemberName("");
    setNonMemberPhone("");
    setBerat("");
    setLayanan("Cuci Setrika");
    setAddons({ selimut: 0, bedcover: 0, pelembut: 0, sabun: 0 });
    setShowSuccess(false);
  };

  const customerName = isMember === "member"
    ? (selectedCustomer?.name || "")
    : nonMemberName;

  const isFormValid =
    customerName.trim() !== "" &&
    berat !== "" &&
    parseFloat(berat) > 0;

  return (
    <AdminSidebar>
      {/* Header */}
      <div className="mb-6">
        {/* Greeting yang disamakan dengan Dashboard */}
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
          BUAT TRANSAKSI BARU <span className="font-normal text-gray-500">(New Transaction)</span>
        </h1>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* ── FORM UTAMA ── */}
        <div className="flex-1 space-y-6">

          {/* ── SECTION 1: Tipe Pelanggan ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-700 mb-4 text-base">
              1. Tipe Pelanggan
            </h2>

            {/* Checkbox Member / Non-Member */}
            <div className="flex gap-4 mb-5">
              {/* Member */}
              <label
                className={`flex items-center gap-3 cursor-pointer flex-1 border-2 rounded-xl px-4 py-3 transition-all ${
                  isMember === "member"
                    ? "border-[#0077b6] bg-[#eaf6fb]"
                    : "border-gray-200 hover:border-[#0077b6]/40"
                }`}
                onClick={() => handleMemberSelect("member")}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                    isMember === "member"
                      ? "border-[#0077b6] bg-[#0077b6]"
                      : "border-gray-300"
                  }`}
                >
                  {isMember === "member" && (
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                      <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-700 text-sm">Member</p>
                  <p className="text-xs text-gray-400">Pelanggan terdaftar</p>
                </div>
              </label>

              {/* Non-Member */}
              <label
                className={`flex items-center gap-3 cursor-pointer flex-1 border-2 rounded-xl px-4 py-3 transition-all ${
                  isMember === "non-member"
                    ? "border-[#0077b6] bg-[#eaf6fb]"
                    : "border-gray-200 hover:border-[#0077b6]/40"
                }`}
                onClick={() => handleMemberSelect("non-member")}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                    isMember === "non-member"
                      ? "border-[#0077b6] bg-[#0077b6]"
                      : "border-gray-300"
                  }`}
                >
                  {isMember === "non-member" && (
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                      <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-700 text-sm">Non-Member</p>
                  <p className="text-xs text-gray-400">Pelanggan baru / tamu</p>
                </div>
              </label>
            </div>

            {/* ── Jika Member: Search Pelanggan ── */}
            {isMember === "member" && (
              <div className="space-y-4" ref={dropdownRef}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari nama atau nomor HP pelanggan..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedCustomer(null);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 bg-[#eaf6fb] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 transition"
                  />
                  {showDropdown && filteredCustomers.length > 0 && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      {filteredCustomers.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onMouseDown={() => handleSelectCustomer(c)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#eaf6fb] transition text-left"
                        >
                          <div className="w-9 h-9 rounded-full bg-[#0077b6]/10 flex items-center justify-center flex-shrink-0">
                            <User size={16} className="text-[#0077b6]" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-800">{c.name}</p>
                            <p className="text-xs text-gray-400">{c.phone} · {c.totalOrders} transaksi</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card data pelanggan terpilih */}
                {selectedCustomer && (
                  <div className="bg-[#eaf6fb] border border-[#0077b6]/20 rounded-xl p-4 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0077b6] flex items-center justify-center flex-shrink-0">
                      <User size={22} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800">{selectedCustomer.name}</p>
                      <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
                      <p className="text-sm text-gray-500">{selectedCustomer.address}</p>
                      <span className="inline-block mt-1 text-xs bg-[#0077b6] text-white px-2 py-0.5 rounded-full">
                        {selectedCustomer.totalOrders} transaksi
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setSelectedCustomer(null); setSearchQuery(""); }}
                      className="text-gray-400 hover:text-red-400 transition"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Jika Non-Member: Input manual ── */}
            {isMember === "non-member" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-sm">
                  <AlertCircle size={15} />
                  <span>Pelanggan non-member, isi data secara manual</span>
                </div>
                <input
                  type="text"
                  placeholder="Nama Pelanggan *"
                  value={nonMemberName}
                  onChange={(e) => setNonMemberName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-[#eaf6fb] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 transition"
                />
                <input
                  type="tel"
                  placeholder="Nomor HP (opsional)"
                  value={nonMemberPhone}
                  onChange={(e) => setNonMemberPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-[#eaf6fb] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 transition"
                />
              </div>
            )}

            {/* Hint jika belum pilih */}
            {isMember === null && (
              <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                <AlertCircle size={14} />
                Pilih tipe pelanggan terlebih dahulu
              </p>
            )}
          </div>

          {/* ── SECTION 2: Detail Cucian ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-700 mb-4 text-base">
              2. Detail Cucian
            </h2>

            {/* Kiloan */}
            <p className="font-bold text-gray-800 mb-3">Kiloan</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-5">
              <div className="flex-1">
                <label className="text-sm text-gray-500 mb-1 block">Berat (Kg)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="0"
                  value={berat}
                  onChange={(e) => setBerat(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-[#eaf6fb] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 transition"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-500 mb-1 block">Layanan</label>
                <div className="relative">
                  <select
                    value={layanan}
                    onChange={(e) => setLayanan(e.target.value)}
                    className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-3 bg-[#eaf6fb] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 transition pr-10"
                  >
                    {Object.keys(HARGA).map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Add-On */}
            <p className="font-bold text-gray-800 mb-3">Add-On</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {[
                { key: "selimut", label: "Selimut" },
                { key: "bedcover", label: "Bedcover" },
                { key: "pelembut", label: "Pelembut" },
                { key: "sabun", label: "Sabun" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <p className="text-sm text-gray-500 mb-2">{label}</p>
                  <Counter
                    value={addons[key]}
                    onChange={(v) => setAddons((prev) => ({ ...prev, [key]: v }))}
                  />
                </div>
              ))}
            </div>
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
                {isMember === "member" && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Member</span>
                )}
                {isMember === "non-member" && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Non-Member</span>
                )}
              </div>
            )}

            <p className="text-white/70 text-sm font-semibold mb-2">Rincian:</p>
            <div className="space-y-1.5 text-sm mb-4">
              {berat && parseFloat(berat) > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/80">-{berat}Kg x {layanan}</span>
                  <span>=Rp {hargaLayanan.toLocaleString("id-ID")},00</span>
                </div>
              )}
              {Object.entries(addons).map(([key, qty]) =>
                qty > 0 ? (
                  <div key={key} className="flex justify-between">
                    <span className="text-white/80 capitalize">-{key.charAt(0).toUpperCase() + key.slice(1)} Add-On</span>
                    <span>=Rp {(qty * ADDON_HARGA[key]).toLocaleString("id-ID")},00</span>
                  </div>
                ) : null
              )}
              {subtotal === 0 && (
                <p className="text-white/40 text-xs italic">Belum ada item</p>
              )}
            </div>

            <div className="border-t border-white/20 pt-3 mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/70">Subtotal</span>
                <span>=Rp {subtotal.toLocaleString("id-ID")},00</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-white/70 text-sm font-semibold">TOTAL BAYAR :</p>
              <p className="text-2xl font-extrabold">
                Rp {subtotal.toLocaleString("id-ID")},00
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                isFormValid
                  ? "bg-white text-[#0077b6] hover:bg-blue-50 shadow"
                  : "bg-white/30 text-white/50 cursor-not-allowed"
              }`}
            >
              <Printer size={16} />
              Simpan &amp; Cetak Struk
            </button>
            {!isFormValid && (
              <p className="text-white/50 text-xs text-center mt-2">
                Lengkapi data pelanggan &amp; berat cucian
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── SUCCESS MODAL ── */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} className="text-green-500" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-2">Transaksi Berhasil!</h3>
            <p className="text-gray-500 text-sm mb-1">
              <strong>{customerName}</strong>
            </p>
            <p className="text-gray-500 text-sm mb-1">{layanan} · {berat} Kg</p>
            <p className="text-2xl font-extrabold text-[#0077b6] my-4">
              Rp {subtotal.toLocaleString("id-ID")},00
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleReset}
                className="flex-1 border-2 border-[#0077b6] text-[#0077b6] py-2.5 rounded-xl font-bold text-sm hover:bg-[#eaf6fb] transition"
              >
                Transaksi Baru
              </button>
              <button
                onClick={() => setShowSuccess(false)}
                className="flex-1 bg-[#0077b6] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#005f92] transition flex items-center justify-center gap-2"
              >
                <Printer size={15} />
                Cetak
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminSidebar>
  );
}