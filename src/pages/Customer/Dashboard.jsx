// src/Pages/Customer/dashboard.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ── Logo ──────────────────────────────────────────────
const Logo = () => (
  <svg viewBox="0 0 200 200" className="w-9 h-9">
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

// ── Sidebar items ────────────────────────────────────
const navItems = [
  {
    label: 'Dashboard', path: '/customer/dashboard',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  },
  {
    label: 'Lacak Pesanan', path: '/customer/track',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  },
  {
    label: 'Riwayat Pesanan', path: '/customer/history',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  },
  {
    label: 'Notifikasi', path: '/customer/notifications',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  },
  {
    label: 'Chat Admin', path: '/customer/chat',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
  },
  {
    label: 'Profil Saya', path: '/customer/profile',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  },
];

// ── Order progress steps ────────────────────────────
const steps = [
  {
    label: 'Diterima',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    )
  },
  {
    label: 'Dicuci',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    )
  },
  {
    label: 'Disetrika',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
      </svg>
    )
  },
  {
    label: 'Siap Ambil',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    )
  },
];

// ── Dummy data ─────────────────────────────────────────
const activeOrders = [
  { nota: '#001', berat: '4Kg', layanan: 'Cuci Strika', total: 'Rp20.00', estimasi: '20 Juli, 10.20 WIB', step: 1 },
  { nota: '#001', berat: '4Kg', layanan: 'Cuci Strika', total: 'Rp20.00', estimasi: '20 Juli, 10.20 WIB', step: 2 },
];

const history = [
  { tanggal: '20 Jan', nota: 'Nota #001', layanan: 'Cuci Strika', total: 'Rp20.000', status: 'Selesai' },
  { tanggal: '10 Feb', nota: 'Nota #001', layanan: 'Cuci Strika', total: 'Rp20.000', status: 'Selesai' },
  { tanggal: '30 Feb', nota: 'Nota #001', layanan: 'Cuci Strika', total: 'Rp20.000', status: 'Selesai' },
  { tanggal: '20 Jan', nota: 'Nota #001', layanan: 'Cuci Strika', total: 'Rp20.000', status: 'Selesai' },
  { tanggal: '20 Jan', nota: 'Nota #001', layanan: 'Cuci Strika', total: 'Rp20.000', status: 'Selesai' },
  { tanggal: '10 Feb', nota: 'Nota #001', layanan: 'Cuci Strika', total: 'Rp20.000', status: 'Selesai' },
  { tanggal: '30 Feb', nota: 'Nota #001', layanan: 'Cuci Strika', total: 'Rp20.000', status: 'Selesai' },
  { tanggal: '20 Jan', nota: 'Nota #001', layanan: 'Cuci Strika', total: 'Rp20.000', status: 'Selesai' },
  { tanggal: '20 Jan', nota: 'Nota #001', layanan: 'Cuci Strika', total: 'Rp20.000', status: 'Selesai' },
  { tanggal: '20 Jan', nota: 'Nota #001', layanan: 'Cuci Strika', total: 'Rp20.000', status: 'Selesai' },
];

// ── Order Card ─────────────────────────────────────────
const OrderCard = ({ order }) => (
  <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
    <p className="text-sm font-semibold text-gray-700 mb-3">Pesanan : Nota {order.nota}</p>

    {/* Progress Steps */}
    <div className="flex items-center justify-between mb-4 px-2">
      {steps.map((s, i) => {
        const done = i <= order.step;
        const active = i === order.step;
        return (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition ${
              active  ? 'bg-[#5bbfe8] border-[#5bbfe8] text-white shadow-lg' :
              done    ? 'bg-[#eaf6fb] border-[#5bbfe8] text-[#5bbfe8]' :
                        'bg-gray-100 border-gray-200 text-gray-400'
            }`}>
              {s.icon}
            </div>
            {i < steps.length - 1 && (
              <div className={`hidden sm:block absolute`} />
            )}
            <span className="text-[10px] text-gray-500 text-center leading-tight">{s.label}</span>
          </div>
        );
      })}
    </div>

    {/* Divider */}
    <div className="border-t border-gray-100 pt-3 space-y-1 text-sm text-gray-600">
      <div className="flex gap-2"><span className="w-32 text-gray-400">Berat</span><span>: {order.berat}</span></div>
      <div className="flex gap-2"><span className="w-32 text-gray-400">Layanan</span><span>: {order.layanan}</span></div>
      <div className="flex gap-2"><span className="w-32 text-gray-400">Total Bayar</span><span>: {order.total}</span></div>
      <div className="flex gap-2"><span className="w-32 text-gray-400">Estimasi Selesai</span><span>: {order.estimasi}</span></div>
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────
export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const Sidebar = () => (
    <aside className={`
      fixed md:static inset-y-0 left-0 z-40 w-52 bg-[#1a3d5c] text-white flex flex-col
      transform transition-transform duration-200
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
    `}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-white/10">
        <Logo />
        <span className="font-bold text-lg">WashUp</span>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{user?.name || 'Alvin Farhan'}</p>
          <p className="text-xs text-blue-200 truncate">ID: {String(user?.id || '0001').padStart(4, '0')}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                active ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
              }`}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                {item.icon}
              </svg>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/10 transition border-t border-white/10">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
        Logout
      </button>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#eaf6fb] overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar />

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 bg-[#1a3d5c] text-white px-4 py-3">
          <button onClick={() => setSidebarOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold">WashUp</span>
        </div>

        <div className="p-6">
          {/* Greeting banner */}
          <div className="flex items-center gap-3 bg-[#5bbfe8] text-white rounded-xl px-5 py-4 mb-6 shadow">
            <div className="w-5 h-5 bg-white/30 rounded flex-shrink-0" />
            <h1 className="text-xl font-bold">Halo {user?.name || 'Alvin Farhan Adison'}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left — Active Orders */}
            <div>
              <h2 className="text-xl font-bold text-[#1a3d5c] mb-4">Dashboard Saya</h2>
              {activeOrders.map((order, i) => (
                <OrderCard key={i} order={order} />
              ))}
            </div>

            {/* Right — History */}
            <div>
              <h2 className="text-xl font-bold text-[#1a3d5c] mb-4">Riwayat</h2>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#5bbfe8] text-white">
                      {['Tanggal', 'Nota', 'Layanan', 'Total Bayar', 'Status'].map(h => (
                        <th key={h} className="px-3 py-3 text-left font-semibold text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2.5 text-gray-600 text-xs">{h.tanggal}</td>
                        <td className="px-3 py-2.5 text-gray-700 text-xs">{h.nota}</td>
                        <td className="px-3 py-2.5 text-gray-600 text-xs">{h.layanan}</td>
                        <td className="px-3 py-2.5 text-gray-700 text-xs font-medium">{h.total}</td>
                        <td className="px-3 py-2.5 text-xs">
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                            {h.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end px-4 py-3 border-t border-gray-100">
                  <button className="bg-[#5bbfe8] hover:bg-[#3aaad4] text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition">
                    Lihat Semua
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}