// src/Pages/Admin/dashboard.jsx
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

// ── Sidebar nav items ──────────────────────────────────
const navItems = [
  {
    label: 'Dashboard', path: '/admin/dashboard',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  },
  {
    label: 'New Transaction', path: '/admin/new-transaction',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  },
  {
    label: 'Order List', path: '/admin/orders',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  },
  {
    label: 'Customer Data', path: '/admin/customers',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  },
  {
    label: 'Notifikasi', path: '/admin/notifications',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  },
  {
    label: 'Chat Customer', path: '/admin/chat',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
  },
  {
    label: 'Financial Reports', path: '/admin/reports',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  },
  {
    label: 'Price Setting', path: '/admin/price',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
  },
];

// ── Dummy chart data ──────────────────────────────────
const chartData = [
  { day: 'Sen', val: 300000 },
  { day: 'Sel', val: 380000 },
  { day: 'Rab', val: 350000 },
  { day: 'Kam', val: 420000 },
  { day: 'Jum', val: 390000 },
  { day: 'Sab', val: 510000 },
  { day: 'Min', val: 500000 },
];

const transactions = [
  { no: 1, nota: '17081945', nama: 'Hamba Allah',  berat: '10Kg', pengambilan: '17 Januari 1983',   status: 'Sedang Dicuci' },
  { no: 2, nota: '31122023', nama: 'Alan Cooper',  berat: '3Kg',  pengambilan: '6 Oktober 2010',    status: 'Siap Diambil' },
  { no: 3, nota: '01072006', nama: 'Steve Krug',   berat: '1Kg',  pengambilan: '7 Juni 2012',       status: 'Selesai' },
  { no: 4, nota: '15081945', nama: 'Jeff Gothelf', berat: '3Kg',  pengambilan: '1 Oktober 2015',    status: 'Dibatalkan' },
  { no: 5, nota: '24682468', nama: 'Jared Spool',  berat: '9Kg',  pengambilan: '12 November 2020',  status: 'Sedang Dicuci' },
  { no: 6, nota: '13571357', nama: 'Khoi Vinh',    berat: '5Kg',  pengambilan: '5 Oktober 2021',    status: 'Dibatalkan' },
  { no: 7, nota: '12344321', nama: 'Brad Frost',   berat: '7Kg',  pengambilan: '8 Juni 2022',       status: 'Selesai' },
];

const statusColor = {
  'Sedang Dicuci': 'bg-yellow-100 text-yellow-700',
  'Siap Diambil':  'bg-blue-100 text-blue-700',
  'Selesai':       'bg-green-100 text-green-700',
  'Dibatalkan':    'bg-red-100 text-red-700',
};

// ── Mini Bar Chart ────────────────────────────────────
const Chart = () => {
  const max = Math.max(...chartData.map(d => d.val));
  const [tooltip, setTooltip] = useState(null);

  return (
    <div className="relative">
      <div className="flex items-end gap-2 h-32">
        {chartData.map((d, i) => (
          <div key={i} className="flex flex-col items-center flex-1 gap-1"
            onMouseEnter={() => setTooltip(i)} onMouseLeave={() => setTooltip(null)}>
            <div className="relative w-full">
              {tooltip === i && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a3d5c] text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  Rp {(d.val / 1000).toFixed(0)}k
                </div>
              )}
              <div
                className="w-full bg-[#5bbfe8] rounded-t hover:bg-[#3aaad4] transition cursor-pointer"
                style={{ height: `${(d.val / max) * 100}px` }}
              />
            </div>
            <span className="text-xs text-gray-500">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────
export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState(1);

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
          <p className="font-semibold text-sm truncate">ADMIN</p>
          <p className="text-xs text-blue-200 truncate">Admin</p>
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
      {/* Sidebar overlay (mobile) */}
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
          <span className="font-bold">WashUp Admin</span>
        </div>

        <div className="p-6">
          {/* Greeting banner */}
          <div className="flex items-center gap-3 bg-[#5bbfe8] text-white rounded-xl px-5 py-4 mb-6 shadow">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            <h1 className="text-xl font-bold">Halo Admin</h1>
          </div>

          {/* Chart + Status Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Grafik Pendapatan Mingguan
              </p>
              <Chart />
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'TOTAL ORDER HARI INI', value: '50',              highlight: true },
                { label: 'CUCIAN PROSES',         value: '25',              highlight: false },
                { label: 'SELESAI',               value: '25',              highlight: false },
                { label: 'OMZET HARI INI',        value: 'Rp 500.000,00',  highlight: false, big: true },
              ].map((card, i) => (
                <div key={i} className={`rounded-xl p-4 shadow-sm border ${
                  card.highlight ? 'border-[#5bbfe8] bg-blue-50' : 'border-gray-200 bg-white'
                }`}>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-tight mb-1">
                    {card.label}
                  </p>
                  <p className={`font-bold text-[#1a3d5c] ${card.big ? 'text-base' : 'text-2xl'}`}>
                    {card.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1a3d5c]">Tabel Transaksi Terbaru</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#5bbfe8] text-white">
                    {['No', 'NOTA', 'Nama', 'Berat', 'Pengambilan', 'Status', 'Aksi'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-gray-600">{t.no}</td>
                      <td className="px-4 py-3 font-mono text-gray-700">{t.nota}</td>
                      <td className="px-4 py-3 text-gray-800 font-medium">{t.nama}</td>
                      <td className="px-4 py-3 text-gray-600">{t.berat}</td>
                      <td className="px-4 py-3 text-gray-600">{t.pengambilan}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[t.status]}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {/* Delete */}
                          <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                          {/* View */}
                          <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition">
                            <svg className="w-4 h-4 text-[#5bbfe8]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end items-center gap-1 px-5 py-4 border-t border-gray-100">
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition">Sebelumnya</button>
              {[1,2,3,4,5].map(p => (
                <button key={p} onClick={() => setActivePage(p)}
                  className={`w-8 h-8 text-sm rounded transition ${
                    activePage === p ? 'bg-[#5bbfe8] text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                  {p}
                </button>
              ))}
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition">Selanjutnya</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}