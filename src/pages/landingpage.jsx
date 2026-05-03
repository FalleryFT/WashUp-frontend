// src/landingpage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 200 200" className={className}>
    <circle cx="100" cy="100" r="96" fill="#4baed4" />
    <circle cx="100" cy="100" r="88" fill="#1752a0" opacity="0.55" />
    <path d="M130 65 Q145 75 135 95 Q125 110 100 115 Q75 120 68 138 Q62 155 80 165 Q95 172 115 165"
      fill="none" stroke="white" strokeWidth="14" strokeLinecap="round" />
    <path d="M72 68 Q90 58 110 68 Q128 78 125 95"
      fill="none" stroke="white" strokeWidth="13" strokeLinecap="round" opacity="0.85" />
    <circle cx="78" cy="108" r="5" fill="white" opacity="0.9" />
    <circle cx="108" cy="125" r="5.5" fill="white" opacity="0.9" />
  </svg>
);

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'service', label: 'Service' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="font-sans bg-[#eaf6fb] text-gray-800 scroll-smooth">

      {/* ══════════ NAVBAR ══════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-2">
            <Logo className="w-9 h-9" />
            <span className="text-xl font-bold text-[#1a3d5c]">WashUp</span>
          </button>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            {navLinks.map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="hover:text-[#5bbfe8] transition">
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

      {/* ══════════ HERO ══════════ */}
      <section id="hero" className="pt-24 pb-16 px-6 bg-[#eaf6fb]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          {/* Text */}
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

          {/* Image / Illustration */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-md h-64 md:h-72 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-[#b8dff5] to-[#3aaad4] flex items-center justify-center">
              <div className="text-center text-white px-6">
                {/* Washing machine icon */}
                <svg className="w-28 h-28 mx-auto mb-3 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2.01L6 2c-1.1 0-2 .89-2 2v16c0 1.11.9 2 2 2h12c1.1 0 2-.89 2-2V4c0-1.11-.9-1.99-2-1.99zM18 20H6V8h12v12zm0-14H6V4h12v2zM9 5H7V4h2v1zm-3 0V4h1v1H6zm6 4c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
                <p className="font-bold text-xl opacity-80">Laundry Professional</p>
                <p className="text-sm opacity-60 mt-1">Bersih · Wangi · Tepat Waktu</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1a3d5c] mb-10">Freatures</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Cuci Hemat',
                desc: 'Harga hemat, kualitas tetap terjaga untuk kebutuhan harian Anda.',
                path: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              },
              {
                title: 'Bersih Maksimal',
                desc: 'Membersihkan noda dan bau secara menyeluruh, hasil segar seperti baru.',
                path: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              },
              {
                title: 'Setrika Rapi',
                desc: 'Disetrika dengan teliti, rapi dan siap dipakai kapan saja.',
                path: <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
              },
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

      {/* ══════════ SERVICE ══════════ */}
      <section id="service" className="py-16 px-6 bg-[#eaf6fb]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1a3d5c] mb-10">Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Cuci Strika',  price: '7.000,00 /Kg', grad: 'from-[#b8dff5] to-[#5bbfe8]' },
              { name: 'Cuci Kering',  price: '7.000,00 /Kg', grad: 'from-[#5bbfe8] to-[#3aaad4]' },
              { name: 'Strika Saja',  price: '7.000,00 /Kg', grad: 'from-[#3aaad4] to-[#1752a0]' },
            ].map((s, i) => (
              <div key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-200 cursor-pointer">
                <div className={`h-44 bg-gradient-to-br ${s.grad} flex items-center justify-center`}>
                  <svg className="w-20 h-20 text-white opacity-60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2.01L6 2c-1.1 0-2 .89-2 2v16c0 1.11.9 2 2 2h12c1.1 0 2-.89 2-2V4c0-1.11-.9-1.99-2-1.99zM18 20H6V8h12v12zm0-14H6V4h12v2zM9 5H7V4h2v1zm-3 0V4h1v1H6zm6 4c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                  </svg>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-[#1a3d5c]">{s.name}</p>
                  <p className="text-[#1a3d5c] font-bold text-lg">Rp {s.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ ABOUT ══════════ */}
      <section id="about" className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center">
          {/* Illustration */}
          <div className="flex-1">
            <div className="w-full h-72 rounded-2xl bg-gradient-to-br from-[#7ecfe0] to-[#1752a0] flex items-center justify-center shadow-xl">
              <div className="text-center text-white p-6">
                <Logo className="w-20 h-20 mx-auto" />
                <p className="font-bold text-lg mt-3">WashUp Professional</p>
                <p className="text-sm opacity-70 mt-1">Laundry Terpercaya di Solo</p>
              </div>
            </div>
          </div>

          {/* Text */}
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
              {[
                'Proses cuci higienis & terstandar',
                'Bahan aman untuk semua jenis kain',
                'Penanganan profesional & teliti',
                'Hasil bersih, rapi, dan tahan lama',
              ].map((item, i) => (
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

      {/* ══════════ CONTACT ══════════ */}
      <section id="contact" className="py-16 px-6 bg-[#eaf6fb]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1a3d5c] mb-10">Contact</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
            {/* Map placeholder */}
            <div className="w-full md:w-72 h-52 rounded-2xl bg-gradient-to-br from-[#c8e9f5] to-[#5bbfe8] flex items-center justify-center shadow-md relative overflow-hidden flex-shrink-0">
              <div className="text-white text-center">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <p className="text-sm font-semibold px-4">Jl. Kutai Utara,<br/>Banjarsari, Solo</p>
              </div>
              <div className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-red-500 border-2 border-white shadow-lg" />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4 md:pl-4 pt-2">
              {[
                { emoji: '📍', text: 'Jl. Kutai Utara, Sumber, Banjarsari, Solo' },
                { emoji: '✉️', text: 'washuplaundry@gmail.com' },
                { emoji: '📱', text: '+62801749020' },
                { emoji: '🕐', text: '08.00 - 20.00' },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                  <span className="text-xl w-7 flex-shrink-0">{c.emoji}</span>
                  <span>{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="bg-[#1a3d5c] text-white py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Logo className="w-8 h-8" />
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
