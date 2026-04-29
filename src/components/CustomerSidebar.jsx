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
  Waves,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

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
    { href: "/customer/dashboard",     icon: <LayoutDashboard size={20} />, text: "Dashboard"        },
    { href: "/customer/track",         icon: <Search size={20} />,          text: "Lacak Pesanan"    },
    { href: "/customer/history",       icon: <History size={20} />,         text: "Riwayat Pesanan"  },
    { href: "/customer/notifications", icon: <Bell size={20} />,            text: "Notifikasi"       },
    { href: "/customer/chat",          icon: <MessageSquare size={20} />,   text: "Chat Admin"       },
    { href: "/customer/profile",       icon: <UserCircle size={20} />,      text: "Profil Saya"      },
  ];

  return (
    <div className="w-72 bg-[#0077b6] text-white min-h-screen flex flex-col font-sans">

      {/* Brand */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-full text-[#0077b6]">
            <Waves size={24} />
          </div>
          <span className="text-3xl font-extrabold tracking-tight">WashUp</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/70 hover:text-white md:hidden">
            <X size={22} />
          </button>
        )}
      </div>

      {/* Profile */}
      <div className="px-6 mb-8 flex items-center gap-3">
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

      {/* Nav */}
      <nav className="flex-1 flex flex-col">
        {navItems.map((item) => (
          <MenuItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            text={item.text}
            active={url === item.href}
          />
        ))}

        {/* Logout pinned to bottom */}
        <div className="mt-auto pb-6">
          <MenuItem icon={<LogOut size={20} />} text="Logout" onClick={onLogout} />
        </div>
      </nav>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Default Export
// ─────────────────────────────────────────────────────
export default function CustomerSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
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

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarBody
          url={pathname}
          user={user}
          onLogout={handleLogout}
          onClose={() => setOpen(false)}
        />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block flex-shrink-0">
        <SidebarBody url={pathname} user={user} onLogout={handleLogout} />
      </div>
    </>
  );
}
