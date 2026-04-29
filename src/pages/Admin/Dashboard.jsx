// src/Pages/Admin/dashboard.jsx
import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { useAuth } from "../../context/AuthContext";

// ── Dummy data ────────────────────────────────────────
const chartData = [
  { day: "Sen", val: 300000 },
  { day: "Sel", val: 380000 },
  { day: "Rab", val: 350000 },
  { day: "Kam", val: 420000 },
  { day: "Jum", val: 390000 },
  { day: "Sab", val: 510000 },
  { day: "Min", val: 500000 },
];

const transactions = [
  { no: 1, nota: "17081945", nama: "Hamba Allah",  berat: "10Kg", pengambilan: "17 Januari 1983",  status: "Sedang Dicuci" },
  { no: 2, nota: "31122023", nama: "Alan Cooper",  berat: "3Kg",  pengambilan: "6 Oktober 2010",   status: "Siap Diambil"  },
  { no: 3, nota: "01072006", nama: "Steve Krug",   berat: "1Kg",  pengambilan: "7 Juni 2012",      status: "Selesai"       },
  { no: 4, nota: "15081945", nama: "Jeff Gothelf", berat: "3Kg",  pengambilan: "1 Oktober 2015",   status: "Dibatalkan"    },
  { no: 5, nota: "24682468", nama: "Jared Spool",  berat: "9Kg",  pengambilan: "12 November 2020", status: "Sedang Dicuci" },
  { no: 6, nota: "13571357", nama: "Khoi Vinh",    berat: "5Kg",  pengambilan: "5 Oktober 2021",   status: "Dibatalkan"    },
  { no: 7, nota: "12344321", nama: "Brad Frost",   berat: "7Kg",  pengambilan: "8 Juni 2022",      status: "Selesai"       },
];

const statusStyle = {
  "Sedang Dicuci": "bg-yellow-100 text-yellow-700",
  "Siap Diambil":  "bg-blue-100  text-blue-700",
  "Selesai":       "bg-green-100 text-green-700",
  "Dibatalkan":    "bg-red-100   text-red-700",
};

// ── Bar Chart ─────────────────────────────────────────
function BarChart() {
  const max = Math.max(...chartData.map((d) => d.val));
  const [tooltip, setTooltip] = useState(null);

  return (
    <div className="flex items-end gap-2 h-36 pt-2">
      {chartData.map((d, i) => (
        <div
          key={i}
          className="flex flex-col items-center flex-1 gap-1 relative"
          onMouseEnter={() => setTooltip(i)}
          onMouseLeave={() => setTooltip(null)}
        >
          {tooltip === i && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0077b6] text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 shadow">
              Rp {(d.val / 1000).toFixed(0)}k
            </div>
          )}
          <div
            className="w-full bg-[#0077b6] hover:bg-[#0EA5E0] rounded-t transition-colors cursor-pointer"
            style={{ height: `${(d.val / max) * 120}px` }}
          />
          <span className="text-xs text-gray-500">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────
export default function AdminDashboard() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState(1);

  return (
    <div className="flex h-screen bg-[#eaf6fb] overflow-hidden font-sans">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto p-6 pt-16 md:pt-6">

        {/* Greeting */}
        <div className="flex items-center gap-3 bg-[#0077b6] text-white rounded-xl px-5 py-4 mb-6 shadow">
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
          <h1 className="text-xl font-bold">Halo Admin</h1>
        </div>

        {/* Chart + Status Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Grafik Pendapatan Mingguan
            </p>
            <BarChart />
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "TOTAL ORDER HARI INI", value: "50",             highlight: true  },
              { label: "CUCIAN PROSES",         value: "25",             highlight: false },
              { label: "SELESAI",               value: "25",             highlight: false },
              { label: "OMZET HARI INI",        value: "Rp 500.000,00", highlight: false, big: true },
            ].map((card, i) => (
              <div
                key={i}
                className={`rounded-xl p-4 shadow-sm border ${
                  card.highlight
                    ? "border-[#0077b6] bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-tight mb-1">
                  {card.label}
                </p>
                <p className={`font-bold text-[#0077b6] ${card.big ? "text-base" : "text-2xl"}`}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#0077b6]">Tabel Transaksi Terbaru</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0077b6] text-white">
                  {["No", "NOTA", "Nama", "Berat", "Pengambilan", "Status", "Aksi"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 text-gray-600">{t.no}</td>
                    <td className="px-4 py-3 font-mono text-gray-700">{t.nota}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{t.nama}</td>
                    <td className="px-4 py-3 text-gray-600">{t.berat}</td>
                    <td className="px-4 py-3 text-gray-600">{t.pengambilan}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyle[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                        <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition">
                          <svg className="w-4 h-4 text-[#0077b6]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
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
            {[1, 2, 3, 4, 5].map((p) => (
              <button
                key={p}
                onClick={() => setActivePage(p)}
                className={`w-8 h-8 text-sm rounded transition ${
                  activePage === p
                    ? "bg-[#0077b6] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition">Selanjutnya</button>
          </div>
        </div>
      </main>
    </div>
  );
}