// src/Pages/Admin/dashboard.jsx
import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { useAuth } from "../../context/AuthContext";
import { Printer, Trash2, Eye, ShoppingBag, Clock, CheckCircle2, TrendingUp } from "lucide-react";

// ─── DATA DUMMY ───────────────────────────────────────────────────────────────
const transaksiData = [
    { id: 1, nota: "17081945", nama: "Hamba Allah",  berat: "10Kg", tgl: "17 Januari 1983",  status: "Sedang Dicuci",  layanan: "Cuci Kering",  totalHarga: "Rp 70.000", estimasi: "18 Januari 1983",  items: [{ item: "Kiloan", jumlah: "10kg", harga: "Rp7.000", sub: "Rp70.000" }], timeline: ["Order di terima", "Sedang Di Pilah", "Sedang Di cuci", null] },
    { id: 2, nota: "31122023", nama: "Alan Cooper",  berat: "4Kg",  tgl: "6 Oktober 2010",  status: "Sedang Dicuci",  layanan: "Cuci Setrika",  totalHarga: "Rp 88.000", estimasi: "6 Oktober 2010",   items: [{ item: "Kiloan", jumlah: "4kg", harga: "Rp7.000", sub: "Rp28.000" }, { item: "Selimut", jumlah: "1x", harga: "Rp20.000", sub: "Rp20.000" }, { item: "Bedcover", jumlah: "1x", harga: "Rp30.000", sub: "Rp30.000" }, { item: "Pelembut", jumlah: "1x", harga: "Rp5.000", sub: "Rp5.000" }, { item: "Sabun", jumlah: "1x", harga: "Rp5.000", sub: "Rp5.000" }], timeline: ["Order di terima", "Sedang Di Pilah", "Sedang Di cuci", null] },
    { id: 3, nota: "01072006", nama: "Steve Krug",   berat: "1Kg",  tgl: "7 Juni 2012",     status: "Selesai",        layanan: "Cuci Kering",  totalHarga: "Rp 7.000",  estimasi: "8 Juni 2012",      items: [{ item: "Kiloan", jumlah: "1kg", harga: "Rp7.000", sub: "Rp7.000" }], timeline: ["Order di terima", "Sedang Di Pilah", "Sedang Di cuci", "Siap Di ambil"] },
    { id: 4, nota: "15081945", nama: "Jeff Gothelf", berat: "3Kg",  tgl: "1 Oktober 2015",  status: "Dibatalkan",     layanan: "Cuci Setrika",  totalHarga: "Rp 21.000", estimasi: "2 Oktober 2015",   items: [{ item: "Kiloan", jumlah: "3kg", harga: "Rp7.000", sub: "Rp21.000" }], timeline: ["Order di terima", null, null, null] },
    { id: 5, nota: "24682468", nama: "Jared Spool",  berat: "9Kg",  tgl: "12 November 2020", status: "Sedang Dicuci",  layanan: "Cuci Kering",  totalHarga: "Rp 63.000", estimasi: "13 November 2020", items: [{ item: "Kiloan", jumlah: "9kg", harga: "Rp7.000", sub: "Rp63.000" }], timeline: ["Order di terima", "Sedang Di Pilah", "Sedang Di cuci", null] },
    { id: 6, nota: "13571357", nama: "Khoi Vinh",    berat: "5Kg",  tgl: "5 Oktober 2021",  status: "Dibatalkan",     layanan: "Cuci Kering",   totalHarga: "Rp 35.000", estimasi: "6 Oktober 2021",   items: [{ item: "Kiloan", jumlah: "5kg", harga: "Rp7.000", sub: "Rp35.000" }], timeline: ["Order di terima", null, null, null] },
    { id: 7, nota: "12344321", nama: "Brad Frost",   berat: "7Kg",  tgl: "8 Juni 2022",     status: "Selesai",        layanan: "Cuci Setrika",  totalHarga: "Rp 49.000", estimasi: "9 Juni 2022",      items: [{ item: "Kiloan", jumlah: "7kg", harga: "Rp7.000", sub: "Rp49.000" }], timeline: ["Order di terima", "Sedang Di Pilah", "Sedang Di cuci", "Siap Di ambil"] },
];

const weeklyData = [300000, 420000, 380000, 450000, 500000, 480000, 500000];
const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

// ─── HELPER ───────────────────────────────────────────────────────────────────
function statusColor(status) {
    const map = {
        "Sedang Dicuci": "bg-[#fdf0d5] text-yellow-800",
        "Siap Diambil":  "bg-[#caf0f8] text-cyan-800",
        "Selesai":       "bg-[#d8f3dc] text-green-800",
        "Dibatalkan":    "bg-[#ffddd2] text-red-800",
    };
    return map[status] ?? "bg-gray-100 text-gray-700";
}

// ─── LINE CHART SVG ───────────────────────────────────────────────────────────
function LineChart() {
    const W = 560, H = 220, padL = 60, padB = 10, padT = 10, padR = 20;
    const drawW = W - padL - padR;
    const drawH = H - padB - padT;
    const maxVal = 600000;
    const yTicks = [0, 100000, 200000, 300000, 400000, 500000, 600000];

    const x = (i) => padL + (i / (weeklyData.length - 1)) * drawW;
    const y = (v) => padT + drawH - (v / maxVal) * drawH;

    const polyline = weeklyData.map((v, i) => `${x(i)},${y(v)}`).join(" ");
    const area = `${x(0)},${y(0)} ${polyline} ${x(weeklyData.length - 1)},${y(0)}`;

    const [tooltip, setTooltip] = useState(null);

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
                {yTicks.map((t) => (
                    <g key={t}>
                        <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="#e5e7eb" strokeWidth="1" />
                        <text x={padL - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                            {t === 0 ? "0" : `${t / 1000}k`}
                        </text>
                    </g>
                ))}
                <text x={10} y={H / 2} textAnchor="middle" fontSize="10" fill="#6b7280" transform={`rotate(-90, 10, ${H / 2})`}>
                    Pendapatan (Rp)
                </text>
                <polygon points={area} fill="#00b4d8" fillOpacity="0.08" />
                <polyline points={polyline} fill="none" stroke="#0077b6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                {weeklyData.map((v, i) => (
                    <g key={i}
                        onMouseEnter={() => setTooltip({ i, v })}
                        onMouseLeave={() => setTooltip(null)}
                        style={{ cursor: "pointer" }}
                    >
                        <circle cx={x(i)} cy={y(v)} r="10" fill="transparent" />
                        <circle cx={x(i)} cy={y(v)} r="5" fill="white" stroke="#0077b6" strokeWidth="2.5" />
                    </g>
                ))}
                {tooltip && (() => {
                    const tx = x(tooltip.i);
                    const ty = y(tooltip.v);
                    const label = `${days[tooltip.i]}, Rp ${tooltip.v.toLocaleString("id-ID")},00`;
                    const boxW = 130, boxH = 28;
                    const bx = Math.min(tx - boxW / 2, W - padR - boxW);
                    return (
                        <g>
                            <rect x={bx} y={ty - 36} width={boxW} height={boxH} rx="6" fill="white" stroke="#d1d5db" strokeWidth="1" />
                            <text x={bx + boxW / 2} y={ty - 18} textAnchor="middle" fontSize="10" fill="#111827" fontWeight="600">{label}</text>
                        </g>
                    );
                })()}
            </svg>
        </div>
    );
}

// ─── STATUS CARD ──────────────────────────────────────────────────────────────
function StatusCard({ title, value, borderColor, isCurrency, icon: Icon }) {
    return (
        <div className={`bg-white border-2 border-black rounded-xl overflow-hidden flex flex-col shadow-[3px_3px_0px_0px_rgba(0,0,0,0.12)] relative border-b-[6px] ${borderColor}`}>
            {/* Ikon di pojok kanan atas */}
            <div className="absolute top-3 right-3 text-gray-400 opacity-60">
                {Icon && <Icon size={24} />}
            </div>
            <div className="flex-1 px-4 py-3 z-10">
                <p className="text-[10px] font-black leading-tight text-gray-500 uppercase tracking-tighter mb-1 pr-6">{title}</p>
                <p className={`font-black text-gray-900 ${isCurrency ? "text-lg leading-tight" : "text-3xl"}`}>{value}</p>
            </div>
        </div>
    );
}

// ─── MODAL KONFIRMASI HAPUS ───────────────────────────────────────────────────
function ConfirmDeleteModal({ onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 max-w-sm w-full mx-4 text-center border border-gray-200">
                <p className="text-2xl font-black text-gray-900 mb-8">Apakah anda yakin menghapus ini?</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 rounded-full border-2 border-red-500 text-red-500 font-bold hover:bg-red-50 transition-colors"
                    >
                        Hapus
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 rounded-full border-2 border-[#00b4d8] text-[#00b4d8] font-bold hover:bg-cyan-50 transition-colors"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── TIMELINE STATUS ──────────────────────────────────────────────────────────
const timelineSteps = [
    { label: "Order di terima",  sub: "6 Oktober 10.30" },
    { label: "Sedang Di Pilah",  sub: "6 Oktober 12.30" },
    { label: "Sedang Di cuci",   sub: "Sedang Berjalan" },
    { label: "Siap Di ambil",    sub: "Belum Terjadi" },
];

function Timeline({ activeSteps }) {
    return (
        <div className="flex flex-col gap-0">
            {timelineSteps.map((step, i) => {
                const done = activeSteps.includes(step.label);
                const current = done && (i === activeSteps.length - 1 || !activeSteps.includes(timelineSteps[i + 1]?.label));
                return (
                    <div key={i} className="flex items-start gap-3 relative">
                        {i < timelineSteps.length - 1 && (
                            <div className={`absolute left-[10px] top-5 w-0.5 h-10 ${done && activeSteps.includes(timelineSteps[i + 1]?.label) ? "bg-green-500" : "bg-gray-200"}`} />
                        )}
                        <div className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center z-10
                            ${done
                                ? current
                                    ? "bg-[#00b4d8] border-[#00b4d8]"
                                    : "bg-green-500 border-green-500"
                                : "bg-white border-gray-300"}`}
                        >
                            {done && !current && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div className="pb-8">
                            <p className={`text-sm font-bold ${done ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                            <p className={`text-xs ${done ? "text-gray-500" : "text-gray-300"}`}>{step.sub}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── MODAL DETAIL TRANSAKSI ───────────────────────────────────────────────────
function DetailModal({ row, onClose, onDelete }) {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const totalNum = row.items.reduce((acc, it) => {
        const n = parseInt(it.sub.replace(/[^0-9]/g, ""), 10);
        return acc + (isNaN(n) ? 0 : n);
    }, 0);

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 p-8 relative border border-gray-200">
                {showConfirmDelete && (
                    <ConfirmDeleteModal
                        onConfirm={() => { setShowConfirmDelete(false); onDelete(row.id); onClose(); }}
                        onCancel={() => setShowConfirmDelete(false)}
                    />
                )}
                <div className="flex gap-8">
                    <div className="flex-1">
                        <h2 className="text-2xl font-black text-gray-900 mb-4">Detail Transaksi</h2>
                        {[
                            ["Nota",            row.nota],
                            ["Layanan",         row.layanan],
                            ["Tanggal Order",   row.tgl],
                            ["Nama",            row.nama],
                            ["Total Berat",     row.berat],
                            ["Total Harga",     row.totalHarga],
                            ["Estimasi Selesai",row.estimasi],
                        ].map(([k, v]) => (
                            <div key={k} className="flex text-sm mb-1">
                                <span className="w-36 text-gray-700 font-medium">{k}</span>
                                <span className="mr-2 text-gray-500">:</span>
                                <span className="font-semibold text-gray-900">{v}</span>
                            </div>
                        ))}

                        {/* Tabel Item Seragam */}
                        <div className="mt-3 rounded-lg overflow-hidden border border-black">
                            <table className="w-full text-sm text-left border-collapse border border-black">
                                <thead>
                                    <tr className="bg-[#00b4d8] text-white">
                                        <th className="px-3 py-2 font-semibold border border-black">Item</th>
                                        <th className="px-3 py-2 font-semibold border border-black text-right">Jumlah</th>
                                        <th className="px-3 py-2 font-semibold border border-black text-right">Harga satuan</th>
                                        <th className="px-3 py-2 font-semibold border border-black text-right">Sub Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {row.items.map((it, i) => (
                                        <tr key={i} className={`transition hover:bg-blue-100/50 ${i % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}`}>
                                            <td className="px-3 py-1.5 text-gray-800 border border-black">{it.item}</td>
                                            <td className="px-3 py-1.5 text-gray-800 border border-black text-right">{it.jumlah}</td>
                                            <td className="px-3 py-1.5 text-gray-800 border border-black text-right">{it.harga}</td>
                                            <td className="px-3 py-1.5 text-gray-800 border border-black text-right font-medium">{it.sub}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50">
                                        <td colSpan={3} className="px-3 py-1.5 font-bold text-gray-800 border border-black text-right">Total</td>
                                        <td className="px-3 py-1.5 font-bold text-[#0077b6] border border-black text-right">
                                            Rp{totalNum.toLocaleString("id-ID")}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between mt-4">
                            <div className="flex gap-2">
                                <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border-2 border-gray-400 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors">
                                    <Printer size={14} /> Cetak
                                </button>
                                <button
                                    onClick={() => setShowConfirmDelete(true)}
                                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border-2 border-red-400 text-red-500 text-sm font-bold hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={14} /> Hapus
                                </button>
                            </div>
                            <button
                                onClick={onClose}
                                className="px-4 py-1.5 rounded-lg border-2 border-[#00b4d8] text-[#00b4d8] text-sm font-bold hover:bg-cyan-50 transition-colors"
                            >
                                Kembali
                            </button>
                        </div>
                    </div>
                    <div className="w-52 flex-shrink-0">
                        <div className="mb-4">
                            <span className="text-sm font-bold text-gray-700">Status : </span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor(row.status)}`}>
                                {row.status}
                            </span>
                        </div>
                        <Timeline activeSteps={row.timeline.filter(Boolean)} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── TABLE ROW ────────────────────────────────────────────────────────────────
function TableRow({ row, no, idx, onDelete, onDetail }) {
    return (
        <tr className={`transition hover:bg-blue-100/50 ${idx % 2 === 1 ? "bg-[#eaf6fb]" : "bg-white"}`}>
            <td className="p-3 text-center border border-black text-sm">{no}</td>
            <td className="p-3 text-center border border-black text-sm font-mono">{row.nota}</td>
            <td className="p-3 text-center border border-black text-sm font-medium">{row.nama}</td>
            <td className="p-3 text-center border border-black text-sm">{row.berat}</td>
            <td className="p-3 text-center border border-black text-sm">{row.tgl}</td>
            <td className="p-3 text-center border border-black text-center">
                <span className={`px-3 py-1 rounded-md text-[11px] font-bold inline-block ${statusColor(row.status)}`}>
                    {row.status}
                </span>
            </td>
            <td className="p-3 border border-black">
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => onDelete(row)}
                        className="bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600 transition-colors"
                        title="Hapus"
                    >
                        <Trash2 size={15} />
                    </button>
                    <button
                        onClick={() => onDetail(row)}
                        className="bg-[#00b4d8] text-white p-1.5 rounded-md hover:bg-[#0096c7] transition-colors"
                        title="Detail"
                    >
                        <Eye size={15} />
                    </button>
                </div>
            </td>
        </tr>
    );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard() {
    const [data, setData] = useState(transaksiData);
    const [page, setPage] = useState(1);
    const perPage = 7;
    const totalPages = Math.ceil(data.length / perPage);
    const pageData = data.slice((page - 1) * perPage, page * perPage);

    const [confirmDelete, setConfirmDelete] = useState(null);
    const [detailRow, setDetailRow]         = useState(null);

    const handleDelete = (id) => {
        setData((prev) => prev.filter((r) => r.id !== id));
        setConfirmDelete(null);
    };

    return (
        <AdminSidebar>
            {confirmDelete && (
                <ConfirmDeleteModal
                    onConfirm={() => handleDelete(confirmDelete.id)}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}

            {detailRow && (
                <DetailModal
                    row={detailRow}
                    onClose={() => setDetailRow(null)}
                    onDetail={(r) => setDetailRow(r)}
                    onDelete={(id) => { handleDelete(id); setDetailRow(null); }}
                />
            )}

            {/* Greeting */}
            <div className="flex items-center gap-3 bg-[#0077b6] text-white rounded-xl px-5 py-4 mb-6 shadow w-full">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              <h1 className="text-xl font-bold">Halo Admin</h1>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-8 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="font-extrabold text-gray-800 text-sm uppercase tracking-wide mb-3">
                            Grafik Pendapatan Mingguan
                        </h2>
                        <LineChart />
                        <div className="flex justify-between px-14 mt-1 text-xs font-bold text-gray-500 uppercase">
                            {days.map((d) => <span key={d}>{d}</span>)}
                        </div>
                    </div>

                    <div className="col-span-4 flex flex-col gap-3">
                        <p className="font-extrabold text-gray-800 text-sm uppercase tracking-wide">Status Cards</p>
                        <div className="grid grid-cols-2 gap-3 flex-1">
                            <StatusCard title="TOTAL ORDER HARI INI" value="50" borderColor="border-b-[#00b4d8]" icon={ShoppingBag} />
                            <StatusCard title="CUCIAN PROSES"        value="25" borderColor="border-b-[#f9a826]" icon={Clock} />
                            <StatusCard title="SELESAI"              value="25" borderColor="border-b-[#2a9d8f]" icon={CheckCircle2} />
                            <StatusCard title="OMZET HARI INI"       value="Rp 500.000" borderColor="border-b-[#E67E22]" isCurrency icon={TrendingUp} />
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM: Tabel Transaksi ── */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-black">
                    <h2 className="font-extrabold text-gray-800 mb-5 text-sm">Tabel Transaksi Terbaru</h2>

                    <div className="overflow-hidden rounded-lg border border-black">
                        <table className="w-full text-left border-collapse border border-black">
                            <thead>
                                <tr className="bg-[#0077b6] text-white text-sm">
                                    {["No", "NOTA", "Nama", "Berat", "Pengambilan", "Status", "Aksi"].map((h) => (
                                        <th key={h} className={`p-3 font-semibold border border-black ${h === "No" || h === "Aksi" ? "text-center w-14" : "text-center"}`}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {pageData.map((row, i) => (
                                    <TableRow
                                        key={row.id}
                                        row={row}
                                        no={(page - 1) * perPage + i + 1}
                                        idx={i}
                                        onDelete={(r) => setConfirmDelete(r)}
                                        onDetail={(r) => setDetailRow(r)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-end mt-4 gap-1 items-center">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                        >
                            Sebelumnya
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                            <button
                                key={n}
                                onClick={() => setPage(n)}
                                className={`px-3 py-1 rounded text-xs font-bold border transition-colors
                                    ${n === page
                                        ? "bg-[#00b4d8] text-white border-[#00b4d8]"
                                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                {n}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                        >
                            Selanjutnya
                        </button>
                    </div>
                </div>
            </div>
        </AdminSidebar>
    );
}