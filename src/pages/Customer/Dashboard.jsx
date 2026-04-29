// src/Pages/Customer/dashboard.jsx
import CustomerSidebar from "../../components/CustomerSidebar";
import { useAuth } from "../../context/AuthContext";

// ── Order progress steps ──────────────────────────────
const steps = [
  {
    label: "Diterima",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
      </svg>
    ),
  },
  {
    label: "Dicuci",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    label: "Disetrika",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
      </svg>
    ),
  },
  {
    label: "Siap Ambil",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
];

// ── Dummy data ────────────────────────────────────────
const activeOrders = [
  { nota: "#001", berat: "4Kg", layanan: "Cuci Strika", total: "Rp20.000", estimasi: "20 Juli, 10.20 WIB", step: 1 },
  { nota: "#002", berat: "4Kg", layanan: "Cuci Strika", total: "Rp20.000", estimasi: "20 Juli, 10.20 WIB", step: 2 },
];

const history = [
  { tanggal: "20 Jan", nota: "Nota #001", layanan: "Cuci Strika", total: "Rp20.000", status: "Selesai" },
  { tanggal: "10 Feb", nota: "Nota #001", layanan: "Cuci Strika", total: "Rp20.000", status: "Selesai" },
  { tanggal: "30 Mar", nota: "Nota #001", layanan: "Cuci Strika", total: "Rp20.000", status: "Selesai" },
  { tanggal: "20 Apr", nota: "Nota #001", layanan: "Cuci Strika", total: "Rp20.000", status: "Selesai" },
  { tanggal: "05 Mei", nota: "Nota #001", layanan: "Cuci Strika", total: "Rp20.000", status: "Selesai" },
  { tanggal: "10 Jun", nota: "Nota #001", layanan: "Cuci Strika", total: "Rp20.000", status: "Selesai" },
  { tanggal: "15 Jul", nota: "Nota #001", layanan: "Cuci Strika", total: "Rp20.000", status: "Selesai" },
  { tanggal: "20 Agu", nota: "Nota #001", layanan: "Cuci Strika", total: "Rp20.000", status: "Selesai" },
  { tanggal: "25 Sep", nota: "Nota #001", layanan: "Cuci Strika", total: "Rp20.000", status: "Selesai" },
  { tanggal: "30 Okt", nota: "Nota #001", layanan: "Cuci Strika", total: "Rp20.000", status: "Selesai" },
];

// ── Order Card ────────────────────────────────────────
function OrderCard({ order }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
      <p className="text-sm font-semibold text-gray-700 mb-3">
        Pesanan : Nota {order.nota}
      </p>

      {/* Progress Steps */}
      <div className="flex items-start justify-between mb-4">
        {steps.map((s, i) => {
          const done   = i <  order.step;
          const active = i === order.step;
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1 relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className={`absolute top-6 left-1/2 w-full h-0.5 ${
                    done ? "bg-[#0077b6]" : "bg-gray-200"
                  }`}
                />
              )}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 z-10 transition ${
                  active
                    ? "bg-[#0077b6] border-[#0077b6] text-white shadow-lg"
                    : done
                    ? "bg-[#dbeafe] border-[#0077b6] text-[#0077b6]"
                    : "bg-gray-100 border-gray-200 text-gray-400"
                }`}
              >
                {s.icon}
              </div>
              <span className="text-[10px] text-gray-500 text-center leading-tight mt-1">
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Order Details */}
      <div className="border-t border-gray-100 pt-3 space-y-1 text-sm text-gray-600">
        <div className="flex">
          <span className="w-36 text-gray-400">Berat</span>
          <span>: {order.berat}</span>
        </div>
        <div className="flex">
          <span className="w-36 text-gray-400">Layanan</span>
          <span>: {order.layanan}</span>
        </div>
        <div className="flex">
          <span className="w-36 text-gray-400">Total Bayar</span>
          <span>: {order.total}</span>
        </div>
        <div className="flex">
          <span className="w-36 text-gray-400">Estimasi Selesai</span>
          <span>: {order.estimasi}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────
export default function CustomerDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-[#eaf6fb] overflow-hidden font-sans">
      <CustomerSidebar />

      <main className="flex-1 overflow-y-auto p-6 pt-16 md:pt-6">

        {/* Greeting */}
        <div className="flex items-center gap-3 bg-[#0077b6] text-white rounded-xl px-5 py-4 mb-6 shadow">
          <div className="w-5 h-5 bg-white/30 rounded flex-shrink-0" />
          <h1 className="text-xl font-bold">
            Halo {user?.name || "Alvin Farhan Adison"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Orders */}
          <div>
            <h2 className="text-xl font-bold text-[#0077b6] mb-4">Dashboard Saya</h2>
            {activeOrders.map((order, i) => (
              <OrderCard key={i} order={order} />
            ))}
          </div>

          {/* History */}
          <div>
            <h2 className="text-xl font-bold text-[#0077b6] mb-4">Riwayat</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0077b6] text-white">
                    {["Tanggal", "Nota", "Layanan", "Total Bayar", "Status"].map((h) => (
                      <th key={h} className="px-3 py-3 text-left font-semibold text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-3 py-2.5 text-gray-500 text-xs">{h.tanggal}</td>
                      <td className="px-3 py-2.5 text-gray-700 text-xs">{h.nota}</td>
                      <td className="px-3 py-2.5 text-gray-500 text-xs">{h.layanan}</td>
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
                <button className="bg-[#0077b6] hover:bg-[#0369A1] text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition">
                  Lihat Semua
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}