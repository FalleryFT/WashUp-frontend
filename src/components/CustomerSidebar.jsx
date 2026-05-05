// src/components/CustomerSidebar.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  History,
  Bell,
  MessageSquare,
  UserCircle,
  LogOut,
  // Waves, // Ikon Waves dihapus
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logoImage from "../assets/logo.png";

// ─────────────────────────────────────────────────────
// Menu Item
// ─────────────────────────────────────────────────────
function MenuItem({ href, icon, text, active = false, onClick }) {
  const base =
    "flex items-center gap-4 px-6 py-3 transition-colors duration-200 font-semibold w-full text-left";
  const activeClass = "bg-[#0369A1] text-white";
  const inactiveClass = "hover:bg-[#0EA5E0] text-blue-50";

  if (onClick) {
    return (
      <button onClick={onClick} className={`${base} ${active ? activeClass : inactiveClass}`}>
        <span className={active ? "text-white" : "text-blue-100"}>{icon}</span>
        <span className="text-[15px]">{text}</span>
      </button>
    );
  }

  return (
    <Link to={href} className={`${base} ${active ? activeClass : inactiveClass}`}>
      <span className={active ? "text-white" : "text-blue-100"}>{icon}</span>
      <span className="text-[15px]">{text}</span>
    </Link>
  );
}

// ─────────────────────────────────────────────────────
// Sidebar body
// ─────────────────────────────────────────────────────
function SidebarBody({ url, user, onLogout, onClose }) {
  const navItems = [
    { href: "/customer/dashboard",     icon: <LayoutDashboard size={20} />, text: "Dashboard"         },
    { href: "/customer/track",         icon: <Search size={20} />,          text: "Lacak Pesanan"    },
    { href: "/customer/history",       icon: <History size={20} />,         text: "Riwayat Pesanan"  },
    { href: "/customer/notifications", icon: <Bell size={20} />,            text: "Notifikasi"       },
    { href: "/customer/chat",          icon: <MessageSquare size={20} />,   text: "Chat Admin"       },
    { href: "/customer/profile",       icon: <UserCircle size={20} />,      text: "Profil Saya"       },
  ];

  return (
    <div className="w-72 bg-[#0077b6] text-white h-full flex flex-col font-sans overflow-hidden">
      
      {/* Brand - Logo Besar dan Full */}
      <div className="p-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-0"> {/* Jarak ditingkatkan */}
          {/* LOGO BARU DI SINI */}
          <img
            src={logoImage}
            alt="WashUp Logo"
            className="w-14 h-14 object-contain drop-shadow-md ml-5"
          />
          <span className="text-3xl font-extrabold tracking-tight">WashUp</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/70 hover:text-white md:hidden">
            <X size={22} />
          </button>
        )}
      </div>

      {/* Profile */}
      <div className="px-6 mb-4 flex items-center gap-3 shrink-0">
        <div className="bg-white text-[#0077b6] rounded-full p-2 flex-shrink-0">
          <UserCircle size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold leading-tight uppercase truncate">
            {user?.name || "Pelanggan"}
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-200">
            ID: {String(user?.id || "0001").padStart(4, "0")}
          </p>
        </div>
      </div>

      {/* Nav (Hanya bagian ini yang bisa di-scroll) */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="flex flex-col">
          {navItems.map((item) => (
            <MenuItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              text={item.text}
              active={url === item.href}
            />
          ))}
        </div>
      </nav>

      {/* Logout pinned to bottom (polosan tanpa border) */}
      <div className="shrink-0 bg-[#0077b6] pt-2 pb-6 mt-auto">
        <MenuItem icon={<LogOut size={20} />} text="Logout" onClick={onLogout} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Default Export
// ─────────────────────────────────────────────────────
export default function CustomerSidebar({ children }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      navigate("/LandingPage"); // Mengarahkan ke LandingPage setelah logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#0077b6] text-white p-2 rounded-lg shadow-lg"
      >
        <MenuIcon size={22} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar Drawer & Desktop Sticky */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 h-screen transform transition-transform duration-300 md:sticky md:top-0 md:translate-x-0 shrink-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarBody
          url={pathname}
          user={user}
          onLogout={handleLogout}
          onClose={() => setOpen(false)}
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full p-4 md:p-8 pt-20 md:pt-8 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}