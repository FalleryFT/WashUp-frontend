// src/Pages/Admin/dashboard.jsx
import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { useAuth } from "../../context/AuthContext";
import { Printer, Trash2, Eye, ShoppingBag, Clock, CheckCircle2, TrendingUp, ChevronLeft, ChevronRight, X, Search } from "lucide-react";

// ─── DATA DUMMY ───────────────────────────────────────────────────────────────
const transaksiData = [
    { id: 1, nota: "17081945", nama: "Hamba Allah", tipe: "Member", berat: "10Kg", tgl: "17 Januari 1983", status: "Sedang Dicuci", layanan: "Cuci Kering", totalHarga: "Rp 70.000", estimasi: "18 Januari 1983", items: [{ item: "Kiloan", jumlah: "10kg", harga: "Rp7.000", sub: "Rp70.000" }], timeline: ["Order di terima", "Sedang Di Pilah", "Sedang Di cuci", null] },
    { id: 2, nota: "31122023", nama: "Alan Cooper", tipe: "Member", berat: "4Kg", tgl: "6 Oktober 2010", status: "Sedang Dicuci", layanan: "Cuci Setrika", totalHarga: "Rp 88.000", estimasi: "6 Oktober 2010", items: [{ item: "Kiloan", jumlah: "4kg", harga: "Rp7.000", sub: "Rp28.000" }, { item: "Selimut", jumlah: "1x", harga: "Rp20.000", sub: "Rp20.000" }, { item: "Bedcover", jumlah: "1x", harga: "Rp30.000", sub: "Rp30.000" }, { item: "Pelembut", jumlah: "1x", harga: "Rp5.000", sub: "Rp5.000" }, { item: "Sabun", jumlah: "1x", harga: "Rp5.000", sub: "Rp5.000" }], timeline: ["Order di terima", "Sedang Di Pilah", "Sedang Di cuci", null] },
    { id: 3, nota: "01072006", nama: "Steve Krug", tipe: "Non-Member", berat: "1Kg", tgl: "7 Juni 2012", status: "Selesai", layanan: "Cuci Kering", totalHarga: "Rp 7.000", estimasi: "8 Juni 2012", items: [{ item: "Kiloan", jumlah: "1kg", harga: "Rp7.000", sub: "Rp7.000" }], timeline: ["Order di terima", "Sedang Di Pilah", "Sedang Di cuci", "Siap Di ambil"] },
    { id: 4, nota: "15081945", nama: "Jeff Gothelf", tipe: "Non-Member", berat: "3Kg", tgl: "1 Oktober 2015", status: "Dibatalkan", layanan: "Cuci Setrika", totalHarga: "Rp 21.000", estimasi: "2 Oktober 2015", items: [{ item: "Kiloan", jumlah: "3kg", harga: "Rp7.000", sub: "Rp21.000" }], timeline: ["Order di terima", null, null, null] },
    { id: 5, nota: "24682468", nama: "Jared Spool", tipe: "Member", berat: "9Kg", tgl: "12 November 2020", status: "Sedang Dicuci", layanan: "Cuci Kering", totalHarga: "Rp 63.000", estimasi: "13 November 2020", items: [{ item: "Kiloan", jumlah: "9kg", harga: "Rp7.000", sub: "Rp63.000" }], timeline: ["Order di terima", "Sedang Di Pilah", "Sedang Di cuci", null] },
    { id: 6, nota: "13571357", nama: "Khoi Vinh", tipe: "Non-Member", berat: "5Kg", tgl: "5 Oktober 2021", status: "Dibatalkan", layanan: "Cuci Kering", totalHarga: "Rp 35.000", estimasi: "6 Oktober 2021", items: [{ item: "Kiloan", jumlah: "5kg", harga: "Rp7.000", sub: "Rp35.000" }], timeline: ["Order di terima", null, null, null] },
    { id: 7, nota: "12344321", nama: "Brad Frost", tipe: "Member", berat: "7Kg", tgl: "8 Juni 2022", status: "Selesai", layanan: "Cuci Setrika", totalHarga: "Rp 49.000", estimasi: "9 Juni 2022", items: [{ item: "Kiloan", jumlah: "7kg", harga: "Rp7.000", sub: "Rp49.000" }], timeline: ["Order di terima", "Sedang Di Pilah", "Sedang Di cuci", "Siap Di ambil"] },
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

// ─── TIPE BADGE ──────────────────────────────────────────────────────────────
function TipeBadge({ tipe }) {
    return tipe === "Member" ? (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{tipe}</span>
    ) : (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">{tipe}</span>
    );
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
function StatusCard({ title, value, borderColor, isCurrency, icon: Icon, iconBg, iconColor }) {
    return (
        <div className={`bg-white border-2 border-black rounded-xl overflow-hidden flex flex-col shadow-[3px_3px_0px_0px_rgba(0,0,0,0.12)] relative border-b-[5px] ${borderColor}`}>
            {/* Ikon di pojok kanan atas dengan latar belakang halus */}
            <div className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                {Icon && <Icon size={20} className={iconColor} />}
            </div>
            <div className="flex-1 px-5 py-4 z-10">
                <p className="text-[10px] font-black leading-tight text-gray-500 uppercase tracking-tighter mb-1 pr-10">{title}</p>
                <p className={`font-black text-gray-900 ${isCurrency ? "text-xl leading-tight" : "text-3xl"}`}>{value}</p>
            </div>
        </div>
    );
}

// ─── MODAL KONFIRMASI HAPUS ───────────────────────────────────────────────────
function ConfirmDeleteModal({ onConfirm, onCancel, itemNota, itemNama }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-200">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={28} className="text-red-500" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-800 mb-2">Apakah anda yakin menghapus ini?</h3>
                {itemNota && itemNama && (
                    <p className="text-sm text-gray-400 mb-6">
                        Transaksi <span className="font-bold text-gray-600">{itemNota}</span> · {itemNama}
                    </p>
                )}
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-red-50 border-2 border-red-400 text-red-500 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
                    >
                        Hapus
                    </button>
                    <button
                        onClick={onCancel}
                        className="flex-1 border-2 border-[#00b4d8] text-[#00b4d8] py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors"
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
                        itemNota={row.nota}
                        itemNama={row.nama}
                    />
                )}
                
                {/* Tombol Tutup X di kanan atas */}
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition">
                    <X size={24} />
                </button>

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
                    <div className="w-52 flex-shrink-0 mt-8">
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
            <td className="px-4 py-3 text-center border border-black text-sm">{no}</td>
            <td className="px-4 py-3 text-center border border-black text-sm font-mono">{row.nota}</td>
            <td className="px-4 py-3 text-center border border-black text-sm font-medium">{row.nama}</td>
            <td className="px-4 py-3 text-center border border-black"><TipeBadge tipe={row.tipe} /></td>
            <td className="px-4 py-3 text-center border border-black text-sm">{row.berat}</td>
            <td className="px-4 py-3 text-center border border-black text-sm">{row.estimasi}</td>
            <td className="px-4 py-3 text-center border border-black">
                <span className={`px-3 py-1 rounded-md text-[11px] font-bold inline-block ${statusColor(row.status)}`}>
                    {row.status}
                </span>
            </td>
            <td className="px-4 py-3 text-center border border-black">
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => onDelete(row)}
                        className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                        title="Hapus"
                    >
                        <Trash2 size={14} />
                    </button>
                    <button
                        onClick={() => onDetail(row)}
                        className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors"
                        title="Detail"
                    >
                        <Eye size={14} />
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
    const totalPages = Math.max(1, Math.ceil(data.length / perPage));
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
                    itemNota={confirmDelete.nota}
                    itemNama={confirmDelete.nama}
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

            {/* Greeting (Logo Mesin Cuci) */}
            <div className="flex items-center gap-3 bg-[#0077b6] text-white rounded-xl px-5 py-4 mb-6 shadow w-full">
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
                            {/* Card 1: Biru Royal */}
                            <StatusCard 
                                title="TOTAL ORDER" 
                                value="50" 
                                borderColor="border-b-[#3b82f6]" 
                                iconBg="bg-blue-50" 
                                iconColor="text-blue-500" 
                                icon={ShoppingBag} 
                            />
                            {/* Card 2: Oranye Hangat */}
                            <StatusCard 
                                title="CUCIAN PROSES" 
                                value="25" 
                                borderColor="border-b-[#f97316]" 
                                iconBg="bg-orange-50" 
                                iconColor="text-orange-500" 
                                icon={Clock} 
                            />
                            {/* Card 3: Hijau Emerald */}
                            <StatusCard 
                                title="SELESAI" 
                                value="25" 
                                borderColor="border-b-[#10b981]" 
                                iconBg="bg-emerald-50" 
                                iconColor="text-emerald-500" 
                                icon={CheckCircle2} 
                            />
                            {/* Card 4: Ungu Elegan */}
                            <StatusCard 
                                title="OMZET HARI INI" 
                                value="Rp 500.000" 
                                borderColor="border-b-[#8b5cf6]" 
                                iconBg="bg-purple-50" 
                                iconColor="text-purple-500" 
                                isCurrency 
                                icon={TrendingUp} 
                            />
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM: Tabel Transaksi ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-black overflow-hidden">
                    
                    {/* Header Tabel & Tombol Lihat Semua (window.location.href) */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-black bg-white">
                        <h2 className="font-extrabold text-gray-800 text-base">Tabel Transaksi Terbaru</h2>
                        
                        <button 
                            onClick={() => window.location.href = '/admin/orders'}
                            className="flex items-center gap-1 text-sm font-bold text-[#0077b6] hover:text-[#005f92] transition-colors cursor-pointer"
                        >
                            Lihat Semua <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse border border-black">
                            <thead>
                                <tr className="bg-[#0077b6] text-white">
                                    {["No", "NOTA", "Nama", "Tipe", "Berat", "Estimasi Selesai", "Status", "Aksi"].map((h) => (
                                        <th key={h} className={`px-4 py-3 font-semibold border border-black ${h === "No" || h === "Aksi" ? "text-center w-14" : "text-center"}`}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {pageData.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-10 text-gray-400 border border-black">Tidak ada data ditemukan</td>
                                    </tr>
                                ) : (
                                    pageData.map((row, i) => (
                                        <TableRow
                                            key={row.id}
                                            row={row}
                                            no={(page - 1) * perPage + i + 1}
                                            idx={i}
                                            onDelete={(r) => setConfirmDelete(r)}
                                            onDetail={(r) => setDetailRow(r)}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-end gap-1 px-6 py-4 border-t border-black bg-white">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1.5 rounded-lg text-sm border border-black text-gray-500 hover:bg-gray-50 disabled:opacity-40 flex items-center gap-1"
                        >
                            <ChevronLeft size={14} /> Sebelumnya
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                            <button
                                key={n}
                                onClick={() => setPage(n)}
                                className={`w-8 h-8 rounded-lg text-sm font-semibold transition ${
                                    n === page
                                        ? "bg-[#0077b6] text-white"
                                        : "border border-black text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                {n}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1.5 rounded-lg text-sm border border-black text-gray-500 hover:bg-gray-50 disabled:opacity-40 flex items-center gap-1"
                        >
                            Selanjutnya <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </AdminSidebar>
    );
}