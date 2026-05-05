// src/pages/landingpage.jsx
import { useState, useEffect } from 'react';
import { Link }                from 'react-router-dom';
import api                     from '../api/axios';
import Home                    from '../assets/Home.png'; 
import About                   from '../assets/About.png'; 
import logoImage               from "../assets/logo.png"; 

// ── Konstanta label timeline — sama dengan Dashboard.jsx ──────────────────────
const TIMELINE_LABELS = [
  'Order di terima',
  'Sedang Di Pilah',
  'Sedang Di cuci',
  'Siap Di ambil',
];

// ── Badge status ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const STATUS_MAP = {
    "Order Diterima":  "bg-blue-100 text-blue-700 border border-blue-200",
    "Sedang Di Pilah": "bg-purple-100 text-purple-700 border border-purple-200",
    "Sedang Dicuci":   "bg-yellow-100 text-yellow-700 border border-yellow-200",
    "Siap Diambil":    "bg-cyan-100 text-cyan-700 border border-cyan-200",
    "Selesai":         "bg-green-100 text-green-700 border border-green-200",
    "Dibatalkan":      "bg-red-100 text-red-700 border border-red-200",
  };
  const colorClass = STATUS_MAP[status] ?? "bg-gray-100 text-gray-600 border border-gray-200";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
      {status || 'Menunggu'}
    </span>
  );
};

// ── Timeline — pola persis dari Dashboard.jsx ─────────────────────────────────
// Mendukung DUA format dari backend:
//   1. String  : "Label\nTanggal"      (raw dari DB, sebelum diparse)
//   2. Object  : { status, date }      (sudah diparse di controller)
// Elemen null = step belum terjadi
const TimelineView = ({ timeline }) => {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">
        Riwayat Status
      </p>
      <div className="flex flex-col gap-0">
        {TIMELINE_LABELS.map((label, i) => {
          const raw    = timeline?.[i];
          const done   = raw !== null && raw !== undefined;
          const isLast = i === TIMELINE_LABELS.length - 1;
          // Handle string "Label\nTgl" ATAU object {status, date}
          const date = done
            ? (typeof raw === 'string' ? (raw.split('\n')[1] ?? '') : (raw?.date ?? ''))
            : '';

          return (
            <div key={i} className="flex items-start gap-3">
              {/* Kolom kiri: dot + garis penghubung */}
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                  done
                    ? 'bg-green-500 border-green-500'
                    : 'bg-white border-gray-300'
                }`} />
                {!isLast && (
                  <div className={`w-0.5 h-8 ${
                    done && timeline?.[i + 1] ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>

              {/* Kolom kanan: label + tanggal */}
              <div className="pb-2">
                <p className={`text-sm font-bold leading-tight ${
                  done ? 'text-gray-800' : 'text-gray-300'
                }`}>
                  {label}
                </p>
                {done
                  ? <p className="text-xs text-gray-400 mt-0.5">{date}</p>
                  : <p className="text-xs text-gray-300 mt-0.5">Belum terjadi</p>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Modal Detail Tracking ─────────────────────────────────────────────────────
const TrackModal = ({ data, onClose, rupiah }) => {
  if (!data) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-xl font-extrabold text-gray-800">Detail Transaksi</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition hover:bg-gray-100 rounded-full p-1.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 p-6">

          {/* ── Kiri: Info + Tabel Item ── */}
          <div className="flex-1">
            {/* Info baris */}
            <div className="space-y-2 mb-5 text-sm">
              {[
                ['Nota',             data.nota],
                ['Layanan',          data.service],
                ['Tanggal Masuk',    data.order_date],
                ['Nama Pelanggan',   data.customer_name],
                ['Total Berat',      data.weight ? `${data.weight} Kg` : '-'],
                ['Total Harga',      rupiah(Number(data.total_price) || 0)],
                ['Estimasi Selesai', data.estimated_date],
              ].map(([label, val]) => (
                <div key={label} className="flex gap-2">
                  <span className="w-36 text-gray-500 font-medium flex-shrink-0">{label}</span>
                  <span className="text-gray-400 flex-shrink-0">:</span>
                  <span className="font-semibold text-gray-800">{val ?? '-'}</span>
                </div>
              ))}
            </div>

            {/* Tabel item (jika ada) */}
            {data.items?.length > 0 && (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#0077b6] text-white">
                      <th className="px-3 py-2 text-left font-semibold border border-[#005f99]">Item</th>
                      <th className="px-3 py-2 text-right font-semibold border border-[#005f99]">Jumlah</th>
                      <th className="px-3 py-2 text-right font-semibold border border-[#005f99]">Harga Satuan</th>
                      <th className="px-3 py-2 text-right font-semibold border border-[#005f99]">Sub Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((row, i) => (
                      <tr key={i} className={`hover:bg-blue-50 ${i % 2 === 1 ? 'bg-[#eaf6fb]' : 'bg-white'}`}>
                        <td className="px-3 py-1.5 text-gray-700 border border-gray-200">{row.item_name}</td>
                        <td className="px-3 py-1.5 text-right text-gray-600 border border-gray-200">
                          {row.quantity} {row.unit}
                        </td>
                        <td className="px-3 py-1.5 text-right text-gray-600 border border-gray-200">
                          {rupiah(Number(row.unit_price) || 0)}
                        </td>
                        <td className="px-3 py-1.5 text-right font-medium text-gray-700 border border-gray-200">
                          {rupiah(Number(row.subtotal) || 0)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-3 py-2 font-bold text-gray-700 border border-gray-200 text-right">Total</td>
                      <td className="px-3 py-2 text-right font-extrabold text-[#0077b6] border border-gray-200">
                        {rupiah(Number(data.total_price) || 0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Kanan: Status + Timeline ── */}
          <div className="md:w-52 flex-shrink-0">
            {/* Info status */}
            <div className="mb-5 p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Status Saat Ini
                </span>
                <StatusBadge status={data.status} />
              </div>
            </div>

            {/* Timeline — pola Dashboard.jsx */}
            <div className="px-1">
              <TimelineView timeline={data.timeline} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [services, setServices] = useState({ kiloan: [], satuan: [] });
  const [loadSvc, setLoadSvc]   = useState(true);

  const [nota, setNota]               = useState('');
  const [tracking, setTracking]       = useState(false);
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError]   = useState('');

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navLinks = [
    { id: 'hero',    label: 'Home' },
    { id: 'service', label: 'Service' },
    { id: 'track',   label: 'Cek Cucian' },
    { id: 'about',   label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    api.get('/landing/services')
      .then(res => setServices(res.data.data))
      .catch(() => {})
      .finally(() => setLoadSvc(false));
  }, []);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!nota.trim()) return;
    setTracking(true);
    setTrackResult(null);
    setTrackError('');
    try {
      const res = await api.get('/landing/track', { params: { nota: nota.trim() } });
      if (res.data?.data) {
        setTrackResult(res.data.data);
      } else {
        setTrackError('Data tidak ditemukan.');
      }
    } catch (err) {
      setTrackError(err.response?.data?.message ?? 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setTracking(false);
    }
  };

  const rupiah = (num) => {
    const value = Number(num);
    if (isNaN(value)) return 'Rp -';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="font-sans bg-[#eaf6fb] text-gray-800 scroll-smooth">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-0">
              <img
                src={logoImage}
                alt="WashUp Logo"
                className="w-12 h-12 object-contain drop-shadow-md"
              />
            <span className="text-xl font-bold text-[#1a3d5c]">WashUp</span>
          </button>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            {navLinks.map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)} className="hover:text-[#5bbfe8] transition">
                {label}
              </button>
            ))}
          </div>
          <Link to="/login"
            className="hidden md:inline-block bg-[#5bbfe8] hover:bg-[#3aaad4] text-white text-sm font-semibold px-5 py-2 rounded-lg transition shadow">
            Login
          </Link>
          <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t px-6 py-4 flex flex-col gap-3 text-sm text-gray-600">
            {navLinks.map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)} className="text-left font-medium">{label}</button>
            ))}
            <Link to="/login" className="bg-[#5bbfe8] text-white text-center py-2 rounded-lg font-semibold">Login</Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" className="pt-24 pb-16 px-6 bg-[#eaf6fb]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a3d5c] leading-tight mb-4">
              Laundry Jadi<br />Lebih Mudah &<br />Bersih Maksimal
            </h1>
            <p className="text-gray-500 mb-8 max-w-md leading-relaxed text-sm">
              Nikmati kemudahan laundry dengan hasil bersih, wangi, dan rapi setiap saat.
              WashUp siap jadi solusi praktis untuk kebutuhan harian Anda.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register"
                className="bg-[#5bbfe8] hover:bg-[#3aaad4] text-white font-semibold px-6 py-3 rounded-lg transition shadow-md">
                Pesan Sekarang
              </Link>
              <button onClick={() => scrollTo('service')}
                className="border-2 border-[#5bbfe8] text-[#5bbfe8] hover:bg-[#5bbfe8] hover:text-white font-semibold px-6 py-3 rounded-lg transition">
                Lihat Layanan
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center">
            {/* GAMBAR HOME MENGGANTIKAN KOTAK BIRU */}
            <img 
              src={Home} 
              alt="WashUp Laundry Service" 
              className="w-full max-w-md h-64 md:h-72 rounded-2xl shadow-xl object-cover hover:scale-[1.02] transition-transform duration-300"
            />
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1a3d5c] mb-10">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Cuci Hemat', desc: 'Harga hemat, kualitas tetap terjaga untuk kebutuhan harian Anda.',
                path: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /> },
              { title: 'Bersih Maksimal', desc: 'Membersihkan noda dan bau secara menyeluruh, hasil segar seperti baru.',
                path: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /> },
              { title: 'Setrika Rapi', desc: 'Disetrika dengan teliti, rapi dan siap dipakai kapan saja.',
                path: <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" /> },
            ].map((f, i) => (
              <div key={i} className="border border-[#c8e9f5] rounded-2xl p-8 text-center hover:shadow-lg hover:-translate-y-1 transition duration-200">
                <div className="flex justify-center mb-4">
                  <svg className="w-12 h-12 text-[#5bbfe8]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    {f.path}
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1a3d5c] mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE */}
      <section id="service" className="py-16 px-6 bg-[#eaf6fb]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1a3d5c] mb-2">Layanan Kami</h2>
          <p className="text-center text-gray-500 text-sm mb-10">Harga transparan, kualitas terjamin</p>

          {loadSvc ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-52 animate-pulse" />)}
            </div>
          ) : (
            <>
              {services.kiloan.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-lg font-bold text-[#1a3d5c]">🧺 Kiloan</span>
                    <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">harga / Kg</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.kiloan.map((s, i) => {
                      const grads = ['from-[#b8dff5] to-[#5bbfe8]','from-[#5bbfe8] to-[#3aaad4]','from-[#3aaad4] to-[#1752a0]'];
                      return (
                        <div key={s.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-200">
                          <div className={`h-36 bg-gradient-to-br ${grads[i % grads.length]} flex items-center justify-center`}>
                            <svg className="w-16 h-16 text-white opacity-60" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18 2.01L6 2c-1.1 0-2 .89-2 2v16c0 1.11.9 2 2 2h12c1.1 0 2-.89 2-2V4c0-1.11-.9-1.99-2-1.99zM18 20H6V8h12v12zm0-14H6V4h12v2zM9 5H7V4h2v1zm-3 0V4h1v1H6zm6 4c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                            </svg>
                          </div>
                          <div className="p-4">
                            <p className="font-semibold text-[#1a3d5c]">{s.name}</p>
                            <p className="text-[#1a3d5c] font-bold text-lg">
                              {rupiah(s.price)} <span className="text-xs font-normal text-gray-400">/Kg</span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {services.satuan.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-lg font-bold text-[#1a3d5c]">👕 Satuan</span>
                    <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">harga / item</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.satuan.map((s) => (
                      <div key={s.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-200">
                        <div className="h-36 bg-gradient-to-br from-[#e0f4fb] to-[#b8dff5] flex items-center justify-center">
                          <svg className="w-14 h-14 text-[#3aaad4] opacity-70" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
                          </svg>
                        </div>
                        <div className="p-4">
                          <p className="font-semibold text-[#1a3d5c]">{s.name}</p>
                          <p className="text-[#1a3d5c] font-bold text-lg">
                            {rupiah(s.price)} <span className="text-xs font-normal text-gray-400">/item</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {services.kiloan.length === 0 && services.satuan.length === 0 && (
                <p className="text-center text-gray-400 py-10">Belum ada layanan tersedia.</p>
              )}
            </>
          )}
        </div>
      </section>

      {/* CEK NOTA */}
      <section id="track" className="py-16 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1a3d5c] mb-2">Cek Status Cucian</h2>
          <p className="text-center text-gray-500 text-sm mb-8">
            Masukkan nomor nota yang tertera di struk Anda
          </p>

          <form onSubmit={handleTrack} className="flex gap-3">
            <input
              type="text"
              value={nota}
              onChange={e => { setNota(e.target.value); setTrackError(''); }}
              placeholder="Masukkan nomor nota..."
              className="flex-1 border border-[#c8e9f5] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5bbfe8] bg-[#f6fbff]"
            />
            <button
              type="submit"
              disabled={tracking || !nota.trim()}
              className="bg-[#5bbfe8] hover:bg-[#3aaad4] text-white font-semibold px-6 py-3 rounded-lg transition text-sm shadow whitespace-nowrap flex items-center gap-2">
              {tracking
                ? <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Mencari...
                  </>
                : 'Cek Status'
              }
            </button>
          </form>

          {trackError && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-3 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              {trackError}
            </div>
          )}
        </div>
      </section>

      {/* MODAL TRACKING */}
      <TrackModal
        data={trackResult}
        onClose={() => { setTrackResult(null); setNota(''); }}
        rupiah={rupiah}
      />

      {/* ABOUT */}
      <section id="about" className="py-16 px-6 bg-[#eaf6fb]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center">
          
          <div className="flex-1">
            {/* GAMBAR ABOUT MENGGANTIKAN KOTAK BIRU */}
            <img 
              src={About} 
              alt="Tentang WashUp Professional" 
              className="w-full h-72 rounded-2xl shadow-xl object-cover hover:scale-[1.02] transition-transform duration-300"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-[#1a3d5c] mb-4">About</h2>
            <p className="text-gray-600 mb-3 leading-relaxed text-sm">
              <strong>WashUp</strong> adalah layanan laundry profesional yang berkomitmen memberikan hasil terbaik
              untuk setiap pelanggan. Kami menggunakan proses pencucian terstandar, deterjen berkualitas, serta
              penanganan yang teliti untuk memastikan setiap pakaian bersih maksimal tanpa merusak serat kain.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed text-sm">
              Setiap tahap dikerjakan oleh tenaga berpengalaman dengan kontrol kualitas yang ketat.
              Kami memahami bahwa kepercayaan pelanggan adalah hal utama, sehingga <strong>WashUp</strong> selalu
              mengutamakan konsistensi, ketepatan waktu, dan kepuasan dalam setiap layanan.
            </p>
            <ul className="text-sm text-gray-600 mb-5 space-y-1.5">
              {['Proses cuci higienis & terstandar','Bahan aman untuk semua jenis kain','Penanganan profesional & teliti','Hasil bersih, rapi, dan tahan lama'].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#5bbfe8] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/login"
              className="inline-block bg-[#5bbfe8] hover:bg-[#3aaad4] text-white font-semibold px-6 py-2.5 rounded-lg transition shadow">
              Pesan Sekarang
            </Link>
          </div>
        </div>
      </section>

{/* CONTACT */}
<section id="contact" className="py-16 px-6 bg-white">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-3xl font-bold text-center text-[#1a3d5c] mb-12">
      Contact Us
    </h2>

    <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-center justify-between bg-gray-50/50 p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
      
      {/* BAGIAN MAPS - Diperkecil */}
      <div className="w-full md:w-5/12 h-60 md:h-72 rounded-2xl shadow-md relative overflow-hidden flex-shrink-0 border border-gray-200 bg-white">
        <iframe
          title="Lokasi WashUp Laundry"
          src="https://maps.google.com/maps?q=FR43%2B5X9,%20Jl.%20Kutai%20Utara,%20Sumber,%20Kec.%20Banjarsari,%20Kota%20Surakarta,%20Jawa%20Tengah%2057138&t=&z=16&ie=UTF8&iwloc=&output=embed"
          className="absolute top-0 left-0 w-full h-full border-0"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* DETAIL KONTAK - Dibuat Lebih Modern */}
      <div className="w-full md:w-7/12 flex flex-col gap-6">
        {[
          { 
            label: 'Alamat', 
            emoji: '📍', 
            text: 'Jl. Kutai Utara, Sumber, Kec. Banjarsari, Kota Surakarta, Jawa Tengah 57138' 
          },
          { 
            label: 'Email', 
            emoji: '✉️', 
            text: 'washuplaundry@gmail.com' 
          },
          { 
            label: 'Telepon / WhatsApp', 
            emoji: '📱', 
            text: '+62801749020' 
          },
          { 
            label: 'Jam Operasional', 
            emoji: '🕐', 
            text: '08.00 - 20.00 WIB' 
          },
        ].map((c, i) => (
          <div key={i} className="flex items-start gap-4">
            {/* Ikon dengan background */}
            <div className="w-12 h-12 flex items-center justify-center bg-[#1a3d5c]/10 rounded-full flex-shrink-0 shadow-sm">
              <span className="text-xl">{c.emoji}</span>
            </div>
            
            {/* Teks dengan Label */}
            <div className="flex flex-col mt-0.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                {c.label}
              </span>
              <span className="font-medium text-[#1a3d5c] text-sm md:text-base leading-relaxed">
                {c.text}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
</section>
      
      {/* FOOTER */}
      <footer className="bg-[#1a3d5c] text-white py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex items-center gap-0 mb-2">
              <img
                src={logoImage}
                alt="WashUp Logo"
                className="w-12 h-12 object-contain drop-shadow-md"
              />
              <span className="font-bold text-lg">WashUp</span>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed">
              Laundry Jadi Lebih Mudah &<br />Bersih Maksimal
            </p>
          </div>
          <div className="text-sm text-blue-200 space-y-1.5">
            <p>📍 Jl. Kutai Utara, Sumber,</p>
            <p>✉️ washuplaundry@gmail.com</p>
            <p>📱 +62801749020</p>
          </div>
        </div>
      </footer>
    </div>
  );
}