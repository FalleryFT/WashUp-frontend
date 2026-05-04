// src/pages/Customer/ProfilSaya.jsx
import { useState, useEffect } from "react";
import CustomerSidebar from "../../components/CustomerSidebar";
import { useAuth } from "../../context/AuthContext";
import { WashingMachine, User, Save, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import api from "../../api/axios";

export default function ProfilSaya() {
  const { user: authUser } = useAuth();
  const namaUser = authUser?.name || authUser?.username || "Pelanggan";

  const [form, setForm] = useState({
    nama:   "",
    noHp:   "",
    alamat: "",
  });

  // Data read-only dari server
  const [profileMeta, setProfileMeta] = useState({
    id:          "",
    idFormatted: "",
    email:       "",
    memberSejak: "-",
  });

  const [loading,  setLoading]  = useState(true);   // fetch awal
  const [saving,   setSaving]   = useState(false);   // saat submit
  const [success,  setSuccess]  = useState(false);   // notif sukses
  const [error,    setError]    = useState(null);    // error umum
  const [fieldErr, setFieldErr] = useState({});      // error per field

  // ── Fetch profil saat mount ────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/customer/profile");
        const p = data.data;
        setForm({ nama: p.nama, noHp: p.noHp, alamat: p.alamat });
        setProfileMeta({
          id:          p.id,
          idFormatted: p.idFormatted,
          email:       p.email,
          memberSejak: p.memberSejak,
        });
      } catch {
        setError("Gagal memuat profil. Silakan refresh halaman.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ── Submit simpan ──────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSaving(true);
    setSuccess(false);
    setError(null);
    setFieldErr({});

    try {
      const { data } = await api.put("/customer/profile", {
        nama:   form.nama,
        no_hp:  form.noHp,
        alamat: form.alamat,
      });

      // Update data dari response
      const p = data.data;
      setForm({ nama: p.nama, noHp: p.noHp, alamat: p.alamat });
      setProfileMeta((m) => ({ ...m, memberSejak: p.memberSejak }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      if (err.response?.status === 422) {
        // Laravel validation errors
        const errors = err.response.data?.errors ?? {};
        setFieldErr({
          nama:   errors.nama?.[0]   ?? null,
          noHp:   errors.no_hp?.[0]  ?? null,
          alamat: errors.alamat?.[0] ?? null,
        });
      } else {
        setError("Gagal menyimpan perubahan. Coba lagi.");
      }
    } finally {
      setSaving(false);
    }
  };

  // ── Field helper ──────────────────────────────────────────────────────────
  const inputClass = (field) =>
    `flex-1 border rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 bg-gray-50
     focus:outline-none focus:ring-2 focus:bg-white transition-all w-full
     ${fieldErr[field]
       ? "border-red-400 focus:ring-red-300"
       : "border-black focus:ring-[#0077b6]"}`;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <CustomerSidebar />

      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="w-full">

          {/* GREETING BANNER */}
          <div className="flex items-center gap-4 bg-gradient-to-r from-[#0077b6] to-[#00b4d8] text-white rounded-3xl px-8 py-7 mb-8 shadow-lg shadow-blue-100">
            <div className="bg-white/20 p-3 rounded-2xl flex-shrink-0 backdrop-blur-sm">
              <WashingMachine size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">Halo, {namaUser}! ✨</h1>
              <p className="text-blue-50 text-sm font-medium mt-1 opacity-90">
                Kelola informasi pribadi dan pengaturan akunmu di sini.
              </p>
            </div>
          </div>

          {/* HEADER JUDUL */}
          <div className="mb-6">
            <h2 className="font-extrabold text-gray-800 text-lg tracking-wide uppercase">Profil Saya</h2>
          </div>

          {/* ERROR BANNER */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4 flex items-center gap-3">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* SUCCESS BANNER */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm rounded-2xl px-5 py-4 flex items-center gap-3">
              <CheckCircle size={16} className="flex-shrink-0" />
              <span>Profil berhasil diperbarui!</span>
            </div>
          )}

          {/* CARD PROFIL */}
          <div className="bg-white rounded-3xl border border-black p-6 md:p-8 shadow-sm">

            <p className="font-black text-gray-800 uppercase text-sm mb-6 border-b border-black pb-4">
              Informasi Utama Profil
            </p>

            {/* Avatar + nama */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-blue-50 border border-black flex items-center justify-center text-[#0077b6] overflow-hidden shadow-sm flex-shrink-0">
                {loading
                  ? <div className="w-12 h-12 rounded-full bg-blue-100 animate-pulse" />
                  : <User size={48} strokeWidth={1.5} />
                }
              </div>
              <div className="text-center sm:text-left mt-2">
                {loading
                  ? <div className="h-6 w-40 bg-gray-200 rounded-lg animate-pulse mb-2" />
                  : <p className="font-bold text-gray-800 text-xl">{form.nama || namaUser}</p>
                }
                <p className="text-sm font-bold text-gray-400 mt-1">{profileMeta.email}</p>
                {loading
                  ? <div className="h-4 w-28 bg-gray-200 rounded-lg animate-pulse mt-1" />
                  : <p className="text-xs font-bold text-gray-400 mt-1">{profileMeta.idFormatted}</p>
                }
              </div>
            </div>

            {/* FORM */}
            <div className="space-y-6">

              {/* ID Pelanggan — read only, tidak bisa diedit */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <span className="w-48 flex-shrink-0 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                  ID Pelanggan
                </span>
                <div className="flex-1">
                  {loading
                    ? <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse" />
                    : (
                      <span className="inline-flex items-center gap-2 bg-gray-100 border border-black text-gray-500 font-bold px-4 py-2 rounded-lg text-sm select-none cursor-not-allowed">
                        {profileMeta.idFormatted}
                        <span className="text-[10px] bg-gray-200 text-gray-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                          Tidak dapat diubah
                        </span>
                      </span>
                    )
                  }
                </div>
              </div>

              {/* Nama Lengkap */}
              <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
                <span className="w-48 flex-shrink-0 text-[11px] font-bold text-gray-500 uppercase tracking-wide pt-3">
                  Nama Lengkap
                </span>
                <div className="flex-1">
                  {loading
                    ? <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
                    : (
                      <>
                        <input
                          type="text"
                          value={form.nama}
                          onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                          className={inputClass("nama")}
                        />
                        {fieldErr.nama && (
                          <p className="text-red-500 text-xs font-bold mt-1">{fieldErr.nama}</p>
                        )}
                      </>
                    )
                  }
                </div>
              </div>

              {/* Nomor HP */}
              <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
                <span className="w-48 flex-shrink-0 text-[11px] font-bold text-gray-500 uppercase tracking-wide pt-3">
                  Nomor HP / WA
                </span>
                <div className="flex-1">
                  {loading
                    ? <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
                    : (
                      <>
                        <input
                          type="tel"
                          value={form.noHp}
                          onChange={(e) => setForm((f) => ({ ...f, noHp: e.target.value }))}
                          className={inputClass("noHp")}
                        />
                        {fieldErr.noHp && (
                          <p className="text-red-500 text-xs font-bold mt-1">{fieldErr.noHp}</p>
                        )}
                      </>
                    )
                  }
                </div>
              </div>

              {/* Alamat */}
              <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
                <span className="w-48 flex-shrink-0 text-[11px] font-bold text-gray-500 uppercase tracking-wide pt-3">
                  Alamat Lengkap
                </span>
                <div className="flex-1">
                  {loading
                    ? <div className="h-24 w-full bg-gray-200 rounded-xl animate-pulse" />
                    : (
                      <>
                        <textarea
                          rows={4}
                          value={form.alamat}
                          onChange={(e) => setForm((f) => ({ ...f, alamat: e.target.value }))}
                          className={`${inputClass("alamat")} resize-none leading-relaxed`}
                        />
                        {fieldErr.alamat && (
                          <p className="text-red-500 text-xs font-bold mt-1">{fieldErr.alamat}</p>
                        )}
                      </>
                    )
                  }
                </div>
              </div>

            </div>

            {/* FOOTER */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-5 border-t border-black gap-4">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                Member Sejak:{" "}
                {loading
                  ? <span className="inline-block h-3 w-24 bg-gray-200 rounded animate-pulse align-middle" />
                  : <span className="text-gray-800">{profileMeta.memberSejak}</span>
                }
              </p>
              <button
                onClick={handleSubmit}
                disabled={saving || loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0077b6] text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-[#005f92] border border-black shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving
                  ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</>
                  : <><Save size={16} /> Simpan Perubahan</>
                }
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}