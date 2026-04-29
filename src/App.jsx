// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage        from './landingpage';
import Login              from './pages/Login';
import Register           from './pages/Register';
import ForgotPassword     from './pages/ForgotPassword';
import NewPassword        from './pages/NewPassword';
import AdminDashboard     from './Pages/Admin/dashboard';
import CustomerDashboard  from './Pages/Customer/dashboard';

// ── Guard: hanya bisa diakses kalau sudah login ────────
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-[#eaf6fb] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#5bbfe8] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'} replace />;
  }

  return children;
};

// ── Guard: redirect ke dashboard jika sudah login ─────
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-[#eaf6fb] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#5bbfe8] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'} replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth routes */}
      <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/new-password"    element={<NewPassword />} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
      } />

      {/* Customer */}
      <Route path="/customer/dashboard" element={
        <ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}